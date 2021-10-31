const assert = require('assert');
const server = require('../server');

describe("Innosoft API Tests:", function() {

    before( (done) => {
        server.deploy('test').then(() => {
            done();
        }).catch( (err) => {
            console.log(err);
            done(err);;
        })
    });

    describe("Testing endpoint /api/v1/test", () => {
        it("Should always pass", function() {
            assert.equal(1, 1);
        });
    
        it("Should also always pass", function() {
            assert.ok(true);
        });
    });

    after((done) => {
        server.undeploy(done);
    });
});