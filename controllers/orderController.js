const db = require("../database/mariadb");
const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv");
dotenv.config();

const orders = async (req, res) => {
  const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } =
    req.body;
  const [deliveryResults, deliveryErr] = await insertDelivery(
    delivery.address,
    delivery.receiver,
    delivery.contact,
  );
  if (deliveryErr) {
    console.error(deliveryErr);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
  const deliveryId = deliveryResults.insertId;

  const [orderResults, orderErr] = await insertOrders(
    firstBookTitle,
    totalQuantity,
    totalPrice,
    userId,
    deliveryId,
  );
  if (orderErr) {
    console.error(orderErr);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
  const orderId = orderResults.insertId;

  const [orderItems] = await getOrderItems(items);

  const [orderedBookResults, orderedBookErr] = await insertOrderedBooks(
    orderId,
    orderItems,
  );
  if (orderedBookErr) {
    console.error(orderedBookErr);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
  const [deleteResults, deleteErr] = await deleteCartItems(orderItems);
  if (deleteErr) {
    console.error(deleteErr);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
  return res.status(StatusCodes.CREATED).send("주문이 성공적으로 되었습니다.");
};

const getOrderItems = (items) => {
  const sql = `select book_id, quantity from cartItems where id in (?)`;
  return db.promise().query(sql, [items]);
};

const insertDelivery = (address, receiver, contact) => {
  const sql = `insert into delivery (address, receiver, contact)
   values (? , ? ,?)`;
  let values = [address, receiver, contact];
  return db.promise().query(sql, values);
};

const insertOrders = (
  bookTitle,
  totalQuantity,
  totalPrice,
  userId,
  deliveryId,
) => {
  const sql = `insert into orders (book_title, total_quantity, total_price, user_id, delivery_id) values (? ,? ,? ,? ,?)`;
  values = [bookTitle, totalQuantity, totalPrice, userId, deliveryId];
  return db.promise().query(sql, values);
};

const insertOrderedBooks = (orderId, items) => {
  const sql = `insert into orderedBooks (order_id, book_id, quantity) values ?`;
  values = [];
  items.forEach((n) => {
    values.push([orderId, n.book_id, n.quantity]);
  });

  return db.promise().query(sql, [values]);
};

const deleteCartItems = (items) => {
  const sql = `delete from cartItems where id in (?)`;
  const values = items.map((n) => n.id);
  return db.promise().query(sql, values);
};

const getOrders = (req, res) => {
  const sql = `select orders.id, book_title, total_quantity, total_price, created_at, address, contact, receiver from orders 
  left join delivery on orders.delivery_id = delivery.id`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end(err);
    }
    return res.status(StatusCodes.OK).json(results);
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
