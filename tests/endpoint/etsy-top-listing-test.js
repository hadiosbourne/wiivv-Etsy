'use strict';
const chai = require('chai');
const ZSchema = require('z-schema');
const validator = new ZSchema({});
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const config = require('config');
const {PermissionRoles} = require('../../models')
const api = supertest('http://localhost:4000'); // supertest init;

chai.should();

let secret = config.get('jwt_api_token');
let decoded = {
  'sub': '1234567890',
  'role': 'admin'
};
let jwtToken = jwt.sign(decoded, secret);

describe('/etsy-top-listing', function() {
  before(function (done) {
    let roles = new PermissionRoles({
      'role': 'admin',
      'accessLevels': [
        'read',
        'write',
        'update',
        'delete'
      ]
    });
    roles.save(()=>{
      done();
    })
  });
  describe('get', function() {
    it('should respond with 200 list of etsy products...', function(done) {
      /*eslint-disable*/
      var schema = {
        "properties": {
          "currentPage": {
            "type": "integer"
          },
          "nextPage": {
            "type": "integer"
          },
          "limit": {
            "type": "integer"
          },
          "totalCount": {
            "type": "integer"
          },
          "results": {
            "type": "array",
            "items": [
              {
                "properties": {
                  "title": {
                    "type": "string",
                    "description": "the name of the product"
                  },
                  "price": {
                    "type": "number",
                    "description": "the price of the product"
                  },
                  "listing_id": {
                    "type": "integer",
                    "description": "the id of listing from etsy"
                  },
                  "url": {
                    "type": "string",
                    "description": "the url of the etsy product"
                  }
                }
              }
            ]
          }
        }
      };

      /*eslint-enable*/
      api.get('/v1/etsy-top-listing')
        .set('Accept', 'application/json')
        .set('authorization', jwtToken)
        .query({page: 1,items_per_page: 1,currency: 'USD'})
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          validator.validate(res.body, schema).should.be.true;
          done();
        });

    });

  });

});
