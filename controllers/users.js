const User = require("../models/user");
const { ERROR_CODES } = require("../utils/errors");

// Get all users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err.name);
      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server.", error: err });
    });
};

// Get user by ID
const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err.name);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: "User not found" });
      }
      if (err.name === "BSONError" || err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid user ID" });
      }
      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server.", error: err });
    });
};

// Create a new user
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      console.error(err.name);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: err.message });
      }
      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server.", error: err });
    });
};

// Update a user
const updateUser = (req, res) => {
  const { userId } = req.params;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(userId, { name, avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: "User not Found" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err.name);
      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "Error updating user", error: err });
    });
};

// Delete a user
const deleteUser = (req, res) => {
  const { userId } = req.params;

  User.findByIdAndDelete(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: "User not found" });
      }
      return res.status(204).send();
    })
    .catch((err) => {
      console.error(err.name);
      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "Error deleting user", error: err });
    });
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
