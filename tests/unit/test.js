const assert = require('assert');
const axios = require('axios');
const server = require('../../server');
const mock = require('../../utils/dbMockup');
const deref = require('json-schema-deref-sync');

/* Declaring const vars */
const tests = deref(require('./test.json')).tests;
const host = "http://localhost:5000"

describe("_________________Innosoft API Tests_________________", function() {

    /* EXECUTED BEFORE ALL TESTS */
    before( (done) => {
        server.deploy('test').then(() => {
            done();
        }).catch( (err) => {
            console.log(err);
            done(err);
        })
    });
    
    /* Restore mock functionality after each test*/
    afterEach( () => { 
        mock.restore()
    });        

    /* ENDPOINT TESTS */
    describe("\nPositive Cases:", () => {
        Object.keys(tests).forEach( (key) => {
            describe(`- [ GET ] ${key}`, () => {
                var apitest = tests[key];
                for (let test of apitest.cases) {
                    it (test.description , async () => {
                        if (key === "api/v1/messages/{roomId}")
                            mock.findMessages(test.result, test.params);
                        else 
                            mock.query(apitest.query, test.result, test.params ? Object.values(test.params) : undefined);
                        var url = host + '/' + key.replace(/\{([\w]+)\}/g, (str) => test.params[str.slice(1, -1)]);
                        await axios.get(url).then((response) => {
                            assert.equal(JSON.stringify(response.data), JSON.stringify(test.response));
                        }).catch((err) => {
                            console.error(err.response.data);
                            assert.fail(`Error on request`);
                        });
                    });
                }
            });
        });
    });

    describe("\nNegative Cases", () => {
        Object.keys(tests).forEach( (key) => {
            describe(`- [ GET ] ${key}`, () => {
                var apitest = tests[key];
                for (let test of apitest.negativeCases) {
                    it (test.description , async () => {
                        if (key === "api/v1/messages/{roomId}" && test.result) {
                            mock.findMessages(test.result, test.params);
                        } else if (apitest.query && test.result) {
                                mock.query(apitest.query, test.result, test.params ? Object.values(test.params) : undefined);
                        }
                        var url = host + '/' + key.replace(/\{([\w]+)\}/g, (str) => test.params[str.slice(1, -1)]);
                        await axios.get(url).then((r) => {
                            assert.fail(`Error on request`);
                        }).catch((err) => {
                            assert.equal(err.response.status, test.code);
                        });
                    });
                }
            });
        });
        describe(`- [ POST ] api/v1/messages/{roomId}`, () => {
            it ('Should fail when body is empty', async () => {
                var url = host + '/api/v1/messages/general';
                await axios.post(url).then((response) => {
                    assert.fail(`Error on request`);
                }).catch((err) => {
                    assert.equal(err.response.status, 500);
                });
            });
        });
    });

    /* EXECUTED AFTER ALL TESTS */
    after((done) => {
        server.undeploy(done);
    });
});