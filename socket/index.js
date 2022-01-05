'use strict';
const http = require('http');
const socketPort = process.env.SOCKET_PORT || 5001;
const io = require('socket.io');

const Messages = require('../models/Message');

module.exports.initialize = () => {
  const server = http.createServer().listen(socketPort);
  const socketServer = io(server);

  socketServer.on('connection', (socket) => {
    socket.on('chatConnection', (data) => {
      socket.join(data.room);
      console.log(`User ${data.user} connected to room ${data.room}`);
      sendRoomMessages(socket, data.room);
      socketServer.in(data.room).emit('newMember', `${data.user} se ha unido a la sala`);
    });

    socket.on('chatMessage', (data) => {
      const newMessage = new Messages({
        text: data.text,
        datetime: data.datetime || new Date(),
        room: data.room,
        user: { _id: data.user._id, name: data.user.name, avatar: data.user.avatar }
      });
      newMessage.save()
        .then((msg) => {
          socketServer.in(data.room).emit('chatMessage', msg);
        }).catch((err) => {
          console.log(err);
        });
    });

    socket.on('chatDisconnect', (room) => {
      socket.leave(room);
    });
  });

  function sendRoomMessages (socket, room) {
    Messages.find({ room })
      .sort({ datetime: -1 })
      .exec()
      .then((messages) => {
        socketServer.in(socket.id).emit('chatMessages', messages);
      }).catch((err) => {
        console.log(err);
      });
  }
};
