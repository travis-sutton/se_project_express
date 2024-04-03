const ClothingItem = require("../models/clothingItem");

// Like an item
const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    // add _id to the array if it's not there yet
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error("Error occurred:", err);
      res.status(500).send({ message: "Server error", error: err });
    });
};

// Unlike an item
const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    // remove _id from the array
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => res.status(200).send(item))
    .catch((err) =>
      res.status(500).send({ message: "Error unliking item", error: err })
    );
};

module.exports = { likeItem, dislikeItem };
