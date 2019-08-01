'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const EtsyStoreProxyHelper = require('../../helpers/EtsyStoreProxyHelper');
const request = require('request');

describe('EtsyStoreProxyHelper testing scenarios', function () {

  describe('getListing test cases', function () {

    /**
     * Test for the successful return of etsy record
     *
     * @author hadi.shayesteh <hadishayesteh@gmail.com>
     * @since  29 July 2019
     *
     * @covers helpers/EtsyStoreProxyHelper.getListing
     */
    it('Testing the successful return of etsy record', function (done) {
  
      let etsyResponse = {
        body: '{"results": [{"listing_id": 706474430,"title": "this year is looking bight tags","url": "https://www.etsy.com/listing/706474430/this-year-is-looking-bight-tags?utm_source=wiivvetsy&utm_medium=api&utm_campaign=api","price": 1.638198}]}'
      }

      let requestStub = sinon.stub(request, 'get').callsFake((url ,callback) => {
        callback(null, etsyResponse);
      });

      let expectedResponse = [
        {
          "listing_id": 706474430,
          "title": "this year is looking bight tags",
          "url": "https://www.etsy.com/listing/706474430/this-year-is-looking-bight-tags?utm_source=wiivvetsy&utm_medium=api&utm_campaign=api",
          "price": 1.638198
        }
      ];

      let callbackSpy = sinon.spy((err, res) => {
        assert.deepEqual(res, expectedResponse, 'Incorrect response was returned by test');
        requestStub.restore();
        done();
      });
      let limit = 1;
      let offset = 1;

      EtsyStoreProxyHelper.getListing(limit, offset, callbackSpy);
    });

  });
});