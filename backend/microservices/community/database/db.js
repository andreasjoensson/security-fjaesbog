const Pool = require("pg/lib").Pool;
const fs = require("fs");
var path = require("path");

const pool = new Pool({
  user: "uwjzyhwc",
  password: "Lkymyym3z91Ko0AECQfYgPonwInTFvv5",
  host: "abul.db.elephantsql.com",
  port: 5432,
  database: "uwjzyhwc",
  max: 3,
  min: 0,
  idle: 10000,
});

module.exports = pool;
