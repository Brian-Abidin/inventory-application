const fs = require("fs");
const path = require("path");
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
        price: "",
        quantity: "",
        devs: [],
        genres: []
      });
    }
    // adding a name, description, devs, price, quantity, and genres to the entry
    acc.get(key).name = currentItem.name;
    acc.get(key).description = currentItem.description;
    acc.get(key).price = currentItem.price;
    acc.get(key).quantity = currentItem.quantity;
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
  const gameCoversArr = games.map(
    (game) =>
      `../images/${game.name.toLowerCase().replaceAll(/[^a-zA-Z0-9]/g, "")}.jpg`
  );
  res.render("games", {
    images: gameCoversArr,
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
      image: `../images/${foundGame.name
        .toLowerCase()
        .replaceAll(/[^a-zA-Z0-9]/g, "")}.jpg`,
      title: foundGame.name,
      developers: foundGame.devs.sort(),
      genre: foundGame.genres.sort(),
      description: foundGame.description,
      quantity: foundGame.quantity,
      price: foundGame.price,
      id: foundGame.game_id
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
      genres: foundGame.genres.sort(),
      description: foundGame.description,
      price: foundGame.price,
      quantity: foundGame.quantity,
      id: foundGame.game_id
    });
  } else {
    res.render("404", {
      game: "foundGame"
    });
  }
}

async function postEditGame(req, res) {
  const details = req.body;
  const filteredDevs = details.developers.filter((dev) => dev);
  const filteredGenres = details.genres.filter((genre) => genre);
  await db.deleteGamesDevsRelations(details.game_id);
  await db.deleteGamesGenresRelations(details.game_id);
  await db.updateGamesTable(
    details.title,
    details.description,
    details.game_id,
    details.price,
    details.quantity
  );
  // eslint-disable-next-line no-restricted-syntax
  for (const dev of filteredDevs) {
    // eslint-disable-next-line no-await-in-loop
    await db.updateDevsTable(dev);
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const genre of filteredGenres) {
    // eslint-disable-next-line no-await-in-loop
    await db.updateGenresTable(genre);
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const dev of filteredDevs) {
    // eslint-disable-next-line no-await-in-loop
    await db.updateGamesDevsTable(details.title, dev);
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const genre of filteredGenres) {
    // eslint-disable-next-line no-await-in-loop
    await db.updateGamesGenresTable(details.title, genre);
  }
  await db.removeNoChildDevs();
  await db.removeNoChildGenres();

  console.log(path.join(__dirname, "..", "public", "images", "c5.jpg"));
  const image = "c6";
  fs.access(
    path.join(__dirname, "..", "public", "images", `${image}.jpg`),
    fs.constants.F_OK,
    (err) => {
      if (err) {
        console.error("file doesn't exists");
      } else {
        console.log("file exists");
      }
    }
  );

  res.redirect(`/games/${details.game_id}`);
}

async function getNewGame(req, res) {
  res.render("new");
}

// function renames the randomized file name from multer to the game title's name
function renameFile(imagesrc, gameTitle) {
  const oldImagePath = `public/images/${imagesrc}`;
  const newImagePath = `public/images/${gameTitle}.jpg`;

  fs.rename(oldImagePath, newImagePath, (err) => {
    if (err) {
      console.error("Error renaming the image file:", err);
      return;
    }
    console.log("File renamed successfully");
  });
}

// function to delete file; primarily for game cover images
async function deleteFile(filePath) {
  await fs.unlink(
    path.join(__dirname, "..", "public", "images", `${filePath}.jpg`),
    (err) => {
      if (err) {
        console.error("An error occured:", err);
      } else {
        console.log("File deleted successfully!");
      }
    }
  );
}

async function postNewGame(req, res) {
  const details = req.body;
  console.log("LOOK HERE NOW", details, req);
  // check if file is submitted with form
  if (req.file) {
    renameFile(
      // given randomized file name
      req.file.filename,
      // game title replacing all characters but lower case and numbers
      details.title.toLowerCase().replaceAll(/[^a-zA-Z0-9]/g, "")
    );
  }
  const filteredDevs = details.developers.filter((dev) => dev);
  const filteredGenres = details.genres.filter((genre) => genre);
  await db.insertGameTable(
    details.title,
    details.description,
    details.price,
    details.quantity
  );
  // eslint-disable-next-line no-restricted-syntax
  for (const dev of filteredDevs) {
    // eslint-disable-next-line no-await-in-loop
    await db.updateDevsTable(dev);
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const genre of filteredGenres) {
    // eslint-disable-next-line no-await-in-loop
    await db.updateGenresTable(genre);
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const dev of filteredDevs) {
    // eslint-disable-next-line no-await-in-loop
    await db.updateGamesDevsTable(details.title, dev);
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const genre of filteredGenres) {
    // eslint-disable-next-line no-await-in-loop
    await db.updateGamesGenresTable(details.title, genre);
  }
  res.redirect("/");
}

// NEED TO FIX THIS FUNCTION WHEN YOU WANT TO DELETE A GAME
// THAT SHARES THE SAME DEVS/GENRES OF A GAME THAT ISNT MARKED FOR
// DELETION
async function postDeleteGame(req, res) {
  const details = req.body;
  const games = await organizeData();
  const gameToDelete = games.find((game) => game.game_id === +details.game_id);
  const filteredDevs = gameToDelete.devs.filter((dev) => dev);
  const filteredGenres = gameToDelete.genres.filter((genre) => genre);
  const gameImagePath = gameToDelete.name
    .toLowerCase()
    .replaceAll(/[^a-zA-Z0-9]/g, "");

  await db.deleteGamesDevsRelations(gameToDelete.game_id);
  await db.deleteGamesGenresRelations(gameToDelete.game_id);
  // eslint-disable-next-line no-restricted-syntax
  for (const dev of filteredDevs) {
    const devExist = games.filter((game) => game.devs.includes(dev));
    if (devExist.length === 0) {
      // eslint-disable-next-line no-await-in-loop
      await db.deleteDevTable(dev);
    }
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const genre of filteredGenres) {
    const genreExist = games.filter((game) => game.genres.includes(genre));
    if (genreExist.length === 0) {
      // eslint-disable-next-line no-await-in-loop
      await db.deleteGenreTable(genre);
    }
  }
  await db.deleteGameTable(gameToDelete.game_id);
  await deleteFile(gameImagePath);
  console.log("THIS GAME?", gameToDelete, gameToDelete.game_id);
  res.redirect("/");
}

module.exports = {
  getIndex,
  getGames,
  getCategories,
  getGameDetails,
  getSearch,
  getGamesByGenre,
  getGamesByDev,
  getEditGame,
  postEditGame,
  getNewGame,
  postNewGame,
  postDeleteGame
};

// NEED TO UPDATE FUNCTIONS DUE TO CHANGING RELATIONAL TABLES
