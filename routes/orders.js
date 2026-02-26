const express = require("express");
const router = express.Router();
router.use(express.json());
const controller = require("../controllers/orderController");

router.post("/", controller.orders);
router.get("/", controller.getOrders);
router.get("/:id", controller.getOrderDetails);

module.exports = router;
