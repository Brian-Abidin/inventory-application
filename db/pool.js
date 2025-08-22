const { Pool } = require("pg");

module.exports = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  databse: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});
