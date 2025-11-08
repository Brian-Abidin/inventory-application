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

async function searchGamesByTitle(searchTerm) {
  const { rows } = await pool.query(
    `SELECT * FROM games WHERE game ILIKE ('%${searchTerm}%')`
  );
  return rows;
}

async function updateGameDetails(name, devs, genre, desc, id) {
  await pool.query(
    `UPDATE games SET game = ${name}, developers = ${devs}, genre = ${genre}, description = ${desc} WHERE id = ${id} `
  );
}

async function deleteGameById(id) {
  await pool.query(`DELETE FROM games WHERE id = ${id}`);
}

module.exports = {
  getAllData,
  getGameInfoById,
  searchGamesByTitle,
  updateGameDetails,
  deleteGameById
};
