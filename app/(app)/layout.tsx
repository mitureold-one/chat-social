import { Sidebar } from '@/_components/layout/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-hidden pb-16 md:pb-0 flex flex-col">
        {children}
      </main>
    </div>
  )
}
