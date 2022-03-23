const express = require('express')
const router = express.Router()
const {getUser, getUsers, setUser, updateUser, deleteUser, getVisitByVolunteerId} = require('../controllers/userController')

// router.route('/').get(getUser)

router.route('/').get(getUsers).post(setUser)

router.route('/:id').put(updateUser).delete(deleteUser).get(getUser)




router.route('/:id/visits').get(getVisitByVolunteerId)



module.exports = router