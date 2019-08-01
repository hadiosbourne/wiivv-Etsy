'use strict';
const chai = require('chai');
const ZSchema = require('z-schema');
const validator = new ZSchema({});
const supertest = require('supertest');
const api = supertest('http://localhost:4000'); // supertest init;

chai.should();

describe('/status', function () {
  describe('get', function () {
    it('should respond with 200 with server uptime', function (done) {
      /*eslint-disable*/
      var schema = {
        "type": "object",
        "required": [
          "up_time"
        ],
        "properties": {
          "up_time": {
            "type": "integer"
          }
        }
      };

      /*eslint-enable*/
      api.get('/v1/status')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) {return done(err);}

          validator.validate(res.body, schema).should.be.true;
          done();
        });
    });

  });

});