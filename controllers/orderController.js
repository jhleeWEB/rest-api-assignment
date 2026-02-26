const db = require("../database/mariadb");
const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv");
dotenv.config();

const orders = async (req, res) => {
  const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } =
    req.body;

  let sql = `insert into delivery (address, receiver, contact)
   values (? , ? ,?)`;
  let values = [delivery.address, delivery.receiver, delivery.contact];
  const [deliveryResults] = await db.promise().query(sql, values);
  const deliveryId = deliveryResults.insertId;

  sql = `insert into orders (book_title, total_quantity, total_price, user_id, delivery_id) values (? ,? ,? ,? ,?)`;
  values = [firstBookTitle, totalQuantity, totalPrice, userId, deliveryId];
  const [orderResults] = await db.promise().query(sql, values);
  const orderId = orderResults.insertId;

  values = [];
  items.forEach((n) => {
    values.push([orderId, n.bookId, n.quantity]);
  });

  sql = `insert into orderedBooks (order_id, book_id, quantity) values ?`;

  db.query(sql, [values], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.CREATED).end();
  });
};

const getOrders = (req, res) => {
  const { bookId, quantity, userId } = req.body;
  const sql = ``;
  const values = [bookId, quantity, userId];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.CREATED).end();
  });
};
const getOrderDetails = (req, res) => {
  const { id } = req.params;
  const sql = ``;
  const values = [bookId, quantity, userId];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.CREATED).end();
  });
};

module.exports = {
  orders,
  getOrders,
  getOrderDetails,
};
