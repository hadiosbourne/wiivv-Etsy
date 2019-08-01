'use strict';

const EtsyService = require('../services/EtsyService');

/**
 * returns list of etsy products
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  29 July 2019
 */
module.exports.retrieveEtsyList = function retrieveEtsyList(req, res, next) {
  let etsyService = new EtsyService();
  etsyService.retrieveEtsyList(req, res, next);
};