const mongoose = require("mongoose");


const pollDataSchema = new mongoose.Schema({
  userInput: Array,
});

const pollData = mongoose.model("pollData", pollDataSchema);

module.exports = pollData;
