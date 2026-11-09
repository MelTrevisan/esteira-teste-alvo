'use strict';
const { Pool } = require('pg');

function connectionString() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL não definida.');
    process.exit(1);
  }
  return url;
}

function createPool() {
  return new Pool({ connectionString: connectionString(), max: 5 });
}

module.exports = { createPool };
