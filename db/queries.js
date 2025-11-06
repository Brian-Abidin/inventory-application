const pool = require("./pool");

async function getAllData() {
  const { rows } = await pool.query("SELECT * FROM games");
  return rows;
}

async function insertGame(game) {
  await pool.query("INSERT INTO games (game) VALUES ($1)", [game]);
}

async function getGameInfoById(id) {
  const { rows } = await pool.query(`SELECT * FROM games WHERE id = ${id}`);
  return rows;
}

module.exports = {
  getAllData,
  getGameInfoById
};
