const assert = require('assert');
const axios = require('axios');
const server = require('../server');
const mock = require('../utils/dbMockup');
const deref = require('json-schema-deref-sync');

/* Declaring const vars */
const tests = deref(require('./test.json')).tests;
const host = "http://localhost:5000"

describe("Innosoft API Tests:", function() {

    /* EXECUTED BEFORE ALL TESTS */
    before( (done) => {
        server.deploy('test').then(() => {
            done();
        }).catch( (err) => {
            console.log(err);
            done(err);
        })
    });

    /* ENDPOINT TESTS */
    describe("[Positive Case] Testing endpoint /api/v1/events : ", () => {
        after( () => mock.restore());
        apiEventPositiveTest();
    });

    describe("[Negative Case] Testing endpoint /api/v1/events : ", () => {
        after( () => mock.restore());
        apiEventNegativeTest();
    });

    function apiEventPositiveTest() {
        var apitest = tests["api/v1/events"];
        for (let test of apitest.cases) {
            it (test.description , () => {
                mock.query(apitest.query, test.result);
                return axios.get(host + '/api/v1/events').then((response) => {
                    assert.equal(JSON.stringify(response.data), JSON.stringify(test.response));
                }).catch((err) => {
                    console.log(err.response.data);
                    assert.fail(`Error on request`);
                });
            });
        }
    }
    function apiEventNegativeTest() {
        var apitest = tests["api/v1/events"];
        it ("Should respond with code 500 when database is down", () => {
            return axios.get(host + '/api/v1/events').then(() => {
                assert.fail(`Error on request`);
            }).catch((err) => {
                assert.equal(err.response.status, 500);
            });
        });
        it ("Should respond with code 500 method fails", () => {
            mock.query(apitest.query, null);
            return axios.get(host + '/api/v1/events').then(() => {
                assert.fail(`Error on request`);
            }).catch((err) => {
                assert.equal(err.response.status, 500);
            });
        });
    }

    /* EXECUTED AFTER ALL TESTS */
    after((done) => {
        server.undeploy(done);
    });
});
