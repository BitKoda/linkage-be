const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Visit = require("../models/visitModel");

const getUsersByID = asyncHandler(async (req, res) => {
  const userID = req.params.id;
  if (userID.length !== 24) {
    res.status(404);
    throw new Error("Invalid ID");
  }

  await User.findById(userID)
    .exec()
    .then((user) => {
      if (user === null) {
        throw new Error("No User Found");
      } else {
        res.status(200).send(user);
      }
    })
    .catch((error) => {
      res.status(404);
      throw new Error("No User Found");
    });
});

const getUsers = asyncHandler(async (req, res) => {
  if (Object.keys(req.query).length === 0) {
    const users = await User.find();
    res.status(200).json(users);
  } else {
    if (
      req.query.userRole !== "volunteer" &&
      req.query.userRole !== "visitee" &&
      req.query.userRole !== "admin"
    ) {
      res.status(404);
      throw new Error("Invalid Pathway");
    } else {
      const users = await User.find({
        userRole: `${req.query.userRole}`,
      });
      res.status(200).json(users);
    }
  }
});

const setUser = asyncHandler(async (req, res, next) => {
  try {
    const exists = Object.values(req.body);
    const valueLength = exists.map((value) => {
      return value.length;
    });
    valueLength.some((value) => {
      if (value === 0) {
        res.status(400);
        throw new Error("Please fill out all fields");
      }
    });
    if (
      req.body.userRole !== "volunteer" &&
      req.body.userRole !== "visitee" &&
      req.body.userRole !== "admin"
    ) {
      res.status(400);
      throw new Error("Incorrect input");
    }

    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      postcode: req.body.postcode,
      approved: false,
      userRole: req.body.userRole,
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
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
  res.status(204).json({ id: req.params.id });
});

const getVisitByUserId = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.userRole === "volunteer") {
    const visits = await Visit.find({ volunteerId: req.params.id });
    res.status(200).json(visits);
  } else {
    const visits = await Visit.find({ visiteeId: req.params.id });
    res.status(200).json(visits);
  }
});

module.exports = {
  getUsersByID,
  getUsers,
  setUser,
  updateUser,
  deleteUser,
  getVisitByUserId,
};
