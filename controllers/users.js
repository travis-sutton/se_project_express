const bcrypt = require("bcrypt");
const validator = require("validator");

const jwt = require("jsonwebtoken");
const { ERROR_CODES } = require("../utils/errors");
const User = require("../models/user");
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
  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(ERROR_CODES.CONFLICT)
          .send({ message: "User with this email already exists" });
      }

      // Hash the password
      return bcrypt
        .hash(password, 10)
        .then((hash) =>
          User.create({
            email,
            password: hash,
            name,
            avatar,
          }),
        )
        .then((user) => {
          // Ensure user is created
          if (!user) {
            return res
              .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
              .send({ message: "User could not be created" });
          }

          // Exclude password field from response
          const { password: hashedPassword, ...userWithoutPassword } =
            user.toObject();
          return res.status(201).send(userWithoutPassword);
        });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid data passed" });
      }
      if (err.code === 11000) {
        return res
          .status(ERROR_CODES.CONFLICT)
          .send({ message: "Email already exists" });
      }
      return res
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
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // Create JWT token
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // Send token to client
      return res.status(200).json({ token });
    })
    .catch((err) => {
      if (err.message === "An error occurred during login") {
        return res
          .status(ERROR_CODES.UNAUTHORIZED)
          .json({ message: "Invalid email or password" });
      }
      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred during login" });
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

      return res.status(200).send(userWithoutPassword);
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "An error has occured on the server." });
      }
      return res
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
      return res.status(200).send(userWithoutPassword);
    })
    .catch((error) => {
      console.error("Error updating user:", error);
      if (error.name === "ValidationError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid data passed" });
      }
      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred during update" });
    });
};

module.exports = { createUser, getCurrentUser, login, updateUser };
