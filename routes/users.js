const router = require("express").Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

// CRUD
// CREATE
router.post("/", createUser);

// // Read
router.get("/", getUsers);

// Read
router.get("/:userId", getUser);

// // Update
router.put("/:userId", updateUser);

// Delete
router.delete("/:userId", deleteUser);

module.exports = router;
