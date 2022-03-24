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
    try {
      const visit = await Visit.findById(req.params.visitId);
        const visitArr = [...visit]
console.log(visitArr)
      if (!visitArr.length) {
        res.status(404);
        throw new Error("No visit found");
      }
      res.status(200).json(visit);
    } catch (error) {
      next(error);
    }
  });



module.exports = {
  getAllVisits,
  getVisitByVisitId
  //   setUser,
  // updateUser,
  // deleteUser,
};
