// Ponto único de acesso à API REST.
// No MVP real seria o backend NestJS; aqui é o json-server (db.json),
// o "truque de arquitetura" da aula para desenvolver o front antes do back.
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export async function api(caminho, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
    body: opcoes.body ? JSON.stringify(opcoes.body) : undefined,
  })
  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status} ao acessar ${caminho}`)
  }
  return resposta.status === 204 ? null : resposta.json()
}
