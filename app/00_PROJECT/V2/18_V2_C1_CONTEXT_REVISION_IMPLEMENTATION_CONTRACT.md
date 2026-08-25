# V2-18 · C1 CONTEXT REVISION — IMPLEMENTATION CONTRACT（实施契约）

> **CONTRACT · LOCKED · V2-C1 · v1.0**
> Contract Review = PASS WITH AMENDMENTS（6 项裁决已并入）→ Final Review **PASS**（2026-08-25）。
> **Contract LOCKED ≠ 自动允许写代码**——须再单独发出明确的 **C1 Implementation Authorization**
>（TradingLabb 从「架构工程」进入「生产工程」的闸门）。
> 执行边界：纯文档、不改代码、不改 UI、Push 由用户手动。

---

## 一、Contract Status & Scope

```text
C1 · Context Revision Boundary
P0 · Authorized（17 号文 7.1，第一轮仅授权 C1 + C4）

Architecture Source:
  13 号文（Method · CONTEXT 步）
  14 号文 F-4 / OD-3（G-BoW-2 = Deferred Architecture Gap，Context Revision Boundary 契约）
  16 号文（V2-07 Closure）
  17 号文（P0 Authorization + 四问 + 禁止事项）

Implementation: NOT AUTHORIZED YET
```

**Scope（以二节 Code Audit 为唯一事实依据）：**

| 范围 | 内容 | 依据 |
|---|---|---|
| **In-Scope A** | `domains/map.ts`：`MapNode` 语义状态字段 + `MAP_ERA.current/note` | 14 号文 F-4 点名「Map 节点状态」 |
| **In-Scope B** | `domains/now.ts`：`OBSERVATIONS` 滚动 | 14 号文 F-4 点名「Observation 滚动」 |
| **In-Scope C**（Review 裁决 ① ACCEPT） | `domains/cycle.ts`：**仅** `CYCLE_INDUSTRIES[].stage` | 「当前产业处于什么阶段」= Context 语义状态；若因位于 cycle.ts 而排除，等于让**语义边界跟着文件边界走**——错误 |
| **Out-of-Scope（显式排除）** | `cycle.ts` 的 layout / presentation / derived geometry；`dimensions.ts` / `framework.ts` / `system.ts` / `wuwei.ts` / `manifesto.ts`（静态框架层，非演化状态） | 裁决 ① 限制 + Audit 二节 |
| **Out-of-Scope（禁止触碰）** | Thesis / Revision / Current Belief / Ledger（AI 边界，七节禁止 4） | 17 号文 7.5 |

> **裁决 ① 确立的永久原则：C1 按语义字段纳入，而不是按文件纳入。**
> C1 保护的是「语义状态」，不是某一个文件中的字段集合。

---

## 二、现状 Audit（代码事实，非架构推断）

> 审计对象：`app/src`。审计日期：2026-08-24。本节只登记代码事实。

### 2.1 Context 的实际落点与数据结构

「Context」在代码中**没有字面命名实体**（全 src 仅 `ink/engine.ts` 出现 canvas context，无关）。
架构概念的实际载体是三个数据模块（含裁决 ① 纳入的 cycle stage）：

**A · `domains/map.ts`（产业地图，15 节点）**

`MapNode` 字段按「演化 vs 结构」二分（本次 Audit 的关键事实）：

| 类别 | 字段 | 性质 |
|---|---|---|
| **语义状态（可演化 = C1 的保护对象）** | `state`（yang/yin/turn 景气）、`valuation`（stretched/fair/washed 估值）、`penetration`、`stageFocus`、`stateNote`、`observation` | 随认知演化而改写，前态丢失 |
| 结构/布局 | `id` / `name` / `en` / `stage` / `x` / `y` / `size` / `links` / `MAP_EDGES` | 画布与图结构，非认知状态 |
| 关联引用 | `essays?` / `theses?` | 引用关系，非状态 |

外加 `MAP_ERA.current`（佩雷斯标尺 0–4 连续刻度）+ `MAP_ERA.note` —— 同为可演化 Context 状态。

**B · `domains/now.ts`（OBSERVATIONS，当前 5 条，人工维护 3–5 条滚动）**

`Observation { id, title, summary, date, mapNodeId?, thesisId? }`。
前态丢失方式：**条目被替换/移除或 summary 被改写**，滚动即覆盖。

**C · `domains/cycle.ts`（裁决 ① 纳入）**

`CYCLE_INDUSTRIES[].stage`（行业在七阶段间的当前位置）——可演化语义状态；
同文件的 stage 文案、展示顺序、几何派生**不属于** C1。

### 2.2 创建 / 修改方式（mutable boundary 究竟在哪里）

- 全部为**静态 TS 数据模块**：没有运行时 mutation、没有 CMS、没有保存按钮。
- 「修改」= 人工编辑源文件 → 旧值被新值**就地覆盖**。
- 唯一的「历史」是 git commit history：对运行时不可见、非结构化、无法回答
  「2026 年 6 月时 HBM 节点的 state/valuation 是什么」。
- **Mutable boundary = 源文件本身**。这就是 C1 要加时间维度的精确位置。

### 2.3 消费者（谁读 Context）

| 消费者 | 读取 | 方式 |
|---|---|---|
| `pages/IndustryMap.tsx` | `INDUSTRY_MAP` / `MAP_EDGES` / `MAP_ERA` / `MAP_ESSAY` | 直接 import（另：行 196 直读 `THESES.probability` = G-08 既有债，**本任务不修**） |
| `pages/Thesis.tsx` / `ThesisDetail.tsx` | `INDUSTRY_MAP.nodes` | 经 `deriveThesisPolarity(thesis, nodes)` 同源推导 polarity |
| `pages/Home.tsx` | `OBSERVATIONS`（slice 0–5）+ `INDUSTRY_MAP.nodes` | 直接 import |
| `pages/Cycle.tsx` | `CYCLE_INDUSTRIES` | 直接 import |
| `data/polarity.ts` | `MapNode`（类型 + state） | Thesis 对 Context 是**读取派生依赖，非存储依赖** |

### 2.4 既有 revision / history 机制（可复用纪律，不可复用实体）

`domains/ledger.ts` + `data/ledger.ts`（V2-06 已生产验证）：

- **append-only 实体**：`Revision`，id 含日期 + 同日 `-N` 序号；`reason` 必填；`evidence?` 可被外部验证
- **派生不持久化**：`deltaOf` / `directionOf` 唯一计算入口，禁止字段持久化
- **Current = 确定性派生**：`deriveCurrentBelief` = date + 同日序号排序后末条 `current`；
  无记录回落 `thesis.probability`（migration-era fallback）——**渐进迁移模式已有先例**
- **R-01**：Current 不依赖数组物理顺序
- **`scripts/check-data.mjs`**：esbuild 打 barrel → 运行时断言的事前校验（当前 174 项），C1 断言的自然扩展点

### 2.5 迁移现实

生产已有 15 节点当前状态 + `MAP_ERA.current` + 5 条 Observation + CYCLE_INDUSTRIES 当前 stage，**零历史记录**。
过去的 Context 演化已永久丢失——C1 只能从今天开始，不能伪造昨天。

---

## 三、C1 四问（Review 裁决后锁定为 Contract 语义）

### Q1 · 什么产生 Version？（裁决 ③ ACCEPT + LOCK DEFINITION）

**Canonical Definition（锁定）：**

> **A Context Revision is a deliberate cognitive update to one or more semantic Context fields, accompanied by a reason.**
> **Context Revision 是对一个或多个语义 Context 字段进行的有意认知更新，并必须伴随 reason。**

> **Version 的粒度不是 field mutation，而是 cognitive revision event。**

| 行为 | Version |
|---|---:|
| `state` 改变 | ✅ |
| `valuation` 改变 | ✅ |
| `penetration` 改变 | ✅ |
| `stageFocus` 改变 | ✅ |
| `stateNote` 改变且表达认知变化 | ✅ |
| `observation` 改变且表达认知变化 | ✅ |
| `MAP_ERA.current/note` 改变 | ✅ |
| `CYCLE_INDUSTRIES[].stage` 改变 | ✅ |
| Observation 条目改写 / 移除 | ✅ |
| 多节点同时调整 | ✅ **一个 Revision** |
| `x` / `y` 调整 | ❌ |
| `size` 调整 | ❌ |
| `links` / `edges` 调整 | ❌ |
| 结构增删节点本身 | ❌（记 git） |
| 纯文字润色（typo/措辞，语义不变） | ❌（写不出 reason 的变化不是 Revision） |
| no-op 保存 | ❌（不得制造虚假 Version，八节断言） |

### Q2 · Version 唯一标识是什么？

**沿用 V2 已验证的确定性 id 纪律，不引入新机制。**

```text
id: ctx-<yyyymmdd>[-N]     // 同日多个修订事件加序号后缀，seq 由后缀派生
date: 'YYYY.MM.DD'         // 字典序 = 时间序（全站统一）
```

原则核验：确定性 ✓、可排序 ✓（date + seqOf，复用 R-01 排序纪律）、不可歧义 ✓。
**不引入**：全局自增 ID、UUID、createdAt 时间戳（无运行时，手工维护，徒增不一致面）。

### Q3 · 历史 Version 如何读取？

**两种读取语义 + 只读铁律（命名经裁决 ④ 锁定）：**

```text
currentContext()   → 当前 Context（派生结果，见 Q4）
contextHistory()   → 全部 Version 的只读事实列表（按确定性次序）
```

铁律：

- 历史 Version 是**只读事实**：数据层 `readonly` 类型 + check 断言 + 派生层不提供任何 update/delete 路径（与 Ledger append-only 同纪律）；
- 禁止「读旧版本 → 改旧版本 → 覆盖历史」的任何代码路径——不存在可调用入口，而不仅是约定。

### Q4 · Current 如何派生？（裁决 ② ACCEPT：方案 B）

**Current 是 Version History 的派生结果——走「渐进迁移」而非「SSOT 硬切换」。**

方案取舍记录：

| | 方案 A · SSOT 硬切换 | **方案 B · 旁路账本 + 一致性断言（ACCEPT）** |
|---|---|---|
| 机制 | map.ts 不再手写当前态，Current = fold(history) 唯一来源 | map.ts / cycle.ts 保持当前态；新增 append-only `CONTEXT_HISTORY`；check 断言「fold(history) === 当前态」，漂移 = 构建前失败 |
| 先例 | 无 | `deriveCurrentBelief` 迁移期模式（Ledger 优先、snapshot fallback、check 护航） |
| 消费者改动 | 全部改走派生 API | **零改动**（Blast Radius 最小：6 个消费者一行不改） |
| 双源风险 | 无双源 | 双源被 check 断言**收敛为构建前失败**，而非运行时漂移 |

**裁决 ② 的三条接受理由（入档）：**

1. **降低 Blast Radius**——IndustryMap / Thesis / ThesisDetail / Home / Cycle / polarity.ts 六个消费者无需因 C1 改写；
2. **与现有迁移纪律一致**——C1 的目标不是一次性重构所有 Context Consumer，而是**先建立历史事实 + 一致性约束，再逐步迁移读取路径**；
3. **形成双重保护**——

```text
CONTEXT_HISTORY
      ↓
    fold()
      ↓
 expectedCurrent

map.ts / cycle.ts / now.ts
      ↓
 actualCurrent

expectedCurrent !== actualCurrent
      ↓
BUILD FAILURE
```

不允许「History 是一套说法，当前代码又是另一套说法」。

Version 记录形态：每个 Version 存**变更对象的 sparse 新状态**（只记变了的节点/字段/Observation/stage）。
**禁止**在 Version 里存 `delta` / `direction` / `previous` 式派生事实（七节禁止 3）——
前后对比由派生层从相邻 Version 计算，与 `deltaOf` 同纪律。

终态方向（登记，不承诺）：未来可收拢为方案 A（Current 唯一来源 = fold），与「Ledger 优先、snapshot 为 fallback」的演进路径一致。

---

## 四、Context History Contract（命名与稀疏语义，裁决 ④⑥ 锁定）

### 4.1 命名（裁决 ④）

- **REJECT**：`ContextRevisionLedger` 及一切「换名平行账本」方向——违反 AI-05/AI-06 边界纪律：Context Version History ≠ Research Ledger；
- **LOCKED**：数据层实体 `CONTEXT_HISTORY`（条目类型 `ContextHistory`）；读取 API `currentContext()` / `contextHistory()`。

### 4.2 Sparse History 语义（裁决 ⑥ ADD，锁定）

每个 Version 只存 sparse 变更，**未提及的字段语义 = 未发生变化，继承上一有效状态**：

```text
v1:  A = x   B = y   C = z      （initial，唯一全量快照）
v2:  A = x2                     （sparse）
     → v2.B = y（继承 v1）
     → v2.C = z（继承 v1）

fold(v1, v2, v3, ...) → Current Context
```

任何 Version **不要求**复制完整 Context Snapshot——这正是要避免的冗余；
`fold` 是唯一合法的「补全」方式，且 fold 结果不得持久化。

### 4.3 实体文件（与 Ledger 双层同构，实体完全独立）

```text
domains/context-history.ts   ← 数据层（append-only 事实，readonly）
data/context.ts              ← 派生层（fold / currentContext / contextHistory）
```

### 4.4 职责边界表（Context Versioning ≠ Research Ledger）

| | Research Ledger（既有） | Context History（本 Contract） |
|---|---|---|
| 记录对象 | Belief / Revision（conviction 数值修正） | Context interpretation（状态字段快照） |
| 中心 | Thesis-centric（一条 Revision 一个命题） | Context-centric（一个事件可跨节点） |
| 事实形态 | previous/current 数值对 + reason | sparse 状态变更 + reason |
| Current | Current Belief（deriveCurrentBelief） | Current Context（currentContext） |
| 回答的问题 | 「我现在多相信这个命题，为什么变了」 | 「我当时怎么理解这个产业环节」 |
| 实体 | `Revision` / `LEDGER` | `ContextHistory` / `CONTEXT_HISTORY` |

---

## 五、Migration Strategy（裁决 ⑤ ACCEPT）

**永久数据诚信原则（锁定，C1 epistemic discipline）：**

> **The initial Context version records the first observable state of the versioned system, not a reconstructed historical state.**
> **历史不可知 ≠ 历史不存在。迁移不得伪造不存在的历史。**

1. **Initial Version**：`ctx-<迁移执行日>` 一条，`reason = 'C1 迁移：既有生产状态登记为初始版本'`；
   内容为当前 15 节点语义状态 + MAP_ERA + 5 条 Observation + CYCLE_INDUSTRIES stage 的**完整快照**
   （唯一一条全量 Version，fold 起点）。
2. **Initial Version 的 date = 迁移执行日**，不回填任何更早日期——

```text
existing map.ts state          ✅        HBM was already like this in 2025   ❌
        ↓                                   ↓
 migration date                       Context v1 dated 2025
        ↓                            （无历史证据，不得倒填）
 Context v1
```

3. 迁移前的历史（过去 Context 演化）**永久缺失且在系统中显式不可查**——
   这正是 14 号文 F-4 登记的损失，C1 防止的是**未来**的丢失。
4. OBSERVATIONS 的迁移：当前 5 条进入 initial snapshot；未来条目的改写/移除按 Q1 产生 Version。

---

## 六、Backward Compatibility

**目标：Existing Consumer 零重构。**

```text
Existing Consumer（IndustryMap / Thesis / ThesisDetail / Home / Cycle / polarity.ts）
       ↓ 继续直接 import INDUSTRY_MAP / OBSERVATIONS / MAP_ERA / CYCLE_INDUSTRIES —— 一行不改
Current Context（map.ts / now.ts / cycle.ts 当前态）
       ↑ check 断言：fold(CONTEXT_HISTORY) === 当前态
CONTEXT_HISTORY（append-only，新增）
```

- 方案 B 下 `map.ts` / `now.ts` / `cycle.ts` 的导出形态**完全不变**；
- 派生层 `data/context.ts` 是**新增**文件，不改任何既有文件导出；
- `check-data.mjs` 扩展断言是 C1 唯一的既有文件改动面之一（另一是新增两个数据/派生文件 + initial 迁移）；
- polarity 推导（deriveThesisPolarity）读当前态，天然不受影响。

---

## 七、禁止事项（Contract 级，违反 = 实现错误）

1. **禁止复制 Ledger**：不得出现 `ContextRevisionLedger` 式换名平行账本（裁决 ④ 已 REJECT 该命名方向）；4.4 职责表为裁决依据。
2. **禁止 Universal Version System**：C1 与 C4 共享设计讨论，**不共享实现**（17 号文 7.5）。
3. **禁止持久化派生事实**：Version 不得含 `delta` / `direction` / `previous` 字段；前后对比一律派生。
4. **禁止修改 Thesis / Revision / Current Belief / Ledger**：C1 是 Context Boundary，不是 Research Canonical 重构。
5. **禁止顺手修 G-08 / G-05 / InkTransition**（含 IndustryMap 行 196 的 probability 直读）。
6. **禁止增加 UI**：本阶段只解决 Data Integrity；历史 Version 的展示不属于 C1。
7. **禁止按文件边界定义 C1 范围**：语义字段纳入原则（裁决 ①）——cycle.ts 仅 stage 受保护，layout/presentation/derived geometry 明确排除。

---

## 八、Validation Contract（实施完成后必须全部通过）

### 8.1 行为断言（数据层，进 check-data.mjs）

```text
Create（initial）        → Version 1 存在且为唯一全量快照
Modify（语义字段）        → Version 2（sparse；未提及字段继承——4.2）
Modify again            → Version 3
Read Current            → fold(V1..V3) === map.ts / cycle.ts / now.ts 当前态
Read Historical         → V1 / V2 内容不变（immutability）
Reload（重跑 check）     → 相同结果（determinism）
Existing consumers      → 零改动、零回归（build + 既有 174 项 check 全过）
```

### 8.2 五条铁律断言

| 铁律 | 断言 |
|---|---|
| **No-op** | 无语义变化时不存在对应 Version（history 末条之后当前态与 fold 一致且无多余 Version） |
| **Determinism** | 同数据状态 → 同 Current（fold 纯函数，不依赖数组物理顺序——R-01 同纪律） |
| **Sparse Inheritance** | 抽样断言：某 Version 未提及字段的 fold 结果 === 上一有效状态（4.2） |
| **Historical Immutability** | 类型 readonly + 派生层无 update/delete 入口 + check 抽检历史 Version 字段未被后续编辑篡改 |
| **Migration Honesty** | initial version date = 迁移日；check 断言无任何 Version 的 date 早于 initial |

### 8.3 工程验证（沿用 V2 纪律）

`npm run check` / `build` / `lint` 全过；CDP 实测仅作**回归验证**（页面应与实施前像素级一致——零 UI 变更的反向证明）。

---

## 九、Contract 授权状态

```text
Contract Draft（本文档）
      ↓
Strategic / Architecture Review   ← PASS WITH AMENDMENTS（十节）
      ↓
Final Review → Contract LOCKED
      ↓
C1 Implementation Authorization（另行明确发出——闸门，不自动放行）
      ↓
Code
      ↓
Validation（八节）
```

九节原 5 个开放点已全部裁决（见十节），本文档不再有开放设计问题。

---

## 十、Contract Review 裁决记录（2026-08-25）

> **C1 Contract Review：PASS WITH AMENDMENTS。**
> 架构质量确认：「没有把 Context 强行实体化，而是从真实代码反推 C1 边界」——方法正确。
> 6 项裁决全部并入正文，无遗留开放点。

| # | 开放点 | 裁决 | 落档位置 |
|---|---|---|---|
| ① | `CYCLE_INDUSTRIES[].stage` | **ACCEPT 纳入**——按语义字段纳入，不按文件纳入；cycle layout/presentation/derived geometry 排除 | 一节 In-Scope C + 七节禁止 7 |
| ② | 方案 B（旁路账本 + 一致性断言） | **ACCEPT**——Blast Radius 最小、与 deriveCurrentBelief 迁移纪律一致、expectedCurrent ≠ actualCurrent → BUILD FAILURE 双重保护 | 三 Q4 |
| ③ | Revision Event 粒度 | **ACCEPT + LOCK DEFINITION**——「对一个或多个语义 Context 字段的有意认知更新，并必须伴随 reason」；粒度 = cognitive revision event，不是 field mutation | 三 Q1 定义与行为表 |
| ④ | 实体命名 | **REJECT `ContextRevisionLedger` 方向；LOCKED `ContextHistory` / `CONTEXT_HISTORY` / `currentContext()` / `contextHistory()`** | 四节 4.1 |
| ⑤ | Initial Version | **ACCEPT**——date = 迁移执行日；提升为永久数据诚信原则：initial version 记录的是 versioned system 的第一个可观察状态，不是重构的历史状态；「历史不可知 ≠ 历史不存在」保留 | 五节 |
| ⑥ | Sparse History 语义 | **ADD BEFORE LOCK**——未变化字段继承上一有效状态；fold 是唯一合法补全方式；fold 结果不得持久化 | 四节 4.2 |

**闸门重申（Review 原话入档）：**

```text
C1 Architecture → 17 Prioritization → 18 Implementation Contract
      ↓
🔒 Contract LOCKED
      ↓
❌ 仍然不能自动写代码
      ↓
C1 Implementation Authorization   ← TradingLabb 从「架构工程」进入「生产工程」最重要的闸门
      ↓
Code
```

---

**修订记录**

| 版本 | 日期 | 内容 |
|---|---|---|
| v0.9-candidate | 2026.08.24 | Contract 候选稿：Code Audit（Context 实际落点 = map.ts 语义字段 + now.ts 滚动；mutable boundary = 源文件覆盖；6 类消费者；Ledger 既有纪律）+ C1 四问提案 + Versioning Boundary 职责表 + 迁移诚信原则 + 六项禁止 + Validation Contract；待 Review，不 Commit |
| v0.95-amended | 2026.08.25 | Contract Review PASS WITH AMENDMENTS：6 项裁决并入——① CYCLE_INDUSTRIES.stage 按语义字段纳入（In-Scope C）② 方案 B ACCEPT + 双重保护图 ③ Revision Event Canonical Definition 锁定 + 行为表 ④ 命名锁定 ContextHistory/CONTEXT_HISTORY ⑤ Initial Version 永久诚信原则 ⑥ Sparse Inheritance 语义入 4.2；追加十节裁决记录；待 Final Review → LOCKED，仍不 Commit |
| **v1.0 · LOCKED** | **2026.08.25** | **Final Review PASS：五点复核确认（语义边界提升 / Strategy B 锁定 / Cognitive Revision Event 定义保持原文 / ContextHistory 命名 + Sparse fold 闭合 / Initial Version 诚信原则）；头部标记 CONTRACT · LOCKED · V2-C1 · v1.0；单文件 Commit，不 Push；Commit 后立即停止，不进入代码** |
