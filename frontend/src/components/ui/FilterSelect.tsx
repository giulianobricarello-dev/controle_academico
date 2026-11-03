import { Select, type Option } from './Field'

interface FilterSelectProps {
  label: string
  allLabel: string
  value: string
  onChange: (value: string) => void
  options: Option[]
  disabled?: boolean
}

/** Seletor compacto para filtros de tabela; o valor vazio significa "sem filtro". */
export function FilterSelect({ label, allLabel, value, onChange, options, disabled }: FilterSelectProps) {
  return (
    <Select
      aria-label={`Filtrar por ${label}`}
      className="h-9 w-auto max-w-[16rem] py-0"
      placeholder={allLabel}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      options={options}
    />
  )
}
