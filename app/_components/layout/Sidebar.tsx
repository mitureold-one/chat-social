'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, Mail, Newspaper, User } from 'lucide-react'

const links = [
  { href: '/feed', label: 'Feed', icon: Newspaper },
  { href: '/groups', label: 'Grupos', icon: Users },
  { href: '/messages', label: 'Mensagens', icon: Mail },
  { href: '/profile', label: 'Perfil', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop — sidebar lateral */}
      <aside className="hidden md:flex w-56 border-r border-neutral-200 h-screen flex-col py-6 px-4 shrink-0">
        <h1 className="font-bold text-lg mb-8 tracking-tight px-2">Chat Social</h1>
        <nav className="flex flex-col gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname.startsWith(href)
                  ? 'bg-black text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile — barra inferior */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 flex">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs transition-colors ${
              pathname.startsWith(href)
                ? 'text-black font-medium'
                : 'text-neutral-400'
            }`}
          >
            <Icon size={20} strokeWidth={pathname.startsWith(href) ? 2.5 : 1.5} />
            {label}
          </Link>
        ))}
      </nav>
    </>
  )
}