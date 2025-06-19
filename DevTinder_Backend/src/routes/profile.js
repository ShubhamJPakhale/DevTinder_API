const express = require("express");
const profileRoute= express.Router();

const {UserAuth} = require("../middlewares/adminAuth");

profileRoute.get("/profile", UserAuth, async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).send(user);
  } catch (err) {
    res.status(400).send(`Error - ${err.message}`);
  }
});

module.exports = {profileRoute};