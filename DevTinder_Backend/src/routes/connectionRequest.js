const express = require("express");
const connectionRequestRoute= express.Router();

const {UserAuth} = require("../middlewares/adminAuth");

connectionRequestRoute.post("/sendConnectionRequest", UserAuth, async (req, res) => {
  try {
    const user = req.user;

    res
      .status(200)
      .send(`${user.firstName} ${user.lastName} Sent Connection request !!`);
  } catch (err) {
    res.status(400).send(`Error - ${err.message}`);
  }
});

module.exports = {connectionRequestRoute};