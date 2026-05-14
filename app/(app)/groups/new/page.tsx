'use client'

import { useNewGroupPage } from '@/hooks/useNewGroupPage'
import { GroupCreateForm } from '@/_components/groups/GroupCreateForm'

export default function NewGroupPage() {
  const form = useNewGroupPage()

  return (
    <GroupCreateForm
      name={form.name}
      description={form.description}
      isPrivate={form.isPrivate}
      password={form.password}
      loading={form.loading}
      error={form.error}
      onNameChange={form.setName}
      onDescriptionChange={form.setDescription}
      onPrivateChange={form.setIsPrivate}
      onPasswordChange={form.setPassword}
      onCancel={form.back}
      onSubmit={form.handleCreate}
    />
  )
}