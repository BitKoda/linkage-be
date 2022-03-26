const asyncHandler = require("express-async-handler");
const Visit = require("../models/visitModel");
const User = require("../models/userModel");

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

const setVisit = asyncHandler(async (req, res, next) => {
  try {
    const entries = Object.values(req.body);
    const valueLength = entries.map((value) => {
      return value.length;
    });
    valueLength.some((value) => {
      if (value === 0) {
        res.status(400);
        throw new Error("Please fill out all fields");
      }
    });

    let userVisit;
    await User.findById(req.body.visiteeId)
      .exec()
      .then((user) => {
        userVisit = user.lastVisit;
        userVisit.push(req.body.visitTime);
      })
      .catch((err) => {
        res.status(404);
        throw new Error("No user found");
      });
    const updatedTime = {
      lastVisit: userVisit,
    };

    await User.findByIdAndUpdate(req.body.visiteeId, updatedTime, {
      new: true,
    });

    const postedVisit = await Visit.create({
      volunteerId: req.body.volunteerId,
      visiteeId: req.body.visiteeId,
      volunteerFirstName: req.body.volunteerFirstName,
      volunteerLastName: req.body.volunteerLastName,
      visiteeFirstName: req.body.visiteeFirstName,
      visiteeLastName: req.body.visiteeLastName,
      visitTime: req.body.visitTime,
    });

    res.status(200).json(postedVisit);
  } catch (error) {
    next(error);
  }
});

const deleteVisit = asyncHandler(async (req, res, next) => {
  const visitId = req.params.visitId;

  if (visitId.length !== 24) {
    res.status(404);
    throw new Error("Invalid id");
  }
  const visit = await Visit.findById(visitId);

  let userVisit;

  await User.findById(visit.visiteeId)
    .exec()
    .then((user) => {
      userVisit = user.lastVisit;
      userVisit.pop();
    })
    .catch((err) => {
      res.status(404);
      throw new Error("No user found");
    });
  const updatedTime = {
    lastVisit: userVisit,
  };

  await User.findByIdAndUpdate(req.body.visiteeId, updatedTime, {
    new: true,
  });

  await visit.remove();

  res.status(204).json({ id: req.params.visitId });
});

const updateVisitTime = asyncHandler(async (req, res, next) => {
  const visitId = req.params.visitId;

  if (visitId.length !== 24) {
    res.status(404);
    throw new Error("Invalid id");
  }
  await Visit.findById(visitId)
    .exec()
    .then((visit) => {})
    .catch((error) => {
      res.status(404);
      throw new Error("No visit found");
    });
  //   console.log(req.body.visitTime.length);
  if (req.body.visitTime.length === 0) {
    res.status(400);
    throw new Error("Bad request");
  }

  const updatedUser = await Visit.findByIdAndUpdate(visitId, req.body, {
    new: true,
  });

  res.status(201).json(updatedUser);
});

module.exports = {
  getAllVisits,
  getVisitByVisitId,
  setVisit,
  deleteVisit,
  updateVisitTime,
};
