// Routes define the endpoints (URLs) of the application and specify which controller function should handle each type of request to those endpoints.
// Routes are responsible for mapping HTTP request methods (GET, POST, PUT, DELETE, etc.) to specific controller functions.
// They provide a clear and organized way to define the API endpoints exposed by the application.

// Main router
const router = require("express").Router();

// Error Codes
const { ERROR_CODES } = require("../utils/errors");

// Controllers
// const { createUser, login, updateUser } = require("../controllers/users");
const { createUser, login } = require("../controllers/users");

// Specific routers
const clothingItem = require("./clothingItem");
const userRouter = require("./users");
const likesRouter = require("./likes");
// const authorize = require("../middlewares/auth");

router.use("/items", clothingItem);
router.use("/users", userRouter);
router.use("/items", likesRouter);

router.post("/signup", createUser);
router.post("/signin", login);

// router.patch("/users/:userId", authorize, updateUser);

router.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND).send({ message: "Route not found" });
});

module.exports = router;
