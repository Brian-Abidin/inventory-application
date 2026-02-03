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

CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ),
    description TEXT
);

CREATE TABLE IF NOT EXISTS devs (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 )
);

CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 )
);

CREATE TABLE IF NOT EXISTS games_devs (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    game_id INTEGER REFERENCES games (id),
    dev_id INTEGER REFERENCES devs (id)
);

CREATE TABLE IF NOT EXISTS games_genres (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    game_id INTEGER REFERENCES games (id),
    genre_id INTEGER REFERENCES genres (id)
);

INSERT INTO games (name, description)
VALUES
    ('Overwatch 2', 'Overwatch 2 is a 2023 American first-person shooter video game by Blizzard Entertainment. As a sequel and replacement to the 2016 hero shooter Overwatch, the game includes new game modes and a reduction in team size from six to five.'),
    ('Call of Duty 6', 'Call of Duty: Black Ops 6 is a 2024 first-person shooter video game co-developed by Treyarch and Raven Software and published by Activision. It is the twenty-first installment of the Call of Duty series and is the seventh main entry in the Black Ops sub-series, following Call of Duty: Black Ops Cold War (2020).');

INSERT INTO devs (name)
VALUES
    ('Blizzard Entertainment'),
    ('Treyarch'),
    ('Raven Software');

INSERT INTO genres (name)
VALUES
    ('FPS'),
    ('Hero Shooter');

INSERT INTO games_devs (game_id, dev_id)
VALUES
    (1, 1),
    (2, 2),
    (2, 3);

INSERT INTO games_genres (game_id, genre_id)
VALUES
    (1, 1),
    (1, 2),
    (2, 1);
    
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
