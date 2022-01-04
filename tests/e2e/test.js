const assert = require('assert');
const axios = require('axios');
const { execSync } = require("child_process");

/* Declaring const vars */
const host = "http://localhost:5000"

describe("_________________Innosoft API E2E Tests_________________", function() {

    /* EXECUTED BEFORE ALL TESTS */
    before((done) => {
        console.log('---------- Start E2E infrastructure ----------');
        try {
            //execSync("host-manager -add host.docker.internal 172.17.0.1");
            execSync("docker-compose -f tests/docker-compose-e2e.yaml pull db innoApi");
            execSync("docker-compose -f tests/docker-compose-e2e.yaml up -d db innoApi");
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

    /* EXECUTED AFTER ALL TESTS */
    after((done) => {
        console.log('---------- Stop E2E infrastructure ----------');
        try {
            execSync("docker-compose -f tests/docker-compose-e2e.yaml down");
            done();
        } catch (err) {
            console.log(err);
            done(err);
        }
    });
});