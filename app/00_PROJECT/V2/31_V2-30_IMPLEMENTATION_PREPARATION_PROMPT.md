# V2-31 · V2-30 IMPLEMENTATION PREPARATION PROMPT — 实施前审计执行提示词

> **状态：ACTIVE · 2026-09-04**
> 上游：V2-30 · COGNITIVE EXPERIENCE DESIGN SPEC · v1.0 · LOCKED（HDG-1～7 PASS / OQ-1～4 落定）。
> 本文件的用途：驱动 **V2-30 Implementation Readiness Audit**。产出物唯一：`V2-30_IMPLEMENTATION_READINESS_REPORT.md`。
> 纪律：本轮为 **V2-C Implementation Preparation**，不是 Implementation Authorized。零代码、零数据、零实体、零 Commit、零 Push。
> 顺序（V2-30 附二 LOCK）：Contract → Audit → Mapping → Approval → Implementation，不可颠倒。

---

## 0. 你的角色

你现在不是自由发挥的网页设计师，也不是重新架构 TradingLabb 的产品经理。

你是：

> **TradingLabb V2 Implementation Analyst / Technical Executor**

你的唯一任务，是在已经批准的 V2-30 · COGNITIVE EXPERIENCE DESIGN SPEC 约束下：

**审计现有项目 → 建立实施映射 → 识别风险 → 制定实施计划 → 等待 Human Implementation Authorization。**

不得自行扩大 Scope。

不得自行创造架构。

不得因为发现问题而重新设计已经 LOCKED 的认知架构。

---

# 1. 必须首先读取的文件

在任何分析开始之前，完整读取并理解：

### V2 上游契约

* V2-01～V2-29 中与本任务相关的 LOCKED 文档
* V2-02 Design Constitution
* V2-03 IA
* V2-04 HOME SPEC
* V2-07 Architecture Closure
* V2-10 Identity / Observer Boundary
* V2-13 Research Loop
* V2-15 Distribution Boundary
* V2-28 Research Product Architecture
* V2-29 Homepage Dedup & Routing

### 当前母文档

* `30_V2_COGNITIVE_EXPERIENCE_DESIGN_SPEC.md`

### 项目设计与实现相关文件

读取现有：

* `DESIGN.md`
* Home 相关源码
* Research / Report 相关源码
* Map 相关源码
* Polarity 相关源码
* Thesis / Journal 相关源码
* 当前 routes
* 当前 data
* 当前 components

不要假定文件路径。

先实际扫描仓库。

---

# 2. 当前版本纪律

除非 Human 明确授权：

* 不修改代码
* 不修改 data
* 不新增 Entity
* 不新增 Schema
* 不新增 Data Layer
* 不新增页面
* 不新增路由
* 不修改 LOCKED Cognitive Architecture
* 不修改 Research Loop
* 不 Commit
* 不 Push

本轮属于：

> **V2-C Implementation Preparation**

而不是：

> **Implementation Authorized**

---

# 3. 第一阶段：Repository Audit

先不要写代码。

完整审计当前 GitHub / 本地项目。

输出：

## A. Homepage Reality Audit

确认当前首页：

* 实际 Section / Scene
* 实际内容
* 实际数据来源
* 实际 routing
* 实际卡片
* 实际交互
* 实际动效
* 实际重复内容
* 当前 FOCUS 展位
* 当前 Thesis 展位
* 当前 Research 展位
* 当前 Map 展位
* 当前 Polarity 展位

特别检查：

> **同一 Canonical Object 是否在首页被重复投影。**

不要只看文字是否相同。

同时判断：

1. Semantic duplication
2. Visual duplication
3. Action duplication

---

# 4. Research Reality Audit

扫描当前所有 Research / Report 页面。

重点判断：

### 第一层

是否能够在 30 秒内获得：

* Question
* Finding
* Why it matters
* Risk / Invalidation

### 第二层

是否存在：

* 大段连续文字
* 缺少阅读导航
* 分类式标题
* 重复结论
* 系统语言泄漏
* 工程字段泄漏
* 无明显层级
* 关键判断埋在正文

### 第三层

确认 Deep Dive 是否仍然保留：

* Evidence
* Counter Evidence
* Invalidation
* 数据
* 产业链分析
* 公司分析
* 风险
* 完整论证

不得因为"阅读友好"而删除 Research 的证据链。

---

# 5. Interaction Audit

扫描当前项目中的交互。

建立：

| Interaction | 当前是否存在 | 当前用途 | V2-30 是否保留 | 是否需要 DESIGN.md 修订 |
| ----------- | ------ | ---- | ---------- | ----------------- |

重点检查：

* Read
* Flip
* Reveal
* Rotate
* Explore
* Compare

禁止自行新增第七种交互动作。

如果发现现有代码存在其他交互，不要自动删除。

先报告：

> Existing / Legacy / Candidate / Conflict

---

# 6. Polarity Audit

确认当前 Polarity 实现。

检查：

* YANG
* YIN
* TURN

是否已有真实数据绑定。

然后检查：

> Polarity 是否可以作为 Map View Filter。

只允许：

> Read-only audit。

如果现有数据不足：

**不要补数据。**

报告：

* Missing field
* Missing mapping
* Existing mapping
* Implementation blocker

---

# 7. World Map Audit

检查当前 Map：

* 数据来源
* 节点结构
* 节点数量
* state
* relations
* routing
* 当前 UI
* 是否已经存在可复用的 Preview

V2-30 要求：

> **World at a Glance**

不是完整 Map。

首页 Preview：

* ≤7 个节点
* 不新增 Entity
* 不新增 Schema
* 不新建 HomeMap 数据文件
* 只消费已有 Map 数据

如果现有 Map 无法满足：

不要自行改变数据模型。

报告阻塞点。

---

# 8. Home V2-30 Mapping

建立以下映射：

| V2-30 Scene | 当前 Home 内容 | 当前组件 | 当前数据 | 处理                        |
| ----------- | ---------- | ---- | ---- | ------------------------- |
| ENTRY       |            |      |      | KEEP / REBUILD            |
| NOW         |            |      |      | KEEP / COMPRESS / REWRITE |
| SEE         |            |      |      | KEEP / REBUILD            |
| THINK       |            |      |      | KEEP / COMPRESS / MOVE    |
| CHANGE      |            |      |      | KEEP / REBUILD            |

注意：

> Scene ≠ Section。

不要机械实现为五个等宽 Section。

---

# 9. Home Content Decision

对当前首页所有内容逐项分类：

### KEEP

已经正确且必要。

### COMPRESS

保留，但降低展示密度。

### REMOVE

仅删除重复投影，不删除 Canonical Content。

### MOVE

内容有价值，但应回到自己的 Primary Home。

### REWRITE

结构正确，但系统语言泄漏。

### DEFER

需要 Human 判断或数据支持。

必须逐项说明理由。

---

# 10. Research Content Translation

不要直接重写所有 Research。

先建立：

> **Content Translation Matrix**

每个 Research 页面：

### Layer 1 · 30 SEC

提取：

* Question
* Finding
* Why
* Risk

### Layer 2 · 5 MIN

提取核心论证：

* What
* Why
* So What
* But

注意：

这四个词是内部写作结构。

**不要机械把四个词全部作为页面标题。**

### Layer 3 · Deep Dive

保留完整研究。

必须确认：

> 30 SEC ≠ 摘要复制

> 5 MIN ≠ 30 SEC 扩写

> Deep Dive ≠ 前两层重复

三个层级必须递进。

---

# 11. Research Title Audit

扫描所有 Research 章节标题。

识别：

### 分类式标题

例如：

* 产业链结构
* 供给
* 市场规模
* 企业分析
* 成本
* 风险

将其标记为：

> Candidate for Question-based Rewrite

不要直接修改。

提出更自然的问题式标题候选。

---

# 12. Language Leakage Audit

扫描用户可见界面中的：

* Entity
* Schema
* Canonical
* Derived View
* Context
* Frame
* Data
* ID
* Field
* Route
* Component
* 文件编号
* 工程术语
* 不必要英文

建立：

> **Reader-facing Language Audit Table**

分类：

### KEEP

品牌语言：

* NOW
* WORLD
* THESIS
* JOURNAL
* POLARITY

### REWRITE

系统概念：

* Observation
* Invalidation
* Revision
* Evidence

需要根据上下文决定是否保留。

### REMOVE FROM UI

工程语言：

* Entity
* Schema
* Canonical Object
* Derived View
* Component
* Route
* 文件编号

---

# 13. Mobile / Desktop Audit

确认当前：

* Desktop
* Tablet
* Mobile

表现。

重点检查：

* Flip 是否依赖 Hover
* Map 是否能够降级
* Polarity 是否仍然可操作
* 阅读层级是否保持
* 卡片是否过长
* 动效是否影响阅读

不要为了 Mobile 单独设计另一套 IA。

原则：

> **同一认知流，不同信息密度。**

---

# 14. Accessibility Audit

检查：

* Keyboard navigation
* Focus state
* Screen reader
* Reduced motion
* Button semantics
* Touch target
* Color-independent meaning

特别确认：

> Flip / Rotate / Reveal 的信息不能只存在于动画状态。

如果 `prefers-reduced-motion`：

所有动画降级为：

> Immediate State Change

而不是删除信息。

---

# 15. Architecture Boundary Audit

明确列出：

## 本次允许改变

* Representation
* Experience Layer
* Reader-facing language
* Home presentation
* Research presentation
* Interaction implementation
* Visual hierarchy

## 本次禁止改变

* Cognitive Architecture
* Research Loop
* Canonical Content model
* Entity model
* Schema
* Data Layer
* Framework / System architecture
* Core IA outside approved V2-30 changes

如果某个实现需求跨越边界：

标记：

> **BOUNDARY CONFLICT**

不要自行解决。

---

# 16. Implementation Impact Map

最终建立：

| File / Component | 当前作用 | V2-30 变化 | Change Type | Risk | 是否需要 Human Approval |
| ---------------- | ---- | -------- | ----------- | ---- | ------------------- |

Change Type：

* No Change
* Content Only
* Styling
* Interaction
* Routing
* Component Refactor
* Data Consumption
* Potential Architecture Conflict

特别注意：

**不要把"需要修改代码"误判成"需要重新架构"。**

---

# 17. Implementation Sequence

基于审计结果，制定：

## V2-B

Content Translation

包括：

* Home copy
* Research copy
* Title rewrite
* Language cleanup
* Duplicate removal
* Content relocation

## V2-C

Implementation

包括：

1. Design Constitution update
2. DESIGN.md update
3. Home presentation
4. Polarity interaction
5. Map Preview
6. Research reading layers
7. Responsive
8. Accessibility
9. Final verification

每一步必须说明：

> Dependency / Input / Output / Risk / Rollback

---

# 18. 不得提前实现

尤其不得：

* 先改 Home
* 再补文档
* 先写 Flip
* 再补 DESIGN.md
* 先改 Map
* 再处理 state
* 先重写 Research
* 再考虑 Primary Home

必须：

> Contract → Audit → Mapping → Approval → Implementation

---

# 19. 最终输出

本轮不要修改任何文件。

只输出一份：

# `V2-30_IMPLEMENTATION_READINESS_REPORT.md`

内容必须包含：

1. Executive Summary
2. Current Repository State
3. Homepage Audit
4. Research Audit
5. Interaction Audit
6. Polarity Audit
7. World Map Audit
8. Language Leakage Audit
9. Mobile / Accessibility Audit
10. Home Mapping
11. Research Translation Mapping
12. File-level Impact Map
13. Boundary Conflicts
14. Implementation Dependencies
15. V2-B Content Worklist
16. V2-C Implementation Worklist
17. Risks
18. Rollback Plan
19. Human Decisions Required
20. Final Readiness Verdict

最后只能给出以下三种结论之一：

### READY FOR HUMAN IMPLEMENTATION AUTHORIZATION

或者：

### READY WITH BLOCKERS

或者：

### NOT READY

---

# 20. 最重要的执行纪律

不要因为你"知道应该怎么做"就直接做。

不要自行补齐 Human 没有批准的东西。

不要把设计推断当成授权。

不要把 V2-30 DRAFT 当成 LOCKED。

不要把 LOCKED 当成 Implementation Authorized。

不要 Commit。

不要 Push。

不要修改代码。

不要修改数据。

完成：

> **Audit → Mapping → Readiness Report**

后立即 STOP，等待 Human Review。
