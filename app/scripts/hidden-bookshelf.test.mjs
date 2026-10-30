import assert from 'node:assert/strict'
import test from 'node:test'
import { BOOKS_PER_PAGE, getBookShelfPage } from '../src/pages/hidden/hiddenBookshelfLayout.ts'

const books = count => Array.from({ length: count }, (_, index) => index + 1)

test('当前十五本书平衡为三层，顺序保持不变', () => {
  const layout = getBookShelfPage(books(15), 0)
  assert.equal(layout.pageCount, 1)
  assert.deepEqual(layout.tiers.map(tier => tier.length), [5, 5, 5])
  assert.deepEqual(layout.tiers.flat(), books(15))
})

test('少量图书自动平衡层数，不超过每层五本', () => {
  assert.deepEqual(getBookShelfPage(books(1), 0).tiers.map(tier => tier.length), [1])
  assert.deepEqual(getBookShelfPage(books(6), 0).tiers.map(tier => tier.length), [3, 3])
  assert.deepEqual(getBookShelfPage(books(11), 0).tiers.map(tier => tier.length), [4, 4, 3])
  assert.deepEqual(getBookShelfPage(books(15), 0).tiers.map(tier => tier.length), [5, 5, 5])
})

test('超过十五本自动翻页，页码越界会收敛', () => {
  const sixteen = books(16)
  const first = getBookShelfPage(sixteen, 0)
  const last = getBookShelfPage(sixteen, 99)
  assert.equal(BOOKS_PER_PAGE, 15)
  assert.equal(first.pageCount, 2)
  assert.deepEqual(first.tiers.flat(), sixteen.slice(0, 15))
  assert.equal(last.page, 1)
  assert.deepEqual(last.tiers, [[16]])
  assert.equal(getBookShelfPage(sixteen, -10).page, 0)
})

test('多页图书不遗漏、不重复', () => {
  const source = books(47)
  const layout = getBookShelfPage(source, 2)
  assert.equal(layout.pageCount, 4)
  assert.equal(layout.startIndex, 30)
  assert.deepEqual(layout.tiers.flat(), source.slice(30, 45))
  assert.equal(getBookShelfPage(source, 3).tiers.flat().length, 2)
})

test('空书架与非法页码保持稳定', () => {
  assert.deepEqual(getBookShelfPage([], Number.NaN), { page: 0, pageCount: 1, startIndex: 0, tiers: [] })
  assert.equal(getBookShelfPage(books(5), Number.POSITIVE_INFINITY).page, 0)
})
