const mongoose = require("mongoose");
const connectDB = require("../config/db");
const dotenv = require("dotenv").config();
const colors = require("colors");
const Visit = require("../models/visitModel");
const User = require("../models/userModel");
// connectDB();
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
  //   .map((user) => User.create(user));
  return User.insertMany(users);
  //   return Promise.all(users);
};

const saveVisit = (users) => {
  const visit = new Visit({
    volunteerId: users[0]._id,
    volunteerFirstName: users[0].firstName,
    volunteerLastName: users[0].lastName,
    visiteeId: users[1]._id,
    visiteeFirstName: users[1].firstName,
    visiteeLastName: users[1].lastName,
  });
  return visit.save();
};

const saveTestData = () => {
  //   connectDB();
  //   console.log(mongoose.connection.collections.visits, "connection");
  //   console.log(mongoose.c, "collection");
  //   console.log(mongo.c, "collection");
  //   return (
  // Promise.all([
  //   //   await connectDB(),
  //   User.deleteMany({}),
  //   //   mongoose.connection.dropCollection(),
  //   //   Visit.collection.deleteMany({}),
  // ])
  // Promise.all([
  //   mongoose.connection.createCollection("users"),
  //   mongoose.connection.createCollection("visits"),
  // ])

  // return Promise.all([User.init(), Visit.init()]);

  // .then(() => {
  //   return Promise.all([User.init(), Visit.init()]);
  // })
  //   .then(() => {
  return saveUser()
    .then((users) => {
      savedData.user = users;
      return saveVisit(users);
    })
    .then((visit) => {
      savedData.visits = visit;
      return savedData;
    });
  //   })
  //   );
};

module.exports = saveTestData;
