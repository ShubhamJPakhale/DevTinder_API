const express = require("express");
const { connecttoDB } = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validator");
const bcrypt = require("bcrypt");
require("dotenv").config();
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { UserAuth } = require("./middlewares/adminAuth");
const user = require("./models/user"); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieparser());

// signup post data to the user inside DB -
app.post("/signup", async (req, res) => {
  try {
    // valid the data once signup api hits
    validateSignupData(req);

    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      about,
      photoUrl,
      skills,
    } = req.body;
    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    //create instance of User model to inset the data in to MondoDB
    const userdata = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      about,
      photoUrl,
      skills,
    });
    await userdata.save();
    res.send("User data added successfully inside DB !!");
  } catch (err) {
    res.status(400).send(`ERROR - ${err.message}`);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials !!");
    }

    const isPasswordvalid = await user.passwordValidation(password);

    if (isPasswordvalid) {
      // token is generated here
      const token = await user.getJWTToken();
      // token will be stored in the cookies
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.send("Login Successfull !!");
    } else {
      throw new Error("Invalid Credentials !!");
    }
  } catch (err) {
    res.status(400).send(`Error - ${err.message}`);
  }
});

app.get("/profile", UserAuth, async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).send(user);
  } catch (err) {
    res.status(400).send(`Error - ${err.message}`);
  }
});

app.post("/sendConnectionRequest", UserAuth, async (req, res) => {
  try {
    const user = req.user;

    res
      .status(200)
      .send(`${user.firstName} ${user.lastName} Sent Connection request !!`);
  } catch (err) {
    res.status(400).send(`Error - ${err.message}`);
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
