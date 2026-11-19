// Simula a cotação do Melhor Envio: preço e prazo variam pela região do CEP.
export function cotarFrete(cep) {
  const digitos = cep.replace(/\D/g, '')
  if (digitos.length !== 8) return null
  const regiao = Number(digitos[0])
  const base = [12.9, 14.9, 18.9, 22.9, 24.9, 27.9, 29.9, 32.9, 16.9, 19.9][regiao]
  return [
    { id: 'pac', nome: 'Correios PAC', preco: base, prazo: 4 + regiao },
    { id: 'sedex', nome: 'Correios SEDEX', preco: +(base * 1.8).toFixed(2), prazo: 1 + Math.ceil(regiao / 3) },
  ]
}
