const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign({ payload }, process.env.JWT_SECRET);
  return token;
};

const verifyJWT = (token) => jwt.verify(token, process.env.JWT_SECRET);

const cookiesResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const longExp = 1000 * 60 * 60 * 24 * 3;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: true,
    signed: true,
    sameSite: "none",
    expires: new Date(Date.now() + oneDay),
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    secure: true,
    signed: true,
    sameSite: "none",
    expires: new Date(Date.now() + longExp),
  });
};

module.exports = { createJWT, verifyJWT, cookiesResponse };
