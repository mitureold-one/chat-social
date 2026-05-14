import { Button } from '@/_components/ui/button'
import { Badge } from '@/_components/ui/badge'
import { Lock, Globe, Plus, LogIn } from 'lucide-react'
import type { GroupWithMeta } from '@/lib/services/groups.service'

type GroupListProps = {
  groups: GroupWithMeta[]
  onCreate: () => void
  onOpenGroup: (groupId: string) => void
}

export function GroupList({ groups, onCreate, onOpenGroup }: GroupListProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Grupos</h1>
            <p className="text-xs md:text-sm text-neutral-500 mt-0.5">Participe de conversas em grupo</p>
          </div>
          <Button size="sm" onClick={onCreate}>
            <Plus size={15} className="mr-1.5" /> Criar
          </Button>
        </div>

        <div className="space-y-3">
          {groups.map(group => (
            <div
              key={group.id}
              className="border border-neutral-200 rounded-xl p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5 shrink-0">
                  {group.is_private
                    ? <Lock size={15} className="text-neutral-400" />
                    : <Globe size={15} className="text-neutral-400" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm truncate">{group.name}</span>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {group.is_private ? 'Privado' : 'Público'}
                    </Badge>
                  </div>
                  {group.description && (
                    <p className="text-xs text-neutral-500 mt-0.5 truncate">{group.description}</p>
                  )}
                  <p className="text-xs text-neutral-400 mt-1">@{group.profiles?.username}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant={group.isMember ? 'default' : 'outline'}
                className="shrink-0 ml-3"
                onClick={() => onOpenGroup(group.id)}
              >
                <LogIn size={13} className="mr-1" />
                {group.isMember ? 'Abrir' : 'Entrar'}
              </Button>
            </div>
          ))}

          {groups.length === 0 && (
            <div className="text-center py-16 text-neutral-400 text-sm">
              Nenhum grupo criado ainda. Seja o primeiro!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
