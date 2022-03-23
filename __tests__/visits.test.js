const request = require("supertest");
const mongoose = require("mongoose");
const connectDB = require("../backend/config/db");
// require('dotenv').config({ path: '../.env' });
const dotenv = require("dotenv").config();
const colors = require("colors");

describe("GET /api/visits/", () => {
  beforeEach(() => {
    connectDB();
  });
  afterEach(() => {
    return mongoose.connection.close();
  });
  test("should  ", () => {});
});
