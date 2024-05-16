const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
    },
  },
  password: {
    type: String,
    required: true,
  },
});
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new Error("User not found");
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new Error("Incorrect email or password");
        }

        return user; // now user is available
      });
    })
    .catch((err) => {
      console.error("Error during login:", err);
      throw new Error("An error occurred during login");
    });
};

module.exports = mongoose.model("user", userSchema);
