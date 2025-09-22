const db = require("../db/queries");

async function getIndex(req, res) {
  const games = await db.getAllData();
  res.render("index", {
    games: games.map((game) => game.game),
    developers: games.map((game) => game.developers)
  });
}

module.exports = {
  getIndex
};
