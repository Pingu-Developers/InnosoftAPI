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
    describe("Testing endpoint /api/v1/events : ", () => {
        apiEventPositiveTest();
    });

    function apiEventPositiveTest() {  
        for (let test of tests["api/v1/events"]) {
            it (test.description , async () => {
                mock.query(test.query, test.result);
                await axios.get(host + '/api/v1/events').then((response) => {
                    assert.equal(JSON.stringify(response.data), JSON.stringify(test.response));
                }).catch((err) => {
                    console.log(err.response.data);
                    assert.fail(`Error on request`);
                });
            });
        }
    }

    /* EXECUTED AFTER ALL TESTS */
    after((done) => {
        mock.restore();
        server.undeploy(done);
    });
});
