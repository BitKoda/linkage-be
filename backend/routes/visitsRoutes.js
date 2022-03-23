const express = require("express");
const router = express.Router();
const { getAllVisits, setVisit } = require("../controllers/visitController");

router.route("/").get(getAllVisits);
// .post(setVisit);

module.exports = router;
