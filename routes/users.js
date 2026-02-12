const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();
router.use(express.json());
router.post("/join", userController.join);
router.post("/login", userController.login);
router.post("/reset", userController.passwordResetRequest);
router.put("/reset", userController.passwordReset);

module.exports = router;
