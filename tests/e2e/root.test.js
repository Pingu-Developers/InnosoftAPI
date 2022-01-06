const assert = require('assert');
const axios = require('axios');
const { execSync } = require("child_process");
const socket = require("socket.io-client")('http://localhost:5001', {transports: ['websocket']});

/* Declaring const vars */
const host = "http://localhost:5000"

describe("_________________Innosoft E2E Tests_________________", function() {

    /* EXECUTED BEFORE ALL TESTS */
    before((done) => {
        console.log('---------- Start E2E infrastructure ----------');
        try {
            execSync("docker-compose -f tests/docker-compose-e2e.yaml pull db innoApi innoChatDb");
            execSync("docker-compose -f tests/docker-compose-e2e.yaml up -d db innoApi innoChatDb");
            setTimeout(() => done(), 25000);
        } 
        catch (err) {
            console.log(err);
            done(err);
        }
    });
      
    
    /* ENDPOINT TESTS */
    describe("\nPositive Cases:", () => {

        describe(`- [ /docs ]`, () => {
            it ('Should be accesible, returns 200 OK' , async () => {
                await axios.get(host + '/docs').then((response) => {
                    assert.equal(response.status, 200);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });
        });

        describe(`- [ /api/v1/events ]`, () => {
            it ('Should return 200 OK' , async () => {
                await axios.get(host + '/api/v1/events').then((response) => {
                    assert.equal(response.status, 200);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });

            it ('Should return 116 elements' , async () => {
                await axios.get(host + '/api/v1/events').then((response) => {
                    assert.equal(response.data.length, 116);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });

            it ('Should have first element with ID = 2276' , async () => {
                await axios.get(host + '/api/v1/events').then((response) => {
                    assert.equal(response.data[0].eventId, 2276);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });

            it ('Should have last element with ID = 2750' , async () => {
                await axios.get(host + '/api/v1/events').then((response) => {
                    assert.equal(response.data[response.data.length - 1].eventId, 2750);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });
        });

        describe(`- [ /api/v1/events/{id} ]`, () => {
            it ('Should return 200 OK' , async () => {
                await axios.get(host + '/api/v1/events/2276').then((response) => {
                    assert.equal(response.status, 200);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });

            it ('Should return 1 elements' , async () => {
                await axios.get(host + '/api/v1/events/2276').then((response) => {
                    assert.equal(response.data.constructor, Object);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });

            it ('Should return element with id = {id}' , async () => {
                await axios.get(host + '/api/v1/events/2276').then((response) => {
                    assert.equal(response.data.eventId, 2276);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });
        });

        describe(`- [ /api/v1/speakers ]`, () => {
            it ('Should return 200 OK' , async () => {
                await axios.get(host + '/api/v1/speakers').then((response) => {
                    assert.equal(response.status, 200);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });

            it ('Should return 22 elements' , async () => {
                await axios.get(host + '/api/v1/speakers').then((response) => {
                    assert.equal(response.data.length, 22);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });

            it ('Should have first element with ID = 2713' , async () => {
                await axios.get(host + '/api/v1/speakers').then((response) => {
                    assert.equal(response.data[0].speakerId, 2713);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });

            it ('Should have last element with ID = 3168' , async () => {
                await axios.get(host + '/api/v1/speakers').then((response) => {
                    assert.equal(response.data[response.data.length - 1].speakerId, 3168);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });
        });

        describe(`- [ /api/v1/speakers/{id} ]`, () => {
            it ('Should return 200 OK' , async () => {
                await axios.get(host + '/api/v1/speakers/3168').then((response) => {
                    assert.equal(response.status, 200);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });

            it ('Should return 1 elements' , async () => {
                await axios.get(host + '/api/v1/speakers/3168').then((response) => {
                    assert.equal(response.data.constructor, Object);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });

            it ('Should return element with id = {id}' , async () => {
                await axios.get(host + '/api/v1/speakers/3168').then((response) => {
                    assert.equal(response.data.speakerId, 3168);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });
        });

        describe(`- [ /api/v1/posts ]`, () => {
            it ('Should return 200 OK' , async () => {
                await axios.get(host + '/api/v1/posts').then((response) => {
                    assert.equal(response.status, 200);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });

            it ('Should return 54 elements' , async () => {
                await axios.get(host + '/api/v1/posts').then((response) => {
                    assert.equal(response.data.length, 54);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });

            it ('Should have first element with ID = 3231' , async () => {
                await axios.get(host + '/api/v1/posts').then((response) => {
                    assert.equal(response.data[0].postId, 3231);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });

            it ('Should have last element with ID = 995' , async () => {
                await axios.get(host + '/api/v1/posts').then((response) => {
                    assert.equal(response.data[response.data.length - 1].postId, 995);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });
        });

        describe(`- [ /api/v1/posts/{id} ]`, () => {
            it ('Should return 200 OK' , async () => {
                await axios.get(host + '/api/v1/posts/3044').then((response) => {
                    assert.equal(response.status, 200);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });

            it ('Should return 1 elements' , async () => {
                await axios.get(host + '/api/v1/posts/3044').then((response) => {
                    assert.equal(response.data.constructor, Object);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });

            it ('Should return element with id = {id}' , async () => {
                await axios.get(host + '/api/v1/posts/3044').then((response) => {
                    assert.equal(response.data.postId, 3044);
                }).catch(() => {
                    assert.fail(`Error on request`);
                })
            });
        });
    });

    describe("\nNegative Cases:", () => {

        describe(`- [ /api/v1/events/{wrongId} ]`, () => {
            it ('Should return 400 when ID = wrongId', async () => {
                await axios.get(host + '/api/v1/events/test').then(() => {
                    assert.fail(`Error on request`);
                }).catch((err) => {
                    assert.equal(err.response.status, 400);
                })
            });

            it ('Should return 404 when ID = notFound', async () => {
                await axios.get(host + '/api/v1/events/1').then(() => {
                    assert.fail(`Error on request`);
                }).catch((err) => {
                    assert.equal(err.response.status, 404);
                })
            });
        });

        describe(`- [ /api/v1/speakers/{wrongId} ]`, () => {
            it ('Should return 400 when ID = wrongId', async () => {
                await axios.get(host + '/api/v1/speakers/test').then(() => {
                    assert.fail(`Error on request`);
                }).catch((err) => {
                    assert.equal(err.response.status, 400);
                })
            });

            it ('Should return 404 when ID = notFound', async () => {
                await axios.get(host + '/api/v1/speakers/1').then(() => {
                    assert.fail(`Error on request`);
                }).catch((err) => {
                    assert.equal(err.response.status, 404);
                })
            });
        });

        describe(`- [ /api/v1/posts/{wrongId} ]`, () => {
            it ('Should return 400 when ID = wrongId', async () => {
                await axios.get(host + '/api/v1/posts/test').then(() => {
                    assert.fail(`Error on request`);
                }).catch((err) => {
                    assert.equal(err.response.status, 400);
                })
            });

            it ('Should return 404 when ID = notFound', async () => {
                await axios.get(host + '/api/v1/posts/1').then(() => {
                    assert.fail(`Error on request`);
                }).catch((err) => {
                    assert.equal(err.response.status, 404);
                })
            });
        });

    });

    describe("\nSocket Tests:", () => {
        
        /* TEST CASES */
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

    /* EXECUTED AFTER ALL TESTS */
    after((done) => {
        console.log('---------- Stop E2E infrastructure ----------');
        try {
            socket.disconnect();
            execSync("docker-compose -f tests/docker-compose-e2e.yaml down");
            done();
        } catch (err) {
            console.log(err);
            done(err);
        }
    });
});