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
  res.render("index");
}

async function getGames(req, res) {
  const games = await organizeData();
  console.log(games.map((game) => game.name));
  res.render("games", {
    games: games.map((game) => game.name),
    developers: games.map((game) => game.developers),
    id: games.map((game) => game.game_id)
  });
}

async function getCategories(req, res) {
  const games = await organizeData();
  res.render("categories", {
    // create a Set to prevent duplicate values
    developers: new Set(
      games
        .map((game) => game.devs)
        .join(",")
        .split(",")
        .sort()
    ),
    genres: new Set(
      games
        .map((game) => game.genres)
        .join(",")
        .split(",")
        .sort()
    )
  });
}

async function getGameDetails(req, res) {
  // obtains the parameter, id, from the URL
  const { id } = req.params;
  const games = await organizeData();
  console.log(
    typeof id,
    games,
    games.find((x) => x.game_id === +id)
  );
  // id is not a Number so turn id into a Number by placing "+" in front of variable
  const foundGame = games.find((game) => game.game_id === +id);
  console.log("found", foundGame);
  if (foundGame !== undefined) {
    res.render("details", {
      title: foundGame.name,
      developers: foundGame.devs.sort(),
      genre: foundGame.genres.sort(),
      description: foundGame.description,
      id: foundGame.id
    });
  } else {
    res.render("404", {
      game: "foundGame"
    });
  }
}

async function getSearch(req, res) {
  const searchTerm = req.query.q;
  const games = await organizeData();
  const foundGames = games.filter((game) =>
    // trim and lowerCase to match with game names easier
    game.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );
  console.log("FOUND", foundGames);
  res.render("search", {
    query: searchTerm,
    games: foundGames.map((game) => game.name),
    id: foundGames.map((game) => game.game_id)
  });
}

async function getGamesByGenre(req, res) {
  const searchGenre = req.query.genre;
  console.log("Genre:", searchGenre);
  const games = await organizeData();
  const foundGames = games.filter((game) => game.genres.includes(searchGenre));
  res.render("search", {
    query: searchGenre,
    games: foundGames.map((game) => game.name),
    id: foundGames.map((game) => game.game_id)
  });
}

async function getGamesByDev(req, res) {
  const searchDev = req.query.dev;
  const games = await organizeData();
  const foundGames = games.filter((game) => game.devs.includes(searchDev));
  res.render("search", {
    query: searchDev,
    games: foundGames.map((game) => game.name),
    id: foundGames.map((game) => game.game_id)
  });
}

async function getEditGame(req, res) {
  const { id } = req.params;
  const games = await organizeData();

  // id is not a Number so turn id into a Number by placing "+" in front of variable
  const foundGame = games.find((game) => game.game_id === +id);
  if (foundGame !== undefined) {
    res.render("edit", {
      title: foundGame.name,
      developers: foundGame.devs.sort(),
      genre: foundGame.genres.sort(),
      description: foundGame.description
    });
  } else {
    res.render("404", {
      game: "foundGame"
    });
  }
}

module.exports = {
  getIndex,
  getGames,
  getCategories,
  getGameDetails,
  getSearch,
  getGamesByGenre,
  getGamesByDev,
  getEditGame
};

// NEED TO UPDATE FUNCTIONS DUE TO CHANGING RELATIONAL TABLES
