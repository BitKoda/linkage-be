const request = require("supertest");
const mongoose = require("mongoose");
// const connectDB = require("../backend/config/db.js");
const app = require("../backend/server");
const dotenv = require("dotenv").config();
const colors = require("colors");
const saveTestData = require("../backend/config/seed-visits.js");

let data;
beforeEach(async () => {
  await mongoose.connection
    .dropDatabase()
    .then(saveTestData)
    .then((savedData) => (data = savedData))
    .catch(console.log);
});

afterAll(() => {
  return mongoose.connection.close();
});
describe("GET /api/users/", () => {
  test("GET - returns an object with all users", () => {
    return request(app)
      .get("/api/users/")
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
              interests: expect.any(Array),
              bio: expect.any(String),
              needs: expect.any(Array),
              age: expect.any(Number),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              avatar_url: expect.any(String),
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
          expect(Object.keys(user).length).toEqual(15);
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
      postcode: "M419PW",
      approved: false,
      userRole: "admin",
      password: "test",
    };
    return request(app)
      .post("/api/auth/signup")
      .send(goodUser)
      .expect(201)
      .then(({ body }) => {
        console.log(body);
        expect(body).toEqual(
          expect.objectContaining({
            firstName: "Sammy",
            lastName: "Northcoder",
            email: "fehtefhde@gmail.com",
            postcode: "M419PW",
            approved: false,
            userRole: "admin",
            avatar_url:
              "https://gravatar.com/avatar/add6ff0c06299e3dc575a5605b82756b?s=400&d=wavatar&r=x",
          })
        );
      });
  });
  test("POST - field has been inputted", () => {
    const badUser = {
      firstName: "Sammy",
      lastName: "Northcoder",
      email: "fehtefhde@gmail.com",
      postcode: "m504ao",
      approved: false,
      userRole: "",
      password: "testPassword",
    };
    return request(app)
      .post("/api/auth/signup")
      .send(badUser)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toEqual("Please fill out all fields");
      });
  });
  test("POST - 400: invalid postcode", () => {
    const badPostCode = {
      firstName: "Sammy",
      lastName: "Northcoder",
      email: "fehtefhde@gmail.com",
      postcode: "m504ao",
      approved: false,
      userRole: "volunteer",
      password: "test",
    };
    return request(app)
      .post("/api/auth/signup")
      .send(badPostCode)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toEqual("Bad request: postcode invalid");
      });
  });
  test("POST - field has been inputted", () => {
    const badUser = {
      firstName: "",
      lastName: "Northcoder",
      email: "fehtefhde@gmail.com",
      postcode: "m504ao",
      approved: false,
      userRole: "visitee",
      password: "testPassword",
    };
    return request(app)
      .post("/api/auth/signup")
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
      password: "testPassword",
    };
    return request(app)
      .post("/api/auth/signup")
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

describe("GET - /api/users?userRole=:userRole", () => {
  test("should return status 200 and all users with a userRole of visitee", () => {
    const validRole = "visitee";
    return request(app)
      .get(`/api/users?userRole=${validRole}`)
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
    const validRole = "volunteer";
    return request(app)
      .get(`/api/users?userRole=${validRole}`)
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
    const validRole = "admin";
    return request(app)
      .get(`/api/users?userRole=${validRole}`)
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
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Invalid Pathway");
      });
  });
  describe("Deletes a user", () => {
    test("should return status 204 when a user is successfully deleted", () => {
      const userId = data.users[0]._id;
      const originalUsersLength = data.users.length;
      return request(app)
        .delete(`/api/users/${userId}`)
        .expect(204)
        .then(() => {
          return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
              expect(body.length).toEqual(originalUsersLength - 1);
            });
        });
    });
  });
});

describe("PATCH - /api/users/:userId", () => {
  test("Last name and interests have been updated", () => {
    const userId = data.users[0]._id.toString();
    const updateLastNameAndInterests = {
      lastName: "Southcoder",
      interests: ["Football", "Sports"],
    };

    return request(app)
      .patch(`/api/users/${userId}`)
      .send(updateLastNameAndInterests)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          _id: userId,
          lastName: "Southcoder",
          interests: ["Football", "Sports"],
        });
      });
  });
  test("First name and interests have been updated", () => {
    const userId = data.users[0]._id.toString();
    const updateFirstNameAndInterests = {
      firstName: "Andrew",
      interests: ["Football", "Sports"],
    };

    return request(app)
      .patch(`/api/users/${userId}`)
      .send(updateFirstNameAndInterests)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          _id: userId,
          firstName: "Andrew",
          interests: ["Football", "Sports"],
        });
      });
  });
  test("email and interests have been updated", () => {
    const userId = data.users[0]._id.toString();
    const updateEmailAndInterests = {
      email: "Southcoder@gmail.com",
      interests: ["Football", "Sports"],
    };

    return request(app)
      .patch(`/api/users/${userId}`)
      .send(updateEmailAndInterests)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          _id: userId,
          email: "Southcoder@gmail.com",
          interests: ["Football", "Sports"],
        });
      });
  });
  test("throws an error if user ID doesnt exist", () => {
    return request(app)
      .patch("/api/users/3948576646485979809090789")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("User not found");
      });
  });
  test("status:200, returns updated interests", () => {
    const userId = data.users[0]._id.toString();
    const testInterests = {
      interests: ["Football", "Sports"],
    };
    return request(app)
      .patch(`/api/users/${userId}`)
      .send(testInterests)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          _id: userId,
          interests: ["Football", "Sports"],
        });
      });
  });
  // test("400: Should return bad request for an empty interests array", () => {
  //   const userId = data.users[0]._id.toString();
  //   return request(app)
  //     .patch(`/api/users/${userId}`)
  //     .send({ interests: [] })
  //     .expect(400)
  //     .then(({ body: { message } }) => {
  //       expect(message).toBe("Bad request");
  //     });
  // });
  test("A user's bio has been updated", () => {
    const userId = data.users[0]._id.toString();
    const updateBio = {
      bio: "",
    };

    return request(app)
      .patch(`/api/users/${userId}`)
      .send(updateBio)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          _id: userId,
          bio: "",
        });
      });
  });
  test("A user's age has been updated", () => {
    const userId = data.users[0]._id.toString();
    const updateAge = {
      age: 35,
    };

    return request(app)
      .patch(`/api/users/${userId}`)
      .send(updateAge)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          _id: userId,
          age: 35,
        });
      });
  });
  test("A user's needs have been updated", () => {
    const userId = data.users[0]._id.toString();
    const updateNeeds = {
      needs: ["ironing", "cleaning"],
    };

    return request(app)
      .patch(`/api/users/${userId}`)
      .send(updateNeeds)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          _id: userId,
          needs: ["ironing", "cleaning"],
        });
      });
  });
  test("should update an avatar url for a user", () => {
    const userId = data.users[0]._id.toString();
    const updateAvatar = {
      avatar_url:
        "https://gravatar.com/avatar/add6ff0c06299e3dc575a5605b82756b?s=400&d=monsterid&r=x",
    };

    return request(app)
      .patch(`/api/users/${userId}`)
      .send(updateAvatar)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          _id: userId,
          avatar_url:
            "https://gravatar.com/avatar/add6ff0c06299e3dc575a5605b82756b?s=400&d=monsterid&r=x",
        });
      });
  });
});
