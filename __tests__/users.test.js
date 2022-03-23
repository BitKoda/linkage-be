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
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
      });
  });
  test("checks instanceOf properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        body.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              _id: expect.any(String),
              firstName: expect.any(String),
              lastName: expect.any(String),
              email: expect.any(String),
              postcode: expect.any(String),
              approved: expect.any(Boolean),
              userRole: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              __v: expect.any(Number),
            })
          );
        });
      });
  });
  test("checks number of keys in a user object", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        body.forEach((user) => {
          expect(Object.keys(user).length).toEqual(10);
        });
      });
  });
  test("userRole is a valid role", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        body.forEach((user) => {
          console.log(user)
          expect(
            user.userRole === "admin" ||
              user.userRole === "volunteer" ||
              user.userRole === "visitee"
          ).toBe(true);
        });
      });
  });
  test.only('for user inputting invalid role', () => {
    const badmin = {
      firstName: "Andy",
      lastName: "Northcoder",
      email: "ex@gmail.com",
      postcode: "m50 3ao",
      approved: false,
      userRole: "gimp"
    }
    return request(app)
    .post("/api/users")
    .send(badmin)
    .expect(400)
    .then(({body: {msg}}) => {
      expect(msg).toBe('Please fill out all fields')
    })
  })
});
