'use strict';

const Messages = require('../models/Message');

/* GET */
module.exports.findMessagesByRoomId = async function findMessagesByRoomId (req, res, next) {
  await Messages.find({ room: req.roomId.value }).sort({ datetime: -1 }).exec().then(messages => {
    res.status(200).send(messages.map(m => {
      return {
        messageId: m._id.toString(),
        messageText: m.text,
        messageDateTime: m.datetime.toISOString(),
        messageRoomId: m.room,
        messageUser: { userId: m.user._id.toString(), userName: m.user.name, userAvatar: m.user.avatar }
      };
    }));
  }).catch(err => res.status(500).send(err));
};

/* POST */
module.exports.addMessageByRoomId = function addMessageByRoomId (req, res, next) {
  try {
    const message = req.message.value;
    const newMessage = new Messages({
      text: message.messageText,
      datetime: message.messageDateTime || new Date(),
      room: req.roomId.value,
      user: { name: message.messageUser.userName, avatar: message.messageUser.userAvatar }
    });
    newMessage.save().then(() => res.status(201).send()).catch(err => res.status(500).send(err));
  } catch (err) {
    res.status(500).send(err);
  }
};
