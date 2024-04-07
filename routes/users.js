const router = require("express").Router();

const { getUsers, getUser, createUser } = require("../controllers/users");

// CREATE
router.post("/", createUser);

// // Read
router.get("/", getUsers);

// Read
router.get("/:userId", getUser);

module.exports = router;
