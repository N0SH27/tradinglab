import assert from 'node:assert/strict'
import test from 'node:test'
import { getHiddenBookDownload, HIDDEN_BOOK_RELEASE_PATH, HIDDEN_BOOKS } from '../src/pages/hidden/hiddenBooks.ts'

test('十五本书使用同一份完整书目配置，编号与顺序一致', () => {
  assert.equal(HIDDEN_BOOKS.length, 15)
  assert.deepEqual(HIDDEN_BOOKS.map(book => book.index), ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15'])
  for (const book of HIDDEN_BOOKS) {
    assert.ok(book.id && book.title && book.spineTitle && book.cover)
    assert.ok(book.summary && book.paragraphs.length > 0 && book.prompts.length > 0)
    assert.match(book.cover, /^\/hidden\/books\/.+\.webp$/)
  }
})

test('只有 books-v1 中已配置的十一份 PDF 才生成下载信息', () => {
  const configured = HIDDEN_BOOKS.filter(book => getHiddenBookDownload(book) !== null)
  assert.deepEqual(configured.map(book => book.id), [
    'true-meaning-of-cycles',
    'hive-mind',
    'poor-economics',
    'tech-revolutions-finance',
    'trading-for-a-living',
    'too-big-to-fail',
    'psychology-of-money',
    'fogg-behavior-model',
    'behavioral-finance',
    'investment-psychology',
    'behavioral-investing-principles',
  ])
  assert.deepEqual(configured.map(book => getHiddenBookDownload(book)?.fileName), [
    'zhou-jintao-cycle-collection.pdf',
    'hive-mind.pdf',
    'poor-economics.pdf',
    'tech-revolutions-finance.pdf',
    'trading-for-a-living.pdf',
    'too-big-to-fail.pdf',
    'psychology-of-money.pdf',
    'fogg-behavior-model.pdf',
    'behavioral-finance.pdf',
    'investment-psychology.pdf',
    'behavioral-investing-principles.pdf',
  ])
  for (const book of configured) {
    const download = getHiddenBookDownload(book)
    assert.ok(download)
    assert.equal(download.href, `${HIDDEN_BOOK_RELEASE_PATH}${download.fileName}`)
  }
  assert.deepEqual(
    getHiddenBookDownload({ pdf: `  ${HIDDEN_BOOK_RELEASE_PATH}reading-notes.pdf  ` }),
    { href: `${HIDDEN_BOOK_RELEASE_PATH}reading-notes.pdf`, fileName: 'reading-notes.pdf' },
  )
})

test('缺失、空值、站内路径和非白名单附件不会形成下载入口', () => {
  const rejected = [
    undefined,
    '',
    '   ',
    'https://example.com/book.pdf',
    '//example.com/book.pdf',
    '/hidden/books/book.pdf',
    `${HIDDEN_BOOK_RELEASE_PATH.replace('books-v1', 'books-v2')}book.pdf`,
    `${HIDDEN_BOOK_RELEASE_PATH.replace('/N0SH27/', '/other/')}book.pdf`,
    `${HIDDEN_BOOK_RELEASE_PATH}../secret.pdf`,
    `${HIDDEN_BOOK_RELEASE_PATH}%2e%2e/secret.pdf`,
    `${HIDDEN_BOOK_RELEASE_PATH}book.pdf?download=1`,
    `${HIDDEN_BOOK_RELEASE_PATH}book.pdf#preview`,
    `${HIDDEN_BOOK_RELEASE_PATH}book.txt`,
    `${HIDDEN_BOOK_RELEASE_PATH}book.pdf/extra`,
    `${HIDDEN_BOOK_RELEASE_PATH}book\\secret.pdf`,
    `${HIDDEN_BOOK_RELEASE_PATH}.evil/book.pdf`,
  ]
  for (const pdf of rejected) assert.equal(getHiddenBookDownload({ pdf }), null, String(pdf))
})
