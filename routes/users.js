const router = require("express").Router();
const { getCurrentUser } = require("../controllers/users");
const authorize = require("../middlewares/auth");

router.get("/:userId", authorize, getCurrentUser);

module.exports = router;
