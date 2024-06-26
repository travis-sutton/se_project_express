// Controllers handle the logic of the application.
// They receive incoming requests, process them, interact with the model (if necessary), and send back a response to the client.
// It delegates the actual database operations to the model layer and focuses on request handling and response generation.

const ClothingItem = require("../models/clothingItem");
const { ERROR_CODES } = require("../utils/errors");

// Create new item
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err.name);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid data passed" });
      }
      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred" });
    });
};

// Retrieve all items
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err.name);
      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// Delete an item
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: "Item not found" });
      }

      console.log(`Item owner ID: ${item.owner}`);
      console.log(`Request owner ID: ${req.user._id}`);

      if (String(item.owner) !== String(req.user._id)) {
        return res.status(ERROR_CODES.FORBIDDEN).send({
          message: "Forbidden: You do not have permission to delete this item",
        });
      }

      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) => {
        if (!deletedItem) {
          return res
            .status(ERROR_CODES.NOT_FOUND)
            .send({ message: "Item not found" });
        }
        return res.status(200).send({ message: "Item deleted successfully" });
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid ID provided", error: err });
      }
      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred", error: err });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
};
