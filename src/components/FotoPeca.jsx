// Placeholder visual da foto da peça (no sistema real: imagem do S3 servida pelo Cloudflare).
export default function FotoPeca({ peca, tamanho = 'md', className = '' }) {
  const fonte = { sm: 'text-3xl', md: 'text-6xl', lg: 'text-9xl' }[tamanho]
  return (
    <div
      className={`relative flex aspect-[4/5] items-center justify-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(150deg, ${peca.cor ?? '#b8a88a'}33, ${peca.cor ?? '#b8a88a'}aa)` }}
      aria-hidden="true"
    >
      <span className={`${fonte} drop-shadow-sm`}>{peca.icone ?? '👚'}</span>
    </div>
  )
}
