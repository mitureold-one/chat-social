'use client'

import { useMessagesPage } from '@/hooks/useMessagesPage'
import { UserList } from '@/_components/messages/UserList'

export default function MessagesPage() {
  const messages = useMessagesPage()

  return (
    <UserList
      search={messages.search}
      users={messages.users}
      onSearchChange={messages.setSearch}
      onOpenChat={messages.openChat}
    />
  )
}