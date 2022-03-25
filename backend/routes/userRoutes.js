const express = require("express");
const router = express.Router();
const {
  getUsers,
  setUser,
  updateUser,
  deleteUser,
  getVisitByUserId,
  getUsersByID,
} = require("../controllers/userController");

// router.route('/').get(getUser)

router.route("/").get(getUsers).post(setUser);

router.route("/:id").patch(updateUser).delete(deleteUser).get(getUsersByID);

router.route("/:id/visits").get(getVisitByUserId);

module.exports = router;
