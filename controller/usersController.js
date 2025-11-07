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
  const { id } = req.params;
  const gameDetails = await db.getGameInfoById(id);
  if (gameDetails !== undefined) {
    res.render("details", {
      title: gameDetails.map((game) => game.game).shift(),
      developers: gameDetails.map((game) => game.developers),
      genre: gameDetails.map((game) => game.genre),
      description: gameDetails.map((game) => game.description)
    });
  } else {
    res.render("404", {
      game: gameDetails
    });
  }
}

async function getSearch(req, res) {
  const searchTerm = req.query.q;
  const found = await db.searchGamesByTitle(searchTerm);
  res.render("search", {
    searchTerm,
    games: found.map((game) => game.game),
    id: found.map((game) => game.id)
  });
}

module.exports = {
  getIndex,
  getGames,
  getCategories,
  getGameDetails,
  getSearch
};
