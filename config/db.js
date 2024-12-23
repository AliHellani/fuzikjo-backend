const mysql = require("mysql2/promise");
require("dotenv").config({ path: "../secret.env" });
const host = process.env.HOST_DB;
const user = process.env.USER_DB;
const password = process.env.PASSWORD_DB;
const database = process.env.NAME_DB;

const dbConfig = {
  host,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
