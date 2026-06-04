'use client'

import { useOverheads } from '@/hooks/use-overheads'
import { FieldDialog } from '@/components/ui/field-dialog'
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog'
import { Button } from '@/components/ui/button'
import { Lock, Trash2 } from 'lucide-react'

export default function OverheadsPage() {
  const { overheads, createOverhead, deleteOverhead } = useOverheads()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overhead Library</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage overhead cost types you can assign to products.</p>
        </div>
        <FieldDialog title="New Overhead" description="Add an overhead cost type to your library." placeholder="e.g. Equipment Maintenance" buttonLabel="Add Overhead" onSubmit={createOverhead} />
      </div>

      <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {overheads.map(oh => (
                <tr key={oh.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium">{oh.name}</td>
                  <td className="px-4 py-3">
                    {oh.isPreset ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                        <Lock className="size-3" /> Preset
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Custom</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {oh.isPreset ? (
                      <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" disabled>
                        <Trash2 className="size-4" />
                      </Button>
                    ) : (
                      <ConfirmDeleteDialog itemName={oh.name} itemType="overhead" onConfirm={() => deleteOverhead(oh.id)}>
                        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive">
                          <Trash2 className="size-4" />
                        </Button>
                      </ConfirmDeleteDialog>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
