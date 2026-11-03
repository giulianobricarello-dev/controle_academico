import { cx } from '../../lib/cx'

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cx('rounded bg-line/70 motion-safe:animate-pulse', className)} />
}
