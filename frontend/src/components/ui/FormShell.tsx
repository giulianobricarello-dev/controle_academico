import type { FormEventHandler, ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from './Button'

interface FormShellProps {
  onSubmit: FormEventHandler<HTMLFormElement>
  onCancel: () => void
  saving: boolean
  error: string | null
  submitLabel: string
  children: ReactNode
}

export function FormShell({ onSubmit, onCancel, saving, error, submitLabel, children }: FormShellProps) {
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2.5 text-sm text-danger"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span className="whitespace-pre-line">{error}</span>
        </div>
      )}
      <div className="space-y-4">{children}</div>
      <p className="text-xs text-muted">
        Campos marcados com <span aria-hidden>*</span>
        <span className="sr-only">asterisco</span> são obrigatórios.
      </p>
      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" loading={saving}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
