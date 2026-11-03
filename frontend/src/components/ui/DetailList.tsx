import type { ReactNode } from 'react'

export interface DetailItem {
  label: string
  value: ReactNode
}

export function DetailList({ items }: { items: DetailItem[] }) {
  return (
    <dl className="divide-y divide-line rounded-lg border border-line">
      {items.map((item) => (
        <div key={item.label} className="grid grid-cols-3 gap-3 px-4 py-3 text-sm">
          <dt className="text-muted">{item.label}</dt>
          <dd className="col-span-2 break-words font-medium text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
