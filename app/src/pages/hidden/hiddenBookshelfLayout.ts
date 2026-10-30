export const BOOKS_PER_TIER = 5
export const TIERS_PER_PAGE = 3
export const BOOKS_PER_PAGE = BOOKS_PER_TIER * TIERS_PER_PAGE

export interface BookShelfPage<T> {
  page: number
  pageCount: number
  startIndex: number
  tiers: T[][]
}

export function getBookShelfPage<T>(books: readonly T[], requestedPage: number): BookShelfPage<T> {
  const pageCount = Math.max(1, Math.ceil(books.length / BOOKS_PER_PAGE))
  const integerPage = Number.isFinite(requestedPage) ? Math.trunc(requestedPage) : 0
  const page = Math.min(pageCount - 1, Math.max(0, integerPage))
  const startIndex = page * BOOKS_PER_PAGE
  const pageBooks = books.slice(startIndex, startIndex + BOOKS_PER_PAGE)

  if (!pageBooks.length) return { page, pageCount, startIndex, tiers: [] }

  const tierCount = Math.min(
    TIERS_PER_PAGE,
    pageBooks.length === 1 ? 1 : Math.max(2, Math.ceil(pageBooks.length / BOOKS_PER_TIER))
  )
  const tierSize = Math.ceil(pageBooks.length / tierCount)
  const tiers: T[][] = []
  for (let index = 0; index < pageBooks.length; index += tierSize) {
    tiers.push(pageBooks.slice(index, index + tierSize))
  }

  return { page, pageCount, startIndex, tiers }
}
