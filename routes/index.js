// Routes define the endpoints (URLs) of the application and specify which controller function should handle each type of request to those endpoints.
// Routes are responsible for mapping HTTP request methods (GET, POST, PUT, DELETE, etc.) to specific controller functions.
// They provide a clear and organized way to define the API endpoints exposed by the application.

// Main router
const router = require("express").Router();

// Specific routers
const clothingItem = require("./clothingItem");
const userRouter = require("./users");
const likesRouter = require("./likes");

router.use("/items", clothingItem);
router.use("/users", userRouter);
router.use("/likes", likesRouter);

router.use((req, res) => {
  res.status(500).send({ message: "Router not found" });
});

module.exports = router;
