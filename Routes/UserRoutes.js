const { showMe } = require("../Controllers/UserController");
const authenTicate = require("../Middleware/Authenticate");

const router = require("express").Router();

router.get("/me", authenTicate, showMe);

module.exports = router;
