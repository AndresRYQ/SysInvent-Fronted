
import type { Key, ReactNode } from 'react'
import '../../styles/maestros.css'

export interface DataTableColumn<T> {
  key: string
  header: ReactNode
  render: (row: T) => ReactNode
  className?: string
}

export interface DataTableProps<T> {
  data: readonly T[]
  columns: readonly DataTableColumn<T>[]
  rowKey: (row: T) => Key
  caption: string
  emptyMessage?: ReactNode
  loading?: boolean
  className?: string
}

/** El módulo entrega las filas filtradas y paginadas. */
export function DataTable<T>({ data, columns, rowKey, caption, emptyMessage = 'No se encontraron registros.', loading = false, className = '' }: DataTableProps<T>) {
  return <div className="table-responsive" aria-busy={loading}>
    <table className={`table maestro-table align-middle mb-0 ${className}`}>
      <caption className="visually-hidden">{caption}</caption>
      <thead><tr>{columns.map((column) => <th scope="col" key={column.key} className={column.className}>{column.header}</th>)}</tr></thead>
      <tbody>{loading || !data.length
        ? <tr><td colSpan={Math.max(1, columns.length)}><div className="maestro-empty-state" role="status">{loading ? 'Cargando registros…' : emptyMessage}</div></td></tr>
        : data.map((row) => <tr key={rowKey(row)}>{columns.map((column) => <td key={column.key} className={column.className}>{column.render(row)}</td>)}</tr>)}</tbody>
    </table>
  </div>
}
