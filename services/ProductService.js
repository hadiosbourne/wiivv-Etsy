'use strict';
const {Product} = require('../models');
const CurrencyLayerProxyHelper = require('../helpers/CurrencyLayerProxyHelper');
const _ = require('lodash');
const async = require('async');

/**
 * Create an instance of the Product Service
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  29 July 2019
 */
class ProductService {

  constructor() {}

  /**
   * Creates a product record, prevents duplicate records where a product with the same type and title exists
   *
   * @param {object} req - The request arguments passed in from the controller
   * @param {IncomingMessage} res - The http response object
   * @param {function} next - The callback used to pass control to the next action/middleware
   *
   * @author Hadi Shayesteh <hadishayesteh@gmail.com>
   * @since  27 July 2019
   *
   * @return void
   */
  postProduct(req, res, next) {
    let payload = req.swagger.params.product.value;
    async.series({
      findOneProductRecord: (cb)=>{
        _findOneProductRecord({'title': payload['title'], 'type': payload['type']}, (err, result)=>{
          if(err) {
            return cb(err);
          }
          if(!_.isEmpty(result)) {
            let duplicationError = {
              code: 400,
              message: 'There is already a product with the same type and title on record'
            };
            return cb(duplicationError);
          }
          return cb(null, result);
        })
      },
      saveProductRecord: (cb) => {
        _saveProductRecord(payload, (err, result)=>{
          if(err) {
            return cb(err);
          }
          return cb(null, JSON.stringify(result));
        })
      }
    }, (err, results) => {
      if (err) {
        res.status(err.code).json(err.message);
        return next();
      }
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(results['saveProductRecord']);
    });
  }

  /**
   * retrieves a list of products
   *
   * @param {object} req - The request arguments passed in from the controller
   * @param {IncomingMessage} res - The http response object
   * @param {function} next - The callback used to pass control to the next action/middleware
   *
   * @author Hadi Shayesteh <hadishayesteh@gmail.com>
   * @since  27 July 2019
   *
   * @return void
   */
  retrieveProductList(req, res, next) {
    let currency = req.swagger.params.currency.value;
    let limit = req.swagger.params.items_per_page.value;
    let page = req.swagger.params.page.value;
    let sortParam = req.swagger.params.sort_parameter.value;
    let sortOrder = req.swagger.params.sort_order.value;
    async.autoInject({
      findProductList: (cb)=>{
        _findProductList(sortParam, sortOrder, page, limit, (err, result)=>{
          if(err) {
            return cb(err);
          }
          return cb(null, result);
        })
      },
      updateCurrency: (findProductList, cb) => {
        _currencyConverter(findProductList, currency, (err, result) => {
          if(err) {
            return cb(err);
          }
          return cb(null, result);
        })
      }
    }, (err, results) => {
      if(err) {
        res.status(err.code).json(err.message);
        return next();
      }
      res.setHeader('Content-Type', 'application/json');

      if(_.isEmpty(results['findProductList'])) {
        res.statusCode = 204;
        res.end(JSON.stringify([]));
      } else {
        res.statusCode = 200;
        res.end(JSON.stringify(results['updateCurrency']));
      }
    });
  }

  /**
   * updates an existing product
   *
   * @param {object} req - The request arguments passed in from the controller
   * @param {IncomingMessage} res - The http response object
   * @param {function} next - The callback used to pass control to the next action/middleware
   *
   * @author Hadi Shayesteh <hadishayesteh@gmail.com>
   * @since  27 July 2019
   *
   * @return void
   */
  putProduct(req, res, next) {
    let payload = req.swagger.params.product.value;
    let productId = req.swagger.params.product_id.value;
    async.autoInject({
      validateDuplicateProductRecord: (cb) => {
        _findOneProductRecord({'title': payload['title'], 'type': payload['type']}, (err, result) => {
          if(err) {
            return cb(err);
          }
          if(!_.isEmpty(result)) {
            let duplicationError = {
              code: 400,
              message: 'There is already a product with the same type and title on record'
            };
            return cb(duplicationError);
          }
          return cb(null, result)
        });
      },
      findOneProductRecord: (cb) => {
        _findOneProductRecord({'_id': productId}, (err, result) => {
          if(err) {
            return cb(err);
          }
          if(_.isEmpty(result)) {
            let resourceNotFound = {
              code: 404,
              message: 'There was no record found matching the given product id'
            };
            return cb(resourceNotFound);
          }
          _.forEach(payload, (value, key) => {
            result[key] = value;
          });
          return cb(null, result)
        });
      },
      saveProductRecord: (findOneProductRecord, cb) => {
        _saveProductRecord(findOneProductRecord , (err, result)=>{
          if(err) {
            return cb(err);
          }
          return cb(null, result)
        });
      }
    }, (err, results) => {
      if (err) {
        res.status(err.code).json(err.message);
        return next();
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(results['saveProductRecord']));
    });
  }

  /**
   * removes a product record
   *
   * @param {object} req - The request arguments passed in from the controller
   * @param {IncomingMessage} res - The http response object
   * @param {function} next - The callback used to pass control to the next action/middleware
   *
   * @author Hadi Shayesteh <hadishayesteh@gmail.com>
   * @since  27 July 2019
   *
   * @return void
   */
  deleteProduct(req, res, next) {
    let productId = req.swagger.params.product_id.value;
    async.autoInject({
      findOneProductRecord: (cb) => {
        _findOneProductRecord({'_id': productId}, (err, result) => {
          if(err) {
            return cb(err);
          }
          if(_.isEmpty(result)) {
            let resourceNotFound = {
              code: 404,
              message: 'There was no record found matching the given product id'
            };
            return cb(resourceNotFound);
          }
          return cb(null, result)
        });
      },
      deleteProductRecord: (findOneProductRecord, cb) => {
        _deleteProductRecord(findOneProductRecord._id , (err, result)=>{
          if(err) {
            return cb(err);
          }
          return cb(null, result);
        });
      }
    }, (err, results) => {
      if (err) {
        res.status(err.code).json(err.message);
        return next();
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(results['deleteProductRecord']));
    });
  }
}

module.exports = ProductService;

/**
 * Get the Product record from database
 *
 * @param {object} query - The query to match
 * @param {function} callback - The callback
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  29 July 2019
 *
 * @private
 *
 * @return void
 */
function _findOneProductRecord(query, callback) {
  Product.findOne(query, (err, res)=>{
    if(err) {
      let error = {
        code: 500,
        message: 'There was an error while finding the Product record'
      }
      return callback(error);
    }
    return callback(null, res);
  })
}

/**
 * saves a product record
 *
 * @param {object} product - The product object to save
 * @param {function} callback - The callback
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  29 July 2019
 *
 * @private
 *
 * @return void
 */
function _deleteProductRecord(productId, callback) {
  Product.remove({'_id': productId}, (err, res)=>{
    if(err) {
      let error = {
        code: 500,
        message: 'There was an error while saving the Product record' + err
      }
      return callback(error);
    }
    return callback(null, {'Success': true});
  });  
}

/**
 * saves a product record
 *
 * @param {object} product - The product object to save
 * @param {function} callback - The callback
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  29 July 2019
 *
 * @private
 *
 * @return void
 */
function _saveProductRecord(product, callback) {
  let productRecord = new Product(product)
  productRecord.save((err, res)=>{
    if(err) {
      let error = {
        code: 500,
        message: 'There was an error while saving the Product record' + err
      }
      return callback(error);
    }
    return callback(null, res);
  });  
}

/**
 * Gets the list of products
 *
 * @param {object} query - The query to match
 * @param {object} offset - The offset value
 * @param {object} limit - The limit
 * @param {function} callback - The callback
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  29 July 2019
 *
 * @private
 *
 * @return void
 */
function _findProductList(sortParam, sortOrder, offset, limit, callback) {
  let aggregationArray = [    
    {'$skip': offset},
    {'$limit': limit},
    {'$sort': {[sortParam]: sortOrder}}
  ];

  Product.aggregate(aggregationArray).exec(function(err, results) {
    if (err) {
      let runtimeError = {
        code: 500,
        message: 'An error occurred while retrieving Product records ' + err
      };
      return callback(runtimeError);
    }
    return callback(null, results);
  });
  
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
      entry['price'] = entry['price'] * res[currency];
      finalResult.push(entry);
    })
    return callback(null, finalResult)
  });
}