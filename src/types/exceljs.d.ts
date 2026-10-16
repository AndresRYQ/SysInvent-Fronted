import 'exceljs'

declare module 'exceljs' {
  interface Workbook {
    title?: string
    subject?: string
    company?: string
  }
}
