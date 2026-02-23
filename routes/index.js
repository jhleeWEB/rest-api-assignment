const express = require("express");
const router = express.Router();

const userRoutes = require("./users");
const bookRoutes = require("./books");
const categoryRoutes = require("./categories");
const cartRoutes = require("./carts");
const likesRoutes = require("./likes");
const orderRoutes = require("./orders");

router.use("/users", userRoutes);
router.use("/books", bookRoutes);
router.use("/categories", categoryRoutes);
router.use("/carts", cartRoutes);
router.use("/likes", likesRoutes);
router.use("/orders", orderRoutes);

module.exports = router;
