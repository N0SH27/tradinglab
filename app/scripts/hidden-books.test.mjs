import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { getHiddenBookDownload, HIDDEN_BOOKS } from '../src/pages/hidden/hiddenBooks.ts'

test('五本书使用同一份完整书目配置，编号与顺序一致', () => {
  assert.equal(HIDDEN_BOOKS.length, 5)
  assert.deepEqual(HIDDEN_BOOKS.map(book => book.index), ['01', '02', '03', '04', '05'])
  for (const book of HIDDEN_BOOKS) {
    assert.ok(book.id && book.title && book.spineTitle && book.cover)
    assert.ok(book.summary && book.paragraphs.length > 0 && book.prompts.length > 0)
    assert.match(book.cover, /^\/hidden\/books\/.+\.webp$/)
  }
})

test('只有已经配置的站内 PDF 才生成下载信息', () => {
  const configured = HIDDEN_BOOKS.filter(book => getHiddenBookDownload(book) !== null)
  assert.deepEqual(configured.map(book => book.id), ['true-meaning-of-cycles'])
  for (const book of configured) {
    const download = getHiddenBookDownload(book)
    assert.ok(download)
    const file = new URL(`../public${download.href}`, import.meta.url)
    assert.equal(fs.existsSync(file), true)
    assert.ok(fs.statSync(file).size > 0)
  }
  assert.deepEqual(
    getHiddenBookDownload({ pdf: '/hidden/books/周期真实义-涛动周期录.pdf' }),
    { href: '/hidden/books/周期真实义-涛动周期录.pdf', fileName: '周期真实义-涛动周期录.pdf' },
  )
  assert.deepEqual(
    getHiddenBookDownload({ pdf: '  /hidden/books/reading-notes.pdf  ' }),
    { href: '/hidden/books/reading-notes.pdf', fileName: 'reading-notes.pdf' },
  )
})

test('缺失、空值和外部地址不会形成下载入口', () => {
  const rejected = [
    undefined,
    '',
    '   ',
    'https://example.com/book.pdf',
    '//example.com/book.pdf',
    '/hidden/other/book.pdf',
    '/hidden/books/../secret.pdf',
    '/hidden/books/%2e%2e/secret.pdf',
    '/hidden/books/book.pdf?download=1',
    '/hidden/books/book.txt',
    '/hidden/books/book.pdf/extra',
    '/hidden/books/book\\secret.pdf',
  ]
  for (const pdf of rejected) assert.equal(getHiddenBookDownload({ pdf }), null, String(pdf))
})
