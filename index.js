'use strict';

const app = require('express')();
const http = require('http');
const swaggerTools = require('swagger-tools');
const jsyaml = require('js-yaml');
const fs = require('fs');
const config = require('config');
const _ = require('lodash');
const serverPort = (config.has('server.port')) ? config.get('server.port') : 4000;
const mongoose = require('mongoose');
const cors = require('cors');
const JWTSecurityHelper = require('./helpers/JWTSecurityHelper');

mongoose.plugin((schema) => { schema.options.usePushEach = true; });
mongoose.Promise = global.Promise;
// Allow any calls on /docs and /api-docs
const options = {
  swaggerUi: '/swagger.json',
  controllers: './controllers',
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

mongoose.connect(config.mongo.database_host, config.mongo.options);
mongoose.connection.on(
  'error',
  function mongooseConnection(error) {
    process.exit(1);
  }
);

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const spec = fs.readFileSync('./api/swagger.yaml', 'utf8');
const swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function middleWareFunc(middleware) {
  app.use(cors());

  app.use(function initUse(req, res, next) {
    // Strip off the query params to keep log message to minimum
    next();
  });

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  let securityMetaData = {};

  // Modifying the middleware swagger security, to cater for jwt verification
  securityMetaData.jwt = function validateJWT(req, res, token, next) {
    return JWTSecurityHelper.jwtVerification(req, token, config.jwt_api_token, (err)=>{
      if(err) {
        let jwtValidationError = {
          'Error': true,
          'code': 'validation_error',
          'ErrorMessage': err,
          'statusCode': 401
        };
        return next(jwtValidationError);
      }
      return next();
    });
  };

  // Set the methods that should be used for swagger security
  app.use(middleware.swaggerSecurity(securityMetaData));
  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi(config.get('swagger_ui_config')));
  app.use(function errorHandler(err, req, res, next) {
    if(err.code === `SCHEMA_VALIDATION_FAILED`) {
      let swaggerValidationError = {
        'Error': true,
        'ErrorMessage': err.message + ', path: [' + err.results.errors[0].path + '], ' + err.results.errors[0].message
      };
      res.status(400).json(swaggerValidationError);
    } else if(err.code === `validation_error`) {
      let jwtValidationError = {
        'Error': true,
        'ErrorMessage':err.ErrorMessage
      };
      res.status(err.statusCode).json(jwtValidationError);
    }
    next();
  });
  // Start the server
  http.createServer(app).listen(serverPort, function createFunc() {
    console.log(`Your server is listening on port ${serverPort} (http://localhost:${serverPort})`);
    // console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });
});