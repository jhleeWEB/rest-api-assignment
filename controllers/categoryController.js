const db = require("../database/mariadb");
const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv");
dotenv.config();

const allCategories = (req, res) => {
  let sql = "select name from categories";

  db.query(sql, (err, results) => {
    if (err) {
      res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  allCategories,
};
