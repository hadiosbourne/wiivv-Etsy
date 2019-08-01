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
let productId;

describe('/product/{product_id}', function() {
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
      productId = res['product'][0]['_id']
      done();
    });

  });
  describe('put', function() {
    it('should respond with 200 The updated Product...', function(done) {
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
      api.put('/v1/product/' + productId)
      .set('Accept', 'application/json')
      .set('authorization', jwtToken)
      .send({
        "title": "stringggggg",
        "type": "string",
        "price": 0,
        "description": "string",
        "thumbnail_url": "https://wiivv-etsy.azurewebsites.net/docs/#!/Product/postProduct"
      })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        validator.validate(res.body, schema).should.be.true;
        done();
      });
    });

  });

  describe('delete', function() {
    it('should respond with 200 The deleted Product will...', function(done) {
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
      api.put('/v1/product/' + productId)
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

});
