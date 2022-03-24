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
describe("/api/users/", () => {
  test("GET - returns an object with all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
      });
  });
  test("GET - checks instanceOf properties", () => {
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
  test("GET - checks number of keys in a user object", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        body.forEach((user) => {
          expect(Object.keys(user).length).toEqual(10);
        });
      });
  });
  test("POST - userRole is a valid role", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        body.forEach((user) => {
          expect(
            user.userRole === "admin" ||
              user.userRole === "volunteer" ||
              user.userRole === "visitee"
          ).toBe(true);
        });
      });
  });
  test("POST - post a new user", () => {
    const goodUser = {
      firstName: "Sammy",
      lastName: "Northcoder",
      email: "fehtefhde@gmail.com",
      postcode: "m50 4ao",
      approved: false,
      userRole: "admin",
    };
    return request(app)
      .post("/api/users")
      .send(goodUser)
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            firstName: "Sammy",
            lastName: "Northcoder",
            email: "fehtefhde@gmail.com",
            postcode: "m50 4ao",
            approved: false,
            userRole: "admin",
          })
        );
      });
  });
  test("POST - field has been inputted", () => {
    const badUser = {
      firstName: "Sammy",
      lastName: "Northcoder",
      email: "fehtefhde@gmail.com",
      postcode: "m50 4ao",
      approved: false,
      userRole: "",
    };
    return request(app)
      .post("/api/users")
      .send(badUser)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toEqual("Please fill out all fields");
      });
  });
  test("POST - field has been inputted", () => {
    const badUser = {
      firstName: "",
      lastName: "Northcoder",
      email: "fehtefhde@gmail.com",
      postcode: "m50 4ao",
      approved: false,
      userRole: "visitee",
    };
    return request(app)
      .post("/api/users")
      .send(badUser)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toEqual("Please fill out all fields");
      });
  });
  test("POST - user only selects from available roles", () => {
    const badUser = {
      firstName: "Peter",
      lastName: "Northcoder",
      email: "fehtefhde@gmail.com",
      postcode: "m50 4ao",
      approved: false,
      userRole: "voluntee",
    };
    return request(app)
      .post("/api/users")
      .send(badUser)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toEqual("Incorrect input");
      });
  });
});
