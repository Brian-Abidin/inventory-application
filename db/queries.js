const pool = require("./pool");

async function getAllData() {
  const { rows } = await pool.query(
    "SELECT games.id AS game_id, games.name, games.description, devs.name AS dev, genres.name AS genre FROM games INNER JOIN games_devs ON games.id = games_devs.game_id INNER JOIN devs ON games_devs.dev_id = devs.id INNER JOIN games_genres ON games.id = games_genres.game_id INNER JOIN genres ON games_genres.genre_id = genres.id"
  );
  return rows;
}

async function updateGamesTable(name, description, id) {
  console.log(name, description, id);
  await pool.query(
    "UPDATE games SET name = $1, description = $2 WHERE id = $3",
    [name, description, id]
  );
}

async function removeNoChildDevs() {
  await pool.query(
    "DELETE FROM devs WHERE NOT EXISTS (SELECT 1 FROM games_devs WHERE games_devs.dev_id = devs.id)"
  );
}

async function removeNoChildGenres() {
  await pool.query(
    "DELETE FROM genres WHERE NOT EXISTS (SELECT 1 FROM games_genres WHERE games_genres.genre_id = genres.id)"
  );
}

async function updateDevsTable(devs) {
  await pool.query(
    "INSERT INTO devs (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
    [devs]
  );
}

async function updateGenresTable(genre) {
  await pool.query(
    "INSERT INTO genres (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
    [genre]
  );
}

module.exports = {
  getAllData,
  updateGamesTable,
  updateDevsTable,
  updateGenresTable,
  removeNoChildDevs,
  removeNoChildGenres
};

/*
Example queries to update game and relational tables
  
ALTER TABLE games ADD CONSTRAINT unique_name UNIQUE (name);
     
ALTER TABLE devs ADD CONSTRAINT unique_dev UNIQUE (name);
     
ALTER TABLE genres ADD CONSTRAINT unique_genre UNIQUE (name);
 
UPDATE games SET name = 'Highguard' WHERE id = 1;

UPDATE games SET description = 'Highguard is a player versus player (PvP) raid shooter where players take on the roles of "Wardens", characters described as arcane gunslingers who fight for control over a mythical continent.' WHERE id = 1;

INSERT INTO devs (name) VALUES ('Wildlight Entertainment') ON CONFLICT (name) DO NOTHING;

INSERT INTO genres (name) VALUES ('Hero Shooter') ON CONFLICT (name) DO NOTHING;

DELETE FROM games_devs WHERE game_id = 1;

INSERT INTO games_devs (game_id, dev_id) WITH
t1 AS (
  SELECT id FROM games WHERE name = 'Highguard'
  ),
 t2 AS (
   SELECT id FROM devs WHERE name = 'Wildlight Entertainment'
   )
 SELECT t1.id, t2.id FROM t1, t2;
 
 DELETE FROM games_genres WHERE game_id = 1;
 
 INSERT INTO games_genres (game_id, genre_id) WITH
t1 AS (
  SELECT id FROM games WHERE name = 'Highguard'
  ),
 t2 AS (
   SELECT id FROM genres WHERE name = 'Hero Shooter'
   )
  SELECT t1.id, t2.id FROM t1, t2;
 
*/
