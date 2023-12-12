const mongoose = require('mongoose');
const User = require('./User');
const Autoincrement = require('mongoose-sequence')(mongoose);
const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User,
    },
    title: {
      type: String,
      required: true,
    },
    text: [
      {
        type: String,
        required: true,
      },
    ],
    completed: {
      type: Boolean,
      deafult: false,
    },
  },
  { timestamps: true }
);

noteSchema.plugin(Autoincrement, {
  inc_field: 'ticket',
  id: 'ticketNums',
  start_seq: 500,
});

module.exports = mongoose.model('Note', noteSchema);
