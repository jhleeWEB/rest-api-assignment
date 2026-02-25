const express = require("express");
const router = express.Router();
router.use(express.json());
const controller = require("../controllers/cartController");

router.post("/", controller.addItems);
router.get("/", controller.allItems);
router.delete("/", controller.removeItems);

module.exports = router;
