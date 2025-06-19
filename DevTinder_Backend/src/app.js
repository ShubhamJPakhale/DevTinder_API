const express = require("express");
const { connecttoDB } = require("./config/database");
require("dotenv").config();
const cookieparser = require("cookie-parser");
const {authRouter} = require("./routes/auth");
const {profileRoute}= require("./routes/profile");
const {connectionRequestRoute} = require("./routes/connectionRequest");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieparser());


app.use("/",authRouter);
app.use("/",profileRoute);
app.use("/",connectionRequestRoute);

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
