// Controllers handle the logic of the application.
// They receive incoming requests, process them, interact with the model (if necessary), and send back a response to the client.
// It delegates the actual database operations to the model layer and focuses on request handling and response generation.

const ClothingItem = require("../models/clothingItem");
const { ERROR_CODES } = require("../utils/errors");

// Create new item
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  if (!req.user || !req.user._id) {
    return res.status(401).send({ message: "Authorization required" });
  }

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err.name);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid data passed", error: err });
      }
      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred", error: err });
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
        .send({ message: "An error has occurred on the server.", error: err });
    });
};

// Delete an item
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  if (!req.user || !req.user._id) {
    return res.status(401).send({ message: "Authorization required" });
  }

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: "Item not found" });
      }

      console.log(
        `Item owner: ${item.owner.toString()}, Request user ID: ${req.user._id.toString()}`,
      );

      if (item.owner !== req.user._id) {
        console.log(
          `Forbidden: User ${req.user._id} does not own the item ${item._id}`,
        );
        return res.status(403).send({
          message: "Forbidden: You do not have permission to delete this item",
        });
      }

      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) => {
        if (!deletedItem) {
          return res
            .status(ERROR_CODES.NOT_FOUND)
            .send({ message: "Item not found" });
        }

        res.status(200).send({ message: "Item deleted successfully" });
      });
    })
    .catch((err) => {
      console.error("Error:", err.name);
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
