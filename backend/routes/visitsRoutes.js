const express = require('express')
const router = express.Router()

router.route('/').get(getVisits).post(setVisit)

module.exports = router