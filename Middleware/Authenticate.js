const unAuthenticateError = require("../Errors/AuthenticateError");
const { verifyJWT, cookiesResponse } = require("../Utils/JWT");
const Token = require("../Models/tokenModel");

const authenTicate = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;

  try {
    if (accessToken) {
      const { payload } = verifyJWT(accessToken);
      req.user = payload.user;
      return next();
    }

    const { payload } = verifyJWT(refreshToken);
    const existingToken = await Token.findOne({
      user: payload.user.id,
      refreshToken: payload.refreshToken,
    });

    if (!existingToken || !existingToken?.isValid) {
      throw new unAuthenticateError("Authentication failed");
    }

    cookiesResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });

    req.user = payload.user;

    next();
  } catch (error) {
    throw new unAuthenticateError("Invalid Authorization");
  }
};

module.exports = authenTicate;
