const express = require("express");
const { connecttoDB } = require("./config/database");
const User = require("./models/user");
const app = express();
const PORT = 3000;

//app.use(express.json());

app.post("/signup", async (req, res) => {
  let body = '';

  // Listen for data chunks
  req.on('data', chunk => {
    body += chunk.toString(); // Convert buffer to string
  });

   req.on('end', async() => {
  const parsedata= JSON.parse(body);
  console.log(parsedata);
  // create instance of User model to inset the data in to MondoDB
  const userdata = new User(parsedata);

  try {
    await userdata.save();
    res.send("User data added successfully inside DB !!");
  } catch (err) {
    res.status(400).send(`Error while saving data to the DB: ${err.message}`);
  }})
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
