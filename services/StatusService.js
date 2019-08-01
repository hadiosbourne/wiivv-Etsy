'use strict';

/**
 * The StatusService class
 *
 * @module StatusService
 */
class StatusService {

  constructor() {}

  /**
   * Gets the system status
   *
   * @param {Object} req - The request arguments passed in from the controller
   * @param {IncomingMessage} res - The http response object
   * @param {Function} next - The callback used to pass control to the next action/middleware
   *
   * @author Hadi Shayesteh <hadishayesteh@gmail.com>
   * @since  29 July 2019
   */
  async getSystemStatus(req, res, next) {
    try {
      let upTime = await Math.floor(process.uptime());
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        'up_time': upTime
      });
    } catch (err) {
      let error = {
        'Error': true,
        'ErrorMessage': 'An error occurred while retrieving system status' + err
      };
      next(error) 
    }
  }

}

module.exports = StatusService;