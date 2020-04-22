const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("config");
const path = require("path");

app.use(express.json());

app.use(express.static("build"));

const connectDB = async () => {
  try {
    await mongoose.connect(config.get("dbconfig"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};

connectDB();

app.get("/", (req, res) => {
  res.send("success");
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`working on port ${PORT}...`));
