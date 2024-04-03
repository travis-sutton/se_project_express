// Controllers handle the logic of the application.
// They receive incoming requests, process them, interact with the model (if necessary), and send back a response to the client.
// It delegates the actual database operations to the model layer and focuses on request handling and response generation.

const ClothingItem = require("../models/clothingItem");

// Create new item
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error("Error creating item:", err.name);
      res.status(400).send({ message: "Error creating item", err });
    });
};

// Retrieve all items
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      res.status(500).send({ message: "Error getting items", err });
    });
};

// Update an item
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      res.status(500).send({ message: "Error updating item", err });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.status(204).send({});
    })
    .catch((err) => {
      res.status(500).send({ message: "Error deleting item", err });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
};
