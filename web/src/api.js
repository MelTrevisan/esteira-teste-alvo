// Cliente mínimo da API. Erros de validação (422) voltam como { errors }.
async function chamar(caminho, opcoes) {
  const res = await fetch(`/api${caminho}`, {
    headers: { 'content-type': 'application/json' },
    ...opcoes,
  });
  const corpo = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, corpo };
}

export const api = {
  listar: () => chamar('/eventos'),
  buscar: (id) => chamar(`/eventos/${id}`),
  criar: (dados) => chamar('/eventos', { method: 'POST', body: JSON.stringify(dados) }),
  inscrever: (id, dados) =>
    chamar(`/eventos/${id}/inscricoes`, { method: 'POST', body: JSON.stringify(dados) }),
};

export function formatarData(iso) {
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
}
