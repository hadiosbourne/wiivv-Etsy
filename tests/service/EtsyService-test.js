'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const EtsyStoreProxyHelper = require('../../helpers/EtsyStoreProxyHelper');
const CurrencyLayerProxyHelper = require('../../helpers/CurrencyLayerProxyHelper');
const EtsyService = require('../../services/EtsyService');

describe('EtsyService testing scenarios', function () {

  describe('retrieveEtsyList test cases', function () {
    let sandbox;
    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });
    afterEach(() => {
      sandbox.restore();
    });

    /**
     * Test for the successful return of etsy results
     *
     * @author hadi.shayesteh <hadishayesteh@gmail.com>
     * @since  29 July 2019
     *
     * @covers helpers/EtsyService.retrieveEtsyList
     */
    it('Testing the successful return of etsy results', function (done) {

      let req = {
        swagger: {
          params: {
            currency: {value: 'GBP'},
            items_per_page: {value: 5},
            page: {value: 1}
          }
        }
      };
  
      let etsyResponse = {
        totalCount: 1,
        results: [
          {
            "listing_id": 706474430,
            "title": "this year is looking bight tags",
            "url": "https://www.etsy.com/listing/706474430/this-year-is-looking-bight-tags?utm_source=wiivvetsy&utm_medium=api&utm_campaign=api",
            "price": 1.638198
          }
        ]
      };

      sandbox.stub(EtsyStoreProxyHelper, 'getListing').callsFake((limit, offset ,callback) => {
        callback(null, etsyResponse);
      });

      let currencyResponse = {
        'GBP': 0.819099,
        'CAD': 1.314515,
        'USD': 1,
        'EUR': 0.89874
      };

      sandbox.stub(CurrencyLayerProxyHelper, 'getCurrencies').callsFake((callback) => {
        callback(null, currencyResponse);
      });
      let expectedResponse = {
        "currentPage": 1,
        "nextPage": 2,
        "limit": 5,
        "totalCount": 1,
        "results": [{
          "listing_id": 706474430,
          "title": "this year is looking bight tags",
          "url": "https://www.etsy.com/listing/706474430/this-year-is-looking-bight-tags?utm_source=wiivvetsy&utm_medium=api&utm_campaign=api",
          "price": 1.341846343602
        }]
      };
      let nextSpy = sinon.spy();
      let headerSpy = sinon.spy();
      let endSpy = sinon.spy(function (responseBody) {
        assert.equal(res.statusCode, 200, 'The response code does not match');
        assert.deepEqual(responseBody, JSON.stringify(expectedResponse), 'The response body does not match');
        done();
      });
      let res = {
        statusCode: 0,
        setHeader: headerSpy,
        end: endSpy
      };

      let etsyService = new EtsyService();
      etsyService.retrieveEtsyList(req, res, nextSpy);
    });
  });
});