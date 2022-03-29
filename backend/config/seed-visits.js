const mongoose = require("mongoose");
const connectDB = require("../config/db");
const dotenv = require("dotenv").config();
const colors = require("colors");
const Visit = require("../models/visitModel");
const User = require("../models/userModel");
const savedData = {};

const interests = [
  "Football",
  "Cooking",
  "Trainspotting",
  "Reading",
  "Boardgames",
  "Sports",
  "Movies",
];
const saveUser = () => {
  const users = [
    {
      firstName: "Andy",
      lastName: "Northcoder",
      email: "ex@gmail.com",
      postcode: "m50 3ao",
      approved: false,
      userRole: "volunteer",
      interests: ["Football"],
      needs: [],
      bio: "Lorem ipsum dolor etc",
      age: 50,
      lastVisit: [],
      password: "testPassword",
    },
    {
      firstName: "Freddie",
      lastName: "N",
      email: "sdg@gmail.com",
      postcode: "m50 5th",
      approved: false,
      userRole: "visitee",
      interests: ["Sports", "Movies"],
      needs: ["dressing", "cleaning"],
      bio: "Lorem ipsum dolor etc",
      age: 80,
      lastVisit: [new Date().getTime(), new Date().getTime()],
      password: "testPassword",
    },

    {
      firstName: "Kate",
      lastName: "C",
      email: "vhbdjfg@gmail.com",
      postcode: "m98 5tt",
      approved: false,
      userRole: "visitee",
      interests: ["Trainspotting", "Movies"],
      needs: ["ironing", "cleaning"],
      bio: "Lorem ipsum dolor etc",
      age: 82,
      lastVisit: [new Date().getTime()],
      password: "testPassword",
    },
    {
      firstName: "Bert",
      lastName: "F",
      email: "bertyb@gmail.com",
      postcode: "m9 5lt",
      approved: false,
      userRole: "volunteer",
      interests: ["Cooking", "Reading"],
      needs: [],
      bio: "Lorem ipsum dolor etc",
      age: 32,
      lastVisit: [],
      password: "testPassword",
    },
    {
      firstName: "William",
      lastName: "J",
      email: "will@gmail.com",
      postcode: "m40 5lt",
      approved: false,
      userRole: "volunteer",
      interests: ["Sports", "Football"],
      needs: [],
      bio: "Lorem ipsum dolor etc",
      age: 43,
      lastVisit: [],
      password: "testPassword",
    },
    {
      firstName: "Barry",
      lastName: "Chuckle",
      email: "2me2u@gmail.com",
      postcode: "CW1 5SQ",
      approved: false,
      userRole: "admin",
      interests: [],
      needs: [],
      bio: "",
      age: 28,
      lastVisit: [],
      password: "testPassword",
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
      visitTime: new Date().getMinutes(),
    },
    {
      volunteerId: users[2]._id,
      volunteerFirstName: users[2].firstName,
      volunteerLastName: users[2].lastName,
      visiteeId: users[3]._id,
      visiteeFirstName: users[3].firstName,
      visiteeLastName: users[3].lastName,
      visitTime: new Date().getMinutes(),
    },
    {
      volunteerId: users[0]._id,
      volunteerFirstName: users[0].firstName,
      volunteerLastName: users[0].lastName,
      visiteeId: users[2]._id,
      visiteeFirstName: users[2].firstName,
      visiteeLastName: users[2].lastName,
      visitTime: new Date().getMinutes(),
    },
    {
      volunteerId: users[3]._id,
      volunteerFirstName: users[3].firstName,
      volunteerLastName: users[3].lastName,
      visiteeId: users[1]._id,
      visiteeFirstName: users[1].firstName,
      visiteeLastName: users[1].lastName,
      visitTime: new Date().getMinutes(),
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
