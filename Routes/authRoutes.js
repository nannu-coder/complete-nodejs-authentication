const router = require("express").Router();
const {
  register,
  login,
  verification,
  forgotPassword,
  resetPassword,
  logout,
} = require("../Controllers/authController");
const authenTicate = require("../Middleware/Authenticate");

router.post("/register", register);
router.post("/login", login);
router.post("/verify", verification);
router.post("/forgotPassword", forgotPassword);
router.post("/resetpassword", resetPassword);
router.delete("/logout", authenTicate, logout);

module.exports = router;
