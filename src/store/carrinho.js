import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { reservarPeca, liberarPeca } from '../api/catalogo.js'

// Estado local do carrinho (Zustand, como definido no documento).
// Persistido no navegador para sobreviver a um recarregamento da página.
export const useCarrinho = create(
  persist(
    (set, get) => ({
      itens: [],

      async adicionar(peca) {
        if (get().itens.some((i) => i.id === peca.id)) return
        const reservada = await reservarPeca(peca.id)
        const { id, nome, preco, cor, icone, tamanho, marca } = peca
        set({ itens: [...get().itens, { id, nome, preco, cor, icone, tamanho, marca, reservadaAte: reservada.reservadaAte }] })
      },

      async remover(id) {
        set({ itens: get().itens.filter((i) => i.id !== id) })
        try {
          await liberarPeca(id)
        } catch {
          /* a reserva expira sozinha de qualquer forma */
        }
      },

      removerExpirados() {
        const agora = new Date()
        const validos = get().itens.filter((i) => new Date(i.reservadaAte) > agora)
        if (validos.length !== get().itens.length) set({ itens: validos })
      },

      esvaziar: () => set({ itens: [] }),
    }),
    { name: 'desa-pego-carrinho' },
  ),
)

export const totalCarrinho = (itens) => itens.reduce((soma, i) => soma + i.preco, 0)
