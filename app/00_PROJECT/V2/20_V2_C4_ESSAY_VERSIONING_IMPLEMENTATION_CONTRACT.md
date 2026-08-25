# V2-20 · C4 ESSAY VERSIONING — IMPLEMENTATION CONTRACT（实施契约）

> **CONTRACT · LOCKED · V2-C4 · v1.0**
> Contract Review = PASS WITH REQUIRED AMENDMENTS（6 项 OD 已并入）→ Final Contract Review **PASS WITH LOCKS**（2026-08-25，三把 Implementation Boundary 锁见十三节）。
> 授权来源：17 号文（C4 = P1 · Authorized）+ C1 Closure PASS 后的 C4 Contract 启动许可。
> **Contract LOCKED ≠ Implementation Authorized**——须另发 C4 Implementation Authorization（与 C1 完全同款闸门）。
> 执行边界：纯文档、不改代码、不改 UI、Push 由用户手动。
> **纪律：C4 从 Code Audit 反推，不套用 C1 数据模型；C1/C4 共享版本化思想 ≠ 共享实现（17 号文 7.5）。**

---

## 一、Contract Status & Scope

```text
C4 · Essay Versioning
P1 · Authorized（17 号文 7.1，第一轮仅授权 C1 + C4）

Architecture Source:
  09 号文 13.3（Slowly Evolving 档：Version 而非覆盖）
  14 号文 F-5 / OD-4（G-BoW-1；Thesis Revision 属 Research Ledger，
        Essay Revision 属 Work/Publication Layer，不得混同）
  17 号文 7.5（概念同源、实现分离；禁 Universal Version System）
  C1 Closure（18/19 号文 + f4b9290，作为闸门流程先例，而非数据模型模板）

Implementation: NOT AUTHORIZED YET
```

**Scope：**

| 范围 | 内容 |
|---|---|
| **In-Scope** | `ESSAYS` **六篇全部纳入**（OD-6 ACCEPT）的 Version History 数据架构（Work Layer） |
| **Out-of-Scope（禁止）** | Version Timeline UI / Diff Viewer / Archive UI / Essay CMS / Universal Version System / Distribution automation（七节） |
| **Out-of-Scope（不碰）** | Thesis / Revision / Ledger / Current Belief / `CONTEXT_HISTORY` / 全部消费者组件 |

> OD-6 裁决理由入档：**Versioning 是 Work Architecture 的能力，而不是内容价值评级。**
> 凡属 Canonical Work 的对象应具备一致的 Version History 语义；
> 人为区分「方法类/世界观类纳入、研究/市场观类不纳入」会形成 `Some Essays = Works / Other Essays = Documents`
> 的危险隐性分类与长期维护成本。

---

## 二、现状 Audit（代码事实，审计日期 2026-08-25）

### 2.1 Essay 的 canonical source 与真实形态

- **唯一事实源 = `domains/essays.ts` 的 `ESSAYS: Essay[]`**（6 篇，无 CMS、无运行时）。
- `Essay` 字段：`id`（slug）/ `no`（编号 001–006）/ `date`（'YYYY.MM.DD'）/ `category` / `title` / `subtitle` / `readTime` / `related[]`（栏目级 path——G-05 挂起中）/ `body: EssayBlock[]`（p / h / quote 三类结构节点）。
- 数组物理顺序 ≈ 编号倒序（006 在前、001 在末）——**阅读顺序，非版本语义**。

### 2.2 既有 revision 痕迹

- **数据层零版本机制**：无 version 字段、无修订记录结构。
- 唯一痕迹是**文件头注释**：「行文结构（2026-08-15）：body 从平铺段落升级为结构节点数组」——
  一次真实的作品层演化，只存在于注释里。这正是 G-BoW-1 的现状证据。

### 2.3 消费者（谁读 ESSAYS）

| 消费者 | 读取 | 方式 |
|---|---|---|
| `pages/Essays.tsx` | `ESSAYS.map`（列表） | 直接 import |
| `pages/Essay.tsx` | `ESSAYS.find(id)` + body 渲染 + h 节点自动生成锚点目录 + 「其他文章」slice | 直接 import |
| `pages/IndustryMap.tsx` | `MAP_ESSAY = 'thesis-writing-os'`（id 引用） | 间接 |
| `pages/System.tsx` | 硬编码链接 `#/essays/casino-boss` | 间接 |
| `domains/map.ts` | `essays?: string[]`（id 引用，gpu/power 节点） | 间接 |
| `domains/site.ts` | 导航 / ARCHIVE_TREE | 间接 |

**关键事实：所有消费者按 `id` 引用 Essay，没有任何消费者关心「版本」。**
→ C4 的兼容性目标与 C1 同构：消费者零改动。

### 2.4 Mutable boundary

与 C1 相同：修改 = 人工编辑 essays.ts → 就地覆盖，git history 是唯一历史。
区别：**Essay 的覆盖单位是整篇作品**（body 是 prose 结构节点，不是可按键值 sparse 的状态字段）。

---

## 三、C4 核心问题（OD-1～OD-5 裁决后锁定）

### 3.0 字段三层拆分（OD-1 MODIFY · 锁定）

**Work Identity / Work Content / Presentation Metadata 必须分开：**

| 字段 | 层 | 进 Version 快照 | 进一致性断言 | 触发 Version |
|---|---|---|---|---|
| `id` | **Work Identity** | 作为 `essayId` | ✓ | —（身份不变） |
| `title` / `subtitle` / `category` / `body` | **Work Content** | ✓ | ✓ | ✓（语义变化时） |
| `no` | Presentation（排序/编号语义） | ❌ | ❌ | ❌ **`no` 不参与 Version identity，编号调整不是作品修订** |
| `readTime` | **Version-associated metadata** | ✓（随版本记录） | ❌（不机械纳入 equality） | ❌（单独修改不触发） |
| `related[]` | 结构关系（G-05 范畴） | ❌ | ❌ | ❌ |
| `date` | 首次发布日 | ❌（留在 ESSAYS） | ❌ | ❌ |

> 锁定的表述：**`readTime` 是 Version-associated metadata，但不是 Version identity**——
> 防止未来 metadata 漂移被误判成作品修订。

### Q1 · 什么算一个 Essay Version？

**An Essay Version is a deliberate revision of the work itself — its Work Content — accompanied by a reason.**
**（Essay Version 是对作品 Work Content 的有意修订，必须伴随 reason。）**

| 行为 | Version |
|---|---:|
| `body` 语义变化（段落/小节/引文的实质增删改） | ✅ |
| `title` / `subtitle` 变化 | ✅ |
| `category` 变化（作品定位更改） | ✅ |
| typo / 标点 / 措辞润色（语义不变） | ❌ |
| `readTime` / `no` / `related[]` 单独变化 | ❌ |
| 渲染层 / 排版调整 | ❌ |
| no-op | ❌ |

> 粒度单位 = **一篇作品的一次修订**，天然不跨篇。
> （与 C1「跨节点状态修订事件」思想同源、粒度不同。）

### Q2 · Version 的唯一身份？（OD-2 ACCEPT · 锁定）

```text
EssayVersion identity = { essayId, version }        // version: number（1, 2, 3 …）
展示层才使用 'v1' / 'v2' 字样——数据层不把 'v1' 当自由字符串
history ordering     = version（同篇内严格递增，不依赖数组物理顺序）
history mutation     = append-only
date                 = 该 Version 的修订执行日（'YYYY.MM.DD'）
同日两次修订          = 两个 version 序号（版本号消化同日问题）
删除 / 覆盖历史 Version = 禁止（append-only 落到 API 层）
```

**与 C1 的语义差异（保持，不统一 ID 模型）：** C1 的 `ctx-<date>[-N]` 表达时间序列中的
Cognitive Revision Event；C4 的 `essayId + vN` 表达**同一作品的第几个稳定版本**。

### Q3 · 历史 Version 如何读取？

```text
currentEssay(essayId)   → 当前版本（= ESSAYS 中的作品本身）
essayHistory(essayId)   → 该篇全部 Version 的只读事实列表（按 version 升序）
```

- 历史 Version 只读：readonly 类型 + **不存在 update/delete 入口**（没有代码路径，不只是约定）；
- 层级归属：Essay Version History 属 **Work Layer**；`ESSAYS` 仍是消费者的唯一读取源。

### Q4 · Current 如何派生？（OD-3 ACCEPT：整篇 Snapshot · 锁定）

**C4 = whole-work snapshot，不做 sparse fold。**

理由（裁决原意入档）：Context 有天然字段语义所以 sparse→fold 合理；Essay 是
paragraph/argument/section/prose，**没有稳定的 sparse semantic field**——
强行做 `paragraph-3 changed / sentence-21 modified` 式 diff 会制造虚假精确性。
版本的意义是「**这篇作品在某个时间点的完整可读形态**」，不是「机器 diff 了哪些字符」。

```text
ESSAYS（当前作品，手写维护，消费者零改动）
      ↑ check 断言：每篇 latest Version 快照的 Work Content === ESSAYS 当前对应字段
ESSAY_VERSIONS（append-only 历史，新增）
```

一致性断言范围（修正后锁定）：**只覆盖 Work Content（id / title / subtitle / category / body）**；
`no` / `readTime` / `related` / `date` 等 metadata 不机械纳入 equality。

---

## 四、Versioning Boundary（三系统并立，互不混同）

| | Research Ledger（V2-06） | Context History（C1） | **Essay Version（C4）** |
|---|---|---|---|
| 回答 | HSN 的**信念**发生了什么变化 | HSN 当时如何**理解**这个产业环节 | HSN 对这个**思想作品的表达**发生了什么变化 |
| 中心 | Thesis-centric | Context-centric（事件可跨节点） | **Work-centric（一篇作品一次修订）** |
| 记录形态 | previous/current 数值对 + reason | sparse 状态变更 + reason | **整篇快照 + version 序号 + reason** |
| Current | deriveCurrentBelief | fold(CONTEXT_HISTORY) | **ESSAYS 本身（latest Work Content 一致性断言护航）** |
| 历史语义 | Research Memory | Research Memory（sparse → fold） | **Work Memory（snapshot → latest）** |
| 层 | Research System | Research System（语境侧） | **Work / Publication Layer** |
| 实体 | Revision / LEDGER | ContextHistory / CONTEXT_HISTORY | **EssayVersion / ESSAY_VERSIONS（OD-4 锁定）** |

**边界铁律（14 号文 OD-4 / AI-08）：** Thesis Revision 与 Essay Version 概念同源、实现分离；
reason 可引用 thesisId 作叙事关联，**但实体不得互相替代、不得合并，version 上不得挂 thesisId 字段**
（十一节最小模型）。

**命名纪律（OD-4）：** 禁止 `EssayHistory`（不是单纯历史读取机制，是 Work Version Entity）、
`PublicationHistory`（改变层位语义）、`EssayRevisionLedger` / `VersionLedger`（错误拉向 Research Ledger）。

---

## 五、Migration Strategy（OD-5 MODIFY · 锁定）

> **历史不可知 ≠ 历史不存在。**
> The initial Essay version records the first observable state of the versioned work, not a reconstructed historical state.

1. 六篇各建 **v1**：快照 = 迁移执行日的当前 Work Content；`date = 迁移执行日`。
2. **双日期区分**：`Essay.date`（首次发布日）保持不动；Version 的 date = 进入版本系统的日子。
   **不得**把 v1 倒填为首次发布日。
3. **2026-08-15 结构升级（OD-5 核心裁决）：**

```text
2026-08-15
    ↓
historical evidence（代码头注释 = 证据）
    ≠
historical version（不等于当日存在完整可恢复可验证的 snapshot）
```

   **不补记为历史 Version**；v1 的 reason 可以提及，但必须是**证据陈述**，不是历史重建：

   > 语义范式：*The existing source contains a dated note indicating a structural evolution on 2026-08-15; no historical snapshot is reconstructed from that note.*
   > 禁止写成：*v1 represents the August 15, 2026 revision.*（前者诚实，后者伪造 Version History）

---

## 六、Backward Compatibility

- `essays.ts` 导出形态**完全不变**，六个消费者零改动；
- 新增 `domains/essay-versions.ts`（数据层）+ `data/essay.ts`（派生层：`essayHistory()` / `currentEssay()`）——
  与 C1 双层同构但**代码独立**（不 import、不抽象共享基类）；
- `check-data.mjs` 追加 C4 断言块，既有断言（含 C1 的 [21]–[26]）零改动；
- `content.ts` 仅追加 barrel 导出行。

---

## 七、禁止事项（Contract 级）

1. **禁止 Universal Version System**：不得抽象 `VersionableEntity` 或复用 `CONTEXT_HISTORY` 代码路径；
2. **禁止混同 Thesis Revision 与 Essay Version**（四节铁律，AI-08）；
3. **禁止 UI**：Version Timeline / Diff Viewer / Archive UI / History 页面——Architecture Asset ≠ Product Feature；
4. **禁止 Essay CMS**、禁止 Distribution automation；
5. **禁止持久化派生事实**（diff / delta / previous / direction 字段）；
6. **禁止 update/delete 历史 Version 的代码入口**；
7. **禁止触碰**：theses.ts / ledger.ts / data/ledger.ts / context-history.ts / data/context.ts / 全部页面组件 / G-08 / G-05 / InkTransition；
8. **禁止把 v1 倒填为首次发布日或将 2026-08-15 补记为历史 Version**（五节）；
9. **C4 不得复制 C1 的机制清单（写死）**：`fold()` / sparse changes / `previous` / `delta` / `direction` / Cognitive Revision Event / `ContextHistory` 均不属于 C4——
   C4 的形态是 `Essay → EssayVersion → Whole Snapshot → Latest Version → Current Essay consistency`；
10. **禁止顺手建立关联网络**：version 上不挂 `authorId` / `publicationId` / `platform` / `distributionId` / `thesisId` / `themeId`（十一节）。

---

## 八、Validation Contract（实施完成后必须全部通过）

```text
结构       → 六篇各有 v1；version 同篇从 1 严格递增连续；reason 必填非空
快照完整    → 每个 Version 的 Work Content（title/subtitle/category/body）齐备
一致性     → 每篇 latest Version 的 Work Content === ESSAYS 当前对应字段（漂移 = check exit 1）
            （no / readTime / related / date 不纳入 equality——3.0 表）
只读       → readonly + 派生层无 update/delete 入口 + 历史 Version 抽检未被篡改
确定性     → essayHistory 按 version 序号排序，不依赖数组物理顺序
No-op     → 不存在「Work Content 与上一 Version 逐字段相同」的虚假 Version
迁移诚信   → 所有 v1 date = 迁移执行日；Essay.date 原值未动；无 Version date 早于迁移日
边界       → version 条目上不存在 thesisId/themeId/authorId 等关联字段（静态扫描）
回归       → 既有 189 项（含 C1 15 项）全过 + build + lint 无新增 + preview 冒烟
```

---

## 九、Contract 授权状态

```text
Contract Draft
      ↓
Strategic / Architecture Review   ← PASS WITH REQUIRED AMENDMENTS（十二节）
      ↓
Final Review → CONTRACT · LOCKED · V2-C4 · v1.0
      ↓
C4 Implementation Authorization（另行，闸门不自动放行）
      ↓
Code → Validation → Implementation Review → Production Review → Commit Authorization
```

九节原 6 个开放点已全部裁决（十二节），本文档不再有开放设计问题。

---

## 十、C4 最小模型（锁定）

```text
EssayVersion
├── essayId          // Work Identity（= 现有 slug）
├── version          // number，同篇严格递增
├── date             // 'YYYY.MM.DD'，修订执行日
├── reason           // 必填
├── body             // 整篇快照的 Work Content
└── [version-associated metadata]   // title/subtitle/category + readTime（关联记录，非身份）
```

```text
version identity   = essayId + version
history ordering   = version
history mutation   = append-only
current            = ESSAYS
historical source  = ESSAY_VERSIONS
```

**不增加**：`authorId` / `publicationId` / `platform` / `distributionId` / `thesisId` / `themeId`——
除非现有 Canonical Architecture 明确要求，不在 C4 顺手建立关联网络。

---

## 十一、新增 C4 Architecture Invariant（随 Final Review 锁定后入 AI 序列）

> **Essay Version records are historical Work snapshots, not a second canonical source for the current Essay.**

```text
ESSAYS          = Current Canonical Work
ESSAY_VERSIONS  = Historical Work Memory

而不是：

ESSAY_VERSIONS  = canonical → ESSAYS = derived   ❌
```

与 C1 的 `CONTEXT_HISTORY ≠ Current Context Source` **语义平行，但代码实现不统一**——
平行边界恰好强化 AI-05 / AI-06 / AI-08。

**Final Review 前四项不变量自查：**

| 不变量 | 本文档落点 |
|---|---|
| AI-05：C4 不复制 Research System | 独立实体 + 独立派生层 + 七节禁止 1/9 |
| AI-06：Essay Version History ≠ Research Ledger | 四节职责表 + 命名纪律（禁 Ledger 系命名） |
| AI-08：Thesis Revision ≠ Essay Version | 四节铁律 + 七节禁止 2/10 |
| NEW：ESSAY_VERSIONS ≠ Current Canonical Essay Source | 本节 |

---

## 十二、Contract Review 裁决记录（2026-08-25）

> **C4 Contract Review：PASS WITH REQUIRED AMENDMENTS。**
> 核心架构判断成立：C4 = Essay 的 Work Version History，不是 C1 Context History 的复制品。

| OD | 内容 | 裁决 | 落档位置 |
|---|---|---|---|
| ① | `no` / `readTime` | **MODIFY**——三层拆分（Work Identity / Work Content / Presentation Metadata）；`no` 不进 Version identity；`readTime` = version-associated metadata 但非身份、不进 equality | 3.0 表 |
| ② | Version identity | **ACCEPT**——`{ essayId, version:number }`；`v1` 字样仅展示层；ordering = version | 三 Q2 |
| ③ | Snapshot vs Sparse | **ACCEPT 整篇快照**——prose 无稳定 sparse semantic field，强行 diff = 虚假精确 | 三 Q4 |
| ④ | 命名 | **ACCEPT `EssayVersion` / `ESSAY_VERSIONS`**；禁 `EssayHistory` / `PublicationHistory` / `*Ledger` | 四节 |
| ⑤ | 2026-08-15 | **MODIFY**——historical evidence ≠ historical version；不补记；v1 reason 只许证据陈述 | 五节 3 |
| ⑥ | 六篇全部纳入 | **ACCEPT**——Versioning 是 Work Architecture 能力，不是内容价值评级 | 一节 |

**系统级成果（Review 原意入档）：两个清晰的历史模型并立——**

```text
RESEARCH MEMORY:  Context → sparse → fold
WORK MEMORY:      Essay   → snapshot → latest
不同对象，不同历史语义——比统一 Version Engine 更干净。
```

---

## 十三、Final Contract Review 记录（2026-08-25）

> **C4 Contract：PASS WITH LOCKS → 封板。**
> 六项 OD 复核全部通过；未发现需退回设计层的结构性问题。
> 三把 Implementation Boundary 锁作为 Final Review 确认项写入，随 LOCKED 生效：

### LOCK-C4-01 · Current Source 不得迁移

Implementation 阶段 `ESSAYS` 继续是 Current Canonical Essay Source。
不得出现 `ESSAY_VERSIONS → derive Current ESSAYS`；也不得为「统一架构」把 C4 改造成类似 C1 的 fold。

### LOCK-C4-02 · Metadata 不得进入 Version Equality

Snapshot equality 只由 Work Content（id / title / subtitle / category / body）决定；
`no` / `readTime` 属 associated metadata。必须防止未来实现出现
`metadata changed → content changed → new Version` 的误判链。

### LOCK-C4-03 · Version Creation 必须仍然是显式事件

禁止 `git diff → 自动生成 Version` 或 `任何字段变化 → 自动 Version`。

> **A Version represents a deliberate new readable form of a Work.**
> Version 是**作品层事件**，不是文件系统 diff 事件——这是 C4 与 C1 的根本差异之一。

**长期数据诚信原则保留（Review 确认）**：
**结构升级发生过 ≠ 可以证明它是一个历史 Version**——`v1.date = migration date`，
除非存在足够证据证明某日确实发生了一次符合 Version Definition 的作品修订。

**Review 结语入档**：「C1 和 C4 已经形成了一个漂亮但非常克制的双时间轴——
这不是在追求『所有东西都版本化』，而是在解决两个不同的问题：
**研究认知如何记住变化，作品如何记住形态。**」

**后续闸门（与 C1 完全一致）**：

```text
20 CONTRACT · LOCKED · V2-C4 · v1.0
      ↓ 单文件 Commit（docs(v2): establish C4 essay versioning implementation contract，不 Push）
      ↓
⏸ C4 Implementation Authorization → Authorization Review → Code Implementation
```

---

**修订记录**

| 版本 | 日期 | 内容 |
|---|---|---|
| v0.9-candidate | 2026.08.25 | C4 Contract 候选稿：Code Audit + 四问独立作答 + 三系统职责边界表 + 迁移诚信 + 八项禁止 + Validation Contract + 6 开放点；待 Review，不 Commit |
| v0.95-amended | 2026.08.25 | Contract Review PASS WITH REQUIRED AMENDMENTS：6 项 OD 并入——① 字段三层拆分表（3.0）② `{essayId, version}` identity ③ 整篇快照锁定 ④ 命名纪律 ⑤ 08-15 = 证据非版本 ⑥ 六篇全纳入；新增十节最小模型、十一节 C4 Invariant + 四项不变量自查、十二节裁决记录；禁止事项扩至 10 条；一致性断言范围修正为 Work Content |
| **v1.0 · LOCKED** | **2026.08.25** | **Final Contract Review PASS WITH LOCKS：六 OD 复核全过、无结构性退回；三把 Implementation Boundary 锁（LOCK-C4-01 Current Source 不得迁移 / LOCK-C4-02 Metadata 不进 equality / LOCK-C4-03 Version 是作品层显式事件非 diff 事件）+ 长期诚信原则入十三节；头部标记 CONTRACT · LOCKED · V2-C4 · v1.0；单文件 Commit，不 Push；闸门保持 Contract LOCKED ≠ Implementation Authorized** |
