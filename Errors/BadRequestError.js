const CustomAPIError = require("./customError");
const { StatusCodes } = require("http-status-codes");

class badRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = badRequestError;
