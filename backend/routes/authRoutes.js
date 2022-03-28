const express = require("express");
const authJwt = require("../middleware/jwt");

const router = express.Router();
const { setUser, loginUser } = require("../controllers/userController");

router.route("/signup").post(setUser);

router.route("/login").post(loginUser);

module.exports = router;
