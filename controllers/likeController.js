const db = require("../database/mariadb");
const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv");
dotenv.config();

const addLike = (req, res) => {
  const { userId, bookId } = req.body;
  let sql = `insert into likes (user_id, book_id)
   values(? , ?)`;
  const values = [userId, bookId];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.CREATED).end();
  });
};

const removeLike = (req, res) => {
  const { userId, bookId } = req.body;
  let sql = "delete from likes where user_id = ? and book_id = ?";
  const values = [userId, bookId];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.ACCEPTED).end();
  });
};

module.exports = {
  addLike,
  removeLike,
};
