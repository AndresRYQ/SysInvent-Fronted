
import { Input, type InputProps } from '../ui/Input'

export type SearchBarProps = Omit<InputProps, 'type'>

export function SearchBar({ placeholder = 'Buscar…', ...props }: SearchBarProps) {
  return <Input {...props} type="search" placeholder={placeholder} />
}
