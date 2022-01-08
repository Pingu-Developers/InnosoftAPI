const assert = require('assert');
const mongomock = require('../../utils/mongoMockup');
const socket = require("socket.io-client")('http://localhost:5001', {transports: ['websocket']});

/* Declaring const vars */

describe("_________________Innosoft Socket Tests_________________", function() {

    /* TEST CASES */
    describe("\nTest cases", () => {

        mongomock.findMessages([], {roomId: 'test'}, true);
        socket.connect();

        it ('Should return no messages when joining a new room and show join message', () => {
            socket.on('chatMessages', (msg) => {
                assert.equal(msg.length, 0);
            });
        });

        it ('Should return new member message', () => {
            socket.on('newMember', (msg) => {
                assert.equal(msg, 'test se ha unido a la sala');
            });
        });

        it ('Should send a new message and return it', () => {
            let newmsg = { text:'test', datetime: new Date(), room: 'test', user: { _id: 'testId', name: 'test', avatar: '' }};
            mongomock.save(newmsg);

            socket.emit('chatMessage', newmsg);
            socket.on('chatMessage', (msg) => {
                assert.equal(msg, newmsg);
            });
        });

        it ('Should show message when member disconnects', () => {
            socket.emit('chatDisconnect', {user: 'test', room: 'test'});
            socket.on('newMember', (msg) => {
                assert.equal(msg, 'test se ha ido a la sala');
                socket.disconnect();
            });
        });
    });
});