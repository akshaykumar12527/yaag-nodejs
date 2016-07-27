var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('first test for app', function() {


    it('should test', function(done) {
        expect(2 + 2).to.equal(4);
        done();
    });
});