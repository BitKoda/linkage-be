const asyncHandler = require("express-async-handler");
const axios = require("axios");
const User = require("../models/userModel");
const Visit = require("../models/visitModel");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");


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
    const { password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    req.body.password = bcrypt.hashSync(password, salt);

    const pcode = req.body.postcode.replace(" ", "");
    const url = `http://api.getthedata.com/postcode/${pcode}`;

    let longitude;
    let latitude;

    await axios
      .get(url)
      .then((result) => {
        if (result.data.status === "match") {
          longitude = result.data.data.longitude;
          latitude = result.data.data.latitude;
        } else if (result.data.status === "no_match") {
          res.status(400);
          throw new Error("Bad request: postcode invalid");
        }
      })
      .catch((err) => {
        res.status(400);
        throw new Error("Bad request: postcode invalid");
      });

    await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      postcode: req.body.postcode,
      approved: false,
      userRole: req.body.userRole,
      lastVisit: req.body.lastVisit,
      password: req.body.password,
    });

    res.status(201).json({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      postcode: req.body.postcode,
      approved: false,
      userRole: req.body.userRole,
      lastVisit: req.body.lastVisit,
      latitude: latitude,
      longitude: longitude,
    });
  } catch (error) {
    next(error);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  await User.findById(req.params.id)
    .exec()
    .catch((err) => {
      res.status(404);
      throw new Error("User not found");
    });
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedUser);
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

const updateUsersInterests = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  if (userId.length !== 24) {
    res.status(404);
    throw new Error("Invalid id");
  }
  await User.findById(userId)
    .exec()
    .catch((error) => {
      res.status(404);
      throw new Error("No user found");
    });
  if (req.body.interests.length === 0) {
    res.status(400);
    throw new Error("Bad request");
  }
  const updatedUserInterests = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
  });
  res.status(201).json(updatedUserInterests);
});

const loginUser = asyncHandler(async (req, res, next) => {
  await User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
        expiresIn: 86400, // 24 hours
      });
      res.setHeader("x-access-control", token).status(200).send({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        postcode: user.postcode,
        approved: user.approved,
        userRole: user.userRole,
        lastVisit: user.lastVisit,
        accessToken: token,
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = {
  getUsersByID,
  getUsers,
  setUser,
  updateUser,
  deleteUser,
  getVisitByUserId,
  updateUsersInterests,
  loginUser,
};
