const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const getUsers = asyncHandler (async (req, res) => {
    const users = await User.find()
    res.status(200).json({users})
})

const setUser = asyncHandler (async (req, res) => {
    if (!req.body) {
        res.status(400)
        throw new Error('Please fill out all fields')
    }
   
    const user = await User.create({
        "firstName": req.body.firstName,
		"lastName": req.body.lastName,
		"email": req.body.email,
		"postcode": req.body.postcode
	
    })
    res.status(201).json(user)
})

const updateUser = asyncHandler (async (req, res) => {
    res.status(201).json({message: `Update user ${req.params.id}`})
})

const deleteUser = asyncHandler (async (req, res) => {
    res.status(204).json({message: `Delete user ${req.params.id}`})
})

module.exports = {
getUsers, setUser, updateUser, deleteUser
}