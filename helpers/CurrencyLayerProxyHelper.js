'use strict';
const config = require('config');
const request = require('request');
const currencylayerConfig = config.get('currency_layer_config');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

const keysMap = {
  'USDGBP': 'GBP',
  'USDCAD': 'CAD',
  'USDUSD': 'USD',
  'USDEUR': 'EUR'
};

module.exports = {

  /**
   * Method to get the currency exchange rate, the current subscription only exchanges based on USD, for paid subscription we can use &source=CAD to base the rates on CAD
   *
   * @param {object} callback - The callback object
   *
   * @author Hadi Shayesteh <hadishayesteh@gmail.com>
   * @since  29 July 2019
   *
   * @return void
   */
  getCurrencies(callback) {
    myCache.get('currency_quotes', (err, value)=>{
      if(err) {
        return callback(err);
      } else if(value == undefined) {
        _getConversionQuote(callback);
      } else {
        return callback(null, value);
      }
    });
  }
}

/**
 * Method to get the currency exchange rate, the current subscription only exchanges based on USD, for paid subscription we can use &source=CAD to base the rates on CAD
 *
 * @param {object} callback - The callback object
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  29 July 2019
 *
 * @return void
 */
function _getConversionQuote(callback) {
  let url = currencylayerConfig['url']  + '?access_key=' + currencylayerConfig['api_key'] + '&currencies=' + currencylayerConfig['currencies'];
  request.get(url, (error, response) => {
    if (error) {
      let errorObj = {
        code: 500,
        message: error
      }
      return callback(errorObj);
    }
    myCache.set('currency_quotes', _renameKeys(JSON.parse(response.body)['quotes']), currencylayerConfig['quote_ttl'], (err) => {
      if(err){
        return callback(err);
      }
      return callback(null, _renameKeys(JSON.parse(response.body)['quotes']));
    });
  });
}

/**
 * helper function to rename the currency keys
 * Converts USDGBP,USDCAD,USDUSD,USDEUR
 *
 * @param {object} obj - The currency object
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  29 July 2019
 *
 * @private
 *
 * @return void
 */
function _renameKeys(obj) {
  return Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: obj[key] }
    }),
    {}
  );
}
