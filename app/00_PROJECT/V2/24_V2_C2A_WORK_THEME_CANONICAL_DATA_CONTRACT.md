# V2-24 · C2-A WORK / THEME CANONICAL DATA CONTRACT — 规范数据契约

> **CONTRACT · CANONICAL · V2-C2-A · v1.0 · LOCKED**
> Contract Review **PASS WITH LOCKS**（2026-08-25：7 × ACCEPT + 1 × ACCEPT WITH LOCK（AC-6），
> 无 REJECT；裁决记录与 LOCK-C2A-01 见十三节）。
> 起草授权来源：23 号文十节 Q1 裁决（2026-08-25）——**C2-A = Authorized for Contract Drafting Only**。
> 本文档是 Canonical Data Contract，**不是数据库设计文档，不是实现方案**。
> **Contract LOCKED ≠ Implementation Authorized**——C2-B / Theme-only Data Layer 须经
> 新一轮 Prioritization → 另发 Authorization，与 C1/C4 完全同款闸门（17 号文 7.5 / 20 号文头部先例）。
> 执行边界（全程已遵守）：**零代码、零 UI、零 Schema 改动、零 Commit、零 Push。**

---

## 一、Purpose & Authorization Boundary

本契约回答一个问题：

> **Work / Theme 是否、以及如何成为 Canonical Organization Layer——
> 在不创造第二套 Research / Revision / Version / CMS 系统的前提下。**

授权边界（23 号文十节原样承接）：

| 允许 | 禁止 |
|---|---|
| 起草本契约候选稿 | 写任何代码 |
| 定义 Identity / Ownership / Reference Boundary | 建立 Data Layer |
| 得出「不实施」结论 | 修改现有 Schema |
| 得出「分裂」结论（Theme 先行 / Work 缓行） | Commit / Push |

本契约的合法产出集合是**三值的**，三者地位完全平等：

```text
Outcome 1   Theme = Canonical Entity（契约定义）+ Work = Canonical Entity（契约定义）
Outcome 2   Theme = Canonical Entity（契约定义）+ Work = Architecture Concept / Deferred Entity
Outcome 3   双方均暂缓实体化（契约仅登记边界，C2-B 不进入下一轮候选）
```

> **Outcome 2 / 3 不是失败，是完整且合法的 C2-A Contract Outcome**（23 号文 Q6 治理结论的直接推论）。
> 本契约的使命是回答真问题，不是为 C2-B 开路。

---

## 二、Input Constraints（全部 LOCKED，不在本契约内重议）

| # | 输入 | 关键约束 |
|---|---|---|
| I-1 | 14 号文 · Body of Work Architecture · LOCKED | Work/Theme 最小模型；AI-07（≠ Publication Archive）；AI-08（≠ Canonical Research Object，No Duplicate Canonical Content）；Canonical Themes v1.0（4 个，九节）；Theme Admission Test 五问 + 增一退一纪律；OD-5 顺序 |
| I-2 | 23 号文 · C2 Re-Prioritization · LOCKED | 双层 Code Audit 结论；Q6 = YES（允许契约不对称）；**Theme-first ≠ Work-first**；**允许 Theme 先行 ≠ 提前授权 Theme Data Layer**（10.3 两道 Gate）；Semantic Blast Radius 框架 |
| I-3 | 战略侧 Audit Findings（23 号文 2.6 已仓库级复核） | AF-3 禁嵌套聚合；AF-5 防 Taxonomy 退化；AF-6 禁复制 C1/C4 machinery；AF-8 C2-B 的价值 = 稳定身份；AF-9 Proof 永不实体化 |
| I-4 | 仓库事实基线（2026-08-25 · HEAD 1180eab） | 全仓无 `Work`/`Theme` 实体；C1/C4 基础设施零增量、零 UI 消费；222/222 断言通过；命名碰撞三处（`system.ts` 的 `theme` 字段 / `cycle.ts` 的 `THEME_*` / `essay-versions.ts:25` 的 `Work Identity` 注释） |
| I-5 | AI-01～AI-12 | 全部适用；本契约任何条款与 AI 序列冲突时，条款作废并回 Architecture Review |

---

## 三、Canonical Entity Qualification（实体资格判定）

> 纪律（战略侧输入，本契约写死）：**关系不能先于实体语义。**
> 先分别回答两个实体的资格问题，之后（第六节）才谈 Relationship Contract。

### 3.1 Theme —— 资格判定：**充分，可进入契约定义**

**为什么 Theme 需要独立 Canonical Identity？**

1. **认知定义已独立成文并 LOCKED**：四个 Canonical Theme（T-01 技术范式→资本重定价 /
   T-02 周期信号先于基本面 / T-03 政策意志与产业能力的距离 / T-04 人性与共识在价格中显形）
   是长期问题容器，不是内容分类（14 号文九节）。其认知价值不依附于任何单个 Thesis/Essay。
2. **有资格治理机制**：Admission Test 五问 + 增一退一纪律已 LOCKED——没有独立身份，
   准入/合并/降级事件将无处登记（原 T-04 并入 T-01、原 T-05 降级 Method，已是两次真实治理事件）。
3. **索引轴心功能唯一**：2030 Reader Test 要求「按问题组织，不按日期」，
   Theme 是该组织的唯一轴心（23 号文四节第 2 问）。

**但同时登记（诚实条款）**：Theme 的认知价值当前**已在文档层（14 号文九节）完整承载**。
「资格充分」回答的是「值不值得拥有 Canonical Identity」，
**不等于**「数据层必须现在实施」——后者是 C2-B 的问题，由下一轮 Prioritization 裁决。

### 3.2 Work —— 资格判定：**不充分，维持 Architecture Concept / Deferred Entity**

**Work 为什么需要独立身份？——当前证据不足：**

1. **无代码债**：全仓不存在任何 Work 标识符，没有任何消费者因缺少 Work 实体而失效（23 号文 2.1）。
2. **无使用量证据**：C1/C4 基础设施上线至今零增量事件；Work 索引层的真实消费场景不存在（23 号文 2.2）。
3. **独立认知价值边际**：Work 不生产新认知，只登记归属；其「准入判断执行位」价值
   当前由 14 号文 3-Year Test 框架在文档层承载（23 号文四节第 1 问）。
4. **风险显著大于收益**：Work 是 Universal Content Relationship Layer 滑坡的最大风险位（AF-3）。

**本契约的正式判定（Outcome 2）：**

```text
Theme = Canonical Entity（本契约定义其 Identity / Semantics / Boundary）
Work  = Architecture Concept / Deferred Entity
        —— 保留 14 号文四节最小模型为架构定义，
           不定义 Data Identity，不建立任何代码占位
```

**Work 的再评估证据门槛（Deferred ≠ Rejected）**——以下任一条件满足时，
Work 实体资格可在未来 Prioritization 重开：

- 出现至少一个**真实消费场景**：某个研究/写作行为需要回答「这个 Research Object 属于 Body of Work 吗、属于哪个 Theme」且现有结构无法回答；
- Theme 数据层（若实施）运行后，其引用目标需要统一抽象（Theme → N 类对象的引用目标需要归一身份）；
- 内容规模越过手工索引阈值（参照 23 号文六节触发线纪律）。

---

## 四、Identity Contract

### 4.1 Theme Identity（契约定义）

| 项 | 契约 |
|---|---|
| Identity | **`theme-01` … `theme-04`**（数字序，永久稳定，与 14 号文九节编号一一对应） |
| 不变量 | id 一旦分配**永不复用、永不重排**；Theme 合并/降级事件登记为治理记录，不改 id |
| Question | Theme 的唯一语义本体 = 它的**长期问题句**（如「周期顶部与底部的信号，为什么总是先于基本面出现？」）；问题句变更 = versioned amendment（AI-04 同款纪律），不是静默编辑 |
| Chain label | 「Technology → Capital → Industry」等链式标签 = **展示层速记**，非身份、非语义本体 |
| 数量纪律 | ≤6（14 号文）；新增必须过 Admission Test 五问 + 增一退一；契约层面不设自动扩张机制 |

**命名空间划界（23 号文 2.4 的契约级解决）：**

- 数据层实体名 = `Theme` / id 前缀 `theme-`；
- `system.ts` 的 `theme: string`（SYSTEM_EVOLUTION 展示字段）与 `cycle.ts` 的
  `THEME_LIFECYCLE / THEME_LEVELS`（题材生命周期，taxonomy 语义）**保持原样、不改名**——
  它们属交易侧展示/方法内容，改名是内容修改，超出本契约授权；
- 契约要求：未来任何消费者引用 Canonical Theme 时必须使用 `theme-NN` id 或 `Theme` 类型名，
  **禁止**以裸字符串「theme」字段语义混用（由九节断言锁定）。

### 4.2 Work Identity（Deferred）

不定义。登记唯一原则：**若未来 Work 获得实体资格，其 identity 必须沿用既有 id 纪律先例**
（slug / `rev-` / `ctx-` 同构纪律，AF-8），且必须显式裁决与 `essay-versions.ts:25`
「Work Identity」注释的术语划界（Work.id ≠ Essay.id）。

---

## 五、Ownership & Source-of-Truth

```text
Research Object（Thesis / Essay / Journal / Observation / Map）
= canonical research truth —— 各域文件继续全权拥有，本契约零触碰

Theme
= canonical authorship organization 的长期问题维度
```

| 问题 | Theme 侧契约 |
|---|---|
| Theme **拥有**什么？ | 仅拥有：id、问题句（question）、定义（definition）、治理状态（canonical 清单成员资格 + 合并/降级记录）。**全部是语义字段，无内容字段** |
| Theme **引用**什么？ | 引用方向与载体在第六节定义；此处只锁原则：引用 = id 指针，永不复制被引对象的任何内容字段 |
| Theme **不拥有**什么？ | 不拥有任何 Research Object 的内容；不拥有 Revision/Version 历史；不拥有 conviction；不拥有 Distribution 字段 |
| Theme 清单的 SSOT | **当前 = 14 号文九节（文档层）**。数据层（若未来授权）建立后，文档层降级为定义文本存档，数据文件成为 SSOT——**迁移只准发生一次，且必须显式登记**；本契约不触发该迁移 |
| Work 的 SSOT | 不存在（Deferred Entity，无数据形态） |

---

## 六、Reference / Relationship Boundary

> 前提纪律已满足：两个实体的语义已在三～五节分别回答完毕，本节才定义关系。

### 6.1 当前裁决：**Relationship Contract 整体 Deferred**

理由：Work = Deferred Entity（3.2），「Theme ↔ Work」关系的一侧不存在；
而「Theme → Research Objects」直接引用在当前规模下（6 Essay / 8 Thesis / 15 节点）
不产生任何现有结构无法回答的问题——**关系层没有先行的合法性**。

### 6.2 预锁规则（未来任何 Relationship Contract 必须遵守，本契约即锁定）

| # | 规则 | 出处 |
|---|---|---|
| R-1 | **单边持有**：任何 Theme ↔ X 关系只在一侧持久化（哪一侧由未来契约裁决），禁止双向字段互拷（双向 = 双源） | 23 号文八问第 3 问 |
| R-2 | **引用 = id，不是对象**：禁止嵌套聚合（AF-3）；禁止 `work = { theses:[…], essays:[…], journals:[…] }` 形态 | AF-3 |
| R-3 | **封闭类型枚举**：引用目标的类型集合必须枚举封闭，禁止 generic `refType: string` | 23 号文八问第 7 问 |
| R-4 | **禁 generic metadata bag**：关系上不挂 `meta: Record<string, unknown>` 类自由字段 | 同上 |
| R-5 | **禁 Distribution 字段**：关系层永不出现 publicationId / distributionId / platform 字段 | AI-09～12 |
| R-6 | **Proof 不实体化**：证据维度永远由 Ledger + 引用派生，本契约不产生任何 Proof/Evidence 实体或字段 | AF-9 / AI-08 |

---

## 七、C1 / C4 Semantic Separation（硬约束）

```text
C1  CONTEXT_HISTORY   = State Reconstruction（Context 的认知修订史：sparse → fold）
C4  ESSAY_VERSIONS    = Content Versioning（作品内容的整篇快照史：snapshot → latest）
C2  Theme（本契约）    = Longitudinal Organization（长期问题簇的归属与索引）
```

**三者语义不同，机制不得共享**（23 号文 AF-6，实码异构已由 check [32] 锁定）：

- Theme 的治理事件（新增/合并/降级）走 **versioned amendment 纪律**（AI-04 同款，文档层登记），
  **不进** CONTEXT_HISTORY，**不进** ESSAY_VERSIONS，**不新建** ThemeHistory 实体；
- Theme 数据层（若未来实施）是**当下态登记表**，不是历史系统：
  合并/降级的叙事记录留在治理文档（修订记录节），数据层只保留当前有效清单与被并/被降者的去向指针；
- `essay-versions.ts:25` 的「Work Identity」注释划界：Work（Deferred Entity）与 Essay Version
  无任何机制关联；该注释的措辞修正列入十节 Open Questions，不在本契约内改代码。

---

## 八、Forbidden Structures（本契约最重要的防御节）

> 本节不只规定「应该有什么」，而是规定**绝对不能演化成什么**。
> C2 的核心风险不是功能不足，而是 Semantic Blast Radius（23 号文七节）。
> 以下每一项 = 命名禁令 + 结构禁令 + 机制禁令，适用于未来任何 C2 系实现。

| # | 禁止结构 | 禁止理由 | 检测方式（九节断言方向） |
|---|---|---|---|
| F-1 | `WorkHistory` / `ThemeHistory` | C2 无历史语义（Longitudinal Organization ≠ State Reconstruction） | 标识符扫描 |
| F-2 | `WorkVersion` / `ThemeVersion` | 版本语义属 C4（Content Versioning），Theme 治理走文档层 amendment | 标识符扫描 |
| F-3 | C2 层出现 `fold` / `sparse` / `snapshot` / `delta` / `previous` / `direction` 机制 | C1/C4 machinery 泄漏（AF-6）；C1 已有反向先例（check [32]） | 机制泄漏扫描（反向复用） |
| F-4 | 嵌套 Research Object 聚合（多类型 id 数组，如 `thesisIds[]` + `essayIds[]` + `journalIds[]` 并存于一个实体） | Universal Content Relationship Layer 滑坡起点（AF-3） | 字段形态断言 |
| F-5 | Theme taxonomy 化：以行业 / 板块 / 标签语义命名或组织 Theme（AI / Semiconductor / Robotics / Energy / China / US……） | Theme = 长期问题，≠ 分类器（AF-5）；`cycle.ts` 题材结构是现成退化模板 | question 字段必填且为问句形态断言 + Admission Test 引用 |
| F-6 | generic metadata bag（`meta` / `extra` / `attrs: Record<string, …>`） | 泛化实体系统的后门 | 类型断言 |
| F-7 | Distribution 字段（`publicationId` / `distributionId` / `platform` / `channel`） | AI-09～12；Distribution 是 Observation Surface，不进 Canonical Organization | 字段名扫描 |
| F-8 | 第二套 Proof / Evidence / Revision 实体或字段 | AF-9；证据维度只能由 Ledger + 引用派生 | 标识符扫描 |
| F-9 | Universal relationship table（`relations: { from, to, type }[]` 形态） | 泛化关系系统 = 知识图谱滑坡 | 结构断言 |
| F-10 | Work 的任何代码占位（`works.ts` / `Work` 类型 / `WORKS` 常量） | Work = Deferred Entity（3.2）；占位即实体化的既成事实 | 文件/标识符存在性断言（Deferred Guard） |

---

## 九、Contract-Level Validation / Assertions（实施时必须落成 check-data 断言组）

> **⚠ LOCK-C2A-01 适用于本节全部内容（Contract Review 2026-08-25 锁定，原文见十三节）：**
> **[33]–[40] 全部 = Contract Requirement → Future Implementation Specification / Acceptance Criteria。**
> **「可执行」≠「现在授权实施」；本契约及其 Review 不授权对 `check-data.mjs` 的任何代码修改，**
> **含 [39] Deferred Guard（其是否立即补入仍归 OQ-5 独立裁决）。**
>
> 本节是**契约级承诺**：若 C2-B（或仅 Theme 数据层）未来获得 Authorization，
> 以下断言组必须随实现一并交付；**未带断言的实现 = 违约实现**。
> 编号续接既有 32 组（候选区间 [33]–[40]，最终以实施任务单为准）。

| 候选组 | 断言内容 |
|---|---|
| [33] Theme Identity 纪律 | id 匹配 `^theme-\d{2}$`；唯一；与 14 号文九节编号一一对应；数量 ≤6 |
| [34] Theme 语义完整性 | 每个 Theme 的 question 必填且为问句形态（F-5 防线）；definition 必填 |
| [35] 引用完整性 | Theme 引用的所有 id 无悬空（指向真实存在的 Research Object）；单边持有（R-1）实证 |
| [36] 禁复制内容断言 | Theme/Work 层不出现被引对象的任何内容字段拷贝（AI-08 可执行化，比照 check [29] 模式） |
| [37] 机制泄漏反向扫描 | works/themes 系文件无 fold/sparse/snapshot/delta/previous/direction 标识符（F-3） |
| [38] 禁结构扫描 | 无 F-1/F-2/F-4/F-6/F-7/F-8/F-9 形态（标识符 + 字段形态联合断言） |
| [39] Deferred Guard | Work 维持 Deferred 期间：全仓不存在 `works.ts` / `Work` 实体导出（F-10）——**本组在当前代码基线下立即成立，建议随 24 号文 LOCK 后直接补入 check-data（需单独小授权）或并入下一授权任务** |
| [40] Consumer Source Integrity | 现有页面/派生层数据来源零改变（比照 check [32] 对 C4 的锁法） |

---

## 十、Open Questions & Deferred Decisions

| # | 问题 | 状态 |
|---|---|---|
| OQ-1 | Theme → Research Objects 的引用是否需要、以及持有侧 | Deferred 至 Relationship Contract（6.1）；本契约预锁 R-1～R-6 |
| OQ-2 | 「Work Identity」注释（essay-versions.ts:25）的措辞修正 | Deferred——需代码改动，走未来任意授权任务顺带处理，不单独开任务 |
| OQ-3 | Work 再评估证据门槛的具体度量（3.2 三条）在未来 Prioritization 如何核验 | Deferred 至下一轮 Prioritization |
| OQ-4 | Theme 治理事件（合并/降级）的文档层登记载体（14 号文 amendment vs 本契约修订记录） | 建议：沿用 14 号文 versioned amendment；本契约不新建登记实体 |
| OQ-5 | [39] Deferred Guard 断言是否值得一次独立小授权立即补入 check-data | 交战略侧随 Contract Review 一并裁决 |

---

## 十一、Implementation Gate

```text
23 号文 LOCKED（已完成）
      ↓
C2-A Contract Candidate（本文档 v0.1）      ←—— 当前停在这里
      ↓
Contract Review（战略侧）
      ↓
PASS / PASS WITH LOCKS → 本文档 LOCKED（单文件 Commit，由用户手动控制）
      ↓
新一轮 Prioritization（C2-B / Theme-only Data Layer 重新评估）
      ↓
Implementation Authorization（若裁决授权）
      ↓
Implementation + 九节断言组交付
      ↓
Validation
```

**退出条件（契约级承诺）**：若 Contract Review 发现三/四节的资格判定站不住
（例如 Theme 的问题句被证明可由现有结构派生），正确动作是**把 C2 整体退回 23 号文框架重新评估**，
而不是修订结论以保全本契约。

---

## 十二、Review / Acceptance Criteria

Contract Review 必须逐项核验：

1. **授权边界**：全文无代码、无 Schema 改动、无 UI 提案；产出集合三值性（一节）被保留而非被偷渡为 Outcome 1。
2. **Q6 落实**：Theme / Work 资格判定不对称（3.1 vs 3.2）；Work 的 Deferred 附证据门槛而非无限期搁置。
3. **关系不先于实体**：六节在三～五节之后，且当前裁决为 Deferred + 预锁规则，无提前接线。
4. **语义分离**：七节三系统边界与 AF-6 一致；无 history/version machinery 引入。
5. **八节完整性**：F-1～F-10 每条有禁止理由 + 可执行检测方向；无「只禁命名不禁结构」的漏项。
6. **九节可执行性**：每组断言能在现有 check-data.mjs 框架内实现，不依赖新工具链。
7. **AI-01～12 无冲突**：逐条对照（重点 AI-01/02/07/08/09-12）。
8. **OQ 清单**：Deferred 决策全部有归属（谁、何时、以何为据再议），无「以后再说」。

---

## 十三、Contract Review 裁决记录（2026-08-25）

> **C2-A Contract Review：PASS WITH LOCKS —— 7 × ACCEPT + 1 × ACCEPT WITH LOCK（AC-6），无 REJECT。**
> 核心结论：24 号文已完成「定义边界」，未偷渡「实施结论」；Outcome 2（Theme 资格充分 /
> Work 继续 Deferred）成立，与 23 号文 Q6 = YES 完全一致。
> **Review 纪律：不为 Lock 大改本文档、不新增章节、不 redesign F-1～F-10 / R-1～R-6——
> 防 Contract Scope Creep；本记录 + 九节锁标注即全部变更。**

### 13.1 裁决总表

| AC | 内容 | 裁决 | 修改 |
|---|---|---|---|
| AC-1 | 授权边界（无代码 / 无 Schema / 无 UI；三值 Outcome 保留；Qualified ≠ Data Layer Authorized 未被偷换） | **ACCEPT** | 无 |
| AC-2 | Q6 非对称资格（Theme = Qualification Sufficient；Work = Deferred Entity + 证据门槛，非无限期搁置） | **ACCEPT** | 无 |
| AC-3 | 关系不先于实体（Entity Semantics → Relationship Contract；R-1～R-6 为防御性预锁而非实施授权；R-2「引用 = id」正对 AF-3） | **ACCEPT** | 无 |
| AC-4 | C1/C4 语义隔离（State Reconstruction / Content Versioning / Longitudinal Organization 三系统互不借用 machinery；Theme 治理走 versioned amendment，不建 ThemeHistory——**C2 不是第三种 History System**） | **ACCEPT** | 无 |
| AC-5 | F-1～F-10 完整防线（嵌套聚合 / 泛化关系 / metadata bag / Distribution 字段 / Proof 实体化 / Work 代码占位 全部封死，对应 Semantic Blast Radius） | **ACCEPT** | 无 |
| AC-6 | 九节断言可执行性 | **ACCEPT WITH LOCK** | LOCK-C2A-01（13.2） |
| AC-7 | AI-01～12 无冲突（契约不重释 Architecture；冲突 = 条款作废回 Architecture Review） | **ACCEPT** | 无 |
| AC-8 | OQ-1～OQ-5 全部有条件、有归属、有 Gate（Deferred 不是遗忘） | **ACCEPT** | 无 |

### 13.2 LOCK-C2A-01（本轮唯一锁）

> **九节 [33]–[40] 全部进入未来 Implementation Acceptance Criteria；**
> **本 Contract Review 不授权其中任何代码实现。**
> 「可执行」≠「现在授权实施」——[33]–[40] 的定位是：

```text
Contract Requirement
        ↓
Future Implementation Specification
```

不得被解释为：

```text
Contract Review PASS
        ↓
立即修改 check-data.mjs
```

尤其 **[39] Deferred Guard**：设计本身成立（把「不做」变成可验证约束），
但是否现在补入 check-data.mjs，继续遵守 **OQ-5 的独立裁决**（十节原样保留该 Deferred 状态）。

### 13.3 Review 确认的链路定位（入档）

```text
23 号文          决定「要不要认真定义 C2？」——LOCKED
      ↓
24 号文          决定「如果定义，什么是合法的 Theme？
                  什么是目前不能定义的 Work？
                  哪些边界绝不能突破？」——本文档 · LOCKED
      ↓
未来 Prioritization   决定「Theme Data Layer 是否值得做？」
      ↓
未来 Authorization    决定「是否真的实施？」
```

### 13.4 封板后的战略状态

```text
23 C2 Re-Prioritization            ✓ LOCKED
24 C2-A Canonical Data Contract    ✓ CONTRACT REVIEW PASS WITH LOCKS → v1.0 LOCKED
C2-B / Theme-only Data Layer       ⏸ Deferred / 重新 Prioritize
C2-C UI                            ⏸ Deferred
C2-D Management                    ⏸ Deferred
```

**无代码授权、无 Schema 授权、无 Commit / Push 授权。**

---

**修订记录**

| 版本 | 日期 | 内容 |
|---|---|---|
| v0.1-candidate | 2026.08.25 | C2-A Canonical Data Contract 候选稿：十二节结构；核心判定 = Outcome 2（Theme 资格充分可定义 / Work 资格不充分维持 Deferred Entity + 再评估证据门槛）；Theme Identity Contract（theme-NN + 命名空间划界）；Relationship Contract 整体 Deferred + R-1～R-6 预锁；C1/C4 语义分离硬约束；Forbidden Structures F-1～F-10；断言组候选 [33]–[40]（含 Deferred Guard）；Implementation Gate 与退出条件；待 Contract Review，零代码 / 零 Commit / 零 Push |
| **v1.0 · LOCKED** | **2026.08.25** | **Contract Review PASS WITH LOCKS：7 × ACCEPT + 1 × ACCEPT WITH LOCK（AC-6），无 REJECT；追加十三节裁决记录；唯一锁 LOCK-C2A-01 落档（[33]–[40] = 未来验收标准，非当前代码授权；[39] 仍归 OQ-5 独立裁决）并于九节头部加锁标注；遵守「不为 Lock 大改文档」纪律，无章节增删、无 F/R 规则 redesign；头部标记 CONTRACT · CANONICAL · V2-C2-A · v1.0 · LOCKED；零代码 / 零 Commit / 零 Push，Commit 由用户手动控制** |
