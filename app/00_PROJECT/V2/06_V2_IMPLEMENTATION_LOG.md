# V2-06 · IMPLEMENTATION LOG — 执行记录与冲突台账

> V2 各阶段的执行记录。新条目加在最上方。
> 冲突格式：CONFLICT / CURRENT RULE / V2 PROPOSAL / RECOMMENDED DECISION。
> 冲突未裁决前，对应功能暂停实施；P0/P1/P2 当前规则优先。

---

## 2026-08-23 · V2-06-00 Brand Canonicalization（裁决 A 落地）

**执行内容**（基线 = V2-06 Milestone Review 工作区状态；品牌清单已核定）：

- **阶段一（3/4 安全项）**：index.html title `HSN · trading-lab` → `TradingLabb · HSN`；
  journal.ts 条目 `target: 'trading-lab'` → `'TradingLabb'`（note 原文零修改）；
  ErrorBoundary console label `[trading-lab]` → `[TradingLabb]`；
- **冲突发现与暂停**：`SITE.name` 被 Header wordmark（Layout.tsx:13，lowercase 渲染）
  与 Footer（:155）直接消费——直接改值会使 Header 退化为 `tradinglabb`，
  Required Change #2 与 AC-03 冲突且 Layout.tsx 不在白名单 → 主动回退 site.ts，
  上报 A/B/C 三选项；ChatGPT 裁决 **A（解耦，授权扩白名单 +Layout.tsx）**；
- **阶段二（裁决 A）**：site.ts `name` → `'TradingLabb'` + 解耦注释；
  Layout.tsx 新增 `HEADER_LOCKUP = 'trading-lab'` 模块级常量（含契约注释），
  Header wordmark 改渲染常量、不再消费 SITE.name；Footer 保持 `· {SITE.name}` 结构，
  随 canonical 自然落地 `HSN · TradingLabb` attribution。

**验证**：check **174/174** ✓；build ✓（index gzip 74.84KB）；lint 无新增 error
（仍仅 InkTransition 既有 1 个）。CDP 真实 Chrome（v20600-header/footer-1440.png）：
title = `TradingLabb · HSN`；Header wordmark `trading-lab` + `by HSN`——
font（IBM Plex Mono）/ 16px / -0.4px tracking / lowercase 逐项与改前一致，像素级不变；
Footer = `HSN · TRADINGLABB`。
grep 分类：D 类 = HEADER_LOCKUP 字面量（授权保留）；E 类 = content.ts barrel 注释；
其余全部 TradingLabb canonical，无单 b 残留；无 B/C 类遗留。

**未做的事**：未动 Header CSS/布局/logo/导航/Homepage/路由/数据结构/journal note/URL/
SEO description/favicon；未顺手修 lint 债；**未 commit、未 push**——等 FINAL CHECK Review。

**冲突**：无新增（阶段一冲突已按裁决 A 解决）。

---

## 2026-08-23 · V2-06 Milestone Review（冻结审查，无代码改动）

**性质**：V2-06-05 Review 裁决的收口阶段——只做审查与登记，不改功能代码，不进入 V2-06-06。

**A · Architecture Freeze（通过）**：
- check **174/174** ✓ 复跑确认；
- conviction 持久化全站仅 `domains/ledger.ts` 一处（grep 验证；`map.ts` 的 `current: 1.8`
  是 MAP_ERA 时代刻度，属另一实体）；
- `deriveCurrentBelief()` 消费点 = Home / Thesis / ThesisDetail 三页（Journal 不显示信念值，
  语义正确）；Map 为例外 → 已登记 G-08；
- `polarity` 字段仅存于 dimensions 域实体与 PolarityTag props，Thesis 零字段化 ✓；
- Ledger / Current Belief / Revision / Thesis / Archive / Polarity / Journal 关系全部稳定。

**B · Product Review（五页统一语言，通过）**：CDP 真实 Chrome 全页截图
v206m-{home,thesis,thesis-compute,journal,map}-1440.png + v206m-map-375.png
（存 v2-05-screenshots/）——Home 七章 / Thesis 注册表 / ThesisDetail 优先级结构 /
Journal 双层 / Map 全部保持 paper·ink·发丝线·衬线展示·等宽数字语言，无 Dashboard 漂移；
六张图全部零横向溢出。

**C · Brand Review（V2-06-00 工作清单）**——`TradingLabb` 为唯一 canonical 拼写
（OD-1 已裁决，`trading·lab BY HSN` 保留为视觉 lockup，不动）：
1. `index.html:8` title `HSN · trading-lab` → 待改；
2. `site.ts:3` `SITE.name: 'trading-lab'` → 待改；
3. `journal.ts:30` 叙事条目 `target: 'trading-lab'`（结构化字段，note 不动）→ 待改；
4. `ErrorBoundary.tsx:22` console 标签 `[trading-lab]` → 低优先，随同阶段处理；
5. 已是 canonical 无需动：`Home.tsx:253` 终幕 `HSN · TRADINGLABB`、
   `Home.tsx:117` `TradingLabb Loop`、header 视觉 lockup。

**登记**：G-08（IndustryMap → Thesis.probability 直读）已写入 08 号契约文档第十节技术债，
Map 阶段统一改走 deriveCurrentBelief()；G-05 继续挂起。

**未做的事**：未改任何功能代码；未做 V2-06-00 品牌统一；**未 commit、未 push**——
等 ChatGPT 的 V2-06-00 执行 Prompt 与用户的 push 许可。

**冲突**：无新增。

---

## 2026-08-23 · V2-06-05 Thesis as Belief Registry

**执行内容**（基线 = V2-06-04 工作区状态；Review 两架构钉死项已裁决）：

- **前置审计**：真实读取 theses.ts / domains/ledger.ts / data/ledger.ts / polarity.ts /
  Thesis.tsx / ThesisDetail.tsx / map.ts / 08 号契约 / 04 号 HOME SPEC / check-data.mjs 后动手；
- **R-01 落地**：`revisionsOf` 排序 = date 升序 + 同日 id 序号（`seqOf` 只匹配
  `-\d{8}-(\d+)$`，防止把日期数字误当序号——check [18] 合成用例当场抓住首版
  `/-(\d+)$/` 误吞日期的真实 bug，修复后全过）；domains/ledger.ts 注释写入
  同日多条入账的 `-N` 序号契约；`deriveCurrentBelief` 注释升级为"确定性排序后的最新
  Revision.current"；
- **Thesis 聚合页全量重写**：手风琴 + 内联详情（含局部 YinYangColumns、证据链、
  修订记录区块）整体退役 → Belief Registry：01 ACTIVE BELIEFS 注册行
  （编号 / ACTIVE / 题名 / 一句核心主张「虽然…——但是…」/ Current Belief /
  PolarityMark / HORIZON / LAST REVISED，整行 `<a>` 进 `#/thesis/:id`）
  + 02 ARCHIVE（closed/invalidated 分组，无数据整区不渲染、不显示"暂无"）；
  新局部组件 PolarityMark（方块字形 + 文字，复用 阳=墨方块/阴=水色空心/turn=朱砂
  语义，非阴阳图形，全站太极仍 ≤2）；06-04 遗留的 YinYangColumns 双实现随
  Thesis.tsx 版退役自然闭环（ThesisDetail 版为唯一实现）；
- **派生入口统一**：注册行 Current Belief / LAST REVISED / Polarity 全部经
  deriveCurrentBelief / lastRevisedOf / deriveThesisPolarity——与 ThesisDetail 同一函数，
  页面内零业务逻辑重复实现；
- **check-data 163 → 174**：[18] 确定性排序（同日多条 × 三种物理顺序恒等、
  revisionsOf 次序、lastRevisedOf 乱序不变、真实数据同日序号连续性待命）、
  [19] Archive 语义（8 active + 0 archived 分区完备、Archive 不含 active）、
  [20] 派生入口一致（四页面必用 canonical 函数、禁内联 `current - previous`、
  禁直读 `.probability`（剥离注释后扫描）、polarity 必走 deriveThesisPolarity）。

**验证**：check **174/174** ✓；build ✓（index gzip 74.83KB）；lint 无新增 error
（仍仅 InkTransition 既有 react-refresh 1 个）。
CDP 真实 Chrome：v20605-thesis-1440/375.png 整页截图 + v20605-thesis-to-detail-1440.png
（存工作区 v2-05-screenshots/）；抽查全过——ACTIVE BELIEFS 呈现、ARCHIVE 闸门
（无 "What I once believed"、无"暂无"）、8 行 × LAST REVISED/HORIZON、无手风琴残留
（无 aria-expanded）、无 Dashboard 词汇（BUY/SELL/Bull/Bear/信号/涨跌零命中）、
点击行进详情（compute 72% / 2026.07.31 一致）、移动端 scrollWidth=375 零溢出、
真实 Tab 键序焦点落在行链接且朱砂焦点环生效（outline solid rgb(192,57,43)）。
dev server 与调试 Chrome 已清理。

**未做的事**：未动 Ledger/Thesis 数据；未制造 CONFIRM 数据；未动 Homepage/导航/Map/Essay；
未删除 Thesis.probability（migration-era fallback 保留）；未做品牌统一（V2-06-00）；
**未 commit、未 push**——等 Review。

**遗留**：IndustryMap.tsx:196 直读 `t.probability` 显示（Map 属本阶段禁区，
建议 Map 阶段统一改走 deriveCurrentBelief）；CONFIRM 真实视觉待首条 delta=0 入账。

**冲突**：无新增。

---

## 2026-08-23 · V2-06-04 Revision Engine 呈现层实施

**执行内容**（基线 = V2-06-03 工作区状态；Rule 01/02/03 已成文）：

- **deriveCurrentBelief**：`data/ledger.ts` 新增 SSOT 函数——`revisionsOf(thesisId)` 非空取末条
  `current`，空取 `thesis.probability`（migration-era fallback，Rule 02）；
  4 处显示全量切换：Home 章 04 LIVE THESIS 卡、Thesis 聚合页 ThesisBlock、
  ThesisDetail CURRENT BELIEF、（Thesis.tsx 聚合行）；
- **ThesisDetail 全量重写**：信息优先级 CURRENT BELIEF → THE CLAIM → WHY
  （新局部组件 YinYangColumns 阴阳两面）→ WHAT WOULD CHANGE MY MIND
  （ASSUMPTIONS 编号 + INVALIDATION ×n，字段存在才渲染）→ 单一 REVISION HISTORY
  （Ledger 行：prev→current (delta) + direction.toUpperCase() 墨灰 label + reason/note/evidence?；
  legacy `thesis.revisions` 按日期去重后以 "NARRATIVE · 叙事存档" 行并入，按日期降序合并；
  compute 页 "2026.07.31" 恰出现 2 次 = LAST REVISED + ledger 行，去重实测确认）
  → EVIDENCE + COUNTER → RELATED MAP → CTA；
- **Journal 全量重写**：01 REVISION · WHAT CHANGED MY MIND（LEDGER 全量降序行）+
  02 NARRATIVE · 研究叙事（既有日期分组流原样保留，thesisId 条目改链接）；
- **Thesis 聚合页**：`(t.status ?? 'active') === 'active'` 过滤；新增 ARCHIVE 区块
  （closed/invalidated 分组、链接 #/thesis/:id，`archived.length > 0` 才渲染——当前全 active 不渲染）；
- **Home**：liveTheses 改 filter active 再 slice(0,3)；LIVE THESIS 卡 conviction 走 deriveCurrentBelief；
- **check-data 132 → 163**：[14] deriveCurrentBelief 一致性（esbuild 二次打包 src/data/ledger.ts
  后 require，8 命题 derive === probability）、[15] direction 派生（合成 up/down/confirm +
  逐 entry）、[16] delta 派生、[17] UI 静态扫描（src/pages/*.tsx 禁 previousConviction/
  currentConviction/note.match/note.split）；[18] status 合法性已由 [13] 覆盖（注释注明映射）。

**验证**：check **163/163** ✓；build ✓（index gzip 74.83KB，ThesisDetail chunk 14.08KB）；
lint 无新增 error（仍仅 InkTransition 既有 react-refresh 1 个）。
CDP 真实 Chrome 实测：v20604-thesis-compute / journal / thesis × 1440/375 六张整页截图
（存工作区 v2-05-screenshots/），单一修订史、A/I 区、双层 Journal、active 过滤均确认；
dev server 与调试 Chrome 已全部清理。

**未做的事**：未动 Ledger/Thesis 数据、首页七章结构、导航、样式系统；无新阴阳图形；
未做 Thesis 聚合页升级与 YinYangColumns 合并（V2-06-05）；未做品牌统一（V2-06-00）；
**未 commit、未 push**——等 Review。

**冲突**：无新增。

---

## 2026-08-23 · V2-06-03 Thesis Schema Extension

**执行内容**（基线 = V2-06-02 工作区状态；V2-06-02 Review 三规则已裁决）：

- **接口扩展**：`Thesis` 新增 `status?: 'active'|'closed'|'invalidated'`、`assumptions?: string[]`、
  `invalidation?: string[]`；`probability` 注释声明 migration-era snapshot（Rule 02）；
- **数据补录**：8 个命题全部 `status: 'active'`；assumptions 各 2 条、invalidation 各 1–2 条——
  全部直接转录各自 `counter` 文本的"最大漏洞/证伪信号"（compute 供给突破 / ai-app 模型跃升 /
  robot 十万台 / newenergy 出清≠反转 / optical 收入结构 / memory HBM 周期性 /
  rare-earth 缓和协议 / drug BD 预算），无虚构、无正则提取；
- **Rule 01 落地**：check-data 撤除 `thesisId+date` 唯一性断言，只保留 `Revision.id` 全局唯一；
- **check [13] 新增**：status 枚举合法性、polarity 禁字段化（`'polarity' in t`）、
  assumptions/invalidation 非空字符串数组结构、legacy revisions 仅 {date,note} 两键（Rule 03 防夹带）；
- **08 文档第十节**：OD 裁决结果 + 最高原则 + Rule 01/02/03 + roadmap 顺序成文。

**验证**：check **132/108→132 项**全过；build ✓（index gzip 74.77KB）；lint 无新增 error
（既有 InkTransition react-refresh 1 个，按 Prompt 不顺手修）。

**未做的事**：未动 Homepage / Navigation / 任何 UI / Journal UI / ThesisDetail Revision UI；
未进入 V2-06-04；未动 Ledger 数据；**未 commit、未 push**。

**冲突**：无新增。

---

## 2026-08-23 · V2-06-02 Ledger Data Layer 实施

**执行内容**（基线 = V2-05 commit `f2964ad` + V2-06-01 文档；四项 OD 已裁决）：

- **T-1** 新增 `data/domains/ledger.ts`：Revision{id/date/thesisId/previous/current/reason/evidence?/note?}，
  append-only；新增 `data/ledger.ts` 派生层：deltaOf / directionOf（up/down/confirm，OD-3）/
  revisionsOf / lastRevisedOf；
- **T-2** 3 条事件完整迁移入账（保留 date/reason/note，无正则提取）；
- **T-3** journal.ts 删 `previousConviction/currentConviction`（OD-2 授权），保留 thesisId，note 未动；
- **T-4** `Thesis.revisions[]` 冻结：4 处消费方（Thesis.tsx:116 / ThesisDetail ×2 / Home:156）依赖，
  不可安全删除 → 保留字段 + 接口注释禁新增，性质 = legacy narrative history；
- **消费方重接**：Home 章 05 与 ThesisDetail 修订史改从 Ledger 取数（视觉结构零改动；
  行首显示由短 target 变为命题全称——消除重复字段的直接结果）；
- **T-5** check-data 92 → 108 项：[10] Journal 无 conviction 字段防回归、[11] Ledger 八类断言、
  [12] Ledger↔Thesis probability 一致性；
- **T-6** barrel 一行接入，无新 data framework。

**验证**：check 108/108 ✓；build ✓（index gzip 74.78KB）；lint 无新增 error（仍仅 InkTransition 既有 1 个）。
CDP 真实浏览器回归：首页章 05 三条 Ledger 行渲染正确（含 +7/+6/−4 delta），
ThesisDetail 仪表条与修订史正常。

**顺带修复（范围内发现）**：V2-05 既有显示 bug——LAST REVISED 取 `revisions[revisions.length-1]`
（数组新→旧，实际是最早日），compute 曾显示 2026.05.12；Home/ThesisDetail 统一改走
`lastRevisedOf` 派生后正确显示 2026.07.31。截图存工作区 v2-05-screenshots/v206-*.png。

**未做的事**：未动 Homepage 视觉/导航/样式；未做 Archive UI、ThesisDetail 双呈现去重（V2-06-04）、
Thesis 聚合页升级（V2-06-05）；未动 status/assumptions/invalidation 字段（V2-06-03）；
**未 commit、未 push**。

**冲突**：无新增。

---

## 2026-08-23 · V2-06-01 Thesis Schema & Belief Ledger Architecture Review

**执行内容**：实码审计（theses/journal/now/map/essays 接口、polarity.ts、check-data.mjs 全文、
ThesisDetail.tsx 全文、V2 文档 01–07）后产出 `08_V2_THESIS_BELIEF_LEDGER.md`——
V2-06 的 Canonical Contract。关键裁决：

- **核心发现：Revision 双源隐患**——`Thesis.revisions[{date,note}]` 与 journal 结构化字段并存，
  ThesisDetail 已同时渲染两个列表，同一事件两处叙述；
- **Belief Ledger 采用独立 `domains/ledger.ts`**（方案 B）：Revision 为 append-only 账本实体，
  journal/thesis/首页均为投影；canonical 字段 = id/date/thesisId/previous/current/reason/evidence?/note?，
  delta 与方向一律派生不持久化；
- **Canonical Thesis Schema**：存储名稳定（probability/window 不重命名，显示层 CONVICTION/HORIZON 已落地），
  新增可选 `status?/assumptions?/invalidation?`；`revisions[]` 冻结为 legacy snapshot；
  lastRevised/created 派生；polarity 维持 G-03 禁止字段化；
- **唯一受控旧字段改写（M-2，待授权 OD-2）**：journal 3 items 的 conviction 字段迁出至 Ledger；
- **品牌命名不统一实码清单**：index.html title / SITE.name / journal target 用 `trading-lab`，
  V2 文档层与终幕用 TradingLabb——列 V2-06-00 Push 前置任务；
- Migration 风险低-中：增量 + 一处授权改写，回滚 = revert；
- Open Decisions 4 项（OD-1 品牌拼写与顶栏形式 / OD-2 M-2 授权 / OD-3 confirm 类入账 / OD-4 封闭命题呈现）。

**未做的事**：未修改任何生产代码（git status 仅新增本文档 + 更新本日志）；
未实现 ledger.ts；未 commit、未 push——等 Review。

**冲突**：无新增（P0/P1/P2 全部兼容；M-2 属授权事项而非规则冲突）。

---

## 2026-08-23 · V2-05 首页实施（T-1 ~ T-7）

**执行内容**（基线 = V2-04.5 commit `360481a`，严格按 07_V2_ENGINEERING_READINESS.md 的 Blocking 顺序）：

- **T-1** `data/domains/site.ts`：NAV 改组为 Option C——当下 NOW(#/) / 世界 WORLD[地图·周期·四象] /
  命题 THESIS[命题·系统·框架] / 日志 JOURNAL[日志·文集] / 无为 WUWEI / HSN[宣言]；
- **T-2** 新增 `data/domains/now.ts`：Observation 接口（id/title/summary/date/mapNodeId?/thesisId?）+
  5 条观察数据；`content.ts` 加 barrel 导出一行；
- **T-3** `data/domains/journal.ts`：JournalItem 增量可选字段 `thesisId?/previousConviction?/currentConviction?`；
  3 条旧条目补结构化数据（国产算力 65→72/compute、新能源 57→63/newenergy、机器人 55→51/robot）；
- **T-4** 新增 `data/polarity.ts`：`derivePolarity/deriveThesisPolarity/formatPolarity`。
  规则：空→null；全同→single；含 turn 且其余一致→"X → TURN"；阴阳混合→MIXED。MapNode.state 唯一事实源；
- **T-5** 新增 `pages/ThesisDetail.tsx`；`App.tsx` 注册 `#/thesis/:id`（镜像 essays/:id 模式）；
  `ink/nav.ts` parentOf 登记 单命题→命题聚合；
- **T-6** `pages/Home.tsx` 全量重写为七章（01 NOW / 02 POLARITY / 03 HOW I THINK / 04 LIVE THESIS /
  05 WHAT CHANGED MY MIND / 06 WUWEI / 07 END），V1 封面 hero 与终幕骨架保留，
  ChapterMark 复用 V1 ActMark 视觉；POLARITY 章节挂载 `<PolarityInstrument state="yang" size={150} interactive showLabel />`；
  数据铁律全部遵守（组件零业务数据、polarity 只经 deriveThesisPolarity、delta 计算值、Observation 空则整章不渲染）；
  hooks 顺序修正为 useRevealRoot 先于任何 early return（原 V1 lint error 随重写顺带消除）；
- **check-data.mjs** 断言扩展：[9] NOW 观察、[10] 日志结构化字段，总计 92 项。

**T-7 验证结果**：
- `npm run check` 92/92 ✓；`npm run build` ✓（index gzip 74.82KB，Home chunk 17.12KB/5.03KB gzip）；
- `npm run lint` 无新增 error（仅剩 InkTransition.tsx 1 个既有 react-refresh error，未动）；
- 真实 Chrome（headless + CDP）实测：1440/768/375 三档整页截图（页高 6148/6684/7952px）；
- **O-1 交互序列全过**：静态 YANG → hover 30° → click 180° 切 TURN → 移出 → 键盘 Enter 切 YIN →
  reduced-motion 重载后 click 切 TURN 且 transitionDuration=0s（零运动）；
- **O-2**：TURN 朱砂仅出现在仪器态标与既有规范位置，无外溢；
- 回归：其他页面文件零改动（git status 仅 7 改 3 增，全部属本任务清单）。

**未做的事**：未动 Cycle Taiji、其他页面、InkTransition lint 债、SIGNALS、实时数据、G-05（留 V2-06）；
未删 site.ts 旧数据（ACTS/CYCLE_STAGES/CYCLE_INDUSTRIES/INDEX_ITEMS 保留）；未 push。

**冲突**：无新增。

---

## 2026-08-23 · V2-04.5 Engineering Readiness Review

**执行内容**：实码审计 G-01~G-07 后产出 `07_V2_ENGINEERING_READINESS.md`——
V2-05 的 Canonical Data Contract。关键裁决：

- **G-03 采用 Option C（Derived Thesis Polarity）**：`MapNode.state` 是全站 polarity 唯一事实源，
  命题极性由纯函数 `deriveThesisPolarity` 推导（全同→该态；含 turn 且其余一致→"X → TURN"；
  阴阳混合→MIXED 并陈），Thesis 不加 polarity 字段，杜绝双数据源冲突；
- **G-04 增量演进**：journal items 追加可选字段 `thesisId?/prev?/current?`，旧条目不迁移，
  delta = current − prev 计算值，禁止从 note 正则提取；
- **G-01 Observation 契约**：`domains/now.ts` 新 domain（id/title/summary/date/mapNodeId?/thesisId?），
  polarity 不持有字段、经 mapNodeId 推导；SIGNALS 完整形态仍挂 C-04；
- **G-02 路由契约**：`#/thesis/:id` 镜像 `/essays/:id` 模式，parentOf 登记 单命题→命题聚合；
- **Blocking 顺序**：T-1 导航改组（site.ts）→ T-2 now.ts → T-3 journal 增量+断言 →
  T-4 推导函数 → T-5 thesis 路由；G-05 延期 V2-06；
- **Migration 风险：低**——全部新增/可选/配置级，无旧字段改写，回滚 = revert 单 commit。

另转入两项 V2-05 验收观察项：O-1（阴阳仪 hover/click transform 叠加走查序列）、
O-2（TURN=朱砂语义不得外溢）。

**未做的事**：未修改任何生产代码、Router、数据、导航；未做数据 migration；未实现 Homepage。
仅新增 1 份 V2 文档 + 更新本日志。

---

## 2026-08-23 · V2-04 Polarity Instrument 实施

**执行内容**（V2 首次生产代码变更，基线 = Design Freeze commit `71ea8b8`）：

- 新增 `src/components/PolarityInstrument.tsx`：`state: 'yin'|'turn'|'yang'`、
  `interactive`、`size`、`showLabel`；默认完全静止；hover 有界微转（30°，单次过渡）；
  click 循环 YANG→TURN→YIN 并翻转 180°；键盘 Enter/Space 可操作；
  `aria-label` 播报当前状态；非 interactive 时 `role="img"`；
- 新增 `src/index.css` `.polarity-disc` 样式（900ms 过渡，墨系时长区间），
  `prefers-reduced-motion` 下 `transition: none`；
- P1 成文例外写入：`02_DESIGN_CONSTITUTION.md` §17 + 根 `DESIGN.md` 禁令表
  （严格按已批准范围：全站阴阳图形 ≤2、默认静止、reduced-motion 零运动，未扩大例外）；
- 07_COMPONENT_SYSTEM.md 组件表同步（07 号文件规定的维护义务）；
- 09_CHANGELOG.md 记一条（P0 AI 工作原则规定的任务后义务）。

**数量复核**：全站阴阳图形 = 2（Cycle 页 Taiji + PolarityInstrument），无第三个；
Cycle.tsx 与 Taiji 组件**零改动**。状态色沿用 PolarityTag 语义（阳=墨/阴=深水蓝/转换中=朱砂豁免），未新增强调色，未新增依赖。

**过渡态说明**：组件暂无页面引用——V2-05 首页 POLARITY 章节挂载，属七阶段计划内的
中间态（不是死组件）；项目无测试 runner（无 vitest/jest），行为验证以 tsc + build + 人工走查为准。

**未做的事**：未实施 Homepage / NOW / Thesis route / Thesis schema / Journal schema /
导航改造；未修改 Cycle 页；未安装依赖；未做无关重构。

---

## 2026-08-23 · V2-03 Homepage Specification Final Review

**执行内容**：将 04_V2_HOME_SPEC.md 重写为 **Homepage Final Product Specification**——
七章（NOW / POLARITY / HOW I THINK / LIVE THESIS / WHAT CHANGED MY MIND / WUWEI / END），
每章 12 项组件级属性（Purpose / User Question / Content / Data Source / CTA / Interaction /
Mobile / Empty / Error / A11y / Performance），另含移动端让位规则、ARK 边界、
实施缺口表（G-01~G-07）、验收标准（AC-01~AC-10）。

**关键定义落账**：

- NOW = Current Observations（不是 News / Dashboard / Watchlist）；Observation ≠ Thesis ≠ Revision；
- SECTION 03 定名 HOW I THINK（不用 SYSTEM），展示七步 TradingLabb Loop；
- SECTION 05 定名 WHAT CHANGED MY MIND（不用 Latest Journal）——Revision 高光，非博客流；
- 首页密度定位：低密度 / 高方向感；首次访问 30–60 秒理解；
- 实码核查确认的新缺口：Thesis 无 polarity 字段（G-03）、Journal 概率 delta 嵌在自由文本（G-04）——
  均列入后续任务，本次未实现。

**Open Decisions**：无新增。C-04 维持挂起（V2-07）。

**未做的事**：未修改任何代码、Router、CSS、组件、数据；未修改 P0/P1/P2；未实现任何首页功能。

---

## 2026-08-23 · V2-02 Information Architecture Review

**执行内容**：实码核查（src/pages 12 页面、App.tsx hash 路由、site.ts NAV/INDEX_ITEMS、
domains 数据关联字段）后，按 Semantic Clarity > Conceptual Purity 原则完成 IA 三方案评审。

**结论：采用 Option C（混合型）为 V2 最终 IA**，已更新 03_V2_INFORMATION_ARCHITECTURE.md：

```text
NOW / WORLD(MAP·CYCLE·DIMENSIONS) / THESIS(SYSTEM·FRAMEWORK) / JOURNAL(ESSAYS) / WUWEI / HSN(ABOUT·MANIFESTO)
```

- 哲学语言 THINK / REVISE / LIVE 从导航下沉为页面 Hero kicker（导航清晰 + 哲学完整）；
- Option A（纯概念）因 LIVE/REVISE/THINK 理解成本否决；Option B（纯内容）因品牌差异化弱否决；
- 路由零改动，11 页面全部保留，迁移只动导航分组与页面叙述层；
- 实码核查确认：Map↔Thesis 双向链 ✅、Map→Essay ✅；Thesis↔Journal 仅自由文本 target ⚠️、
  Essay→Thesis 仅栏目级 ⚠️、`#/thesis/:id` 不存在 ❌、NOW 页与 HSN/ABOUT 页不存在 ❌——
  缺口已列入 03 号文件第五节，均为后续实施任务，本次未实现。

**未做的事**：未修改任何代码、Router、页面、CSS、组件、数据；未修改 P0/P1/P2；未新建页面。
无重大争议，无 OPEN DECISION 遗留（SIGNALS 形态仍挂 C-04，排期 V2-07）。

---

## 2026-08-23 · V2-01 Brand Architecture 定稿 + 用户三项裁决落账

**执行内容**：依据 V2-01 实施要求与用户裁决，更新 5 份 V2 文档（未新建文件）。

| 文件 | 修改内容 |
|---|---|
| 02_V2_BRAND_ARCHITECTURE.md | **整体重写为 14 节最终版**：Brand Definition / Positioning / HSN Role / 三级品牌结构 / Core Worldview / TradingLabb Loop / Polarity System / Content Architecture / Personal IP / Distribution / Brand Voice / Forbidden Positioning / Long-term Moat / Future Evolution |
| 01_V2_MASTER.md | Loop 改为七步（OBSERVE→MAP→THINK→THESIS→ACT/DON'T ACT→REVISE→ARCHIVE，UNDERSTAND 并入 MAP）；路线图按新顺序重排（V2-02 IA Review → V2-03 首页规格终审 → V2-04 阴阳仪实施 → V2-05 首页实施 → V2-06 Thesis+Revision → V2-07 HSN IP） |
| 05_V2_POLARITY_SYSTEM.md | 交互规则改为保守方案（默认完全静止，仅 hover/click 运动，reduced-motion 零运动）；第七节改写为裁决结果；新增"全站阴阳图形至多 2 个"硬约束 |
| 04_V2_HOME_SPEC.md | POLARITY 章节同步保守方案；移除"待裁决"标注 |
| 03_V2_INFORMATION_ARCHITECTURE.md | C-03 冲突标注更新为"以 V2 五层导航为最新工作方向，持续修改迭代" |

**用户裁决（2026-08-23）**：

- **C-01 ✅**：全站阴阳图形至多 2 个——现有 1 个（Cycle 页 `Taiji` 组件）保留，至多再新增 1 个（首页 Polarity Instrument），不得出现第三个；
- **C-02 ✅**：采用保守方案——新增阴阳仪默认完全静止，仅 hover/click 时才运动；
- **C-03 ✅**：导航以最新 V2 五层方案为工作方向，持续修改。

**未做的事**：未修改任何代码、Router、组件、数据、CSS；未修改 P0/P1/P2 原始文档；
未实施 V2-04/05 的任何功能。遗留义务：V2-04 实施时须将阴阳仪条款以成文例外写入 P1（见 05 号文件第七节）。

---

## 2026-08-23 · V2-00 建立 V2 产品上下文层

**执行内容**：完整读取 P0（01_PROJECT_SPEC）、P1（02_DESIGN_CONSTITUTION + 根 DESIGN.md）、
P2（03_INFORMATION_ARCHITECTURE）、P3（06_PAGE_SPECS 全部 7 份）、P4（08_TASKS 两份）、
04_CONTENT_SYSTEM、05_DATA_MODEL、07_COMPONENT_SYSTEM、09_CHANGELOG、10_HANDOFF 后，
新建 `app/00_PROJECT/V2/` 目录及 6 份设计层文档。

**创建的文件**：

| 文件 | 作用 |
|---|---|
| 01_V2_MASTER.md | V2 总纲：定位、Operating Loop、三层产品深度、七阶段路线图 |
| 02_V2_BRAND_ARCHITECTURE.md | 品牌架构：HSN/TradingLabb 关系、禁止人设、东方哲学现代化转译、内容矩阵 |
| 03_V2_INFORMATION_ARCHITECTURE.md | 信息架构：11 栏目 → 5 认知层（NOW/WORLD/THINK/REVISE/LIVE + HSN）的重组设计 |
| 04_V2_HOME_SPEC.md | 首页六章节规格（NOW/POLARITY/SYSTEM/LIVE THESIS/WHAT CHANGED MY MIND/END），设计稿 |
| 05_V2_POLARITY_SYSTEM.md | 阴阳仪系统设计：三态模型、交互规则、全站联动愿景、P1 冲突说明 |
| 06_V2_IMPLEMENTATION_LOG.md | 本文件 |

**未做的事**（任务约束确认）：

- 未修改任何现有代码（Router / Navigation / CSS / 组件 / 数据 / 内容）；
- 未修改任何 P0/P1/P2 原始文档（00_PROJECT 下 01–10 号文件与根 DESIGN.md 均未动）；
- 未安装依赖、未重构、未删除任何文件；
- 未实施 V2 的任何功能（导航重组、首页六章节、阴阳仪均仅为设计稿）；
- 按本任务"不修改任何现有文件"的约束，09_CHANGELOG.md 未同步更新——V2-00 的记录在本文件。

---

## 冲突台账（待用户裁决）

### C-01 · 阴阳仪 vs 太极图禁令【P1 冲突，V2-04 前置】

- **CONFLICT**：V2 拟在首页引入具象可转动阴阳仪（05_V2_POLARITY_SYSTEM.md）。
- **CURRENT RULE**：P1 02_DESIGN_CONSTITUTION §17 明确禁止"太极图（阴阳意象只用抽象方块）"；
  且 2026-08-14 首屏阴阳生命体（DaoSymbol）被用户否决："设计的一言难尽"。
- **V2 PROPOSAL**：不做"太极装饰"，做"Polarity Instrument"——三态（YIN/TURN/YANG）
  认知模型，与 MapNode.state 数据结构打通，动画缓慢克制、reduced-motion 下静止。
- **RECOMMENDED DECISION**：由用户裁决。若批准，以"成文例外"形式修改 P1（禁止太极装饰、
  允许 Polarity Instrument，并写入硬约束）；若不批准，05 号文件作废，阴阳意象继续只用抽象方块。
- **状态**：✅ 已裁决（2026-08-23）——批准成文例外，全站阴阳图形至多 2 个（现有 Cycle 页 1 个保留 + 首页至多新增 1 个）。详见 05 号文件第七节。

### C-02 · 首页持续旋转 vs 首屏动效禁令【P1 冲突，V2-03/04 前置】

- **CONFLICT**：阴阳仪默认缓慢旋转位于首页 POLARITY 章节。
- **CURRENT RULE**：P1「❌ 首屏任何开场动效」。
- **V2 PROPOSAL**：旋转非"开场动效"（无入场编排、无位移、无炫技），是持续状态表达，
  且慢到第一眼未必察觉；但"首屏区域存在持续运动"是否越界，解释权在用户。
- **RECOMMENDED DECISION**：与 C-01 合并裁决。可选项：①允许缓慢旋转（写入例外条款）；
  ②默认静止、仅 hover/click 时才动；③不进入首页。倾向②作为保守方案。
- **状态**：✅ 已裁决（2026-08-23）——采用方案②保守方案：默认完全静止，仅 hover/click 时运动，
  reduced-motion 下零运动。已写入 05 号文件第四节。

### C-03 · V2 导航 vs 2026-08-22 已裁决导航【近期决策冲突，V2-03 前置】

- **CONFLICT**：V2 拟将顶栏改为 NOW/WORLD/THINK/REVISE/LIVE + HSN（03 号文件）。
- **CURRENT RULE**：2026-08-22 TASK-001 用户刚裁决「6 项两组」（索引/宣言/体系/观察/文集/日志），
  已上线。09_CHANGELOG 明确记录这是"用户裁决——选择了分层方案并指定分组归属"。
- **V2 PROPOSAL**：五层认知结构替代六组结构，分组归属与命名均不同。
- **RECOMMENDED DECISION**：由用户裁决——是以 V2 五层取代现有六组，还是在现有六组框架内
  吸收 V2 思想（如仅在首页与页面叙述层落地认知层级，顶栏不动）。后者冲突最小。
- **状态**：✅ 已裁决（2026-08-23）——以 V2 五层导航为最新工作方向，持续修改迭代；
  现有「6 项两组」视为 V1 终态，V2 导航实施前按任务单走，不直接改动现有顶栏。

### C-04 · SIGNALS 新模块【结构纪律待决，非冲突】

- **CONFLICT**：V2 提案新增 SIGNALS 模块（尚未形成共识的变化）。
- **CURRENT RULE**：P2 结构纪律——新栏目上线前必须回答"它沉淀为树的哪一枝"；
  新 domain 文件需纳入 check-data 断言体系。
- **V2 PROPOSAL**：归属 OBSERVE 层；数据形态未设计（独立 domain 文件 vs theses/journal 轻量投影）。
- **RECOMMENDED DECISION**：V2-07 阶段再议；当前仅记录，不进入任何实施排期。
- **状态**：⏸ 记录待议。

---

## 下一阶段建议（仅建议，未执行）

C-01 / C-02 / C-03 已于 2026-08-23 全部裁决，V2-01 品牌架构已定稿。按 V2-01 重排路线图：

1. **V2-02 Information Architecture Review**（下一项）——复核 03 号文件：五层结构与
   TradingLabb Loop（七步）是否完全对齐、ESSAYS 归属 REVISE/CAPITAL 的表述统一、
   SIGNALS 暂挂 OBSERVE 层的形态；定稿后首页规格才有稳定地基。
2. **V2-03 Homepage Specification Final Review**——基于定稿 IA 终审 04 号文件。
3. **V2-04 Polarity Instrument 实施**——首个改代码阶段；开工前任务单须包含：
   将阴阳仪条款以成文例外写入 P1 的授权（05 号文件第七节遗留义务）。
4. **V2-05 Homepage Implementation**——六章节落地。
5. **V2-06 Thesis + Revision System / V2-07 HSN Personal IP**——前序稳定后启动。
