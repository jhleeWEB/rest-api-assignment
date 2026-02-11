const dotenv = require("dotenv");
dotenv.config();

const router = require("./routes/index");
const express = require("express");
const app = express();

app.use("/api", router);

app.listen(process.env.PORT);
