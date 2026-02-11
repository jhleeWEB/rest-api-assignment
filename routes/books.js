const express = require("express");
const router = express.Router();
router.use(express.json());

router.post("/", (req, res) => {
  res.json("도서 조회");
});
router.get("/:id", (req, res) => {
  res.json("상세 도서 조회");
});

module.exports = router;
