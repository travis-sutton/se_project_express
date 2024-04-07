// ROUTES

const router = require("express").Router();

// Import the controller function for creating and receiving clothing items
const {
  createItem,
  getItems,
  deleteItem,
} = require("../controllers/clothingItem");

// CRUD
// CREATE
router.post("/", createItem);

// Read
router.get("/", getItems);

// Delete
router.delete("/:itemId", deleteItem);

module.exports = router;
