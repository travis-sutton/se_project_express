const ClothingItem = require("../models/clothingItem");

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
      if (!item) {
        // Item with the provided itemId does not exist
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error("Error occurred:", err);
      res.status(400).send({ message: "Server error", error: err });
    });
};

// Dislike an item
const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    // remove _id from the array
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        // Item with the provided itemId does not exist
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).send(item);
    })
    .catch((err) =>
      res.status(400).send({ message: "Error disliking item", error: err }),
    );
};

module.exports = { likeItem, dislikeItem };
