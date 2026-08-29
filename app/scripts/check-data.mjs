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
import { mkdtempSync, rmSync, readdirSync, readFileSync } from 'node:fs'
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
  // （ACTS 断言已随 V1 dead export 一并移除——Track B · B2-5，222 → 221 为预期变化）

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
  const validPaths = new Set(['/manifesto', '/system', '/thesis', '/essays', '/map', '/cycle', '/dimensions', '/wuwei', '/framework', '/journal', '/method'])
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

  // ── 10. Journal 叙事层 SSOT 防回归（V2-06-02 OD-2）──
  console.log('\n[10] Journal 不得持有 conviction 字段')
  for (const entry of d.JOURNAL ?? []) {
    for (const it of entry.items ?? []) {
      ;(it.previousConviction === undefined && it.currentConviction === undefined)
        ? ok(`${entry.date} ${it.target}: 无 conviction 字段`)
        : bad(`${entry.date} ${it.target}: conviction 字段回流（事实层只许在 Ledger）`)
      if (it.thesisId !== undefined) {
        thesisIds.has(it.thesisId) ? ok(`${entry.date} ${it.target} → ${it.thesisId}`) : bad(`${entry.date} ${it.target}: thesisId 悬空: ${it.thesisId}`)
      }
    }
  }

  // ── 11. Belief Ledger（V2-06-02：conviction 变化唯一事实源）──
  console.log('\n[11] Belief Ledger')
  Array.isArray(d.LEDGER) ? ok(`LEDGER ${d.LEDGER.length} 条`) : bad('LEDGER 缺失')
  const revIds = new Set()
  const lastCurrentByThesis = new Map()
  for (const r of d.LEDGER ?? []) {
    const errs = []
    if (!r.id || !r.date || !r.thesisId || !r.reason) errs.push('必填字段缺失')
    if (r.thesisId && !thesisIds.has(r.thesisId)) errs.push(`thesisId 悬空: ${r.thesisId}`)
    const inRange = (v) => typeof v === 'number' && v >= 0 && v <= 100
    if (!inRange(r.previous) || !inRange(r.current)) errs.push(`conviction 越界: ${r.previous} → ${r.current}`)
    if (!/^\d{4}\.\d{2}\.\d{2}$/.test(r.date ?? '')) errs.push(`date 格式异常: ${r.date}`)
    if ('delta' in r) errs.push('delta 不得持久化')
    if ('direction' in r) errs.push('direction 不得持久化')
    // Rule 01（V2-06-02 Review）：Revision 是 Event 不是 Daily Snapshot——
    // 唯一性只要求 id 全局唯一；同一命题同日允许多条入账。
    if (revIds.has(r.id)) errs.push(`id 重复: ${r.id}`)
    revIds.add(r.id)
    errs.length === 0 ? ok(`${r.id}: ${r.previous} → ${r.current}`) : bad(`${r.id ?? '?'}: ${[...new Set(errs)].join(' / ')}`)
    // 记录每命题末条（按 date 字典序 = 时间序）用于一致性断言
    const prev = lastCurrentByThesis.get(r.thesisId)
    if (!prev || r.date > prev.date) lastCurrentByThesis.set(r.thesisId, { date: r.date, current: r.current })
  }
  // 一致性：Thesis.probability 必须等于 Ledger 末条 current（防账本与现状漂移）
  console.log('\n[12] Ledger ↔ Thesis 一致性')
  for (const t of d.THESES) {
    const last = lastCurrentByThesis.get(t.id)
    if (!last) continue // 无账本记录的命题不断言（渐进补录）
    last.current === t.probability
      ? ok(`${t.id}: probability ${t.probability} = Ledger 末条`)
      : bad(`${t.id}: probability ${t.probability} ≠ Ledger 末条 current ${last.current}（${last.date}）`)
  }

  // ── 13. Thesis 扩展字段（V2-06-03）──
  console.log('\n[13] Thesis 扩展字段')
  const statusOk = new Set(['active', 'closed', 'invalidated'])
  for (const t of d.THESES) {
    const errs = []
    if (t.status !== undefined && !statusOk.has(t.status)) errs.push(`status 非法: ${t.status}`)
    if ('polarity' in t) errs.push('polarity 不得字段化（唯一事实源 = MapNode.state）')
    for (const key of ['assumptions', 'invalidation']) {
      if (t[key] !== undefined) {
        ;(Array.isArray(t[key]) && t[key].length > 0 && t[key].every((s) => typeof s === 'string' && s.trim().length > 0))
          ? ok(`${t.id}.${key} ${t[key].length} 条`)
          : errs.push(`${key} 结构非法（须为非空字符串数组）`)
      }
    }
    // Rule 03：legacy revisions 只读冻结——条目只允许 {date, note} 两键，禁止夹带 conviction 字段
    for (const r of t.revisions ?? []) {
      const extra = Object.keys(r).filter((k) => k !== 'date' && k !== 'note')
      if (extra.length > 0) errs.push(`revisions 条目夹带字段: ${extra.join(',')}`)
    }
    errs.length === 0 ? ok(t.id) : bad(`${t.id}: ${[...new Set(errs)].join(' / ')}`)
  }

  // ── 14–16. 派生层（V2-06-04：CURRENT BELIEF / direction / delta 只能派生）──
  // 注：prompt 的 [18] status 合法性已由 [13] 覆盖。
  const deriveOut = join(tmp, 'ledger.cjs')
  execFileSync(join(root, 'node_modules', '.bin', 'esbuild'), [
    join(root, 'src/data/ledger.ts'),
    '--bundle', '--format=cjs', '--platform=node',
    `--outfile=${deriveOut}`, '--log-level=error',
  ])
  const derive = require(deriveOut)

  console.log('\n[14] deriveCurrentBelief 一致性（UI 当前信念唯一入口）')
  for (const t of d.THESES) {
    const belief = derive.deriveCurrentBelief(t, d.LEDGER)
    belief === t.probability
      ? ok(`${t.id}: derive = ${belief}`)
      : bad(`${t.id}: deriveCurrentBelief ${belief} ≠ probability ${t.probability}（迁移期快照漂移）`)
  }

  console.log('\n[15] direction 派生正确性')
  const dirCases = [
    [{ previous: 60, current: 70 }, 'up'],
    [{ previous: 70, current: 60 }, 'down'],
    [{ previous: 60, current: 60 }, 'confirm'],
  ]
  for (const [fixture, expected] of dirCases) {
    derive.directionOf(fixture) === expected
      ? ok(`directionOf(${fixture.previous}→${fixture.current}) = ${expected}`)
      : bad(`directionOf(${fixture.previous}→${fixture.current}) 应=${expected} 实=${derive.directionOf(fixture)}`)
  }
  for (const r of d.LEDGER ?? []) {
    const expected = r.current > r.previous ? 'up' : r.current < r.previous ? 'down' : 'confirm'
    derive.directionOf(r) === expected
      ? ok(`${r.id}: ${expected}`)
      : bad(`${r.id}: direction 派生错误`)
  }

  console.log('\n[16] delta 派生正确性')
  derive.deltaOf({ previous: 65, current: 72 }) === 7
    ? ok('deltaOf(65→72) = 7')
    : bad(`deltaOf 合成用例失败: ${derive.deltaOf({ previous: 65, current: 72 })}`)
  for (const r of d.LEDGER ?? []) {
    derive.deltaOf(r) === r.current - r.previous
      ? ok(`${r.id}: delta ${derive.deltaOf(r)}`)
      : bad(`${r.id}: delta 派生错误`)
  }

  // ── 17. UI 不得从旧字段/文本生成 conviction history（静态扫描）──
  console.log('\n[17] UI 静态扫描（禁旧 conviction 字段与文本提取）')
  const pagesDir = join(root, 'src/pages')
  const banned = ['previousConviction', 'currentConviction', 'note.match(', 'note.split(']
  const pageSrc = new Map()
  for (const f of readdirSync(pagesDir).filter((f) => f.endsWith('.tsx'))) {
    const src = readFileSync(join(pagesDir, f), 'utf8')
    pageSrc.set(f, src)
    const hit = banned.filter((b) => src.includes(b))
    hit.length === 0 ? ok(f) : bad(`${f}: 命中禁用模式 ${hit.join(', ')}`)
  }

  // ── 18. Current Belief 确定性排序（V2-06-05 R-01：不依赖 LEDGER 数组物理顺序）──
  console.log('\n[18] Current Belief 确定性排序（R-01）')
  const mk = (id, date, previous, current) => ({ id, date, thesisId: 't', previous, current, reason: 'x' })
  const r0 = mk('rev-t-20260701', '2026.07.01', 45, 50)
  const r1 = mk('rev-t-20260801', '2026.08.01', 50, 60)
  const r2 = mk('rev-t-20260801-2', '2026.08.01', 60, 55) // 同日更晚事件（序号大者）
  const fakeThesis = { id: 't', probability: 50 }
  const orders = [[r0, r1, r2], [r2, r1, r0], [r1, r2, r0]]
  const beliefs = orders.map((arr) => derive.deriveCurrentBelief(fakeThesis, arr))
  beliefs.every((b) => b === 55)
    ? ok('同日多条 + 三种物理顺序 → Current Belief 恒为当日序号大者')
    : bad(`确定性失败: ${beliefs.join(',')}`)
  const seqIds = derive.revisionsOf([r2, r0, r1], 't').map((r) => r.id).join(',')
  seqIds === 'rev-t-20260701,rev-t-20260801,rev-t-20260801-2'
    ? ok('revisionsOf = date 升序 + 同日 id 序号升序')
    : bad(`revisionsOf 次序异常: ${seqIds}`)
  derive.lastRevisedOf([r2, r1, r0], 't', 'X') === '2026.08.01'
    ? ok('lastRevisedOf 与物理顺序无关')
    : bad('lastRevisedOf 依赖物理顺序')
  // 真实数据：同命题同日多条入账时，id 序号必须 1..n 连续（否则 Current Belief 不确定）
  const byDay = new Map()
  for (const r of d.LEDGER ?? []) {
    const key = `${r.thesisId}|${r.date}`
    byDay.set(key, [...(byDay.get(key) ?? []), r.id])
  }
  let dayGroups = 0
  for (const [key, ids] of byDay) {
    if (ids.length <= 1) continue
    dayGroups++
    const seqs = ids
      .map((id) => { const m = /-\d{8}-(\d+)$/.exec(id); return m ? parseInt(m[1], 10) : 1 })
      .sort((a, b) => a - b)
    const expect = Array.from({ length: ids.length }, (_, i) => i + 1)
    JSON.stringify(seqs) === JSON.stringify(expect)
      ? ok(`${key}: ${ids.length} 条同日记录序号连续`)
      : bad(`${key}: 同日 ${ids.length} 条记录序号 ${seqs.join(',')} 不连续——Current Belief 不确定`)
  }
  dayGroups === 0 ? ok('当前无同命题同日多条记录（规则待命）') : null

  // ── 19. Archive 语义（active 不进存档；分区不重不漏）──
  console.log('\n[19] Archive 语义')
  const activeSet = d.THESES.filter((t) => (t.status ?? 'active') === 'active')
  const archivedSet = d.THESES.filter((t) => t.status === 'closed' || t.status === 'invalidated')
  activeSet.length + archivedSet.length === d.THESES.length
    ? ok(`分区完备：${activeSet.length} active + ${archivedSet.length} archived = ${d.THESES.length}`)
    : bad(`分区不完备：${activeSet.length} + ${archivedSet.length} ≠ ${d.THESES.length}`)
  archivedSet.every((t) => t.status !== 'active')
    ? ok('Archive 不含 active 命题')
    : bad('Archive 混入 active 命题')

  // ── 20. 聚合页与详情页派生入口一致（禁止页面内重复实现业务逻辑）──
  console.log('\n[20] 聚合页 / 详情页 / 首页派生入口一致')
  const stripComments = (src) =>
    src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')
  for (const f of ['Thesis.tsx', 'ThesisDetail.tsx', 'Home.tsx', 'Journal.tsx']) {
    const src = pageSrc.get(f)
    if (!src) { bad(`${f}: 未找到`); continue }
    const code = stripComments(src)
    const errs = []
    if (f !== 'Journal.tsx' && !code.includes('deriveCurrentBelief')) errs.push('未使用 deriveCurrentBelief')
    if (f !== 'Journal.tsx' && !code.includes('lastRevisedOf')) errs.push('未使用 lastRevisedOf')
    if (/current\s*-\s*previous/.test(code)) errs.push('内联计算 delta（必须走 deltaOf）')
    if (/\.probability\b/.test(code)) errs.push('直接读取 .probability 字段（Current Belief 必须走 deriveCurrentBelief）')
    errs.length === 0 ? ok(f) : bad(`${f}: ${errs.join(' / ')}`)
  }
  pageSrc.get('Thesis.tsx')?.includes('deriveThesisPolarity')
    ? ok('Thesis.tsx: polarity 经 deriveThesisPolarity（无字段化）')
    : bad('Thesis.tsx: polarity 未走 deriveThesisPolarity')

  // ── 21–26. Context History（V2-C1：Context Revision Boundary，18/19 号文契约）──
  const canon = (v) =>
    Array.isArray(v) ? v.map(canon)
      : v && typeof v === 'object'
        ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])]))
        : v
  const deepEq = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b))

  console.log('\n[21] CONTEXT_HISTORY 结构与 id 纪律')
  const hist = d.CONTEXT_HISTORY
  Array.isArray(hist) && hist.length > 0 ? ok(`CONTEXT_HISTORY ${hist.length} 条`) : bad('CONTEXT_HISTORY 缺失或为空')
  const ctxIds = new Set()
  for (const h of hist ?? []) {
    const errs = []
    if (!/^ctx-\d{8}(-\d+)?$/.test(h.id ?? '')) errs.push(`id 格式异常: ${h.id}`)
    if (!/^\d{4}\.\d{2}\.\d{2}$/.test(h.date ?? '')) errs.push(`date 格式异常: ${h.date}`)
    if (!h.reason || !h.reason.trim()) errs.push('reason 缺失（写不出 reason 的变化不是 Revision）')
    if (('snapshot' in h) === ('changes' in h)) errs.push('snapshot 与 changes 必须恰居其一')
    if ('delta' in h || 'direction' in h || 'previous' in h) errs.push('派生事实不得持久化（delta/direction/previous）')
    if (ctxIds.has(h.id)) errs.push(`id 重复: ${h.id}`)
    ctxIds.add(h.id)
    errs.length === 0 ? ok(h.id) : bad(`${h.id ?? '?'}: ${[...new Set(errs)].join(' / ')}`)
  }
  // 同日多条时 id 序号 1..n 连续（fold 确定性前提）
  const ctxByDay = new Map()
  for (const h of hist ?? []) ctxByDay.set(h.date, [...(ctxByDay.get(h.date) ?? []), h.id])
  for (const [day, ids] of ctxByDay) {
    if (ids.length <= 1) continue
    const seqs = ids.map((id) => { const m = /-\d{8}-(\d+)$/.exec(id); return m ? parseInt(m[1], 10) : 1 }).sort((a, b) => a - b)
    JSON.stringify(seqs) === JSON.stringify(ids.map((_, i) => i + 1))
      ? ok(`${day}: ${ids.length} 条同日记录序号连续`)
      : bad(`${day}: 同日序号 ${seqs.join(',')} 不连续——fold 不确定`)
  }

  console.log('\n[22] append-only API 面（锁 2：不存在 update/delete/rewrite 入口）')
  const mutationApi = Object.keys(d).filter((k) => /(update|delete|remove|rewrite)/i.test(k))
  mutationApi.length === 0
    ? ok('barrel 导出中无任何 mutation API')
    : bad(`发现 mutation API: ${mutationApi.join(', ')}`)
  ;['foldContext', 'orderedHistory', 'currentContext', 'contextHistory'].every((f) => typeof d[f] === 'function')
    ? ok('派生层四函数齐备（foldContext / orderedHistory / currentContext / contextHistory）')
    : bad('派生层函数缺失')

  console.log('\n[23] fold 语义合成用例（Sparse Inheritance / 确定性 / initial 唯一）')
  const fxNode = { state: 'yang', valuation: 'fair', penetration: 'p', stageFocus: 'f', stateNote: 's', observation: 'o' }
  const fx1 = { id: 'ctx-20260101', date: '2026.01.01', reason: 'init', snapshot: { map: { era: { current: 1, note: 'n' }, nodes: { a: fxNode } }, now: { observations: [] }, cycle: { industries: { X: '萌芽' } } } }
  const fx2 = { id: 'ctx-20260201', date: '2026.02.01', reason: 'r2', changes: { map: { nodes: { a: { state: 'yin' } } } } }
  const fx3 = { id: 'ctx-20260201-2', date: '2026.02.01', reason: 'r3', changes: { map: { era: { current: 2 } }, cycle: { industries: { X: '泡沫' } } } }
  const fxFold = d.foldContext([fx3, fx1, fx2]) // 乱序物理输入
  fxFold.map.nodes.a.state === 'yin' && fxFold.map.nodes.a.valuation === 'fair'
    ? ok('Sparse Inheritance：v2 只改 state，valuation 继承 initial')
    : bad(`Sparse Inheritance 失败: ${JSON.stringify(fxFold.map.nodes.a)}`)
  fxFold.map.era.current === 2 && fxFold.cycle.industries.X === '泡沫'
    ? ok('同日多条按 id 序号次序叠加（-2 为当日更晚事件）')
    : bad('同日序号叠加次序异常')
  deepEq(d.foldContext([fx1, fx2, fx3]), d.foldContext([fx3, fx2, fx1]))
    ? ok('fold 不依赖数组物理顺序（确定性）')
    : bad('fold 依赖物理顺序')
  let threwNoInitial = false
  try { d.foldContext([fx2]) } catch { threwNoInitial = true }
  threwNoInitial ? ok('缺 initial 直接抛错') : bad('缺 initial 未抛错')
  let threwDupSnapshot = false
  try { d.foldContext([fx1, { ...fx1, id: 'ctx-20260301', date: '2026.03.01' }]) } catch { threwDupSnapshot = true }
  threwDupSnapshot ? ok('第二条 snapshot 直接抛错（initial 唯一）') : bad('未拦截第二条 snapshot')
  let folded = null
  try { folded = d.foldContext(hist) } catch (e) { bad(`真实数据 fold 抛错: ${e.message}`) }

  console.log('\n[24] Current fold ↔ 生产当前态一致性（expectedCurrent === actualCurrent）')
  if (folded) {
    const actual = {
      map: {
        era: { current: d.MAP_ERA.current, note: d.MAP_ERA.note },
        nodes: Object.fromEntries(d.INDUSTRY_MAP.nodes.map((n) => [n.id, {
          state: n.state, valuation: n.valuation, penetration: n.penetration,
          stageFocus: n.stageFocus, stateNote: n.stateNote, observation: n.observation,
        }])),
      },
      now: { observations: d.OBSERVATIONS },
      cycle: { industries: Object.fromEntries(d.CYCLE_INDUSTRIES.map((x) => [x.name, x.stage])) },
    }
    deepEq(folded, actual)
      ? ok('fold(CONTEXT_HISTORY) === map/now/cycle 当前态（无漂移）')
      : bad('fold 结果与生产当前态漂移——expectedCurrent !== actualCurrent')
  }

  console.log('\n[25] No-op / Sparse 真实数据断言')
  if (folded) {
    const ordered = d.orderedHistory(hist)
    if (ordered.length === 1) {
      ok('当前仅 initial version（无多余 Version，No-op 规则待命）')
    } else {
      for (let i = 1; i < ordered.length; i++) {
        deepEq(d.foldContext(ordered.slice(0, i + 1)), d.foldContext(ordered.slice(0, i)))
          ? bad(`${ordered[i].id}: 入账后状态未变——No-op 虚假 Version`)
          : ok(`${ordered[i].id}: 入账产生真实状态变化`)
      }
    }
  }

  console.log('\n[26] Initial Migration 诚信')
  const initial = d.orderedHistory(hist)[0]
  const snapCount = (hist ?? []).filter((h) => 'snapshot' in h).length
  snapCount === 1 && initial && 'snapshot' in initial
    ? ok(`initial = ${initial.id}（唯一全量快照，确定性次序首条）`)
    : bad(`initial 异常：snapshot 条目 ${snapCount} 条`)
  if (initial?.snapshot) {
    ;(hist ?? []).every((h) => h.date >= initial.date)
      ? ok('无任何 Version 的 date 早于 initial（不倒填历史）')
      : bad('存在早于 initial 的 Version——伪造历史')
    const s = initial.snapshot
    const nodeKeys = Object.keys(s.map.nodes)
    const nodeFieldsOk = nodeKeys.every((k) =>
      ['state', 'valuation', 'penetration', 'stageFocus', 'stateNote', 'observation']
        .every((f) => s.map.nodes[k][f] !== undefined && s.map.nodes[k][f] !== ''))
    nodeKeys.length === d.INDUSTRY_MAP.nodes.length && nodeFieldsOk
      ? ok(`initial 快照完整：${nodeKeys.length} 节点 × 6 语义字段`)
      : bad('initial 快照节点数或字段不完整')
    s.now.observations.length === d.OBSERVATIONS.length &&
    Object.keys(s.cycle.industries).length === d.CYCLE_INDUSTRIES.length &&
    typeof s.map.era.current === 'number' && !!s.map.era.note
      ? ok(`observations ${s.now.observations.length} 条 / industries ${Object.keys(s.cycle.industries).length} 个 / era 齐备`)
      : bad('initial 快照 now/cycle/era 不完整')
  }

  // ── 27–32. Essay Versions（V2-C4：Work Memory，20/21 号文契约）──
  const evs = d.ESSAY_VERSIONS
  const essayIds = new Set(d.ESSAYS.map((e) => e.id))
  // Work Content 视图（一致性断言唯一范围；metadata 不进入 equality——LOCK-C4-02）
  const workContentOf = (v) => ({ title: v.title, subtitle: v.subtitle, category: v.category, body: v.body })

  console.log('\n[27] ESSAY_VERSIONS 结构与 identity 纪律')
  Array.isArray(evs) && evs.length >= 6 ? ok(`ESSAY_VERSIONS ${evs.length} 条`) : bad('ESSAY_VERSIONS 缺失或少于 6 条')
  const evKeys = new Set()
  for (const v of evs ?? []) {
    const errs = []
    if (!essayIds.has(v.essayId)) errs.push(`essayId 悬空: ${v.essayId}`)
    if (!Number.isInteger(v.version) || v.version < 1) errs.push(`version 非法: ${v.version}`)
    if (!/^\d{4}\.\d{2}\.\d{2}$/.test(v.date ?? '')) errs.push(`date 格式异常: ${v.date}`)
    if (!v.reason || !v.reason.trim()) errs.push('reason 缺失（写不出 reason 的改动不是 Version）')
    for (const k of ['thesisId', 'themeId', 'authorId', 'publicationId', 'distributionId']) {
      if (k in v) errs.push(`关联字段禁挂: ${k}`)
    }
    for (const k of ['delta', 'direction', 'previous', 'diff']) {
      if (k in v) errs.push(`派生事实不得持久化: ${k}`)
    }
    const key = `${v.essayId}#${v.version}`
    if (evKeys.has(key)) errs.push(`identity 重复: ${key}`)
    evKeys.add(key)
    errs.length === 0 ? ok(`${v.essayId} v${v.version}`) : bad(`${v.essayId ?? '?'}#${v.version ?? '?'}: ${[...new Set(errs)].join(' / ')}`)
  }
  for (const id of essayIds) {
    const vs = d.versionsOf(evs ?? [], id).map((v) => v.version)
    const expect = Array.from({ length: vs.length }, (_, i) => i + 1)
    JSON.stringify(vs) === JSON.stringify(expect)
      ? ok(`${id}: version 从 1 严格递增连续（${vs.join(',')}）`)
      : bad(`${id}: version 序列 ${vs.join(',')} 不连续`)
  }

  console.log('\n[28] 快照完整性（Work Content 齐备）')
  const evTypeOk = new Set(['p', 'h', 'quote'])
  for (const v of evs ?? []) {
    const errs = []
    if (!v.title || !v.subtitle || !v.category) errs.push('title/subtitle/category 缺失')
    if (!Array.isArray(v.body) || v.body.length === 0) errs.push('body 为空')
    else for (const b of v.body) {
      if (!evTypeOk.has(b.type)) errs.push(`未知节点 type="${b.type}"`)
      if (typeof b.text !== 'string' || !b.text) errs.push('空 text')
    }
    if (typeof v.readTime !== 'number' || v.readTime <= 0) errs.push('readTime 异常')
    errs.length === 0 ? ok(`${v.essayId} v${v.version}（${v.body.length} 节点）`) : bad(`${v.essayId} v${v.version}: ${[...new Set(errs)].join(' / ')}`)
  }

  console.log('\n[29] latest Version ↔ ESSAYS 当前一致性（Current Source Integrity）')
  for (const e of d.ESSAYS) {
    const latest = d.latestVersionOf(evs ?? [], e.id)
    if (!latest) { bad(`${e.id}: 无任何 Version`); continue }
    deepEq(workContentOf(latest), workContentOf(e))
      ? ok(`${e.id}: latest v${latest.version} Work Content === ESSAYS 当前`)
      : bad(`${e.id}: latest v${latest.version} 与 ESSAYS 当前漂移（expectedWork !== actualWork）`)
  }

  console.log('\n[30] Metadata Equality Integrity（LOCK-C4-02 合成用例）')
  const fxv = evs?.[0]
  if (fxv) {
    const metaShifted = { ...fxv, readTime: 999 }
    deepEq(workContentOf(metaShifted), workContentOf(fxv))
      ? ok('metadata 变化（readTime 999）→ Work Content equality 仍为 true，不产生新 Version')
      : bad('metadata 污染了 Work Content equality')
    let noopViolations = 0
    for (const id of essayIds) {
      const vs = d.versionsOf(evs ?? [], id)
      for (let i = 1; i < vs.length; i++) {
        if (deepEq(workContentOf(vs[i]), workContentOf(vs[i - 1]))) noopViolations++
      }
    }
    noopViolations === 0
      ? ok('No-op：不存在 Work Content 与上一 Version 相同的虚假 Version（当前每篇仅 v1，规则待命）')
      : bad(`发现 ${noopViolations} 个 No-op 虚假 Version`)
  }

  console.log('\n[31] Migration 诚信与排序确定性')
  // 同日迁移断言只约束 C4 迁移批次（reason 以「C4 迁移」开头的 v1）；
  // 迁移之后的新作 v1 = 首次登记，日期独立，仅受下方「不倒填首次发布日」约束。
  const migV1s = (evs ?? []).filter((v) => v.version === 1 && v.reason.startsWith('C4 迁移'))
  const migV1Dates = new Set(migV1s.map((v) => v.date))
  migV1Dates.size === 1
    ? ok(`C4 迁移批次 ${migV1s.length} 篇 v1 同日迁移（${[...migV1Dates][0]}）`)
    : bad(`C4 迁移批次 v1 日期不一致: ${[...migV1Dates].join(', ')}`)
  ;(evs ?? []).every((v) => {
    const e = d.ESSAYS.find((x) => x.id === v.essayId)
    return e && v.date >= e.date
  })
    ? ok('无 Version date 早于对应 Essay.date（不倒填首次发布日）')
    : bad('存在早于首次发布日的 Version——伪造历史')
  const shuffled = [...(evs ?? [])].reverse()
  essayIds.size > 0 && deepEq(
    d.versionsOf(shuffled, fxv?.essayId ?? '').map((v) => v.version),
    d.versionsOf(evs ?? [], fxv?.essayId ?? '').map((v) => v.version),
  )
    ? ok('versionsOf 不依赖数组物理顺序（确定性）')
    : bad('versionsOf 依赖物理顺序')

  console.log('\n[32] Consumer Source Integrity + 机制泄漏扫描')
  const consumerLeak = []
  for (const [f, src] of pageSrc) {
    if (src.includes('essay-versions') || src.includes("data/essay'") || src.includes('ESSAY_VERSIONS')) consumerLeak.push(`pages/${f}`)
  }
  const dataDir = join(root, 'src/data')
  for (const f of readdirSync(dataDir).filter((f) => f.endsWith('.ts'))) {
    if (f === 'essay.ts' || f === 'content.ts') continue
    const src = readFileSync(join(dataDir, f), 'utf8')
    if (src.includes('essay-versions') || src.includes('ESSAY_VERSIONS')) consumerLeak.push(`data/${f}`)
  }
  for (const f of readdirSync(join(dataDir, 'domains')).filter((f) => f.endsWith('.ts'))) {
    if (f === 'essay-versions.ts') continue
    const src = readFileSync(join(dataDir, 'domains', f), 'utf8')
    if (src.includes('essay-versions') || src.includes('ESSAY_VERSIONS')) consumerLeak.push(`domains/${f}`)
  }
  consumerLeak.length === 0
    ? ok('ESSAY_VERSIONS 未改变任何 consumer / 数据源的数据来源（仅 essay.ts 与 barrel 引用）')
    : bad(`ESSAY_VERSIONS 泄漏到: ${consumerLeak.join(', ')}`)
  const c1Mechanism = /\b(fold|sparse|previous|delta|direction|ContextHistory|Ledger)\b/
  for (const f of ['domains/essay-versions.ts', 'essay.ts']) {
    const code = stripComments(readFileSync(join(dataDir, f), 'utf8'))
    const hit = code.match(c1Mechanism)
    !hit ? ok(`${f}: 无 C1 机制泄漏`) : bad(`${f}: 命中 C1 机制标识符 "${hit[1]}"`)
  }
} catch (err) {
  bad(`数据文件无法解析：${err.message}`)
  console.error(err)
} finally {
  rmSync(tmp, { recursive: true, force: true })
}

console.log(`\n${fail === 0 ? '✓' : '✗'} 通过 ${pass} 项，失败 ${fail} 项\n`)
process.exit(fail === 0 ? 0 : 1)
