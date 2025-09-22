const db = require("../db/queries");

async function getIndex(req, res) {
  const games = await db.getAllData();
  console.log(games);
  res.render("index");
}

module.exports = {
  getIndex
};
