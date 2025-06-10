const express = require("express");
const { connecttoDB } = require("./config/database");
const User = require("./models/user");
const app = express();
const PORT = 3000;

app.post("/signup", async (req, res) => {
  const userdata = new User({
    firstName: "Archana",
    lastName: "Pakhale",
    emailId: "shubham@gmail.com",
    password: "archu%89f",
    age: 26,
    gender: "Female",
  });

  try {
    await userdata.save();
    res.send("User data added successfully inside DB !!");
  } catch (err) {
    res.status(400).send(`Error while saving data to the DB: ${err.message}`);
  }
});

connecttoDB()
  .then(() => {
    console.log("Database connection established successfully !!");
    app.listen(PORT, () => {
      console.log(`App is listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection not established..please try again.. !!");
  });
