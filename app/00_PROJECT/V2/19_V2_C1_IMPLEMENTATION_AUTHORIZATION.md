# V2-19 · C1 IMPLEMENTATION AUTHORIZATION — 实施授权

> **CANONICAL · V2-C1 · IMPLEMENTATION AUTHORIZED · LOCKED**
> Authorization Review = **PASS WITH LOCKS**（2026-08-25）：3 条实施级不变量已补入（七节），随后正式 Lock。
> 18 号 Contract 定义「怎么做」；本文档定义「**现在允许做什么、不允许做什么**」。
> **本文档不重新审查、不修改 18 号 Contract；若发现 Contract 缺口，回 Architecture/Contract Review，不在授权层解释。**
> **本授权不授权 Commit / Push（F11）。**
> **从本授权 LOCKED 起，代码必须服从 18/19 号文，而不是反过来让代码推动架构。**

---

## 一、Authorization Decision

```text
C1 · Context Revision Boundary
Decision: AUTHORIZED（本文档 LOCKED 时生效）

授权链:
  17 号文（P0 · Authorized）
    → 18 号文（CONTRACT · LOCKED · v1.0）
    → 19 号文（本文档，IMPLEMENTATION AUTHORIZED · LOCKED）

约束:
  · 本授权不改变 18 号 Contract 的任何条款；
  · 本授权仅覆盖第二节列出的 Implementation Scope；
  · 本授权 ≠ Commit 授权 ≠ Push 授权（两者均须届时另行明确）。
```

---

## 二、Implementation Scope（第一轮 · 极小 Blast Radius）

**允许实现的，且仅允许以下五项：**

| # | 范围项 | 契约依据（18 号文） |
|---|---|---|
| S1 | `CONTEXT_HISTORY` 数据实体（append-only、readonly、`ContextHistory` 类型） | 四节 4.1 / 4.3 |
| S2 | Context Revision 最小实现：`ctx-<yyyymmdd>[-N]` id 纪律 + sparse 变更记录形态 | 三节 Q1 / Q2，四节 4.2 |
| S3 | Current fold / 派生层：`fold()` + `currentContext()` + `contextHistory()`（纯函数，不依赖数组物理顺序） | 三节 Q3 / Q4，四节 4.2 |
| S4 | `expectedCurrent ↔ actualCurrent` 一致性断言（进 check-data.mjs） | 三 Q4 双重保护，八节 8.1/8.2 |
| S5 | 数据迁移 / Initial Version：既有生产状态（15 节点语义字段 + MAP_ERA + 5 条 Observation + CYCLE_INDUSTRIES stage）全量快照，`date` = 迁移执行日 | 五节 |

**明确不做（本轮）：**

- **Consumer migration** —— 6 个既有消费者（IndustryMap / Thesis / ThesisDetail / Home / Cycle / polarity.ts）一行不改；
- 任何历史 Version 的展示 / UI；
- 超出 S1～S5 的任何数据模型扩张。

---

## 三、Allowed Files（精确清单，来自 18 号文 Code Audit）

> 原则：**清单外的文件一律不允许修改。**「我觉得这个文件也应该改一下」= 违反授权。

### 3.1 允许新建（2 个）

| 文件 | 用途 |
|---|---|
| `app/src/data/domains/context-history.ts` | CONTEXT_HISTORY 数据层（S1/S2/S5） |
| `app/src/data/context.ts` | 派生层：fold / currentContext / contextHistory（S3）——职责边界见七节锁 1 |

### 3.2 允许修改（2 个，限定改法）

| 文件 | 允许的修改 | 不允许的修改 |
|---|---|---|
| `app/src/data/content.ts` | **仅追加** barrel 导出两行（`./domains/context-history` 与 `./context`） | 不改动既有 13 行导出、不改注释结构 |
| `app/scripts/check-data.mjs` | **仅追加** C1 断言块（S4 + 18 号文八节五条铁律断言） | 不修改、不删除既有 174 项断言中的任何一条 |

### 3.3 允许追加（1 个，实施完成后）

| 文件 | 用途 |
|---|---|
| `app/00_PROJECT/V2/06_V2_IMPLEMENTATION_LOG.md` | 追加 C1 实施记录（沿用既有格式：Impact / 验证 / Not Changed） |

### 3.4 特别登记：允许范围内**但不得修改**的数据文件

Strategy B（18 号文三 Q4）下，以下文件的当前态**保持手写原样**——
它们的既有内容被 initial version **快照引用**，而不是被改写：

```text
app/src/data/domains/map.ts     ← 不改
app/src/data/domains/now.ts     ← 不改
app/src/data/domains/cycle.ts   ← 不改
```

---

## 四、Forbidden Changes（违反 = 实现错误，立即回 Review）

| # | 禁止项 |
|---|---|
| F1 | Thesis / Revision / Ledger / Current Belief 的任何修改（`domains/theses.ts` / `domains/ledger.ts` / `data/ledger.ts`） |
| F2 | `deriveCurrentBelief()` 及其调用路径 |
| F3 | IndustryMap 的 consumer migration（含行 196 `t.probability` 直读 = G-08，不修） |
| F4 | Thesis / ThesisDetail / Home / Cycle / `polarity.ts` 的任何 consumer 重构 |
| F5 | G-08 / G-05 / InkTransition 既有债（不顺手修） |
| F6 | 任何 UI（页面、组件、样式、交互） |
| F7 | Distribution 相关任何内容（15 号文边界） |
| F8 | Universal Version System（C1/C4 不共享实现） |
| F9 | 任何超出 18 号 Contract 的数据模型扩张（含给 Version 加 delta/direction/previous 字段） |
| F10 | 新依赖 / package.json / 构建配置改动 |
| F11 | Commit / Push（本授权不含） |

---

## 五、Validation Standard（全部通过才算实施完成）

### 5.1 契约断言（18 号文八节，进 check-data.mjs）

```text
Revision Event        → 无语义变化无 Version；reason 必填非空
Sparse Inheritance    → 抽样：未提及字段的 fold 结果 === 上一有效状态
Current fold          → fold(CONTEXT_HISTORY) === map/now/cycle 当前态
Historical Immutability → readonly + 无 update/delete 入口 + 历史 Version 抽检未被篡改
No-op                 → 无多余 Version
Deterministic Ordering → date + 同日 -N 序号，fold 不依赖数组物理顺序
Initial Migration     → initial 为唯一全量快照；无任何 Version date 早于 initial
Consistency           → expectedCurrent !== actualCurrent → BUILD FAILURE（check exit 1）
```

### 5.2 V2 既有回归

- `npm run check`：既有 174 项全过 + 新增 C1 断言全过；
- `npm run build` ✓；
- `npm run lint`：无新增 error（InkTransition 既有 1 个保持原样）；
- CDP 实测定位（精确化）：**CDP 不是 C1 的功能正确性证明**——
  C1 的正确性来源 = 18 Contract Validation + C1 assertions + 既有 174 assertions；
  CDP 只用于确认 **No unintended UI surface change**（零 UI 变更的反向证明），
  不得因 CDP PASS 而声称 C1 数据契约已被验证。

---

## 六、Production Review Gate

```text
Implementation（S1～S5，三、四、七节边界内）
      ↓
Validation（五节全部通过）
      ↓
Implementation Review（技术复核：实现 vs 18 号 Contract 逐条对账）
      ↓
Production Review（战略复核：是否守住极小 Blast Radius）
      ↓
Commit（届时另行授权，建议单 commit 或「数据+派生 / check」两 commit，由 Review 定）
      ↓
Push（用户手动）
```

> **Implementation Authorization ≠ Commit Authorization。本授权本身不授权 Commit / Push。**

---

## 七、实施级不变量（Authorization Review 三锁，LOCKED 时并入）

### 锁 1 · `context.ts` 职责写死：Read/Derivation Boundary，NOT Second Canonical Source

```text
CONTEXT_HISTORY
      ↓
    fold()
      ↓
context.ts ──→ currentContext() / contextHistory()

NOT:

CONTEXT_HISTORY ───┐
                   ├→ two sources of truth   ❌
context.ts ────────┘
```

- `context.ts` 只持有派生逻辑，**不得持有任何独立状态**；
- 防止其未来从「Current 派生层」演变成新的 Canonical Context Store；
- 对应 AI-01 / AI-02 防双源原则。

### 锁 2 · `CONTEXT_HISTORY` append-only 落实到 API 层

允许：`append revision`（新增条目）。
不允许：`update / delete / rewrite historical revision`。

**代码中不得存在** `updateContextHistory()` / `deleteContextHistory()` 或任何等价入口——
比文档声明 readonly 更强：不可变由「不存在可调用入口」保证。

### 锁 3 · C1 不得顺手解决 G-BoW-2 的 UX 面

C1 解决的是 **Context Revision Boundary**，不是完整的 Context Historical UX / Archive System。
本轮禁止出现：

```text
history UI / timeline UI / historical Map / date selector / revision viewer
```

也不得为「验证历史可读」增加任何产品 UI——验证停留在 **data + derivation + assertion + tests**。
依据：Architecture Asset ≠ Product Feature（14 号文 / 16 号文明示风险）。

---

## 八、Authorization Review 裁决记录（2026-08-25）

> **PASS WITH LOCKS → 补 3 条实施级不变量 → LOCKED。**

| 项目 | Review |
|---|---|
| Authorization Scope（S1～S5，不做 Consumer migration） | ✅ PASS |
| Allowed Files（来自 Code Audit，非架构倒推；content.ts 仅 +2 exports；check-data.mjs 仅追加断言） | ✅ PASS |
| Forbidden Files / Areas（F1～F11） | ✅ PASS |
| Strategy B（map/now/cycle 保持现状，initial 只快照引用） | ✅ PASS |
| Validation（5.1 契约断言 + 5.2 回归） | ✅ PASS（CDP 定位精确化后） |
| Commit / Push 边界（F11 保留） | ✅ PASS |
| `context.ts` 职责边界 | ⚠️→✅ 锁 1 已补 |
| History append-only API | ⚠️→✅ 锁 2 已补 |
| G-BoW-2 / UI 边界 | ⚠️→✅ 锁 3 已补 |

**Review 原话入档**：「这是 V2-07 以来第一次真正跨过 Architecture → Contract → Authorization → Code 的闸门。
从这一刻开始，代码必须服从 18/19 号文，而不是反过来让代码推动架构。」

```text
19 LOCKED → single-file commit → STOP → 开始 C1 Code Implementation
```

---

**修订记录**

| 版本 | 日期 | 内容 |
|---|---|---|
| v0.9-candidate | 2026.08.25 | Authorization 候选稿：六问锁定——Authorized（授权链 17→18→19）；Scope 仅 S1～S5（不做 Consumer migration）；Allowed Files 精确清单（新建 2 + 限定修改 2 + 实施完成后追加 1，map/now/cycle 登记为「范围内但不得修改」）；Forbidden F1～F11；Validation = 18 号文八节断言 + V2 回归；Production Review Gate；本授权不含 Commit/Push。待 Review，不 Commit |
| **v1.0 · LOCKED** | **2026.08.25** | **Authorization Review PASS WITH LOCKS：补 3 条实施级不变量（锁 1 context.ts = Read/Derivation Boundary 非第二事实源；锁 2 append-only 落实到 API 层、不得存在 update/delete 入口；锁 3 禁止顺手解决 G-BoW-2 UX 面、验证停留 data+derivation+assertion+tests）；CDP 定位精确化（非功能正确性证明，仅确认零 UI 意外变更）；追加八节裁决记录；头部标记 CANONICAL · V2-C1 · IMPLEMENTATION AUTHORIZED · LOCKED；单文件 Commit，不 Push；Commit 后 STOP，随后方可开始 C1 Code Implementation** |
