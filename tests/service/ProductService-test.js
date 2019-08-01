'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const CurrencyLayerProxyHelper = require('../../helpers/CurrencyLayerProxyHelper');
const ProductService = require('../../services/ProductService');
const {Product} = require('../../models')

describe('ProductService testing scenarios', function () {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('postProduct test cases', function () {

    /**
     * Test for the successful return of created product results
     *
     * @author hadi.shayesteh <hadishayesteh@gmail.com>
     * @since  29 July 2019
     *
     * @covers helpers/ProductService.postProduct
     */
    it('Testing the successful return of created product results', function (done) {

      let req = {
        swagger: {
          params: {
            product: {
              value: {
              "title": "hadi",
              "type": "human",
              "price": 0,
              "description": "string",
              "thumbnail_url": "https://github.com/"
              }
            }
          }
        }
      };

      sandbox.stub(Product, 'findOne').callsFake((query, callback) => {
        callback(null, {});
      });

      let saveResponse = {
        "title": "hadi",
        "type": "human",
        "price": 0,
        "description": "string",
        "thumbnail_url": "https://github.com/",
        "__v" : 0
      }

      sandbox.stub(Product.prototype, 'save').callsFake((callback) => {
        callback(null, saveResponse);
      });

      let nextSpy = sinon.spy();
      let headerSpy = sinon.spy();
      let endSpy = sinon.spy(function (responseBody) {
        assert.equal(res.statusCode, 201, 'The response code does not match');
        assert.equal(responseBody, JSON.stringify(saveResponse), 'The response body does not match');
        done();
      });
      let res = {
        statusCode: 0,
        setHeader: headerSpy,
        end: endSpy
      };

      let productService = new ProductService();
      productService.postProduct(req, res, nextSpy);
    });
  });

  describe('retrieveProductList test cases', function () {

    /**
     * Test for the successful return of created product results
     *
     * @author hadi.shayesteh <hadishayesteh@gmail.com>
     * @since  29 July 2019
     *
     * @covers helpers/ProductService.retrieveProductList
     */
    it('Testing the successful return of product listing', function (done) {

      let req = {
        swagger: {
          params: {
            currency: {value: 'GBP'},
            items_per_page: {value: 5},
            page: {value: 1},
            sort_parameter: {value: 'type'},
            sort_order: {value: 1}
          }
        }
      };

      let currencyResponse = {
        'GBP': 0.819099,
        'CAD': 1.314515,
        'USD': 1,
        'EUR': 0.89874
      };

      sandbox.stub(CurrencyLayerProxyHelper, 'getCurrencies').callsFake((callback) => {
        callback(null, currencyResponse);
      });

      let findResponse = {
        "title": "hadi",
        "type": "human",
        "price": 0,
        "description": "string",
        "thumbnail_url": "https://github.com/",
        "__v" : 0
      }
      let aggregationResponse = {
        skip: function skip(skip) {
          assert.equal(
            skip,
            0,
            'Expected 0 item to be skipped'
          );
          return aggregationResponse;
        },
        limit: function limit(limit) {
          assert.equal(
            limit,
            25,
            'Expected the limit to match the limit passed'
          );
          return aggregationResponse;
        },
        sort: function sort() {
          return aggregationResponse;
        },
        exec: function exec(callback) {
          callback(null, [findResponse]);
        }
      };
      sandbox.stub(Product, 'aggregate').callsFake((query) => {
        return aggregationResponse;
      });

      let expectedResponse = [{"title":"hadi","type":"human","price":0,"description":"string","thumbnail_url":"https://github.com/","__v":0}];
      let nextSpy = sinon.spy();
      let headerSpy = sinon.spy();
      let endSpy = sinon.spy(function (responseBody) {
        assert.equal(res.statusCode, 200, 'The response code does not match');
        assert.equal(responseBody, JSON.stringify(expectedResponse), 'The response body does not match');
        done();
      });
      let res = {
        statusCode: 0,
        setHeader: headerSpy,
        end: endSpy
      };

      let productService = new ProductService();
      productService.retrieveProductList(req, res, nextSpy);
    });
  });

  describe('putProduct test cases', function () {

    /**
     * Test for the successful return of updated product results
     *
     * @author hadi.shayesteh <hadishayesteh@gmail.com>
     * @since  29 July 2019
     *
     * @covers helpers/ProductService.putProduct
     */
    it('Testing the successful return of updated product results', function (done) {
      let productId = '5d3fb633f2296a6ce81ea463';
      let req = {
        swagger: {
          params: {
            product_id: {value: productId},
            product: {
              value: {
              "title": "hadi2",
              "type": "human2",
              "price": 0,
              "description": "string",
              "thumbnail_url": "https://github.com/"
              }
            }
          }
        }
      };

      let findResponse = {
        "_id": productId,
        "title": "hadi2",
        "type": "human2",
        "price": 0,
        "description": "string",
        "thumbnail_url": "https://github.com/"
        };

      let findStub = sinon.stub(Product, 'findOne')
      findStub.onCall(0).callsFake((query, callback) => {
        return callback(null, null)
      });
      findStub.onCall(1).callsFake((query, callback) => {
        return callback(null, findResponse)
      });

      let saveResponse = {
        "title": "hadi",
        "type": "human",
        "price": 0,
        "description": "string",
        "thumbnail_url": "https://github.com/",
        "__v" : 0
      }

      sandbox.stub(Product.prototype, 'save').callsFake((callback) => {
        callback(null, saveResponse);
      });

      let nextSpy = sinon.spy();
      let headerSpy = sinon.spy();
      let endSpy = sinon.spy(function (responseBody) {
        assert.equal(res.statusCode, 200, 'The response code does not match');
        assert.equal(responseBody, JSON.stringify(saveResponse), 'The response body does not match');
        findStub.restore();
        done();
      });
      let res = {
        statusCode: 0,
        setHeader: headerSpy,
        end: endSpy
      };

      let productService = new ProductService();
      productService.putProduct(req, res, nextSpy);
    });
  });

  describe('deleteProduct test cases', function () {

    /**
     * Test for the successful deletion of product
     *
     * @author hadi.shayesteh <hadishayesteh@gmail.com>
     * @since  29 July 2019
     *
     * @covers helpers/ProductService.deleteProduct
     */
    it('Testing the successful return of updated product results', function (done) {
      let productId = '5d3fb633f2296a6ce81ea463';
      let req = {
        swagger: {
          params: {
            product_id: {value: productId}
          }
        }
      };

      let findResponse = {
        "_id": productId,
        "title": "hadi2",
        "type": "human2",
        "price": 0,
        "description": "string",
        "thumbnail_url": "https://github.com/"
        };

      let findStub = sinon.stub(Product, 'findOne')
      findStub.onCall(0).callsFake((query, callback) => {
        return callback(null, findResponse)
      });


      sandbox.stub(Product.prototype, 'remove').callsFake((recordId, callback) => {
        callback();
      });

      let nextSpy = sinon.spy();
      let headerSpy = sinon.spy();
      let endSpy = sinon.spy(function (responseBody) {
        assert.equal(res.statusCode, 200, 'The response code does not match');
        assert.equal(responseBody, JSON.stringify({"Success": true}), 'The response body does not match');
        findStub.restore();
        done();
      });
      let res = {
        statusCode: 0,
        setHeader: headerSpy,
        end: endSpy
      };

      let productService = new ProductService();
      productService.deleteProduct(req, res, nextSpy);
    });
  });
});