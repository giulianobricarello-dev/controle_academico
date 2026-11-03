import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  Eye,
  Pencil,
  Search,
  Trash2,
  type LucideIcon,
} from 'lucide-react'
import { cx } from '../../lib/cx'
import { Button, IconButton } from './Button'
import { EmptyState } from './EmptyState'
import { Skeleton } from './Skeleton'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  /** Quando informado, a coluna fica ordenável por este valor. */
  sortValue?: (row: T) => string | number | null | undefined
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => number | string
  loading: boolean
  error?: string | null
  onRetry?: () => void
  /** Texto da pesquisa (vem da barra superior). */
  query?: string
  searchText?: (row: T) => string
  onView?: (row: T) => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  emptyIcon: LucideIcon
  emptyTitle: string
  emptyDescription?: string
  emptyAction?: ReactNode
  /** Há algum filtro ativo além da pesquisa? */
  filtersActive?: boolean
  onClearFilters?: () => void
  defaultSort?: { key: string; dir: 'asc' | 'desc' }
  pageSize?: number
}

const normalize = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

function compare(a: string | number | null | undefined, b: string | number | null | undefined) {
  if (a === null || a === undefined) return b === null || b === undefined ? 0 : 1
  if (b === null || b === undefined) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), 'pt-BR', { sensitivity: 'base', numeric: true })
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  error,
  onRetry,
  query = '',
  searchText,
  onView,
  onEdit,
  onDelete,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyAction,
  filtersActive = false,
  onClearFilters,
  defaultSort,
  pageSize = 10,
}: DataTableProps<T>) {
  const [sort, setSort] = useState(defaultSort ?? null)
  const [page, setPage] = useState(1)

  const visible = useMemo(() => {
    const q = normalize(query.trim())
    let result = q && searchText ? rows.filter((r) => normalize(searchText(r)).includes(q)) : rows
    const column = sort && columns.find((c) => c.key === sort.key)
    if (column?.sortValue && sort) {
      const get = column.sortValue
      const factor = sort.dir === 'asc' ? 1 : -1
      result = [...result].sort((a, b) => factor * compare(get(a), get(b)))
    }
    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, query, sort, searchText])

  useEffect(() => setPage(1), [query, rows])

  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize))
  const current = Math.min(page, pageCount)
  const start = (current - 1) * pageSize
  const pageRows = visible.slice(start, start + pageSize)
  const hasActions = !!(onView || onEdit || onDelete)
  const colSpan = columns.length + (hasActions ? 1 : 0)

  const toggleSort = (key: string) => {
    setPage(1)
    setSort((s) => (s?.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))
  }

  if (error) {
    return (
      <div className="flex flex-col items-center px-6 py-12 text-center" role="alert">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft text-danger">
          <AlertCircle className="h-6 w-6" aria-hidden />
        </div>
        <h3 className="text-base font-semibold text-ink">Não foi possível carregar os dados</h3>
        <p className="mt-1 max-w-md text-sm text-muted">{error}</p>
        {onRetry && (
          <Button variant="secondary" className="mt-5" onClick={onRetry}>
            Tentar novamente
          </Button>
        )}
      </div>
    )
  }

  const isFiltered = filtersActive || query.trim() !== ''

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <thead className="border-b border-line bg-canvas/60 text-xs font-semibold text-muted">
            <tr>
              {columns.map((c) => {
                const active = sort?.key === c.key
                const SortIcon = active ? (sort.dir === 'asc' ? ChevronUp : ChevronDown) : ChevronsUpDown
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                    className={cx('px-4 py-3', c.className)}
                  >
                    {c.sortValue ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(c.key)}
                        className={cx('inline-flex items-center gap-1 rounded hover:text-ink', active && 'text-ink')}
                      >
                        {c.header}
                        <SortIcon className={cx('h-3.5 w-3.5', !active && 'opacity-50')} aria-hidden />
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                )
              })}
              {hasActions && (
                <th scope="col" className="px-4 py-3 text-right">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading &&
              Array.from({ length: 6 }, (_, i) => (
                <tr key={i}>
                  {Array.from({ length: colSpan }, (_, j) => (
                    <td key={j} className="px-4 py-3.5">
                      <Skeleton className="h-4 w-full max-w-[10rem]" />
                    </td>
                  ))}
                </tr>
              ))}
            {!loading &&
              pageRows.map((row) => (
                <tr key={rowKey(row)} className="hover:bg-canvas/60">
                  {columns.map((c) => (
                    <td key={c.key} className={cx('px-4 py-3 align-middle text-ink', c.className)}>
                      {c.render(row)}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="whitespace-nowrap px-4 py-2 text-right">
                      {onView && (
                        <IconButton label="Visualizar" onClick={() => onView(row)}>
                          <Eye className="h-4 w-4" aria-hidden />
                        </IconButton>
                      )}
                      {onEdit && (
                        <IconButton label="Editar" onClick={() => onEdit(row)}>
                          <Pencil className="h-4 w-4" aria-hidden />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton label="Excluir" tone="danger" onClick={() => onDelete(row)}>
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </IconButton>
                      )}
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!loading && visible.length === 0 && (
        <div className="border-t border-line">
          {isFiltered ? (
            <EmptyState
              icon={Search}
              title="Nenhum resultado encontrado"
              description="Nenhum registro corresponde à pesquisa ou aos filtros aplicados."
              action={
                filtersActive && onClearFilters ? (
                  <Button variant="secondary" onClick={onClearFilters}>
                    Limpar filtros
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} action={emptyAction} />
          )}
        </div>
      )}

      {!loading && visible.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm text-muted">
          <span aria-live="polite">
            {start + 1}–{Math.min(start + pageSize, visible.length)} de {visible.length}{' '}
            {visible.length === 1 ? 'registro' : 'registros'}
          </span>
          {pageCount > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="h-8 px-2.5"
                onClick={() => setPage(current - 1)}
                disabled={current === 1}
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </Button>
              <span className="tabular-nums">
                Página {current} de {pageCount}
              </span>
              <Button
                variant="secondary"
                className="h-8 px-2.5"
                onClick={() => setPage(current + 1)}
                disabled={current === pageCount}
                aria-label="Próxima página"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
