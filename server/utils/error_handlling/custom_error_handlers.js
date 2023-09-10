const httpStatusCodes = require('../http_status_codes');
const BaseError = require('./base_error');

class Api400Error extends BaseError {
  constructor(name, statusCode = httpStatusCodes.BAD_REQUEST, description = "Bad Request") {
    super(name, statusCode, description);
  }
}

class Api404Error extends BaseError {
  constructor(name, statusCode = httpStatusCodes.NOT_FOUND, description = "Requested Object Not Found") {
    super(name, statusCode, description);
  }
}

class Api500Error extends BaseError {
  constructor(name, statusCode = httpStatusCodes.INTERNAL_SERVER, description = "Internal server error") {
    super(name, statusCode, description);
  }
}

module.exports = {
  Api400Error,
  Api404Error,
  Api500Error,
};
