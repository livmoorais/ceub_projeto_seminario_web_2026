import { useEffect, useState } from 'react'

// Mostra quanto tempo falta para a reserva expirar.
export default function Contagem({ ate, onExpirar }) {
  const [agora, setAgora] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setAgora(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const restante = Math.max(0, new Date(ate).getTime() - agora)

  useEffect(() => {
    if (restante === 0) onExpirar?.()
  }, [restante, onExpirar])

  const min = String(Math.floor(restante / 60000)).padStart(2, '0')
  const seg = String(Math.floor((restante % 60000) / 1000)).padStart(2, '0')
  return <span className="font-mono tabular-nums">{min}:{seg}</span>
}
