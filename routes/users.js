const router = require("express").Router();
const { getCurrentUser } = require("../controllers/users");
const authorize = require("../middlewares/auth");

router.get("/me", authorize, getCurrentUser);

module.exports = router;

// router.get("/:userId", getCurrentUser); // try this is the above doesnt work
// const { getUsers, getUser, createUser } = require("../controllers/users");

// User Routes
// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);
