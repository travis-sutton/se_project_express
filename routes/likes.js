const router = require("express").Router();
const { likeItem, dislikeItem } = require("../controllers/likes");
const authorize = require("../middlewares/auth");

// Like an item
router.put("/:itemId/likes", authorize, likeItem);

// Dislike an item
router.delete("/:itemId/likes", authorize, dislikeItem);

module.exports = router;
