import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-4">
        <p className="text-7xl font-bold tracking-tighter text-neutral-100 select-none mb-2">404</p>
        <h1 className="text-xl font-semibold text-neutral-800 mb-1">Página não encontrada</h1>
        <p className="text-sm text-neutral-400 mb-6">Esse endereço não existe ou foi removido.</p>
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 px-5 py-2 bg-black text-white text-sm rounded-full hover:bg-neutral-800 transition-colors"
        >
          Voltar pro feed
        </Link>
      </div>
    </div>
  )
}
