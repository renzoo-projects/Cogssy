'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Package, Receipt, FolderTree, Shirt, Calculator } from 'lucide-react'

const navSections = [
  {
    label: 'Main',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/ingredients', label: 'Ingredients', icon: Package },
      { href: '/overheads', label: 'Overheads', icon: Receipt },
      { href: '/categories', label: 'Categories', icon: FolderTree },
      { href: '/products', label: 'Products', icon: Shirt },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
            <Calculator className="size-4 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold text-sidebar-foreground">Cogssy</h1>
        </div>
        <p className="text-xs text-sidebar-foreground/60">Smart Product Costing</p>
        <p className="text-xs text-sidebar-foreground/40">by Renz Rendel De Arroz</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navSections.map(section => (
          <div key={section.label}>
            <p className="px-3 py-1.5 text-[11px] font-semibold text-sidebar-foreground/40 uppercase tracking-widest">
              {section.label}
            </p>
            {section.items.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === item.href
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary -ml-px shadow-sm shadow-primary/10'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
