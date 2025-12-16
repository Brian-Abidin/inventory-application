const db = require("../db/queries");

async function organizeData() {
  const rawGames = await db.getAllData();
  const organizedGamesMap = rawGames.reduce((acc, currentItem) => {
    const key = currentItem.game_id;
    // if key does not appear in the map instance
    if (!acc.has(key)) {
      // add a new entry with the specified key and value to the map
      acc.set(key, {
        game_id: key,
        name: "",
        description: "",
        devs: [],
        genres: []
      });
    }
    // adding a name, description, devs, and genres to the entry
    acc.get(key).name = currentItem.name;
    acc.get(key).description = currentItem.description;
    // if the dev is not already listed inside the devs array, add it
    if (!acc.get(key).devs.includes(currentItem.dev))
      acc.get(key).devs.push(currentItem.dev);
    // if the genre is not already listed inside the genres array, add it
    if (!acc.get(key).genres.includes(currentItem.genre))
      acc.get(key).genres.push(currentItem.genre);
    return acc;
  }, new Map()); // initial accumulator is an empty Map
  // converting the organized Map back into an array
  const organizedGamesArr = Array.from(organizedGamesMap.values());
  return organizedGamesArr;
}

async function getIndex(req, res) {
  const games = await organizeData();
  console.log(games);
  res.render("index", {
    games: "hello",
    developers: "world"
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
  const games = await db.getAllData();
  res.render("categories", {
    developers: new Set(
      games
        .map((game) => game.developers)
        .join(",")
        .split(",")
    ),
    genres: new Set(
      games
        .map((game) => game.genre)
        .join(",")
        .split(",")
    )
  });
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

async function getGamesByGenre(req, res) {
  const searchGenre = req.query.genre;
  console.log("Genre:", searchGenre);
  const found = await db.searchGamesByGenre(searchGenre.trim().split());
  res.render("search", {
    searchGenre,
    games: found.map((game) => game.game),
    id: found.map((game) => game.id)
  });
}

module.exports = {
  getIndex,
  getGames,
  getCategories,
  getGameDetails,
  getSearch,
  getGamesByGenre
};

// NEED TO UPDATE FUNCTIONS DUE TO CHANGING RELATIONAL TABLES
