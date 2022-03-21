const asyncHandler = require('express-async-handler')

const getUsers = asyncHandler (async (req, res) => {
    res.status(200).json({message: 'Get users'})
})

const setUser = asyncHandler (async (req, res) => {
    if (!req.body.newUser) {
        res.status(400)
        throw new Error('Please fill out all fields')
    }
    res.status(201).json({message: 'Set user'})
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