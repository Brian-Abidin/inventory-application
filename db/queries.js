const pool = require("./pool");

async function getAllData() {
  const { rows } = await pool.query(
    "SELECT games.id AS game_id, games.name, games.description, devs.name AS dev, genres.name AS genre FROM games INNER JOIN games_devs ON games.id = games_devs.game_id INNER JOIN devs ON games_devs.dev_id = devs.id INNER JOIN games_genres ON games.id = games_genres.game_id INNER JOIN genres ON games_genres.genre_id = genres.id"
  );
  return rows;
}

module.exports = {
  getAllData
};
