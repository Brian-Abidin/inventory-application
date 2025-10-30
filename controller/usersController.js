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

async function getGameDetails(req, res) {
  const games = await db.getAllData();
  const { gameTitle } = req.params;
  const isGame = games.map((game) => game.game).includes(gameTitle);
  if (isGame) {
    const gameIndex = games.map((game) => game.game).indexOf(gameTitle);
    res.render("details", {
      title: games.map((game) => game.game)[gameIndex],
      developers: games.map((game) => game.developers)[gameTitle]
    });
  } else {
    res.render("404", {
      gameTitle
    });
  }
}

module.exports = {
  getIndex,
  getGames,
  getCategories,
  getGameDetails
};
