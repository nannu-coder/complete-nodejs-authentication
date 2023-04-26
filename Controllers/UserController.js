const { StatusCodes } = require("http-status-codes");

const showMe = async (req, res) => {
  res.status(StatusCodes.OK).json(req.user);
};

module.exports = { showMe };
