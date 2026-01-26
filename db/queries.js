const pool = require("./pool");

async function getAllData() {
  const { rows } = await pool.query(
    "SELECT games.id AS game_id, games.name, games.description, devs.name AS dev, genres.name AS genre FROM games INNER JOIN games_devs ON games.id = games_devs.game_id INNER JOIN devs ON games_devs.dev_id = devs.id INNER JOIN games_genres ON games.id = games_genres.game_id INNER JOIN genres ON games_genres.genre_id = genres.id"
  );
  return rows;
}

async function updateGame(name, devs, genre, desc, id) {
  await pool.query(
    `UPDATE games SET game = ${name}, developers = ${devs}, genre = ${genre}, description = ${desc} WHERE id = ${id} `
  );
}

async function updateDevs(devs) {}
module.exports = {
  getAllData
};

/*
Example queries to update game and relational tables

UPDATE games SET name = 'Highguard' WHERE id = 1;

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
