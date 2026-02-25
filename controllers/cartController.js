const db = require("../database/mariadb");
const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv");
dotenv.config();

const addItems = (req, res) => {
  const { bookId, quantity, userId } = req.body;
  const sql = `insert into cartItems (book_id, quantity, user_id)
  values(?, ?, ?);
  `;
  const values = [bookId, quantity, userId];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.CREATED).end();
  });
};
const removeItems = (req, res) => {
  const { cartId } = req.body;
  const sql = `delete from cartItems where id = ?`;
  db.query(sql, cartId, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.ACCEPTED).end();
  });
};
const allItems = (req, res) => {
  const { userId, selectedItems } = req.body;
  const sql = `select cartItems.id, book_id, title, summary, quantity, price from cartItems left 
  join books on cartItems.book_id = books.id 
  where user_id = ? 
  and cartItems.id in (?)`;

  db.query(sql, [userId, selectedItems], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  addItems,
  removeItems,
  allItems,
};
