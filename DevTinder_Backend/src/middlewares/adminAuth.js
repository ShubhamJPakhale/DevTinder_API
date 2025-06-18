const jwt = require("jsonwebtoken");
const User = require("../models/user");

const UserAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Invalid Token !!");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedToken;

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
