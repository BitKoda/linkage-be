const request = require("supertest");
const mongoose = require("mongoose");
// const connectDB = require("../backend/config/db.js");
const app = require("../backend/server");
const dotenv = require("dotenv").config();
const colors = require("colors");
const saveTestData = require("../backend/config/seed-visits.js");
const connectDB = require("../backend/config/db.js");
// const { beforeEach, expect } = require("@jest/globals");
let data;
beforeEach(async () => {
  //   connectDB();

  await mongoose.connection
    .dropDatabase()
    .then(saveTestData)
    .then((savedData) => (data = savedData))
    .catch(console.log);
});

afterAll(() => {
  //   return mongoose.disconnect();
  return mongoose.connection.close();
});
describe("GET /api/users/", () => {
  test("GET returns an object with all users", () => {
    return request(app)
      .get("/api/users?userRole=volunteer")
      .expect(200)
      .then(({ body: { users } }) => {
        console.log(users);
        expect(users).toBeInstanceOf(Array);
      });
  });
});
