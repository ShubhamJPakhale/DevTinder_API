const mongoose = require("mongoose");

const connecttoDB = async () => {
  await mongoose.connect(
    "mongodb+srv://pakhaleshubham1997:qMmEaN9fCd7vFeaZ@nodejsapidevelopement.djjpnab.mongodb.net/devTinder"
  );
};

module.exports = { connecttoDB };
