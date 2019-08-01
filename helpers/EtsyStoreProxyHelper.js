'use strict';
const config = require('config');
const etsyConfig = config.get('etsy_config')
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();
const request = require('request');

module.exports = {

  /**
   * Method to use proxy and check the cache for existing record
   *
   * @param {object} callback - The callback object
   *
   * @author Hadi Shayesteh <hadishayesteh@gmail.com>
   * @since  29 July 2019
   *
   * @return void
   */
  getListing(limit, offset, callback) {
    let url = etsyConfig['url'] + '/listings/active?limit=' + limit + '&offset=' + offset + '&api_key=' + etsyConfig['api_key']
    myCache.get(url, (err, value)=>{
      if(err) {
        return callback(err);
      } else if(value == undefined) {
        _getEtsyListing(url, callback);
      } else {
        return callback(null, value);
      }
    });
  }
}

/**
 * Proxy method to request product listing from etsy
 *
 * @param {string} url - The url to be used
 * @param {object} callback - The callback object
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  29 July 2019
 *
 * @return void
 */
function _getEtsyListing(url,  callback) {
  request.get(url, (error, response) => {
    if (error) {
      let errorObj = {
        code: 500,
        message: error
      }
      return callback(errorObj);
    }

    let etsyResponse = JSON.parse(response.body);
    let recordToReturn = {
      totalCount: etsyResponse['count'],
      results: etsyResponse['results']
    }
    myCache.set(url, recordToReturn, etsyConfig['url_ttl'], (err) => {
      if(err){
        return callback(err);
      }
      return callback(null, recordToReturn);
    });
  });
}