#!/usr/bin/env node
/* ─────────────────────────────────────────────
 * 数据层事前校验：编辑 domains/*.ts 后先跑 `npm run check`，
 * 把「数组写空、字段名打错、互链悬空」拦在构建之前。
 * 与渲染层的 ErrorBoundary 构成「事前校验 + 事后兜底」双保险。
 *
 * 用法：node scripts/check-data.mjs
 * 退出码：0 全部通过；1 有失败项。
 * ───────────────────────────────────────────── */

import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const tmp = mkdtempSync(join(tmpdir(), 'hsn-check-'))

let pass = 0
let fail = 0
const ok = (msg) => { pass++; console.log(`  ✓ ${msg}`) }
const bad = (msg) => { fail++; console.log(`  ✗ ${msg}`) }

try {
  // 用 esbuild 把 barrel 打成 CJS，再 require 进来做运行时断言
  const out = join(tmp, 'content.cjs')
  execFileSync(join(root, 'node_modules', '.bin', 'esbuild'), [
    join(root, 'src/data/content.ts'),
    '--bundle', '--format=cjs', '--platform=node',
    `--outfile=${out}`, '--log-level=error',
  ])
  const d = require(out)

  const thesisIds = new Set(d.THESES.map((t) => t.id))
  const nodeIds = new Set(d.INDUSTRY_MAP.nodes.map((n) => n.id))

  // ── 1. 非空 ──
  console.log('\n[1] 非空')
  d.THESES.length > 0 ? ok(`THESES ${d.THESES.length} 篇`) : bad('THESES 为空（Home 页将无内容）')
  d.INDUSTRY_MAP.nodes.length > 0 ? ok(`地图节点 ${d.INDUSTRY_MAP.nodes.length} 个`) : bad('INDUSTRY_MAP.nodes 为空')
  d.ESSAYS.length > 0 ? ok(`文集 ${d.ESSAYS.length} 篇`) : bad('ESSAYS 为空')
  d.ACT_COUNT ?? Object.keys(d.ACTS).length ? ok(`ACTS ${Object.keys(d.ACTS).length} 幕`) : bad('ACTS 为空')

  // ── 2. 命题必填字段 ──
  console.log('\n[2] 命题字段')
  for (const t of d.THESES) {
    const miss = ['id', 'no', 'title', 'industry', 'probability', 'window', 'counter']
      .filter((k) => t[k] === undefined || t[k] === '')
    miss.length === 0 ? ok(`${t.id}`) : bad(`${t.id ?? '?'} 缺字段: ${miss.join(', ')}`)
    if (typeof t.probability !== 'number' || t.probability < 0 || t.probability > 100) {
      bad(`${t.id} probability 越界: ${t.probability}`)
    }
    if (!t.conflict?.although || !t.conflict?.but) bad(`${t.id} conflict 不完整`)
    if (!Array.isArray(t.revisions)) bad(`${t.id} revisions 不是数组`)
  }

  // ── 3. 互链：命题 nodes ↔ 地图 theses ──
  console.log('\n[3] 命题 ↔ 地图互链')
  for (const t of d.THESES) {
    for (const nid of t.nodes ?? []) {
      nodeIds.has(nid) ? ok(`${t.id} → ${nid}`) : bad(`${t.id} 引用了不存在的节点 "${nid}"`)
    }
  }
  for (const n of d.INDUSTRY_MAP.nodes) {
    for (const tid of n.theses ?? []) {
      thesisIds.has(tid) ? ok(`节点 ${n.id} → ${tid}`) : bad(`节点 ${n.id} 引用了不存在的命题 "${tid}"`)
    }
  }

  // ── 4. 地图节点字段 ──
  console.log('\n[4] 地图节点字段')
  const stateOk = new Set(['yang', 'yin', 'turn'])
  const valOk = new Set(['stretched', 'fair', 'washed'])
  for (const n of d.INDUSTRY_MAP.nodes) {
    const errs = []
    if (!stateOk.has(n.state)) errs.push(`state=${n.state}`)
    if (!valOk.has(n.valuation)) errs.push(`valuation=${n.valuation}`)
    if (typeof n.x !== 'number' || typeof n.y !== 'number') errs.push('坐标缺失')
    if (!n.penetration) errs.push('penetration 缺失')
    if (!n.stageFocus) errs.push('stageFocus 缺失')
    errs.length === 0 ? ok(n.id) : bad(`${n.id}: ${errs.join(' / ')}`)
  }

  // ── 5. 地图边引用 ──
  console.log('\n[5] 地图连线')
  for (const [a, b] of d.MAP_EDGES) {
    ;(nodeIds.has(a) && nodeIds.has(b)) ? ok(`${a}—${b}`) : bad(`连线引用了不存在的节点: ${a}—${b}`)
  }

  // ── 6. 文集结构节点 ──
  console.log('\n[6] 文集结构')
  const typeOk = new Set(['p', 'h', 'quote'])
  for (const e of d.ESSAYS) {
    const errs = []
    if (!Array.isArray(e.body) || e.body.length === 0) errs.push('body 为空')
    else for (const blk of e.body) {
      if (!typeOk.has(blk.type)) errs.push(`未知节点 type="${blk.type}"`)
      if (typeof blk.text !== 'string' || !blk.text) errs.push('空 text')
    }
    if (e.readTime <= 0) errs.push('readTime 异常')
    errs.length === 0 ? ok(`${e.id}（${e.body.filter((b) => b.type === 'h').length} 节）`) : bad(`${e.id}: ${[...new Set(errs)].join(' / ')}`)
  }

  // ── 7. 时代标尺 ──
  console.log('\n[7] 时代标尺')
  const era = d.MAP_ERA
  era && era.current >= 0 && era.current <= era.stages.length - 1
    ? ok(`current=${era.current} / ${era.stages.length - 1}`)
    : bad(`MAP_ERA.current 越界: ${era?.current}`)

  // ── 8. 站内相关链接 ──
  console.log('\n[8] 文集延伸链接')
  const validPaths = new Set(['/manifesto', '/system', '/thesis', '/essays', '/map', '/cycle', '/dimensions', '/wuwei', '/framework', '/journal'])
  for (const e of d.ESSAYS) {
    for (const r of e.related ?? []) {
      validPaths.has(r.path) ? ok(`${e.id} → ${r.path}`) : bad(`${e.id} 延伸链接无效: ${r.path}`)
    }
  }

  // ── 9. NOW 观察（V2-05 T-2）──
  console.log('\n[9] NOW 观察')
  Array.isArray(d.OBSERVATIONS) ? ok(`OBSERVATIONS ${d.OBSERVATIONS.length} 条`) : bad('OBSERVATIONS 缺失')
  for (const o of d.OBSERVATIONS ?? []) {
    const errs = []
    if (!o.id || !o.title || !o.summary || !o.date) errs.push('必填字段缺失')
    if (o.mapNodeId && !nodeIds.has(o.mapNodeId)) errs.push(`mapNodeId 悬空: ${o.mapNodeId}`)
    if (o.thesisId && !thesisIds.has(o.thesisId)) errs.push(`thesisId 悬空: ${o.thesisId}`)
    errs.length === 0 ? ok(o.id) : bad(`${o.id ?? '?'}: ${errs.join(' / ')}`)
  }

  // ── 10. 日志结构化 Revision（V2-05 T-3）──
  console.log('\n[10] 日志结构化字段')
  for (const entry of d.JOURNAL ?? []) {
    for (const it of entry.items ?? []) {
      const hasP = it.previousConviction !== undefined
      const hasC = it.currentConviction !== undefined
      if (hasP !== hasC) { bad(`${entry.date} ${it.target}: previous/current 必须成对出现`); continue }
      if (hasP) {
        const inRange = (v) => typeof v === 'number' && v >= 0 && v <= 100
        ;(inRange(it.previousConviction) && inRange(it.currentConviction))
          ? ok(`${entry.date} ${it.target}: ${it.previousConviction} → ${it.currentConviction}`)
          : bad(`${entry.date} ${it.target}: conviction 越界`)
      }
      if (it.thesisId !== undefined) {
        thesisIds.has(it.thesisId) ? ok(`${entry.date} ${it.target} → ${it.thesisId}`) : bad(`${entry.date} ${it.target}: thesisId 悬空: ${it.thesisId}`)
      }
    }
  }
} catch (err) {
  bad(`数据文件无法解析：${err.message}`)
  console.error(err)
} finally {
  rmSync(tmp, { recursive: true, force: true })
}

console.log(`\n${fail === 0 ? '✓' : '✗'} 通过 ${pass} 项，失败 ${fail} 项\n`)
process.exit(fail === 0 ? 0 : 1)
