const User = require("../models/user");
const { ERROR_CODES } = require("../utils/errors");
const bcrypt = require("bcrypt");
const validator = require("validator");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, email, avatar, password } = req.body;

  if (!email) {
    return res.status(ERROR_CODES.BAD_REQUEST).send({
      message: "A Valid email is required",
    });
  }

  if (!validator.isURL(avatar)) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Invalid avatar" });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Invalid email format" });
  }

  // Check if the email already exists
  User.findOne({ email: email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(ERROR_CODES.CONFLICT)
          .send({ message: "User with this email already exists" });
      }

      // Hash the password
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.create({
            email: email,
            password: hash,
            name: name,
            avatar: avatar,
          })
            .then((user) => {
              // Exclude password field from response
              const { password, ...userWithoutPassword } = user.toObject();

              res.status(201).send(userWithoutPassword);
            })
            .catch((err) => {
              if (err.name === "ValidationError") {
                res
                  .status(ERROR_CODES.BAD_REQUEST)
                  .send({ message: "Invalid data passed" });
              } else if (err.code === 11000) {
                res
                  .status(ERROR_CODES.CONFLICT)
                  .send({ message: "Email already exists" });
              } else {
                res
                  .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
                  .send({ message: "An error has occurred on the server." });
              }
            });
        })
        .catch((err) => {
          res
            .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
            .send({ message: "An error has occurred on the server." });
        });
    })
    .catch((err) => {
      res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .json({ message: "Email and password are required" });
  }

  // Authenticate user
  User.findUserByCredentials(email, password)
    .then((user) => {
      // Create JWT token
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // Send token to client
      res.status(200).json({ token });
    })
    .catch((err) => {
      if (err.message === "An error occurred during login") {
        res
          .status(ERROR_CODES.UNAUTHORIZED)
          .json({ message: "Invalid email or password" });
      } else {
        res
          .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
          .json({ message: "An error occurred during login" });
      }
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res
          .stats(ERROR_CODES.NOT_FOUND)
          .send({ message: "Invalid user ID" });
      }

      const { password, ...userWithoutPassword } = user.toObject();

      res.status(200).send(userWithoutPassword);
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "An error has occured on the server." });
      }
      res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const updates = req.body;

  console.log("User ID:", userId);
  console.log("Updates:", updates);

  User.findOneAndUpdate({ _id: userId }, updates, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      console.log("Updated user:", user);
      if (!user) {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: "User not found" });
      }
      // Exclude password field from response
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(200).send(userWithoutPassword);
    })
    .catch((error) => {
      console.error("Error updating user:", error);
      if (error.name === "ValidationError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid data passed" });
      }
      res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred during update" });
    });
};

module.exports = { createUser, getCurrentUser, login, updateUser };
