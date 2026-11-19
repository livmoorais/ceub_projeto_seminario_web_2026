export function Carregando({ texto = 'Carregando…' }) {
  return <p className="py-16 text-center text-tinta/60">{texto}</p>
}

export function ErroApi({ erro }) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl bg-red-50 p-6 text-red-900 ring-1 ring-red-200">
      <p className="font-semibold">Não foi possível falar com a API.</p>
      <p className="mt-1 text-sm">{erro.message}</p>
      <p className="mt-3 text-sm">
        Verifique se o json-server está rodando (<code className="rounded bg-red-100 px-1">npm run dev</code>).
      </p>
    </div>
  )
}
