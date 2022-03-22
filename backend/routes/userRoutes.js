const express = require('express')
const router = express.Router()
const {getUsersByRole, setUser, updateUser, deleteUser} = require('../controllers/userController')

router.route('/').get(getUsersByRole).post(setUser) 

router.route('/:id').put(updateUser).delete(deleteUser)


module.exports = router