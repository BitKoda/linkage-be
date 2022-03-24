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

const getVisitByVisitId = asyncHandler(async (req, res, next) => {
  const visitId = req.params.visitId;
  if (visitId.length !== 24) {
    res.status(404);
    throw new Error("Invalid id");
  }

  await Visit.findById(visitId)
    .exec()
    .then((visit) => {
      res.status(200).send(visit);
    })
    .catch((error) => {
      res.status(404);
      throw new Error("No visit found");
    });
});

module.exports = {
  getAllVisits,
  getVisitByVisitId,
  //   setUser,
  // updateUser,
  // deleteUser,
};
