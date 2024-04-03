const router = require("express").Router();
const { likeItem, dislikeItem } = require("../controllers/likes");

// // Like an item
router.put("/:itemId/likes", likeItem);

// // Dislike an item
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
