const jwt = require("jsonwebtoken");
const User = require("../models/user");

const UserAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Please Login !!");
    }

    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById({ _id: _id });

    if (!user) {
      throw new Error("User does not exist !!");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send(`Error - ${err.message}`);
  }
};

module.exports = { UserAuth };
