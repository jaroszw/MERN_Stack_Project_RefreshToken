const express = require("express");
const router = express.Router();

const noteController = require("../controllers/usersControllers");

router
  .route("/")
  .get(noteController.getAllUsers)
  .post(noteController.createNewUser)
  .patch(noteController.updateUser)
  .delete(noteController.deleteUser);

module.exports = router;
