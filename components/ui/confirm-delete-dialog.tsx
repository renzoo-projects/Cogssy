'use client'

import { useState, cloneElement, type ReactElement, type MouseEvent } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trash2 } from 'lucide-react'

interface ConfirmDeleteDialogProps {
  itemName: string
  itemType?: string
  onConfirm: () => void
  children: ReactElement<{ onClick?: (e: MouseEvent) => void }>
}

export function ConfirmDeleteDialog({ itemName, itemType = 'item', onConfirm, children }: ConfirmDeleteDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          cloneElement(children, {
            onClick: (e: MouseEvent) => {
              children.props.onClick?.(e)
              e.stopPropagation()
              setOpen(true)
            },
          })
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {itemType}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>&ldquo;{itemName}&rdquo;</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => { onConfirm(); setOpen(false) }}>
            <Trash2 className="size-4 mr-1.5" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
