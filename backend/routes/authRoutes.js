const express = require("express");
const authJwt = require("../middleware/jwt");

const router = express.Router();
const { setUser, loginUser } = require("../controllers/userController");

// router.route("/signup").post(setUser);

// router.route("/login").post(loginUser);
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/api/auth/signup",

    setUser
  );
  app.post("/api/auth/login", loginUser);
};

// module.exports = router;
