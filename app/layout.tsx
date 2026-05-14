import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { AppProvider } from './context/AppProvider'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chat Social',
  description: 'Chat ao vivo + rede social',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={geist.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}