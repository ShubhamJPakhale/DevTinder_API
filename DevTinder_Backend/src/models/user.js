const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 4, maxLength: 20 },
    lastName: { type: String },
    emailId: { type: String, unique: true, lowercase: true, trim: true },
    password: { type: String },
    age: { type: Number, min: 18 },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error(
            "Enter a valid gender between male, female and others !!"
          );
        }
      },
    },
    about: { type: String, default: "This is the default about of user !!" },
    photo: {
      type: String,
      default: "https://i.sstatic.net/l60Hf.png",
    },
    skills: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
