const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 4, maxLength: 20 },
    lastName: { type: String, minLength: 1 },
    emailId: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid EmailId : " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      // match: [
      //   /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/,
      //   "Password must be 8-12 characters long, include at least one uppercase letter, one number, and one special character.",
      // ],
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password !!");
        }
      },
    },
    age: { type: Number, min: 18 },
    gender: {
      type: String,
      validate(value) {
        if (!["Male", "Female", "Other"].includes(value)) {
          throw new Error(
            "Enter a valid gender between Male, Female and Other !!"
          );
        }
      },
    },
    about: { type: String, default: "This is the default about of user !!" },
    photoUrl: {
      type: String,
      default: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL : " + value);
        }
      },
    },
    skills: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length <= 10;
        },
        message: "Maximum 10 skills allowed for the user!!",
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWTToken = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.passwordValidation = async function(userenteredpassword){
  const user = this;

  const isPasswordvalid = await bcrypt.compare(userenteredpassword, user.password);

  return isPasswordvalid;
}

module.exports = mongoose.model("User", userSchema);
