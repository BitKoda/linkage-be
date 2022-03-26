const express = require("express");
const router = express.Router();
const getEndpoints = require("../controllers/endpointsController");

router.route("/").get(getEndpoints);

module.exports = router;
