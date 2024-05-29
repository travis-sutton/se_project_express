// ROUTES

const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
} = require("../controllers/clothingItem");

const authorize = require("../middlewares/auth");

// CRUD
// CREATE

// router.post("/", createItem);
router.post("/", authorize, createItem);

// Read
router.get("/", getItems);

// Delete
router.delete("/:itemId", authorize, deleteItem);

module.exports = router;
