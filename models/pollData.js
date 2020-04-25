const mongoose = require("mongoose");

const pollDataSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  userInput: {
    type: Array,
    required: true
  },
  date: {
    type: String,
    required: true
  },
});

const pollData = mongoose.model("pollData", pollDataSchema);

module.exports = pollData;
