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
  console.log("Deleting item with ID:", itemId);

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()

    .then((item) => {
      console.log(item);
      res.status(200).send({});
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid ID provided", error: err });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: "Item not found", error: err });
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
