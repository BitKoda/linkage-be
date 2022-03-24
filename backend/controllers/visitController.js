const asyncHandler = require("express-async-handler");
const Visit = require("../models/visitModel");

const getAllVisits = asyncHandler(async (req, res, next) => {
  try {
    const visits = await Visit.find();

    if (!visits) {
      res.status(404);
      throw new Error("No visits found");
    }
    res.status(200).json(visits);
  } catch (error) {
    next(error);
  }
});

module.exports = {
  getAllVisits,
  //   setUser,
  // updateUser,
  // deleteUser,
};
