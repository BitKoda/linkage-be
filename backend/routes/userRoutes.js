const express = require('express')
const router = express.Router()
const {getUser, getUsers, setUser, updateUser, deleteUser} = require('../controllers/userController')

// router.route('/').get(getUser)

router.route('/').get(getUsers).post(setUser)

router.route('/:id').put(updateUser).delete(deleteUser).get(getUser)


module.exports = router