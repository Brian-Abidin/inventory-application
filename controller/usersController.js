const db = require("../db/queries");

async function getIndex(req, res) {
  const games = await db.getAllData();
  res.render("index", {
    greeting: "hello",
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

async function getGameDetails(req, res) {
  const games = await db.getAllData();
  const { id } = req.params;
  const isGame = games.map((game) => game.game)[id];
  if (isGame === undefined) {
    res.render("details", {
      title: games.map((game) => game.game)[id],
      developers: games.map((game) => game.developers)[id]
    });
  } else {
    res.render("404");
  }
}

module.exports = {
  getIndex,
  getGames,
  getCategories,
  getGameDetails
};
