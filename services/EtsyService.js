'use strict';
const EtsyStoreProxyHelper = require('../helpers/EtsyStoreProxyHelper');
const CurrencyLayerProxyHelper = require('../helpers/CurrencyLayerProxyHelper');
const _ = require('lodash');
const async = require('async');

/**
 * Create an instance of the Product Service
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  29 July 2019
 */
class EtsyService {

  constructor() {}

  /**
   * retrieves a list of etsy products
   *
   * @param {object} req - The request arguments passed in from the controller
   * @param {IncomingMessage} res - The http response object
   * @param {function} next - The callback used to pass control to the next action/middleware
   *
   * @author Hadi Shayesteh <hadishayesteh@gmail.com>
   * @since  29 July 2019
   *
   * @return void
   */
  retrieveEtsyList(req, res, next) {
    let currency = req.swagger.params.currency.value;
    let limit = req.swagger.params.items_per_page.value;
    let page = req.swagger.params.page.value;
    async.autoInject({
      findProductList: (cb)=>{
        EtsyStoreProxyHelper.getListing(limit, page, (err, result)=>{
          if(err) {
            return cb(err);
          }
          return cb(null, result);
        })
      },
      updateResultsCurrency: (findProductList, cb) => {
        _currencyConverter(findProductList['results'], currency, (err, result) => {
          if(err) {
            return cb(err);
          }
          return cb(null, result);
        })
      },
      responseObject: (findProductList, updateResultsCurrency, cb) => {
        return cb(null, _createResponseObject(limit, page, findProductList['totalCount'], updateResultsCurrency));
      }
    }, (err, results) => {
      if(err) {
        res.status(err.code).json(err.message);
        return next();
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(results['responseObject']);
    });
  }

}

module.exports = EtsyService;

/**
 * converts the currency into the user passed in value
 *
 * @param {array} productsList - The array of products
 * @param {string} currency - The currency value
 * @param {function} callback - The callback
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  29 July 2019
 *
 * @private
 *
 * @return void
 */
function _createResponseObject(limit, page, count, updateResultsCurrency) {
  let finalResponse = {
    'currentPage': page,
    'nextPage': ++page,
    'limit': limit,
    'totalCount': count,
    'results': updateResultsCurrency
  };

  return JSON.stringify(finalResponse);
}

/**
 * converts the currency into the user passed in value
 *
 * @param {array} productsList - The array of products
 * @param {string} currency - The currency value
 * @param {function} callback - The callback
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  29 July 2019
 *
 * @private
 *
 * @return void
 */
function _currencyConverter(productsList, currency, callback) {
  CurrencyLayerProxyHelper.getCurrencies((err, res)=>{
    if(err) {
      return callback(err);
    }
    let finalResult = [];
    productsList.filter((entry) => {
      if ('listing_id' in entry && 'title' in entry && 'url' in entry && 'price' in entry) {
        let newEntry = {
          'listing_id': entry['listing_id'],
          'title':  entry['title'],
          'url':  entry['url'],
          'price': entry['price'] * res[currency]
        }
        finalResult.push(newEntry);
      }
    });
    return callback(null, finalResult)
  });
}