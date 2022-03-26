const express = require("express");
const router = express.Router();
const {
  getAllVisits,
  setVisit,
  getVisitByVisitId,
  deleteVisit,
  updateVisitTime,
} = require("../controllers/visitController");

router.route("/").get(getAllVisits).post(setVisit);
router
  .route("/:visitId")
  .get(getVisitByVisitId)
  .delete(deleteVisit)
  .patch(updateVisitTime);
module.exports = router;
