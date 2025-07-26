const mongoose = require("mongoose");

const connecttoDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);
};

module.exports = { connecttoDB };
