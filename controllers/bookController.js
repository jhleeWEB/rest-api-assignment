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
  const { userId } = req.body;
  const id = parseInt(req.params.id);
  let sql = `select * ,
  (select count(*) from likes where book_id=books.id) as likes ,
  (select exists (select * from likes where book_id=? and user_id= ?)) as liked 
  from books 
  left join categories 
  on books.category_id = categories.category_id 
  where books.id = ?`;
  const values = [id, userId, id];
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results && results[0]) {
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
