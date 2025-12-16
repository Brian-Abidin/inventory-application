const pool = require("./pool");

async function getAllData() {
  const { rows } = await pool.query(
    "SELECT games.id AS game_id, games.name, games.description, devs.name AS dev, genres.name AS genre FROM games INNER JOIN games_devs ON games.id = games_devs.game_id INNER JOIN devs ON games_devs.dev_id = devs.id INNER JOIN games_genres ON games.id = games_genres.game_id INNER JOIN genres ON games_genres.genre_id = genres.id"
  );
  return rows;
}

// async function insertGame(game) {
//   await pool.query("INSERT INTO games (game) VALUES ($1)", [game]);
// }

// async function getGameInfoById(id) {
//   const { rows } = await pool.query(`SELECT * FROM games WHERE id = ${id}`);
//   return rows;
// }

// async function searchGamesByTitle(searchTerm) {
//   const { rows } = await pool.query(
//     `SELECT * FROM games WHERE game ILIKE ('%${searchTerm}%')`
//   );
//   return rows;
// }

// async function updateGameDetails(name, devs, genre, desc, id) {
//   await pool.query(
//     `UPDATE games SET game = ${name}, developers = ${devs}, genre = ${genre}, description = ${desc} WHERE id = ${id} `
//   );
// }

// async function deleteGameById(id) {
//   await pool.query(`DELETE FROM games WHERE id = ${id}`);
// }

// async function searchGamesByGenre(genresArr) {
//   console.log(genresArr.map((genre) => `'${genre}'`).join(", "), 2);
//   const { rows } = await pool.query(
//     `SELECT * FROM games WHERE genre IN (${genresArr
//       .map((genre) => `'${genre}'`)
//       .join(",")})`
//   );
//   return rows;
// }

module.exports = {
  getAllData
  // getGameInfoById,
  // searchGamesByTitle,
  // updateGameDetails,
  // deleteGameById,
  // searchGamesByGenre
};

// NEED TO UPDATE FUNCTIONS DUE TO CHANGING RELATIONAL TABLES

// query to select all name, desc, dev, and genres of all games
// SELECT games.name, games.description, devs.name, genres.name FROM games INNER JOIN games_devs ON games.id = games_devs.game_id INNER JOIN devs ON games_devs.dev_id = devs.id INNER JOIN games_genres ON games.id = games_genres.game_id FULL JOIN genres ON games_genres.genre_id = genres.id;
