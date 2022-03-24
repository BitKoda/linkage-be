const express = require("express");
const router = express.Router();
const { getAllVisits, setVisit, getVisitByVisitId } = require("../controllers/visitController");

router.route("/").get(getAllVisits);
router.route('/:visitId').get(getVisitByVisitId)
// .post(setVisit);

module.exports = router;
