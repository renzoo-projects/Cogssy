'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

interface OverheadFormProps {
  onSubmit: (name: string) => void
}

export function OverheadForm({ onSubmit }: OverheadFormProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  const handleSubmit = () => {
    if (!name) return
    onSubmit(name)
    setOpen(false)
    setName('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="rounded-full">
            <Plus className="size-4 mr-1.5" />
            Add Overhead
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Overhead</DialogTitle>
          <DialogDescription>Add an overhead cost type to your library.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Overhead Name</Label>
            <Input id="name" placeholder="e.g. Equipment Maintenance" value={name} onChange={e => setName(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!name}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
