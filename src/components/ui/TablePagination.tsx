import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TablePaginationProps {
  totalItems: number
  page: number
  pageSize: number
  pageSizes?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

function buildPages(
  currentPage: number,
  totalPages: number,
) {
  if (totalPages <= 3) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    )
  }

  if (currentPage <= 2) {
    return [1, 2, 3]
  }

  if (currentPage >= totalPages - 1) {
    return [
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }

  return [
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]
}

export function TablePagination({
  totalItems,
  page,
  pageSize,
  pageSizes = [10, 20, 50],
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  if (totalItems === 0) {
    return null
  }

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize),
  )

  const currentPage = Math.min(page, totalPages)
  const startItem =
    (currentPage - 1) * pageSize + 1
  const endItem = Math.min(
    currentPage * pageSize,
    totalItems,
  )

  const pages = buildPages(
    currentPage,
    totalPages,
  )

  return (
    <div className="table-footer categories-pagination">
      <div className="d-flex align-items-center gap-2">
        <span className="categories-pagination__label">
          Filas
        </span>

        <select
          className="form-select categories-pagination__select"
          value={pageSize}
          onChange={(event) =>
            onPageSizeChange(
              Number(event.target.value),
            )
          }
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="categories-pagination__content">
        <span className="categories-pagination__label">
          {startItem} - {endItem} de {totalItems}
        </span>

        <div className="categories-pagination__nav">
          <button
            type="button"
            className="categories-page-btn"
            onClick={() =>
              onPageChange(currentPage - 1)
            }
            disabled={currentPage === 1}
            aria-label="Página anterior"
          >
            <ChevronLeft size={16} />
          </button>

          {pages.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              className={
                pageNumber === currentPage
                  ? 'categories-page-btn categories-page-btn--active'
                  : 'categories-page-btn'
              }
              onClick={() =>
                onPageChange(pageNumber)
              }
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            className="categories-page-btn"
            onClick={() =>
              onPageChange(currentPage + 1)
            }
            disabled={currentPage === totalPages}
            aria-label="Página siguiente"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
