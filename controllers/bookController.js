const db = require("../database/mariadb");
const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv");
dotenv.config();

const allBooks = (req, res) => {
  let { categoryId, isNew, limit, currentPage } = req.query;

  let sql = `select * from books`;
  const values = [];

  if (categoryId && isNew) {
    sql += ` where category_id = ? 
    and pub_date between date_sub(now(), interval 3 month) and now()`;
    values.push(parseInt(categoryId));
  } else if (categoryId) {
    sql += ` where category_id = ?`;
    values.push(parseInt(categoryId));
  } else if (isNew) {
    sql += ` where pub_date between date_sub(now(), interval 3 month) and now()`;
  }
  sql += ` limit ? offset ?`;
  limit = parseInt(limit);
  let offset = limit * (currentPage - 1);
  values.push(limit, offset);

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

const bookDetails = (req, res) => {
  const { id } = req.params;
  const sql =
    "SELECT * FROM books left join categories on books.category_id = categories.id where books.id = ?";
  db.query(sql, id, (err, results) => {
    if (err) {
      res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results[0]) {
      res.status(StatusCodes.OK).json(results[0]);
    } else {
      res.status(StatusCodes.BAD_REQUEST).end();
    }
  });
};

const booksByCategories = (req, res) => {};

module.exports = {
  allBooks,
  bookDetails,
  booksByCategories,
};
