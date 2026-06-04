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

interface FieldDialogProps {
  title: string
  description: string
  placeholder: string
  buttonLabel: string
  onSubmit: (name: string) => void
}

export function FieldDialog({ title, description, placeholder, buttonLabel, onSubmit }: FieldDialogProps) {
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
            {buttonLabel}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">{title}</Label>
            <Input id="name" placeholder={placeholder} value={name} onChange={e => setName(e.target.value)} />
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
