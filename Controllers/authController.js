const User = require("../Models/userModel");
const { StatusCodes } = require("http-status-codes");
const badRequestError = require("../Errors/BadRequestError");
const crypto = require("crypto");
const unAuthenticateError = require("../Errors/AuthenticateError");
const sendVerificationEmail = require("../Utils/sendVerificationEmail");
const notFoundError = require("../Errors/notFoundError");
const sendResetPassword = require("../Utils/sendResetPasswordMail");
const Token = require("../Models/tokenModel");
const { cookiesResponse } = require("../Utils/JWT");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new badRequestError("Please provide all values");
  }

  const emailAlreadyExit = await User.findOne({ email });
  if (emailAlreadyExit) {
    throw new badRequestError("Email already Exists");
  }

  const isFirst = (await User.countDocuments({})) === 0;
  const role = isFirst ? "admin" : "user";
  const verificationToken = crypto.randomBytes(45).toString("hex");

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });

  const origin = "https://vite-auth.netlify.app";

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

  res.status(StatusCodes.CREATED).json({
    status: "Success! Please Check Email to verify Account",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new badRequestError("Please provide Email & Password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new unAuthenticateError("Invalid Credentials");
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new unAuthenticateError("Invalid Credentials");
  }

  if (!user.isVerified) {
    throw new unAuthenticateError("Please verify your account");
  }

  const tokenUser = {
    name: user.name,
    id: user._id,
    role: user.role,
  };

  //create refresh token
  let refreshToken = "";

  // check existing token
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new badRequestError("Expired Session Token");
    }
    refreshToken = existingToken.refreshToken;
    cookiesResponse({ res, user: tokenUser, refreshToken });
    res
      .status(StatusCodes.OK)
      .json({ id: user._id, name: user.name, email: user.email });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };
  cookiesResponse({ res, user: tokenUser, refreshToken });

  await Token.create(userToken);

  res
    .status(StatusCodes.OK)
    .json({ id: user._id, name: user.name, email: user.email });
};

const verification = async (req, res) => {
  const { email, verificationToken } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new unAuthenticateError("Verification failed");
  }

  if (verificationToken !== user.verificationToken) {
    throw new unAuthenticateError("Verification failed");
  }

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Email Verified" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new badRequestError("Please enter a valid email");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new notFoundError("user not found");
  }

  if (user) {
    const verifyToken = crypto.randomBytes(72).toString("hex");

    //send email
    const origin = "https://vite-auth.netlify.app";

    await sendResetPassword({
      name: user.name,
      email: user.email,
      token: verifyToken,
      origin,
    });

    const tenMinitues = 1000 * 60 * 10;
    const passwordExpire = new Date(Date.now() + tenMinitues);

    user.passwordToken = verifyToken;
    user.passwordTokenExpire = passwordExpire;

    await user.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Please Check your Email for reset password link" });
};

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;

  // console.log(token, email, password);

  if (!token || !email || !password) {
    throw new badRequestError("Please provide all values");
  }

  const user = await User.findOne({ email });

  if (user.passwordToken !== token) {
    throw new badRequestError("Invalid Token");
  }

  if (user) {
    const currentDate = new Date();

    if (
      user.passwordToken === token &&
      user.passwordTokenExpire > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpire = null;
      await user.save();
    }
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Password updated successfully", status: "success" });
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.id });
  console.log("user id", req.user.id);

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "User Logged Out" });
};

module.exports = {
  register,
  login,
  verification,
  forgotPassword,
  resetPassword,
  logout,
};
