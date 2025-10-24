const db = require("../db/queries");

async function getIndex(req, res) {
  const games = await db.getAllData();
  res.render("index", {
    games: games.map((game) => game.game),
    developers: games.map((game) => game.developers)
  });
}

async function getGames(req, res) {
  const games = await db.getAllData();
  res.render("games", {
    games: games.map((game) => game.game),
    developers: games.map((game) => game.developers),
    id: games.map((game) => game.id)
  });
}

async function getCategories(req, res) {
  res.render("categories");
}

module.exports = {
  getIndex,
  getGames,
  getCategories
};
