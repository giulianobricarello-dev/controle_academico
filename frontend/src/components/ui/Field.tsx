import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '../../lib/cx'
import type { ListState } from '../../hooks/useList'

const control =
  'block h-10 w-full rounded-lg border bg-surface px-3 text-sm text-ink shadow-sm transition-colors ' +
  'placeholder:text-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25 ' +
  'disabled:cursor-not-allowed disabled:bg-canvas disabled:text-muted'

interface FieldProps {
  label: string
  htmlFor: string
  required?: boolean
  error?: string
  hint?: ReactNode
  children: ReactNode
}

export function Field({ label, htmlFor, required, error, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && (
          <>
            <span aria-hidden className="text-danger"> *</span>
            <span className="sr-only"> (obrigatório)</span>
          </>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>
      )}
    </div>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export function Input({ invalid, className, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cx(control, invalid ? 'border-danger focus:border-danger focus:ring-danger/25' : 'border-line', className)}
      {...props}
    />
  )
}

export interface Option {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: Option[]
  placeholder?: string
  invalid?: boolean
}

export function Select({ options, placeholder, invalid, className, ...props }: SelectProps) {
  return (
    <select
      aria-invalid={invalid || undefined}
      className={cx(control, 'pr-8', invalid ? 'border-danger focus:border-danger focus:ring-danger/25' : 'border-line', className)}
      {...props}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value} disabled={o.disabled}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

/**
 * Estado de um seletor alimentado pela API: placeholder, desabilitação e dica
 * (carregando, erro de conexão ou nenhum registro cadastrado).
 */
export function relationState<T>(list: ListState<T>, plural: string, to: string, pluralTitle: string) {
  if (list.loading) return { placeholder: `Carregando ${plural}…`, disabled: true, hint: undefined as ReactNode }
  if (list.error) {
    return {
      placeholder: 'Indisponível',
      disabled: true,
      hint: (
        <>
          Não foi possível carregar {plural}.{' '}
          <button type="button" onClick={() => void list.reload()} className="font-medium text-brand underline">
            Tentar novamente
          </button>
        </>
      ),
    }
  }
  if (list.data.length === 0) {
    return {
      placeholder: 'Nenhum cadastrado',
      disabled: true,
      hint: (
        <>
          Cadastre antes em{' '}
          <Link to={to} className="font-medium text-brand underline">
            {pluralTitle}
          </Link>
          .
        </>
      ),
    }
  }
  return { placeholder: 'Selecione…', disabled: false, hint: undefined as ReactNode }
}
