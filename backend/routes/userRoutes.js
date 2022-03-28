const express = require("express");
const authJwt = require("../middleware/jwt");

const router = express.Router();
const {
  getUsers,
  // setUser,
  updateUser,
  deleteUser,
  getVisitByUserId,
  getUsersByID,
  updateUsersInterests,
  // loginUser,
} = require("../controllers/userController");

// module.exports = function (app) {
//   app.use(function (req, res, next) {
//     res.header(
//       "Access-Control-Allow-Headers",
//       "x-access-token, Origin, Content-Type, Accept"
//     );
//     next();
//   });
//   app.get("/api/users", [authJwt.verifyToken], getUsers);
//   app.get("/api/users/:id", [authJwt.verifyToken], updateUser);
// };
// router.route("/").post(setUser);
router.route("/").get(getUsers);

// router.route("/login").post(loginUser);

// router.route("/:id").patch(updateUser).delete(deleteUser).get(getUsersByID);

// router.route("/:id/visits").get(getVisitByUserId);

// router.route("/:id/interests").patch(updateUsersInterests);
module.exports = router;
