import type { ReactNode } from 'react'

export function PageHeader({ description, action }: { description: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <p className="max-w-2xl text-sm text-muted">{description}</p>
      {action}
    </div>
  )
}
