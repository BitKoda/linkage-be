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
              visitTime: expect.any(String),
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

describe("POST /api/visits/", () => {
  test("201: should return a visit object ", () => {
    const testVisit = {
      volunteerId: data.users[4]._id.toString(),
      volunteerFirstName: data.users[4].firstName,
      volunteerLastName: data.users[4].lastName,
      visiteeId: data.users[2]._id.toString(),
      visiteeFirstName: data.users[2].firstName,
      visiteeLastName: data.users[2].lastName,
      visitTime: new Date().getTime(),
    };
    return request(app)
      .post(`/api/visits`)
      .send(testVisit)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          _id: expect.any(String),
          volunteerId: expect.any(String),
          visiteeFirstName: "Kate",
          visiteeLastName: "C",
          visiteeId: expect.any(String),
          volunteerFirstName: "William",
          volunteerLastName: "J",
          visitTime: expect.any(String),
        });
      });
  });
  test("400: returns message 'Please fill out all fields' ", () => {
    const testVisit = {
      volunteerId: data.users[4]._id.toString(),
      volunteerFirstName: data.users[4].firstName,
      volunteerLastName: data.users[4].lastName,
      visiteeId: data.users[2]._id.toString(),
      visiteeFirstName: data.users[2].firstName,
      visiteeLastName: "",
    };

    return request(app)
      .post(`/api/visits`)
      .send(testVisit)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Please fill out all fields");
      });
  });
});

describe("DELETE /api/visits/:visitId", () => {
  test("204: should delete a visit object ", () => {
    const visitId = data.visits[3]._id.toString();
    return request(app).delete(`/api/visits/${visitId}`).expect(204);
  });
});

describe("PATCH /api/visits/:visitId", () => {
  test("status:200, returns updated visit and updates visitTime", () => {
    const visitId = data.visits[0]._id.toString();
    const testVisit = {
      visitTime: new Date().getMinutes(),
    };
    return request(app)
      .patch(`/api/visits/${visitId}`)
      .send(testVisit)
      .expect(201)
      .then(({ body }) => {
        expect(body).toMatchObject({
          _id: expect.any(String),
          visitTime: expect.any(String),
        });
      });
  });
  test('404: non-existent visitId returns "No visit found"', () => {
    return request(app)
      .patch(`/api/visits/fjh473472222222222222222`)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("No visit found");
      });
  });
  test('404: non-existent visitId returns "Invalid id"', () => {
    return request(app)
      .patch(`/api/visits/fjh473472`)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Invalid id");
      });
  });
  test('400: returns "Bad request" when invalid request body', () => {
    const visitId = data.visits[0]._id.toString();
    const testVisit = {
      visitTime: "",
    };
    return request(app)
      .patch(`/api/visits/${visitId}`)
      .send(testVisit)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
});
