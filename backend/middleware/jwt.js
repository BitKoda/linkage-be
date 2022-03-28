const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
// const config = require("../config/auth.config.js");
// const db = require("../models");
const User = require("../models/userModel");

// get password vars from .env file
dotenv.config();

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken,
  // isAdmin,
  // isModerator,
};
module.exports = authJwt;
