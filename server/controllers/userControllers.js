const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

const getAllusers = asyncHandler(async (req, res, nedx) => {
  // User.collection.drop();

  const users = await User.find().select('-password').lean();
  if (!users) {
    return res.status(400).json({ message: 'no users found' });
  }

  res.json(users);
});

const createNewUser = asyncHandler(async (req, res, next) => {
  const { username, email, password, roles } = req.body;

  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate user name' });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const userObject = { username, password: hashPassword, email, roles };

  const user = await User.create(userObject);

  if (user) {
    return res
      .status(201)
      .json({ message: `New user ${user.username} created` });
  } else {
    return res.status(400).json({ message: `Invalid user data received` });
  }
});

const updateUser = asyncHandler(async (req, res, next) => {
  const { id, email, username, active, password, roles } = req.body;

  if (
    !id ||
    !email ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof roles !== 'boolean'
  ) {
    res.status(400).json({ message: 'All fields are required' });
  }

  const user = User.findById(id).exec();

  if (!user) {
    res.status(400).json({ message: 'User not found' });
  }

  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate && duplicate._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate username' });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const udpatedUser = user.save();

  res.json({ message: `User ${udpatedUser.username} was updated succesfully` });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({
      message: `User ID required`,
    });
  }

  const note = Note.findOne({ user: id }).lean().exec();

  if (note?.length) {
    res.status(400).json({ message: `User has assigned roles` });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    res.status(400).json({ message: `Usernot found` });
  }

  const result = await user.deleteOne();
  console.log(result);
  const reply = `Username ${user.username} with ID ${user._id} deleted`;
  res.json(reply);
});

module.exports = { getAllusers, createNewUser, updateUser, deleteUser };
