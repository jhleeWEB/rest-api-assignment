const db = require("../database/mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const crypto = require("crypto");
dotenv.config();

const join = (req, res) => {
  const { email, password, name } = req.body;

  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  const sql = "insert into users (email, password,name, salt) values (?,?,?,?)";
  const values = [email, hashPassword, name, salt];
  db.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.CREATED).json(results);
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  const sql = "select * from users where email = ? ";
  db.query(sql, email, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    const user = results[0];
    const hashPassword = crypto
      .pbkdf2Sync(password, user.salt, 10000, 10, "sha512")
      .toString("base64");

    if (user.password !== hashPassword) {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }

    const token = jwt.sign(
      {
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
        issuer: "jhlee",
      },
    );

    res.cookie("token", token, { httpOnly: true });
    return res.status(StatusCodes.OK).json(user);
  });
};

const passwordResetRequest = (req, res) => {
  const { email } = req.body;
  const sql = "select * from users where email = ? ";
  db.query(sql, email, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    const user = results[0];
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
    return res.status(StatusCodes.OK).json({ email: user.email });
  });
};
const passwordReset = (req, res) => {
  const { email, password, newPassword } = req.body;

  const selectSql = "select * from users where email = ? ";
  const prevSalt = db.query(selectSql, email, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    const user = results[0];
    if (!user) {
      return res.status(500).end();
    }
    return user.salt;
  });

  const prevHashPassword = crypto
    .pbkdf2Sync(password, prevSalt, 10000, 10, "sha512")
    .toString("base64");

  const newSalt = crypto.randomBytes(10).toString("base64");
  const newHashPassword = crypto
    .pbkdf2Sync(newPassword, salt, 10000, 10, "sha512")
    .toString("base64");
  const sql =
    "update users set password = ?, salt = ? where email = ? and password = ?";
  const values = [newHashPassword, newSalt, email, prevHashPassword];
  db.query(sql, values, (err, results) => {
    if (err || results.affectedRows == 0) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  join,
  login,
  passwordResetRequest,
  passwordReset,
};
