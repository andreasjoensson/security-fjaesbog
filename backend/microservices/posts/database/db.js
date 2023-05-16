const Pool = require("pg/lib").Pool;
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  max: process.env.DB_MAX,
  min: process.env.DB_MIN,
  idle: process.env.DB_IDLE,
});

module.exports = pool;
