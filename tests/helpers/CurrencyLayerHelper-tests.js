'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const CurrencyLayerProxyHelper = require('../../helpers/CurrencyLayerProxyHelper');
const request = require('request');

describe('CurrencyLayerProxyHelper testing scenarios', function () {

  describe('getCurrencies test cases', function () {

    /**
     * Test for the successful return of currency quote
     *
     * @author hadi.shayesteh <hadishayesteh@gmail.com>
     * @since  29 July 2019
     *
     * @covers helpers/CurrencyLayerProxyHelper.getCurrencies
     */
    it('Testing the successful return of currency quote', function (done) {
  
      let currencylayerResponse = {
        body: '{"quotes": {"USDGBP": 0.819099, "USDCAD": 1.314515, "USDUSD": 1, "USDEUR": 0.89874}}'
      }

      let requestStub = sinon.stub(request, 'get').callsFake((url ,callback) => {
        callback(null, currencylayerResponse);
      });

      let expectedResponse = {
        'GBP': 0.819099,
        'CAD': 1.314515,
        'USD': 1,
        'EUR': 0.89874
      };

      let callbackSpy = sinon.spy((err, res) => {
        assert.deepEqual(res, expectedResponse, 'Incorrect response was returned by test');
        requestStub.restore();
        done();
      });

      CurrencyLayerProxyHelper.getCurrencies(callbackSpy);
    });

  });
});

// { success: true,
//   terms: 'https://currencylayer.com/terms',
//   privacy: 'https://currencylayer.com/privacy',
//   timestamp: 1564589289,
//   source: 'USD',
//   quotes:
//    { USDGBP: 0.819099, USDCAD: 1.314515, USDUSD: 1, USDEUR: 0.89874 } }
