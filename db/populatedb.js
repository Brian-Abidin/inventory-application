#! /usr/bin/env node

const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    game VARCHAR ( 255 ),
    developers VARCHAR ( 255 )
);

INSERT INTO games (game, developers)
VALUES
    ('Overwatch 2', 'Blizzard Entertainment'),
    ('Call of Duty 6', 'Treyarch, Raven Software');
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
