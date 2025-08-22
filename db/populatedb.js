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
    connectionString: "postgresql://brian:1234@localhost:5432/game_inventory"
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
