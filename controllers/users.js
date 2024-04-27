const User = require("../models/user");
const { ERROR_CODES } = require("../utils/errors");
const bcrypt = require("bcrypt");
const validator = require("validator");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  if (!req.body.name || req.body.name.length < 2 || req.body.name.length > 30) {
    return res.status(400).send({
      message: "Name must be between 2 and 30 characters long",
    });
  }

  if (!req.body.email) {
    return res.status(400).send({
      message: "A Valid email is required",
    });
  }

  if (!validator.isURL(req.body.avatar)) {
    return res.status(400).send({ message: "Invalid avatar" });
  }

  if (!validator.isEmail(req.body.email)) {
    return res.status(400).send({ message: "Invalid email format" });
  }

  // Check if the email already exists
  User.findOne({ email: req.body.email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(409)
          .send({ message: "User with this email already exists" });
      }

      // Hash the password
      bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
          // Create the user with the hashed password
          User.create({
            email: req.body.email,
            password: hash,
            name: req.body.name,
            avatar: req.body.avatar,
          })
            .then((user) => {
              // Exclude password field from response
              const { password, ...userWithoutPassword } = user.toObject();

              // Send the user object without the password as response
              res.status(201).send(userWithoutPassword);
            })
            .catch((err) => {
              // Handle any errors during user creation
              if (err.code === 11000) {
                res
                  .status(ERROR_CODES.BAD_REQUEST)
                  .send({ message: "Email already exists" });
              } else {
                res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).send({
                  message: "An error has occurred on the server.",
                  error: err,
                });
              }
            });
        })
        .catch((err) => {
          // Handle any errors during password hashing
          res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).send({
            message: "An error has occurred on the server.",
            error: err,
          });
        });
    })
    .catch((err) => {
      // Handle any errors during database query
      res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).send({
        message: "An error has occurred on the server.",
        error: err,
      });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  // Authenticate user
  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: "Invalid email or password" });
      }

      // Create JWT token
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // Send token to client
      res.status(200).send({ token });
    })
    .catch((err) => {
      console.error("Error during login:", err);
      res.status(500).send({ message: "An error occurred during login" });
    });
};

const getCurrentUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .stats(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid user ID" });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "An error has occured on the server.", err });
      }
    });
};

module.exports = { createUser, getCurrentUser, login };

// module.exports = { getUsers, getUser, createUser, login };

// Old get user stuff

// // Get all users
// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(200).send(users))
//     .catch((err) => {
//       console.error(err.name);
//       return res
//         .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
//         .send({ message: "An error has occurred on the server.", error: err });
//     });
// };

// // Get user by ID
// const getUser = (req, res) => {
//   const { userId } = req.params;

//   User.findById(userId)
//     .orFail()
//     .then((user) => res.status(200).send(user))
//     .catch((err) => {
//       console.error(err.name);
//       if (err.name === "DocumentNotFoundError") {
//         return res
//           .status(ERROR_CODES.NOT_FOUND)
//           .send({ message: "User not found" });
//       }
//       if (err.name === "BSONError" || err.name === "CastError") {
//         return res
//           .status(ERROR_CODES.BAD_REQUEST)
//           .send({ message: "Invalid user ID" });
//       }
//       return res
//         .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
//         .send({ message: "An error has occurred on the server.", error: err });
//     });
// };
