const express = require('express');
const router = express.Router();

const userController = require('../controllers/userControllers.js');

router
  .route('/')
  .get(userController.getAllusers)
  .post(userController.createNewUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
