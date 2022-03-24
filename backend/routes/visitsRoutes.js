const express = require("express");
const router = express.Router();
const {
  getAllVisits,
  setVisit,
  getVisitByVisitId,
  deleteVisit,
} = require("../controllers/visitController");

router.route("/").get(getAllVisits).post(setVisit);
router.route("/:visitId").get(getVisitByVisitId).delete(deleteVisit);

module.exports = router;
