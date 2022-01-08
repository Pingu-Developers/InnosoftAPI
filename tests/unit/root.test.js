const server = require('../../server');
const mongomock = require('../../utils/mongoMockup');
const mock = require('../../utils/dbMockup');
const socket = require("socket.io-client")('http://localhost:5001', {transports: ['websocket']});

/* Declaring const vars */

describe("INNOSOFT TEST SUITE", function() {

    /* EXECUTED BEFORE ALL TESTS */
    before( (done) => {
        mongomock.connect();
        server.deploy('test').then(() => {

            socket.on('connect', (msg) => {
                socket.emit('chatConnection', {user: 'test', room: 'test'});
            });
            
            done();
        }).catch( (err) => {
            console.log(err);
            done(err);
        });
    });

    /* Restore mock functionality after each test*/
    afterEach( () => { 
        mock.restore();
    });
    
    /* Run tests */
    require('./api.test');
    require('./socket.test');
    
    /* EXECUTED AFTER ALL TESTS */
    after((done) => {
        mongomock.restore();
        socket.disconnect();
        server.undeploy(done);
    });
});