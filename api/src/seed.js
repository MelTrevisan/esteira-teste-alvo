'use strict';
const { createPool } = require('./db');

// Dados fictícios e óbvios. Nenhuma pessoa real.
const eventos = [
  ['Oficina de Exemplo', '2030-03-10', 'Sala Fictícia 1', 50, 'Evento de demonstração.'],
  ['Palestra de Teste', '2030-04-02', 'Auditório Imaginário', 120, 'Outro evento de demonstração.'],
  ['Encontro Modelo', '2030-05-21', 'Online (fictício)', 30, ''],
];
const inscricoes = [
  [1, 'Pessoa Exemplo Um', 'exemplo.um@exemplo.invalid'],
  [1, 'Pessoa Exemplo Dois', 'exemplo.dois@exemplo.invalid'],
];

async function main() {
  const pool = createPool();
  try {
    const { rows } = await pool.query('SELECT count(*)::int AS n FROM evento');
    if (rows[0].n > 0) {
      console.log('seed: já há eventos, nada a fazer');
      return;
    }
    for (const e of eventos) {
      await pool.query(
        'INSERT INTO evento (titulo, data, local, vagas, descricao) VALUES ($1,$2,$3,$4,$5)',
        e,
      );
    }
    for (const i of inscricoes) {
      await pool.query('INSERT INTO inscricao (evento_id, nome, email) VALUES ($1,$2,$3)', i);
    }
    console.log('seed: ok');
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('seed: falhou:', err.message);
  process.exit(1);
});
