const User = require("../models/User");
const Note = require("../models/Note");
const bcrypt = require("bcrypt");
const expressAsyncHandler = require("express-async-handler");

const asyncHandler = require(expressAsyncHandler);

const getAllNotes = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const notes = await Note.find().lean();

  if (!notes?.length) {
    return res.status(400).json({ message: "No notes found" });
  }

  //sprawdzic POSTMANEM jak wygląda wyszukiwanie wielu obiektów z podanym parametrem ID
  // const noteswithUser2 = await Note.find({ user: id });
  // https://stackoverflow.com/questions/59138481/mongoose-find-by-reference-field

  // Po co takie wyszukiwanie referencyjncy dokumentów?
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );

  res.json(notesWithUser);
});

const createNewNote = asyncHandler(async (req, res, next) => {
  const { user, title, text } = req.body;

  if (!title || !text || !user) {
    return res.status(400).json({ message: " All fields are required" });
  }

  const duplicate = await Note.findOne({ title }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate note title" });
  }

  const note = await Note.create({ user, title, text });
  if (note) {
    return res.staus(201).json({ message: "New note created" });
  } else {
    return res.staus(400).json({ message: "Invalid new data received" });
  }
});

const updateNote = asyncHandler(async (req, res, next) => {
  const { id, user, title, text, completed } = req.body;

  if (!id || !user || !title || !text || !typeof completed !== boolean) {
    return res.status(400).json({ message: "All fileds are required" });
  }

  const note = await Note.findById({ id }).exec();

  if (!note) {
    return res.status(400).jsno({ message: "Note not found" });
  }

  const duplicate = await Note.findOne({ title }).lean().exec();
  if (duplicate && duplicate._id.toString() !== id) {
    return res.status(401).json({ message: "Duplicate note title" });
  }

  note.user = user;
  note.title = title;
  note.test = text;
  note.completed = completed;

  const updatedNote = await Note.save();
  res.json(`${updateNote.title} udpated`);
});

const deleteNote = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
  }

  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  const result = await note.deleteOne();
  const reply = `Note ${result.title} with ID ${result.id} deleted`;
  res.json(reply);
});

module.exports = { getAllNotes, createNewNote, updateNote, deleteNote };
