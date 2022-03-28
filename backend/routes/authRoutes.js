const express = require("express");

const router = express.Router();
const { setUser, loginUser } = require("../controllers/userController");

router.route("/signup").post(setUser);

router.route("/login").post(loginUser);

module.exports = router;
