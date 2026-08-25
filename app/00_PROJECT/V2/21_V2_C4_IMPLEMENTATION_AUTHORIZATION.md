# V2-21 · C4 IMPLEMENTATION AUTHORIZATION — 实施授权

> **CANONICAL · V2-C4 · IMPLEMENTATION AUTHORIZED · LOCKED**
> Authorization Review = **PASS WITH LOCKS**（2026-08-25），裁决记录见七节。
> 20 号 Contract（CONTRACT · LOCKED · V2-C4 · v1.0）定义「怎么做」；本文档定义「**现在允许做什么、不允许做什么**」。
> **本文档不重新审查、不修改 20 号 Contract；发现 Contract 缺口回 Contract Review，不在授权层解释。**
> **本授权不授权 Commit / Push（F11）。**
> 纪律：**流程与 19 号文同构，实现方案不复制**——Allowed Files 来自 Code Audit（20 号文二节，2026-08-25，审计后代码零变动），不是架构猜测。

---

## 一、Authorization Decision

```text
C4 · Essay Versioning
Decision: AUTHORIZED（待本文档 LOCKED 后生效）

授权链:
  17 号文（P1 · Authorized）
    → 20 号文（CONTRACT · LOCKED · V2-C4 · v1.0）
    → 21 号文（本文档，Implementation Authorization）

约束:
  · 本授权不改变 20 号 Contract 的任何条款（含 LOCK-C4-01/02/03）；
  · 本授权仅覆盖第二节 Scope；
  · 本授权 ≠ Commit 授权 ≠ Push 授权。
```

---

## 二、Implementation Scope（极小 Blast Radius）

**允许实现的，且仅允许以下四项：**

| # | 范围项 | 契约依据（20 号文） |
|---|---|---|
| S1 | `ESSAY_VERSIONS` 数据实体：`EssayVersion` 类型（`{ essayId, version, date, reason, body + version-associated metadata }`，readonly，append-only） | 十节最小模型 |
| S2 | 迁移 / v1 快照：六篇各建 v1（Work Content 整篇快照；`date` = 迁移执行日；reason 含 08-15 的证据陈述） | 五节，OD-5/OD-6 |
| S3 | 派生层：`essayHistory(essayId)` / `currentEssay(essayId)`（version 序号确定性排序；**不存在 update/delete 入口**） | 三 Q3 |
| S4 | 一致性断言（进 check-data.mjs，含五节十项 + 反向架构断言） | 八节 |

**明确不做（本轮）：**

- **不迁移 Current Source**——`ESSAYS` 继续保持 Canonical Current Source（LOCK-C4-01）；
- 任何 Version 展示 / UI / timeline / viewer；
- 超出 S1～S4 的任何数据模型扩张或关联网络。

---

## 三、Allowed Files（精确清单，来自 20 号文二节 Code Audit）

> 原则：**清单外的文件一律不允许修改。**

### 3.1 允许新建（2 个）

| 文件 | 用途 |
|---|---|
| `app/src/data/domains/essay-versions.ts` | ESSAY_VERSIONS 数据层（S1/S2） |
| `app/src/data/essay.ts` | 派生层：essayHistory / currentEssay（S3）——Read/Derivation Boundary，不持有独立状态 |

### 3.2 允许修改（2 个，限定改法）

| 文件 | 允许的修改 | 不允许的修改 |
|---|---|---|
| `app/src/data/content.ts` | **仅追加** barrel 导出两行（`./domains/essay-versions` 与 `./essay`） | 不改动既有 15 行导出（含 C1 追加的 2 行） |
| `app/scripts/check-data.mjs` | **仅追加** C4 断言块 | 不修改、不删除既有 189 项断言中的任何一条（含 C1 的 [21]–[26]） |

### 3.3 允许追加（1 个，实施完成后）

| 文件 | 用途 |
|---|---|
| `app/00_PROJECT/V2/06_V2_IMPLEMENTATION_LOG.md` | 追加 C4 实施记录 |

### 3.4 特别登记：允许范围内**但不得修改**的数据文件

```text
app/src/data/domains/essays.ts   ← 不改（LOCK-C4-01：ESSAYS = Current Canonical Source，
                                    v1 快照只复制其 Work Content，不改写源文件；
                                    Essay.date 首次发布日原样保留）
```

---

## 四、Forbidden Changes（违反 = 实现错误，立即回 Review）

**C4 三把 Boundary 锁（20 号文十三节，转为实施级禁止项）：**

| # | 禁止项 |
|---|---|
| F-C4-01 | `ESSAY_VERSIONS ≠ Current Canonical Essay Source`——不得让 Version 数据反向驱动 `ESSAYS`，不得出现 derive-Current 方向 |
| F-C4-02 | `Metadata ≠ Work Content`——`no` / `readTime` 等 metadata 变化不得自动产生 Version，不得进入 content equality |
| F-C4-03 | `Version ≠ File Diff`——不得根据 git diff、字段 mutation 或任何自动检测机制产生 Version；Version 是作品层显式事件 |

**延续性禁止项：**

| # | 禁止项 |
|---|---|
| F4 | C1 机制泄漏：fold / sparse / previous / delta / direction / Cognitive Revision Event / ContextHistory 不得出现在 C4 |
| F5 | 命名：禁 `EssayHistory` / `PublicationHistory` / `*Ledger` |
| F6 | Universal Version System（不得抽象 `VersionableEntity`，不得复用 C1 代码路径） |
| F7 | 关联网络：version 条目上不得挂 `authorId` / `publicationId` / `platform` / `distributionId` / `thesisId` / `themeId` |
| F8 | UI / timeline / version viewer / Archive UI / Essay CMS / G-BoW-2 UX |
| F9 | Newsletter / Distribution 任何内容 |
| F10 | 触碰：theses.ts / ledger.ts / data/ledger.ts / context-history.ts / data/context.ts / 全部页面组件 / G-08 / G-05 / InkTransition / 新依赖 / 构建配置 |
| F11 | Commit / Push（本授权不含） |
| F12 | v1 倒填首次发布日；把 2026-08-15 补记为历史 Version（证据 ≠ 版本） |

---

## 五、Validation Standard（比 C1 简单——C4 没有 fold，不制造 C1 式复杂测试）

### 5.1 C4 断言（进 check-data.mjs）

```text
① 六篇 → 六条 version history（每篇至少 v1）
② version identity = { essayId, version:number }；同篇 version 从 1 严格递增连续
③ version ordering 确定性（不依赖数组物理顺序）
④ v1 date = 迁移执行日；Essay.date 原值未动；无 Version date 早于迁移日
⑤ snapshot 完整性：Work Content（title/subtitle/category/body）齐备
⑥ 一致性：每篇 latest Version 的 Work Content === ESSAYS 当前对应字段；
   metadata（no/readTime/related/date）不纳入 equality（漂移 = check exit 1）；
   含合成用例：latest 快照仅 metadata 不同 → equality 仍成立且不产生新 Version（LOCK-C4-02 落到代码契约）
⑦ No-op：不存在 Work Content 与上一 Version 逐字段相同的虚假 Version
⑧ 只读：readonly + 无 update/delete 入口（API 面扫描）
```

### 5.2 反向架构断言（关键）

```text
ESSAY_VERSIONS 的存在不得改变任何 Current Essay consumer 的数据来源：
  · 静态扫描 pages/ 与 domains/：除派生层外无任何文件 import essay-versions
  · Essays.tsx / Essay.tsx 仍从 content barrel 读 ESSAYS
```

### 5.3 机制泄漏扫描

```text
essay-versions.ts / data/essay.ts 中不得出现：
fold / sparse / previous / delta / direction / ContextHistory / Ledger 字样（注释除外——
注释中引用边界纪律允许，标识符禁止）
```

### 5.4 V2 既有回归

`npm run check`（既有 189 项全过 + 新增 C4 断言全过）/ `build` ✓ / `lint` 无新增 error /
preview 冒烟（HTTP 200）+ git diff 证明零 UI 文件改动（CDP 定位同 C1：非功能正确性证明）。

---

## 六、Production Review Gate

```text
Implementation（S1～S4，三、四节边界内）
      ↓
Validation（五节全部通过）
      ↓
Implementation Review（实现 vs 20 号 Contract 逐条对账）
      ↓
Production Review（极小 Blast Radius 复核）
      ↓
Commit Authorization（另行明确——Authorization ≠ Commit Authorization）
      ↓
Commit（不 Push；Push 用户手动）
```

---

## 七、Authorization Review 裁决记录（2026-08-25）

> **21 号文：PASS WITH LOCKS → IMPLEMENTATION AUTHORIZED · LOCKED。**
> 核心结论：未发现需退回 Contract 层的结构性问题；21 号文没有把 C1 的实现机制复制到 C4，符合「概念同源、实现分离」。

### 7.1 核心对账（全项通过）

Scope S1～S4 正确排除 fold/sparse ✅；`essayHistory()`/`currentEssay()` 足够覆盖读取语义 ✅；
Allowed Files 来自 Code Audit ✅；`essays.ts` 不修改 🔒（LOCK-C4-01 核心执行边界）；
F-C4-01/02/03 均得到 Implementation 层映射 🔒；Migration Honesty（F12）🔒；
Consumer 不迁移 ✅；反向架构断言 ✅（C4 最有价值的专属 Validation）；机制泄漏扫描 ✅；
Commit/Push 不含于本授权 ⏸（正确）。

### 7.2 三锁确认 + 一条新增纪律

- **LOCK-C4-01（第一优先级）**：`ESSAYS → Current Consumers` ∥ `ESSAY_VERSIONS → Historical Work Memory`；
  禁止 `ESSAY_VERSIONS → currentEssay() → Consumers` 方向。
  **C4 第一轮实现不是迁移 Current Source，而是给 Current Source 增加历史记忆能力。**
- **LOCK-C4-02**：Metadata/Content 必须在代码层真正分离——Validation 5.1 ⑥ 已补合成用例
  （latest 快照仅 metadata 不同 → equality 仍成立且不产生新 Version），防止三层拆分停留在文档概念。
- **LOCK-C4-03**：`Git diff ≠ Essay Version`；`任何字段变化 ≠ 自动 Version`——Version 必须来自显式作品层事件。
- **新增纪律（Review 四节）**：`data/essay.ts` 职责保持极窄——是 Essay History / Current Essay Read Boundary，
  不得演化成 Essay Repository / Service / Manager / Version Engine，
  不得形成 `ESSAYS ↕ data/essay.ts ↕ ESSAY_VERSIONS` 三角依赖；
  **`ESSAY_VERSIONS` 是历史数据，`essay.ts` 是读取/派生边界，不是第二个 Canonical Source。**

### 7.3 Validation 五层框架（Review 三节确认）

```text
Current Source Integrity + Historical Version Integrity + Consumer Source Integrity
+ Metadata Equality Integrity + Mechanism Separation
```

### 7.4 后续动作（Review 五节）

21 号文 LOCKED → 单文件 Commit（不 Push）→ 才允许进入 C4 Code Implementation
（严格限于 S1～S4 + Allowed Files）→ Validation → Implementation Review → Production Review → Commit Authorization。

---

**修订记录**

| 版本 | 日期 | 内容 |
|---|---|---|
| v0.9-candidate | 2026.08.25 | Authorization 候选稿：授权链 17→20→21；Scope 仅 S1～S4；Allowed Files 来自 20 号文 Code Audit（新建 2 + 限定修改 2 + 记录 1；essays.ts 登记为「范围内但不得修改」）；Forbidden = F-C4-01/02/03 + F4～F12；Validation 十项 + 反向架构断言 + 机制泄漏扫描；Gate 保持 Authorization ≠ Commit Authorization。待 Review，不 Commit |
| **v1.0 · LOCKED** | **2026.08.25** | **Authorization Review PASS WITH LOCKS：核心对账全项通过；三锁确认（LOCK-C4-01 第一优先级：给 Current Source 增加历史记忆而非迁移；LOCK-C4-02 落代码契约——5.1 ⑥ 补 metadata 合成用例；LOCK-C4-03 Version 非 diff 事件）；新增 data/essay.ts 极窄职责纪律（禁 Repository/Service/Manager/Engine 演化，防三角依赖）；Validation 五层框架入档；头部标记 CANONICAL · V2-C4 · IMPLEMENTATION AUTHORIZED · LOCKED；单文件 Commit，不 Push** |
