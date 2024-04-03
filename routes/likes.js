const router = require("express").Router();

const { likeItem, dislikeItem } = require("../controllers/likes");

// Like an item
router.put("/items/:itemId/likes", likeItem);

// Dislike an item
router.delete("/items/:itemId/likes", dislikeItem);

module.exports = router;
