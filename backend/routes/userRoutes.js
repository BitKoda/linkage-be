const express = require("express");
const router = express.Router();
const {
  getUsers,
  setUser,
  updateUser,
  deleteUser,
  getVisitByUserId,
  getUsersByID,
  updateUsersInterests
} = require("../controllers/userController");

router.route("/").get(getUsers).post(setUser);

router.route("/:id").patch(updateUser).delete(deleteUser).get(getUsersByID);

router.route("/:id/visits").get(getVisitByUserId);

router.route('/:id/interests').patch(updateUsersInterests)
module.exports = router;
