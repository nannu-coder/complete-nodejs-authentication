const CustomAPIError = require("./customError");
const { StatusCodes } = require("http-status-codes");

class unAuthorizedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = unAuthorizedError;
