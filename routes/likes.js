const express = require("express");
const controller = require("../controllers/likeController");
const router = express.Router();
router.use(express.json());

router.post("/", controller.addLike);
router.delete("/", controller.removeLike);

module.exports = router;
