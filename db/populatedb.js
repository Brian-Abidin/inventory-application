#! /usr/bin/env node

const { Client } = require("pg");
require("dotenv").config();

const SQL = `
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
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    // This is the connection for local hosting
    // postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:${process.env.DB_PORT}/${process.env.DB_NAME}
    connectionString: process.env.DB_CONNECTIONSTRING
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
