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
      console.error(err.name);
      res.status(400).send({ message: "Error creating item", err });
    });
};

// Retrieve all items
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err.name);
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
      console.error(err.name);
      res.status(500).send({ message: "Error updating item", err });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log("Deleting item with ID:", itemId);

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.status(200).send({});
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Error deleting item", err });
      }

      res.status(404).send({ message: "Error deleting item", err });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
};
