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
describe('404 for any non-existent path', () => {
  test('Should return "404 path not found"', () => {
    return request(app)
    .get("/api/visitsss")
    .expect(404)
    .then(({body: {message}}) => {
      console.log(message)
      expect(message).toBe("Path not found")
    })
  });
});
describe("GET /api/visits/", () => {
  test("GET returns an object with all users", () => {
    return request(app)
      .get("/api/visits/")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
      });
      
  });
  
  test('should return an array of visits objects', () => {
    const userId = data.users[0]._id.toString()
    return request(app)
    .get(`/api/users/${userId}/visits`)
    .expect(200)
    .then(({body}) => {
      expect(body).toBeInstanceOf(Array);
      expect(body).toHaveLength(2)
    })
  });
});
