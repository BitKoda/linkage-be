const express = require("express");
const router = express.Router();
const {
  getAllVisits,
  setVisit,
  getVisitByVisitId,
} = require("../controllers/visitController");

router.route("/").get(getAllVisits).post(setVisit);
router.route("/:visitId").get(getVisitByVisitId);

module.exports = router;
