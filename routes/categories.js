const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
router.use(express.json());

router.get("/", categoryController.allCategories);

module.exports = router;
