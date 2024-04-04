const User = require("../models/user");

// Get all users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: "error from controllers/users" });
    });
};

// Get user by ID
const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.log(err.name);

      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "User not found" });
      } if (err.name === "BSONError" || err.name === "CastError") {
        return res.status(400).send({ message: "Invalid user ID" });
      }

      return res.status(500).send({ message: err.message });
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
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

// Update a user
const updateUser = (req, res) => {
  const { userId } = req.params;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(userId, { name, avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not Found" });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Error updating user", err });
    });
};

// Delete a user
const deleteUser = (req, res) => {
  const { userId } = req.params;

  User.findByIdAndDelete(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(204).send();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Error deleting user", err });
    });
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
