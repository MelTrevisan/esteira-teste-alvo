'use strict';
const http = require('http');
const { createPool } = require('./db');

const pool = createPool();
const port = Number(process.env.PORT || 3000);

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => {
      raw += c;
      if (raw.length > 32 * 1024) reject(Object.assign(new Error('grande'), { status: 413 }));
    });
    req.on('end', () => {
      try {
        resolve(raw === '' ? {} : JSON.parse(raw));
      } catch {
        reject(Object.assign(new Error('json'), { status: 400 }));
      }
    });
  });
}

const str = (v) => (typeof v === 'string' ? v.trim() : '');
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function validateEvento(b) {
  const errors = {};
  const titulo = str(b.titulo);
  const data = str(b.data);
  const local = str(b.local);
  const vagas = Number(b.vagas);
  if (titulo === '') errors.titulo = 'Informe o título do evento.';
  else if (titulo.length > 120) errors.titulo = 'O título aceita até 120 caracteres.';
  if (data === '') errors.data = 'Informe a data do evento.';
  else if (!isDate(data)) errors.data = 'Data inválida.';
  if (b.vagas === '' || b.vagas === undefined || b.vagas === null) {
    errors.vagas = 'Informe o número de vagas.';
  } else if (!Number.isInteger(vagas) || vagas < 1) {
    errors.vagas = 'O número de vagas deve ser um inteiro maior que zero.';
  }
  return { errors, value: { titulo, data, local, vagas, descricao: str(b.descricao) } };
}

function validateInscricao(b) {
  const errors = {};
  const nome = str(b.nome);
  const email = str(b.email);
  if (nome === '') errors.nome = 'Informe o nome.';
  if (email === '') errors.email = 'Informe o e-mail.';
  else if (!isEmail(email)) errors.email = 'E-mail inválido.';
  return { errors, value: { nome, email } };
}

const eventoSql = `SELECT e.id, e.titulo, to_char(e.data, 'YYYY-MM-DD') AS data, e.local, e.vagas,
  e.descricao, (SELECT count(*)::int FROM inscricao i WHERE i.evento_id = e.id) AS inscritos
  FROM evento e`;

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const m = path.match(/^\/api\/eventos\/(\d+)(\/inscricoes)?$/);

  if (path === '/api/health') return send(res, 200, { ok: true });

  if (path === '/api/eventos' && req.method === 'GET') {
    const { rows } = await pool.query(`${eventoSql} ORDER BY e.data, e.id`);
    return send(res, 200, { eventos: rows });
  }

  if (path === '/api/eventos' && req.method === 'POST') {
    const { errors, value } = validateEvento(await readJson(req));
    if (Object.keys(errors).length > 0) return send(res, 422, { errors });
    const { rows } = await pool.query(
      'INSERT INTO evento (titulo, data, local, vagas, descricao) VALUES ($1,$2,$3,$4,$5) RETURNING id',
      [value.titulo, value.data, value.local, value.vagas, value.descricao],
    );
    return send(res, 201, { id: rows[0].id });
  }

  if (m && !m[2] && req.method === 'GET') {
    const found = await pool.query(`${eventoSql} WHERE e.id = $1`, [Number(m[1])]);
    if (found.rows.length === 0) return send(res, 404, { error: 'Evento não encontrado.' });
    const insc = await pool.query(
      'SELECT id, nome FROM inscricao WHERE evento_id = $1 ORDER BY id',
      [Number(m[1])],
    );
    return send(res, 200, { evento: found.rows[0], inscricoes: insc.rows });
  }

  if (m && m[2] && req.method === 'POST') {
    const id = Number(m[1]);
    const { errors, value } = validateInscricao(await readJson(req));
    if (Object.keys(errors).length > 0) return send(res, 422, { errors });
    const found = await pool.query(`${eventoSql} WHERE e.id = $1`, [id]);
    if (found.rows.length === 0) return send(res, 404, { error: 'Evento não encontrado.' });
    if (found.rows[0].inscritos >= found.rows[0].vagas) {
      return send(res, 409, { error: 'Evento sem vagas.' });
    }
    try {
      await pool.query('INSERT INTO inscricao (evento_id, nome, email) VALUES ($1,$2,$3)', [
        id,
        value.nome,
        value.email,
      ]);
    } catch (err) {
      if (err.code === '23505') {
        return send(res, 409, { error: 'Este e-mail já está inscrito neste evento.' });
      }
      throw err;
    }
    return send(res, 201, { ok: true });
  }

  return send(res, 404, { error: 'Rota não encontrada.' });
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((err) => {
    if (err && err.status) return send(res, err.status, { error: 'Requisição inválida.' });
    console.error('erro:', err.message);
    send(res, 500, { error: 'Erro interno.' });
  });
});

server.listen(port, '0.0.0.0', () => console.log(`api ouvindo na porta ${port}`));

for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => server.close(() => pool.end().then(() => process.exit(0))));
}
