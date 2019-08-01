'use strict';

const ProductService = require('../services/ProductService');
/**
 * creates a product record
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  29 July 2019
 */
module.exports.postProduct = function postProduct(req, res, next) {
  let productService = new ProductService();
  productService.postProduct(req, res, next);
};

/**
 * returns list of products
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  29 July 2019
 */
module.exports.retrieveProductList = function retrieveProductList(req, res, next) {
  let productService = new ProductService();
  productService.retrieveProductList(req, res, next);
};

/**
 * upserts a product record
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  29 July 2019
 */
module.exports.putProduct = function putProduct(req, res, next) {
  let productService = new ProductService();
  productService.putProduct(req, res, next);
};

/**
 * deletes a product record
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  29 July 2019
 */
module.exports.deleteProduct = function deleteProduct(req, res, next) {
  let productService = new ProductService();
  productService.deleteProduct(req, res, next);
};