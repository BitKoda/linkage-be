const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Visit = require('../models/visitModel')

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
 
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }
  res.status(200).json(user);
});

const getUsers = asyncHandler(async (req, res) => {
  // const users = await User.find({userRole: `${req.query.userRole}`})
  const users = await User.find(req.body)
  res.status(200).json(users);
});

const setUser = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }

  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    postcode: req.body.postcode,
    approved: false,
    userRole: req.body.userRole
  });
  res.status(201).json(user);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(201).json(updatedUser);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  await user.remove();
  res.status(200).json({ id: req.params.id });
});











const getVisitByVolunteerId = asyncHandler(async (req, res) => {
const user = await User.findById(req.params.id);
if (!user) {
  res.status(400);
  throw new Error("User not found");
}
const visits = await Visit.find({volunteer_id: req.params.id})
res.status(200).json(visits)

})

module.exports = {
  getUser,
  getUsers,
  setUser,
  updateUser,
  deleteUser,
  getVisitByVolunteerId,
  
};
