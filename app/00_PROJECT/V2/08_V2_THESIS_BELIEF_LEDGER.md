# V2-08 · THESIS SCHEMA & BELIEF LEDGER — V2-06-01 架构审查

> **V2-06-01 产出（2026-08-23）。** 只审计 + 设计，未修改任何生产代码。
> 本文件是 V2-06 后续实施（Thesis 产品化 / Belief Ledger / Revision Engine）的
> Canonical Contract——实施时以本文件为准，冲突记入 06_V2_IMPLEMENTATION_LOG.md。
> 阶段目标（ChatGPT V2-06 Prompt）：从"优化网站"切换为"建立 HSN 的个人认知资产系统"。

---

## 一、审计范围与方法

实码读取（非记忆）：`domains/theses.ts`（8 个命题全文）、`domains/journal.ts`、
`domains/now.ts`、`domains/map.ts`、`domains/essays.ts`（接口）、`data/polarity.ts`、
`scripts/check-data.mjs`（161 行全文）、`pages/ThesisDetail.tsx`（162 行全文）、
V2 文档 01–07 全部。

**核心发现（实码事实）：**

1. **Revision 当前有两个表达处**——`Thesis.revisions[{date,note}]`（自由文本，含概率变化叙述）
   与 `Journal.items` 结构化字段（`thesisId/previousConviction/currentConviction`，V2-05 T-3 新增）。
   ThesisDetail 修订史区块**同时渲染两个列表**（journalItems + thesis.revisions），
   同一事件（如 2026.07.31 国产算力 65→72）在两处各有一份叙述。**这是 V2-06 必须裁决的双数据源隐患。**
2. Thesis 实体成熟度高于预期：`conflict/evidence/counter/window/probability/revisions/nodes`
   已构成命题骨架；**缺 `assumptions`、结构化 `invalidation`、`status`**。
3. `counter` 字段自由文本内嵌"证伪信号：……"——invalidation condition 以散文形式存在，
   不可被结构化消费（未来"什么会证明我错了"列表无法自动生成）。
4. `JournalItem.type`（up/down/risk/new）与概率方向**冗余**：up/down 可由 delta 符号推导，
   但 risk/new 是真正的日志语义——Revision ≠ Journal entry（V2-04 规格已定义），二者必须分离。
5. 品牌命名不统一（实码）：`index.html <title>HSN · trading-lab</title>`、
   `site.ts SITE.name: 'trading-lab'`、`journal.ts` target `'trading-lab'`、
   文档层 P0–P4 全部用 `trading-lab`；而 V2 文档层与首页终幕已用 `TradingLabb`/`TRADINGLABB`。
   ChatGPT 裁决：**TradingLabb 为正式品牌名**——列入 V2-06-00 前置任务（见九节）。

---

## 二、Canonical Thesis Schema

字段裁决原则：**存储名稳定，显示名标准化**。`probability`/`window` 已被 8 个命题、
多个组件与 92 项 check 断言使用——重命名是纯破坏性变更、零信息收益；
显示层已统一为 CONVICTION / HORIZON（ThesisDetail 仪表条），维持"存储-显示别名"模式。

| Canonical 字段 | 存储字段（实码） | 状态 | 裁决 |
|---|---|---|---|
| thesis id | `id: string` | ✅ 存在 | 不变 |
| title | `title: string` | ✅ 存在 | 不变 |
| statement | `conflict: { although, but }` | ✅ 存在 | 不新增字段——statement = 虽然（让步）+ 但是（主断言），这就是 TradingLabb 的命题陈述结构，优于单句 statement |
| conviction | `probability: number` | ✅ 存在 | 存储名不变；显示名 CONVICTION（已落地）。check 断言 ∈ [0,100] 已有 |
| horizon | `window: string` | ✅ 存在 | 存储名不变；显示名 HORIZON（已落地） |
| polarity | —（无字段） | ✅ 契约已定 | **维持 G-03 裁决：禁止加字段**，唯一入口 `deriveThesisPolarity`（MapNode.state SSOT） |
| evidence | `evidence: string[]` | ✅ 存在 | 不变（可被外部验证的事实列表） |
| counter-evidence | `counter: string` | ✅ 存在 | 不变（反面论证叙述，单字符串，不拆分数组——拆分会强迫改写 8 篇既有叙述，收益低） |
| assumptions | — | ❌ 缺失 | **新增 `assumptions?: string[]`**——命题成立依赖的前提假设（可选，向后兼容） |
| invalidation conditions | 内嵌于 `counter` 自由文本 | ⚠️ 半存在 | **新增 `invalidation?: string[]`**——结构化证伪条件。新命题必填（check 断言），旧命题渐进补录；`counter` 散文保留不动，禁止正则提取 |
| linked map nodes | `nodes?: string[]` | ✅ 存在 | 不变（与 `MapNode.theses` 双向，check [3] 已断言） |
| revisions | `revisions: { date, note }[]` | ⚠️ 双源隐患 | **冻结为 legacy**：不再新增条目；新事件全部进 Belief Ledger（见三节）。旧数组保留渲染，标 legacy display |
| last revised | —（多处临时计算） | ⚠️ 派生 | **派生字段，禁止持久化**：`lastRevised = max(ledger dates) ?? revisions 末条 date ?? updated`。Home/ThesisDetail 现有的 `revisions[revisions.length-1]` 取值法在 Ledger 上线后统一改为派生函数 |
| status | — | ❌ 缺失 | **新增 `status?: 'active' \| 'watch' \| 'closed' \| 'invalidated'`**，缺省 = active。封闭命题（closed/invalidated）是 Belief Ledger 的"结业档案"——认知资产的完成态，不是删除 |
| created | — | ⚠️ 半存在 | 派生：首个 revision 的 date（现状 8 个命题首条 revision 均为"首次建立命题"）。不新增字段 |

**不变铁律（沿用 07 号文件）**：Thesis 永不持有 polarity 字段；组件永不写死业务数据；
delta 永不持久化。

---

## 三、Belief Ledger 设计

### 3.1 定位

Belief Ledger 是**全站唯一的主张-修正账本**：每一次 conviction 变化是一条不可变账本记录
（append-only）。Thesis 页、Journal 页、首页 WHAT CHANGED MY MIND 全部是 Ledger 的**投影**，
不再各自持有概率变化数据。

### 3.2 生命周期

```text
Observation（now.ts，"什么在变"）
     ↓ 观察积累到可下注的程度
Thesis 建立（theses.ts，初始 conviction + status: active）
     ↓ 现实出现新证据
Revision 入账（ledger：prev → current + reason + evidence）
     ↓ 反复迭代（Ledger 逐渐变厚 = 认知资产）
Thesis 结业（status → closed / invalidated，账本封存，保留完整历史）
     ↓
Archive（封闭命题 + 完整 Ledger = Epistemic Track Record）
```

对应品牌层（02 号文件 §13）：`What I believed → What changed → What I updated → What I learned`。
Ledger 是这个链条的数据层形态。

### 3.3 存放位置裁决（两个候选）

| 方案 | 内容 | 判断 |
|---|---|---|
| A · Ledger 留在 journal.ts | 沿用 V2-05 T-3 路径：journal items 继续承载结构化 conviction 字段 | ❌ 否决——JournalEntry 按日期分组、混排 risk/new 语义，"账本"与"日志"纠缠；Thesis 视角的完整修正史需要跨日期聚合，查询逻辑已在 ThesisDetail 里出现一次（flatMap+filter），继续走这条路会让每个消费方都重复实现聚合 |
| B · **独立 `domains/ledger.ts`** | Revision[] 扁平账本实体，journal/thesis 页均为投影 | ✅ **采用**——实体边界干净（Journal=事件流含 risk/new；Ledger=conviction 修正专项账本）；聚合逻辑收进 data 层一个函数；与 now.ts/theses.ts 的 domain 划分同构 |

### 3.4 Canonical Revision Schema

```ts
// domains/ledger.ts（V2-06-02 新建，本阶段不实现）
export interface Revision {
  id: string                  // 'rev-' + thesisId + '-' + yyyymmdd，如 'rev-compute-20260731'
  date: string                // 沿用全站 '2026.07.31' 格式（字典序 = 时间序，排序安全）
  thesisId: string            // → Thesis.id（check 断言无悬空）
  previousConviction: number  // ∈ [0,100]
  currentConviction: number   // ∈ [0,100]
  reason: string              // 为什么改（必填，一两句）
  evidence?: string[]         // 什么事实出现了（可选，可外部验证）
  note?: string               // 人读叙述补充（可选，legacy 迁移时承接原 note）
}
```

**派生（一律不持久化）：**

- `delta = currentConviction − previousConviction`（组件内计算，与 V2-05 契约一致）；
- 方向 `up / down / confirm` 由 delta 符号推导（delta = 0 时 = confirm——"复核后维持"也是一条有效账本记录，
  现状 ai-app 2026.07.18"维持 58%"正是此类，现有 schema 无法表达，Ledger 可以）；
- Journal 页的 up/down 条目展示、Thesis 页 REVISION HISTORY、首页 WHAT CHANGED MY MIND
  全部从 Ledger 投影生成。

### 3.5 与现有数据的关系（迁移边界）

| 现有数据 | 处置 |
|---|---|
| Journal 3 条结构化条目（compute/newenergy/robot，V2-05 T-3） | 数据**迁移入 Ledger**；journal items 保留 `note` 作为人读叙述，**删除其 `previousConviction/currentConviction` 字段**（否则与 Ledger 形成第二份 conviction 数据）——这是 V2-06 唯一允许的旧字段改写，需在实施任务单中显式授权 |
| `Thesis.revisions[{date,note}]`（8 个命题全部） | **冻结**：不迁移、不删除、不再新增。其中含概率变化叙述的条目与 Ledger 在页面层**去重渲染**（同 date+thesisId 时 Ledger 为准，legacy 条目不再重复显示） |
| Journal risk/new 条目 | 不动——它们是日志语义，不是账本语义 |
| `Thesis.probability` | 保持手工维护 = 当前 conviction；check 新增一致性断言：**probability 必须等于该命题 Ledger 末条的 currentConviction**（有 Ledger 条目时），防止账本与现状漂移 |

---

## 四、Source-of-Truth Matrix

| 实体 / 字段 | Owner 文件 | 分类 | 说明 |
|---|---|---|---|
| Observation | `domains/now.ts` | **Source of Truth**（自身） | polarity 经 mapNodeId 推导（Derived） |
| MapNode（含 state） | `domains/map.ts` | **Source of Truth**（自身） | polarity 全站唯一事实源（不变） |
| Thesis 主体（title/conflict/evidence/counter/yang/yin/window/nodes） | `domains/theses.ts` | **Source of Truth**（自身） | |
| Thesis.polarity | `data/polarity.ts` | **Derived** | deriveThesisPolarity，禁止字段化 |
| Thesis.probability | `domains/theses.ts` | **Source of Truth（当前值快照）** | 受 Ledger 一致性断言约束 |
| Thesis.lastRevised / created | 派生函数 | **Derived** | 禁止持久化 |
| Thesis.status / assumptions / invalidation | `domains/theses.ts` | **Source of Truth**（新增可选字段） | |
| Revision（prev/current/reason/evidence/date/thesisId） | `domains/ledger.ts`（新） | **Source of Truth（账本，append-only）** | conviction 变化唯一事实源 |
| Revision.delta / 方向 | 组件内计算 | **Derived** | current − previous，禁止持久化 |
| `Thesis.revisions[{date,note}]` | `domains/theses.ts` | **Historical Snapshot（冻结 legacy）** | 只读存档，页面去重渲染 |
| Journal items（risk/new/note） | `domains/journal.ts` | **Source of Truth**（日志语义） | conviction 字段迁出后不再是概率数据源 |
| `no`（命题一…）、`industry`、显示名 CONVICTION/HORIZON | theses.ts / 组件 label | **Display-only** | 不参与逻辑 |

---

## 五、Migration Strategy

**风险评级：低-中。** 全部增量 + 一处受控字段迁出，无破坏性 schema 变更。

1. **M-1 新建 `domains/ledger.ts`**：Revision 接口 + 首批 5 条入账记录
   （既有 3 条结构化 journal 事件 + ai-app "维持 58%"补登 + optical-module 建立记录按需），
   barrel 导出一行；
2. **M-2 journal 字段迁出**：3 个 items 删 `previousConviction/currentConviction`（note 保留），
   渲染层改为从 Ledger 投影——**实施任务单显式授权后方可执行**；
3. **M-3 theses 新增可选字段**：`status?/assumptions?/invalidation?` 接口先加，
   旧命题渐进补录（不设死线），新命题起 invalidation 必填；
4. **M-4 派生函数**：`lastRevisedOf(thesis, ledger)` / `revisionsOf(thesisId, ledger)` 收进 data 层
   （建议放 `data/ledger.ts` 或扩展 polarity.ts 同级的 `data/derive.ts`），消灭组件内重复聚合；
5. **M-5 check-data 扩展**：Ledger 断言组（见七节）；
6. **回滚** = revert 单 commit（与 V2-05 同级纪律）。

**禁止**：正则解析 legacy note（07 号文件铁律延续）；一次性改写 8 个命题的 `counter` 散文；
为迁移引入任何运行时依赖。

---

## 六、Engineering Risks

| 风险 | 等级 | 缓解 |
|---|---|---|
| 迁移期 journal/Ledger 双份 conviction 数据并存 | 中 | M-2 与 M-1 同 commit 完成；check 断言 journal items 不再携带 conviction 字段（防回归） |
| ThesisDetail 修订史双列表（journalItems + legacy revisions）渲染重复事件 | 中 | 页面层合并函数按 date+thesisId 去重，Ledger 优先；该函数放 data 层，不进组件 |
| `probability` 与 Ledger 末条漂移（手改一个忘改另一个） | 中 | check 一致性断言（五节 M-5）事前拦截 |
| date 字符串排序 | 低 | 全站 'YYYY.MM.DD' 格式字典序=时间序，已验证安全；check 断言格式正则 |
| delta=0（confirm 类）条目方向显示 | 低 | 派生方向三态 up/down/confirm，UI 规格在 V2-06-02 定义 |
| 封闭命题（status≠active）在首页 LIVE THESIS 的呈现 | 低 | 首页取数逻辑不变（slice 前 3），V2-06-02 定义过滤规则（建议仅 active+watch 入首页）——属实施任务，本阶段只立契约 |
| 品牌命名统一触及 P0–P4 文档层 | 低 | 文档层改名跟随代码层同名任务，单列 diff，不与 Ledger 混提 |

---

## 七、Acceptance Criteria（V2-06 全阶段验收预留）

| AC | 标准 |
|---|---|
| AC-01 | conviction 变化在全站只有一个事实源（ledger.ts）；grep 不到第二处持久化的 prev/current |
| AC-02 | 任一命题页可完整呈现 Ledger 修正史（含 delta 计算值），无重复事件 |
| AC-03 | `probability` = Ledger 末条 `currentConviction` 的一致性断言进 check-data 且通过 |
| AC-04 | 旧命题零改写（除 M-2 授权的 journal 字段迁出）；check 全量通过 |
| AC-05 | 封闭命题（status: closed/invalidated）有明确产品呈现（结业档案态，不删除） |
| AC-06 | delta 无持久化；方向 up/down/confirm 全部派生 |
| AC-07 | Thesis 无 polarity 字段（回归 G-03）；组件无写死业务数据（回归铁律） |
| AC-08 | 品牌命名统一任务（V2-06-00）完成：index.html title、SITE.name、journal target、Footer 一致为 TradingLabb 体系 |
| AC-09 | build ✓ / lint 无新增 error / 三档 CDP 实测（沿用 V2-05 验证纪律） |

---

## 八、下一阶段实施任务清单（建议，待 ChatGPT 裁决后排期）

| # | 任务 | 内容 | 前置 |
|---|---|---|---|
| **V2-06-00** | 品牌命名统一（Push 前置微任务） | `index.html` title、`site.ts SITE.name`、`journal.ts` target、Footer/END 落款统一为 TradingLabb 体系；P0–P4 文档层同名跟随；HSN 层级（Founder/Observer）按 02 号文件 §3 固定。**建议完成后即 push V2-05+V2-06-00 上线** | 用户确认「TradingLabb」拼写与 header 保留形式（`trading-lab BY HSN` 顶栏是否保留小写） |
| V2-06-02 | Ledger 数据层（M-1/M-2/M-4/M-5） | 新建 ledger.ts + 派生函数 + journal 字段迁出 + check 扩展；纯数据层，不动页面 | V2-06-01 本文档通过 Review |
| V2-06-03 | Thesis 字段扩展（M-3） | status/assumptions/invalidation 接口 + 首批补录 | V2-06-02 |
| V2-06-04 | Revision Engine 呈现层 | ThesisDetail 修订史合并去重渲染；Journal 页升级为 WHAT CHANGED MY MIND 视角；封闭命题档案态 | V2-06-02/03 |
| V2-06-05 | 命题聚合页升级 | #/thesis 从手风琴升级为 LIVE THESIS 呈现（conviction/polarity/horizon/lastRevised 投影） | V2-06-04 |
| （挂起） | G-05 Essay→Thesis 命题级链接 | Essay.related 目前仅栏目级（03 号文件五节缺口表） | V2-06 后段或 V2-07，本文档不展开 |

**本阶段纪律复述**：不修改 Homepage；不新增阴阳图形；不加行情/新闻流/Dashboard/Newsletter；
不引入数据库/CMS/登录/新 UI 框架；不 commit、不 push——等 Review。

---

## 九、Open Decisions（交 ChatGPT / 用户裁决）

1. **OD-1 · 品牌拼写**：正式品牌名采用 `TradingLabb`（双 b，与域名 tradinglabb.com 一致）——
   header 顶栏是否保留现有小写 `trading-lab BY HSN` 作为 logo 形式，还是同步改为 `TradingLabb`？
2. **OD-2 · M-2 授权**：journal 3 个 items 的 `previousConviction/currentConviction` 字段迁出
   （数据进 Ledger，journal 只留 note）——是否批准这处唯一的旧字段改写？
3. **OD-3 · confirm 类条目**：delta=0 的"维持"记录（如 ai-app 2026.07.18）是否正式入账？
   本文档建议入账（复核即认知活动），但这会让 Ledger 比 journal 更厚，需确认产品呈现不因此臃肿。
4. **OD-4 · 封闭命题呈现**：status: closed/invalidated 的命题在 #/thesis 聚合页是降权置灰、
   单独分区（ARCHIVE），还是完全移出？建议"单独分区"，对应品牌层的 Epistemic Track Record。

---

## 十、裁决结果与追加架构纪律（2026-08-23，V2-06-02 Review 定稿）

**OD 裁决**：OD-1 正式品牌 = TradingLabb，`trading-lab BY HSN` 保留为 visual wordmark
（不视为第二品牌，以后不得出现第三种拼法）；OD-2 授权 M-2（已执行）；OD-3 delta=0 正式入账，
方向三态 UP / DOWN / **CONFIRM**（"没有改变也是判断"——Reality changed, belief didn't.）；
OD-4 closed / invalidated 进独立 ARCHIVE 分区，绝不删除，不做"失败案例墙"。

**最高原则（升级为 V2-06 核心设计原则）**：

> **Ledger is the factual record. Journal is the narrative record.**
> **Ledger 记录我改变了什么；Journal 记录我为什么这样想。**
> 一个事实只允许一个 Source of Truth；同一事实在多页面出现时必须经
> id / thesisId / revisionId 建立关系，而不是复制事实。

**Rule 01 — Revision 是 Event，不是 Daily Snapshot**：
唯一性只要求 `Revision.id` 全局唯一；**同一 Thesis 同日允许多条 Revision**
（真实认知过程一天内可以有多次修正）。check-data 已撤除"同命题同日不重复入账"断言。

**Rule 02 — Ledger 是最终 Belief SSOT**：
`Thesis.probability` 是 **migration-era snapshot**——当前保留并经 check [12]
与 Ledger 末条 current 一致性校验，但**不得成为长期第二事实源**；
最终形态为 `Ledger → deriveCurrentBelief() → Thesis presentation`，
待 Ledger 覆盖全部命题后 probability 降级为派生显示。theses.ts 接口注释已同步声明。

**Rule 03 — Legacy revisions 只读冻结**：
`Thesis.revisions[]` 保留为 legacy narrative history（"我过去怎么描述这个事情"），
**禁止新增 conviction event**；所有新认知变化只入 Ledger。
check [13] 断言条目仅允许 `{date, note}` 两键。

**状态语义定稿**：`status: active | closed | invalidated`（closed = 命题完成生命周期，
不代表错；invalidated = 核心假设被现实证伪——个人 IP 最重要的内容之一）。

**技术债登记（V2-06-05 Review 裁决）**：
**G-08 — Presentation SSOT leakage**：`IndustryMap.tsx` 直读 `Thesis.probability` 作显示
（约 196 行，命题节点旁 conviction 数字）。Map 属 V2-06-05 阶段禁区，登记为 **Map 阶段技术债**；
届时统一改走 `deriveCurrentBelief()`，形成 Home / Thesis / ThesisDetail / Journal / Map
全页面单一入口的完整 SSOT。修复前由 check [12] 一致性断言兜底（probability ≡ Ledger 末条 current，
数值不会漂移，仅入口不规范）。另：G-05（Essay→Thesis 命题级链接）继续挂起。

** roadmap 顺序裁决**：V2-06-03 → V2-06-04 → V2-06-05 → 品牌统一（V2-06-00）→ Push。
不在 Revision Engine 完成前发布半成品。
