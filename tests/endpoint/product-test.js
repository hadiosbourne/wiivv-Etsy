'use strict';
const chai = require('chai');
const ZSchema = require('z-schema');
const validator = new ZSchema({});
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const config = require('config');
const async = require('async');
const {PermissionRoles, Product} = require('../../models')
const api = supertest('http://localhost:4000'); // supertest init;

chai.should();

let secret = config.get('jwt_api_token');
let decoded = {
  'sub': '1234567890',
  'role': 'admin'
};
let jwtToken = jwt.sign(decoded, secret);

describe('/product', function() {
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

    let product = new Product({
      "title": "string",
      "type": "string",
      "price": 0,
      "description": "string",
      "thumbnail_url": "https://wiivv-etsy.azurewebsites.net/docs/#!/Product/postProduct"
    });
    async.parallel({
      roles: (cb) => {roles.save(cb);},
      product: (cb) => {product.save(cb);}
    }, function (err, res) {
      done();
    });

  });
  describe('get', function() {
    it('should respond with 200 list of products matching...', function(done) {
      /*eslint-disable*/
      var schema = {
        "type": "array",
        "items": {
          "allOf": [
            {
              "type": "object",
              "required": [
                "_id",
                "updated_at",
                "created_at",
                "__v"
              ],
              "properties": {
                "_id": {
                  "type": "string",
                  "pattern": "^[0-9a-fA-F]{24}$"
                },
                "updated_at": {
                  "type": "string",
                  "format": "date-time"
                },
                "created_at": {
                  "type": "string",
                  "format": "date-time"
                },
                "__v": {
                  "type": "integer"
                }
              }
            },
            {
              "required": [
                "title",
                "type",
                "price"
              ],
              "properties": {
                "title": {
                  "type": "string",
                  "description": "the name of the product"
                },
                "type": {
                  "type": "string",
                  "description": "type of the product"
                },
                "price": {
                  "type": "integer",
                  "description": "price of the product"
                },
                "description": {
                  "type": "string",
                  "description": "the description of the product"
                },
                "thumbnail_url": {
                  "type": "string",
                  "pattern": "^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$",
                  "description": "the url of the thumbnail of the product"
                }
              }
            }
          ]
        }
      };

      /*eslint-enable*/
      api.get('/v1/product')
      .query({
        page: 1, items_per_page: 1, sort_parameter: 'type', sort_order: 1, currency: 'USD'
      })
      .set('Accept', 'application/json')
      .set('authorization', jwtToken)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        validator.validate(res.body, schema).should.be.true;
        done();
      });
    });

  });

  describe('post', function() {
    it('should respond with 201 product content was...', function(done) {
      /*eslint-disable*/
      var schema = {
        "allOf": [
          {
            "type": "object",
            "required": [
              "_id",
              "updated_at",
              "created_at",
              "__v"
            ],
            "properties": {
              "_id": {
                "type": "string",
                "pattern": "^[0-9a-fA-F]{24}$"
              },
              "updated_at": {
                "type": "string",
                "format": "date-time"
              },
              "created_at": {
                "type": "string",
                "format": "date-time"
              },
              "__v": {
                "type": "integer"
              }
            }
          },
          {
            "required": [
              "title",
              "type",
              "price"
            ],
            "properties": {
              "title": {
                "type": "string",
                "description": "the name of the product"
              },
              "type": {
                "type": "string",
                "description": "type of the product"
              },
              "price": {
                "type": "integer",
                "description": "price of the product"
              },
              "description": {
                "type": "string",
                "description": "the description of the product"
              },
              "thumbnail_url": {
                "type": "string",
                "pattern": "^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$",
                "description": "the url of the thumbnail of the product"
              }
            }
          }
        ]
      };

      /*eslint-enable*/
      api.post('/v1/product')
      .set('Accept', 'application/json')
      .set('authorization',jwtToken)
      .send({
        "title": "string3433333",
        "type": "string34333334",
        "price": 0,
        "description": "string",
        "thumbnail_url": "https://wiivv-etsy.azurewebsites.net/docs/#!/Product/postProduct"
      })
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);

        validator.validate(res.body, schema).should.be.true;
        done();
      });
    });

  });

});
