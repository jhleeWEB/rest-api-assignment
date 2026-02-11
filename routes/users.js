const express = require("express");
const router = express.Router();
router.use(express.json());
router.post("/join", (req, res) => {
  res.json("희원가입");
});
router.post("/login", (req, res) => {
  res.json("로그인");
});
router.post("/reset", (req, res) => {
  res.json("비번 재설정");
});
router.put("/reset", (req, res) => {
  res.json("희원정보 수정");
});

module.exports = router;
