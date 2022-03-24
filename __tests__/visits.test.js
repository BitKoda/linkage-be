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
describe("404 for any non-existent path", () => {
  test('Should return "404 path not found"', () => {
    return request(app)
      .get("/api/visitsss")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Path not found");
      });
  });
});
describe("GET /api/visits/", () => {
  test("GET returns an object with all users", () => {
    return request(app)
      .get("/api/visits/")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body).toHaveLength(4);
        body.forEach((visit) => {
          expect(visit).toEqual(
            expect.objectContaining({
              _id: expect.any(String),
              volunteerId: expect.any(String),
              volunteerFirstName: expect.any(String),
              volunteerLastName: expect.any(String),
              visiteeId: expect.any(String),
              visiteeFirstName: expect.any(String),
              visiteeLastName: expect.any(String),
              __v: expect.any(Number),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            })
          );
        });
      });
  });
});
describe("GET /api/users/:id/visits", () => {
  test("should return an array of visits objects", () => {
    const userId = data.users[0]._id.toString();
    return request(app)
      .get(`/api/users/${userId}/visits`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body).toHaveLength(2);
        body.forEach((visit) => {
          expect(visit).toEqual(
            expect.objectContaining({
              _id: expect.any(String),
              volunteerId: expect.any(String),
              volunteerFirstName: expect.any(String),
              volunteerLastName: expect.any(String),
              visiteeId: expect.any(String),
              visiteeFirstName: expect.any(String),
              visiteeLastName: expect.any(String),
              __v: expect.any(Number),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            })
          );
        });
      });
  });
  test('404: responds with message "User not found" when ID doesnt exist ', () => {
    return request(app)
      .get(`/api/users/sdjhfgku4358/visits`)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("User not found");
      });
  });
  test("200: returns visits array with different volunteers for a visteeId", () => {
    const userId = data.users[1]._id.toString();
    return request(app)
      .get(`/api/users/${userId}/visits`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body).toHaveLength(2);
        body.forEach((visit) => {
          //   console.log(visit);
          expect(visit).toEqual(
            expect.objectContaining({
              _id: expect.any(String),
              volunteerId: expect.any(String),
              volunteerFirstName: expect.any(String),
              volunteerLastName: expect.any(String),
              visiteeId: expect.any(String),
              visiteeFirstName: expect.any(String),
              visiteeLastName: expect.any(String),
              __v: expect.any(Number),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            })
          );
        });
      });
  });
});
describe("GET /api/visits/:visitId", () => {
  test("200: should return a visit object ", () => {
    const visitId = data.visits[0]._id.toString();
    return request(app)
      .get(`/api/visits/${visitId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.visiteeFirstName).toBe("Freddie");
        expect(body.volunteerFirstName).toBe("Andy");
      });
  });
  test('404: non-existent visitId returns "Invalid id"', () => {
    return request(app)
      .get(`/api/visits/fjh473472`)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Invalid id");
      });
  });
  test('404: non-existent visitId returns "No visit found"', () => {
    return request(app)
      .get(`/api/visits/fjh473472222222222222222`)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("No visit found");
      });
  });
});
