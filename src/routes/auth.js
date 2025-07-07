const express = require("express");
const authRouter = express.Router();

const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignupData } = require("../utils/validator");

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Successfully !!");
});

module.exports = authRouter;
