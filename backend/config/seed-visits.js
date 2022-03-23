const mongoose = require("mongoose");
const connectDB = require("../config/db");
const dotenv = require("dotenv").config();
const colors = require("colors");
const Visit = require("../models/visitModel");
const User = require("../models/userModel");
const savedData = {};

const saveUser = () => {
  const users = [
    {
      firstName: "Andy",
      lastName: "Northcoder",
      email: "ex@gmail.com",
      postcode: "m50 3ao",
      approved: false,
      userRole: "volunteer",
    },
    {
      firstName: "Freddie",
      lastName: "N",
      email: "sdg@gmail.com",
      postcode: "m50 5th",
      approved: false,
      userRole: "visitee",
    },
    
  ];

  return User.insertMany(users);
};

const saveVisit = (users) => {
  const visits = [
    {
      volunteerId: users[0]._id,
      volunteerFirstName: users[0].firstName,
      volunteerLastName: users[0].lastName,
      visiteeId: users[1]._id,
      visiteeFirstName: users[1].firstName,
      visiteeLastName: users[1].lastName,
    },
  ];
  return Visit.insertMany(visits);
};

const saveTestData = async () => {
  const users = await saveUser();
  savedData.users = users;
  const visits = await saveVisit(users);
  savedData.visits = visits;
  return savedData;
};

module.exports = saveTestData;
