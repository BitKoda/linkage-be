const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Visit = require("../models/visitModel");

const getUsersByID = asyncHandler(async (req, res) => {
  console.log("hello");
  // const user = await User.findById(req.params.id);

  // console.log(User.findById(req.params.id));
  // console.log(req.params.id);
  // if (user.length !== 24) {
  //   res.status(404);
  //   throw new Error("Invalid id");
  // }
  // if (!user) {
  //   res.status(400);
  //   throw new Error("User not found");
  // }
  // res.status(200).json(user);

  const userID = req.params.id;
  console.log(userID);
  if (userID.length !== 24) {
    res.status(404);
    throw new Error("Invalid id");
  }

  await User.findById(userID)
    .exec()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      res.status(404);
      throw new Error("No user found");
    });
});

const getUsers = asyncHandler(async (req, res) => {
  // const users = await User.find({userRole: `${req.query.userRole}`})
  const users = await User.find(req.body);
  res.status(200).json(users);
});

// const getUsersByID = asyncHandler(async (req, res, next) => {
//   // console.log("hello");
//   const userID = req.params._id;
//   if (userID.length !== 24) {
//     res.status(404);
//     throw new Error("Invalid id");
//   }

//   await Users.findById(userID)
//     .exec()
//     .then((user) => {
//       res.status(200).send(user);
//     })
//     .catch((error) => {
//       res.status(404);
//       throw new Error("No user found");
//     });
// });

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
  res.status(200).json({ id: req.params.id });
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
