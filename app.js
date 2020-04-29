const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("config");
const path = require("path");
const bcrypt = require("bcrypt");

const PollData = require("./models/pollData");

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

//get the number of datasets plus the content of all data:

app.get("/polldata", async (req, res) => {
  try {
    const pollData = await PollData.find();
    const numberOfDataSets = pollData.length;
    res.json({
      numberOfDataSets,
      pollData,
    });
  } catch (error) {
    res.send(error);
  }
});

app.get("/polldata/question/:question", async (req, res) => {
  try {
    const pollData = await PollData.find();
    let answers = [];
    pollData.forEach((dataSet) => {
      answers.push(dataSet.userInput[req.params.question]);
    });
    res.json({ requestedQuestion: req.params.question, answers });
  } catch (error) {
    res.send(error);
  }
});

app.get("/polldata/question/:question/answer/:answer", async (req, res) => {
  try {
    const pollData = await PollData.find();
    let answers = [];
    pollData.forEach((dataSet) => {
      answers.push(dataSet.userInput[req.params.question]);
    });
    const numberOfAnswersPresent = answers.filter(
      (answer) => answer == req.params.answer
    ).length;
    const percentage =
      Math.round((numberOfAnswersPresent / answers.length) * 10000) / 100;
    res.json({ numberOfAnswersPresent, percentage, answers });
  } catch (error) {
    res.send(error);
  }
});

app.post("/polldata", (req, res) => {
  const reqData = req.body;
  bcrypt.hash(reqData.email, config.get("salt"), (err, hash) => {
    if (!err) {
      PollData.findOne({ email: hash }, (err, pollData) => {
        if (pollData) {
          res
            .status(201)
            .json({ msg: "Er is al een poll ingevuld met dit emailadres!" });
        } else {
          let newPollData = new PollData();
          newPollData.userInput = reqData.pollData;
          newPollData.email = hash;
          newPollData.date = reqData.date;
          newPollData.save();
          res.status(200).json({
            msg: "Gegevens opgeslagen...",
          });
        }
      });
    } else {
      console.log(err);
      res.send(
        "Er is een error ontstaan in de server. Wees lief, en laat me dit alsjeblieft weten: heijnenkris@gmail.com"
      );
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.get("/stats", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.get("*", (req, res) => {
  res
    .status(404)
    .send("Kris zegt: zorg er voor dat je url is: www.de-corona-poll.nl of www.de-corona-poll.nl/stats");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`working on port ${PORT}...`));
