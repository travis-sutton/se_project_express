const ClothingItem = require("../models/clothingItem");
const { ERROR_CODES } = require("../utils/errors");

// Like an item
const likeItem = (req, res) => {
  console.log("Request parameters:", req.params);
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    // add _id to the array if it's not there yet
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err.name);
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid item ID provided", error: err });
      }

      if (err.message.includes("Cast to ObjectId failed for value")) {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .json({ message: "Item not found" });
      }

      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server.", error: err });
    });
};

// Dislike an item
const dislikeItem = (req, res) => {
  console.log("Request parameters:", req.params);
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    // remove _id from the array
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      // Check if item is not found
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      // If item is found, return it
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err.name);
      // Handle other errors
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid item ID provided", error: err });
      }
      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server.", error: err });
    });
};

module.exports = { likeItem, dislikeItem };
