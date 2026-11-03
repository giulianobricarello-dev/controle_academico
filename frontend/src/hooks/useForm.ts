import { useState, type ChangeEvent, type FormEvent } from 'react'

export type FieldErrors<T> = Partial<Record<keyof T, string>>

/** Estado de formulário com validação no envio. Todos os valores são strings (como nos inputs). */
export function useForm<T extends Record<string, string>>(
  initial: T,
  validate: (values: T) => FieldErrors<T>,
) {
  const [values, setValues] = useState<T>(initial)
  const [errors, setErrors] = useState<FieldErrors<T>>({})

  const setValue = <K extends keyof T>(name: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
  }

  /** Props prontas para <Input /> e <Select />. */
  const bind = <K extends keyof T & string>(name: K) => ({
    id: name,
    name,
    value: values[name],
    invalid: !!errors[name],
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setValue(name, e.target.value as T[K]),
  })

  const handleSubmit = (onValid: (values: T) => void | Promise<void>) => (e: FormEvent) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.values(found).some(Boolean)) return
    void onValid(values)
  }

  return { values, errors, setValue, bind, handleSubmit }
}
