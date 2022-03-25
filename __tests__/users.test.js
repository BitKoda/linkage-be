const request = require("supertest");
const mongoose = require("mongoose");
// const connectDB = require("../backend/config/db.js");
const app = require("../backend/server");
const dotenv = require("dotenv").config();
const colors = require("colors");
const saveTestData = require("../backend/config/seed-visits.js");

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
          expect(Object.keys(user).length).toEqual(11);
        });
      });
  });
});

describe("POST /api/users", () => {
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

describe("GET /api/users/:userId", () => {
  test("get single user by Id", () => {
    const userId = data.users[0]._id;

    return request(app)
      .get(`/api/users/${userId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            firstName: "Andy",
            lastName: "Northcoder",
            email: "ex@gmail.com",
            postcode: "m50 3ao",
            approved: false,
            userRole: "volunteer",
          })
        );
      });
  });
  test("returns a 404 when an incorrect user ID is passed in", () => {
    return request(app)
      .get(`/api/users/1`)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Invalid ID");
      });
  });
  test("returns a 404 when an incorrect user ID is passed in", () => {
    return request(app)
      .get(`/api/users/aaaaaaaaaaaaaaaaaaaaaaaa`)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("No User Found");
      });
  });
});

describe("Gets a user by a valid role", () => {
  test("should return status 200 and all users with a userRole of visitee", () => {
    return request(app)
      .get(`/api/users?userRole=visitee`)
      .expect(200)
      .then(({ body }) => {
        body.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              userRole: "visitee",
            })
          );
        });
      });
  });
  test("should return status 200 and all users with a userRole of volunteer", () => {
    return request(app)
      .get(`/api/users?userRole=volunteer`)
      .expect(200)
      .then(({ body }) => {
        body.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              userRole: "volunteer",
            })
          );
        });
      });
  });
  test("should return status 200 and all users with a userRole of admin", () => {
    return request(app)
      .get(`/api/users?userRole=admin`)
      .expect(200)
      .then(({ body }) => {
        body.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              userRole: "admin",
            })
          );
        });
      });
  });
  test("should return status 400 where an invalid role has been searched", () => {
    const userRole = "legend";
    return request(app)
      .get(`/api/users?userRole=${userRole}`)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Invalid Pathway");
      });
  });
});

describe("PATCH /api/users/:id/interests", () => {
  test("status:200, returns updated interests", () => {
    const userId = data.users[0]._id.toString();
    const testInterests = {
      interests: ["Football", "Sports"]
    }
    return request(app)
      .patch(`/api/users/${userId}/interests`)
      .send(testInterests)
      .expect(201)
      .then(({ body }) => {
        expect(body).toMatchObject({
          _id: userId,
          interests: ["Football", "Sports"]
        });
      });
    })
    test('400: Should return bad request for an empty interests array', () => {
      const userId = data.users[0]._id.toString();
      return request(app)
      .patch(`/api/users/${userId}/interests`)
      .send({ interests: [] })
      .expect(400)
      .then(({ body: {message}}) => {
        
       expect(message).toBe("Bad request")
    });
  })
})