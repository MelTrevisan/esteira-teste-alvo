'use strict';
const { createPool } = require('./db');

const statements = [
  `CREATE TABLE IF NOT EXISTS evento (
     id          SERIAL PRIMARY KEY,
     titulo      TEXT NOT NULL,
     data        DATE NOT NULL,
     local       TEXT NOT NULL DEFAULT '',
     vagas       INTEGER NOT NULL CHECK (vagas > 0),
     descricao   TEXT NOT NULL DEFAULT '',
     criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE TABLE IF NOT EXISTS inscricao (
     id          SERIAL PRIMARY KEY,
     evento_id   INTEGER NOT NULL REFERENCES evento(id) ON DELETE CASCADE,
     nome        TEXT NOT NULL,
     email       TEXT NOT NULL,
     criado_em   TIMESTAMPTZ NOT NULL DEFAULT now(),
     UNIQUE (evento_id, email)
   )`,
];

async function main() {
  const pool = createPool();
  try {
    for (const sql of statements) await pool.query(sql);
    console.log('migrate: ok');
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('migrate: falhou:', err.message);
  process.exit(1);
});
