'use client'

import { useGroupsPage } from '@/hooks/useGroupsPage'
import { GroupList } from '@/_components/groups/GroupList'
import { GroupListSkeleton } from '@/_components/ui/skeletons'

export default function GroupsPage() {
  const groupsPage = useGroupsPage()

  if (groupsPage.pageLoading) return <GroupListSkeleton />

  return (
    <GroupList
      groups={groupsPage.groups}
      onCreate={groupsPage.onCreate}
      onOpenGroup={groupsPage.onOpenGroup}
    />
  )
}
