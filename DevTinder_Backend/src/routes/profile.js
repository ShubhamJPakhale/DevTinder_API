const express = require("express");
const profileRoute = express.Router();

const { validateProfileEditfields } = require("../utils/validator");

const { UserAuth } = require("../middlewares/adminAuth");

profileRoute.get("/profile/view", UserAuth, async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).send(user);
  } catch (err) {
    res.status(400).send(`Error - ${err.message}`);
  }
});

profileRoute.patch("/profile/edit", UserAuth, async (req, res) => {
  try {
    if (!validateProfileEditfields(req)) {
      throw new Error("Invalid fields for Profile Edit !!");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send(`Error - ${err.message}`);
  }
});

module.exports = profileRoute;
