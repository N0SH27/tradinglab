# CURRENT_TASK — TASK-003（IMPLEMENTED · 待 Human Review 与 Commit 授权）

> **Status: IMPLEMENTED（2026-09-01）· Implementation Report 已提交（TASK-003_IMPLEMENTATION_REPORT.md）· Awaiting Human Review & Commit Approval**
> **Contract: V2-29 · HOMEPAGE DEDUP & CONTENT ROUTING CONTRACT · v1.0 · LOCKED**
> **Implementation Authorization: GRANTED（2026-09-01，含授权附录 Rule 1–7）**
> **Commit Authorization: NOT YET GRANTED**
>
> 三道闸门分离：**V2-29 LOCKED ≠ TASK-003 AUTHORIZED ≠ COMMIT AUTHORIZED。**
> 实施已完成且未 Commit；在 Human Review 通过并明确授予 Commit Authorization 之前，不得创建任何 Commit。

---

## 1. Objective（要解决什么问题）

实施 V2-29 要求的**呈现层**改动。

本任务**不是**：重新设计 TradingLabb IA、改动内容架构、引入新实体、修改 Canonical Content Model。

本任务唯一目标：

> **降低首页的语义重复，让首页每个章节只承担一个唯一的认知/导航角色。**

首页既有章序不变。

---

## 2. Scope（允许修改的范围）

### 2.1 首页呈现层

主要实施目标文件：

```text
app/src/pages/Home.tsx
```

授权改动包括：

- FOCUS 路由行为
- 必要的 FOCUS 卡片呈现调整
- LIVE THESIS 卡片压缩
- RESEARCH 章节呈现
- NOW 呈现约束
- 表达上述语义边界所需的首页文案
- 首页链接 / 路由目标

### 2.2 Canonical 文档同步

同步 `00_PROJECT/V2/04_V2_HOME_SPEC.md` 中与本次实施直接相关的部分。

文档同步**严格限于**受影响的首页行为，不得借同步之名改写其他章节。

---

## 3. Must Preserve（必须保持不变的内容）

### 3.1 首页章序

保留现有章序（2026-08-31 裁决现状）：

```text
FOCUS
LIVE THESIS
WHAT CHANGED MY MIND
RESEARCH
NOW
WUWEI
END
```

任何章节不得：新增 / 删除 / 重排 / 重命名——除非另有契约显式授权。

### 3.2 IA

本任务是 **Presentation Architecture Compression**，**不是** Information Architecture Redesign。

不得重新设计：全局导航 / 路由层级 / 域架构 / Research 架构 / Thesis 架构 / Framework 架构 / System 架构。

### 3.3 Canonical Content Model

不得创建：`Focus Entity` / `Topic Entity` / `ResearchObject Entity` / `Homepage Content Registry`。

不得引入：新内容实体类型 / 新 CMS / 新 Content Layer / 自动语义去重系统 / 推荐引擎 / 首页动态排序系统。

### 3.4 FOCUS 的非实体地位

FOCUS 保持 **Derived View**（V2-28 LOCK）。

不得引入：`Focus.ts` / `focus.ts` / Focus schema / Focus 数据库 / Focus 内容文件，或任何等效的持久化 Focus 模型。

### 3.5 Featured Research 的选择纪律

Featured Research 由现有 Canonical Content 状态中人工选择，不新增字段、不新增数据结构、不新增算法逻辑。实施阶段仅允许调整首页展示引用关系，不得建立新的 Featured 管理机制。

实现中不得把概念规则硬编码为 `latest = featured` 或 `most important = featured`——除非该行为已存在于 Canonical 内容状态。

---

## 4. Do Not Touch（禁止修改的页面/组件/数据）

- 任何 Canonical 页面（Thesis Detail / Research Report / Journal / Map / System / Method / Wuwei 等）的内容与结构——压缩只发生在首页投影层（V2-29 F-8）
- 任何数据域文件（theses.ts / now.ts / ledger / essays / map 等）的既有字段与内容
- 任何新增实体 / Schema / 数据库 / 路由族
- POLARITY / WUWEI / END 章节的任何内容与呈现
- 04 号文 HOME SPEC 中与本次实施无关的章节

---

## 5. Required Behavioral Changes（必须达成的行为改动）

### 5.1 FOCUS 路由（V2-29 §3.3）

```text
Focus Question
      ↓
Existing Canonical Content Object
      ↓
Primary destination
```

路由优先级：

```text
1. Research Report（直接回应 directly addresses 该 Focus 问题者）
2. Thesis 兜底（无直接对应 Report 时，进入最相关 Thesis）
3. 两者皆无 → 该 Focus 卡片不得出现在首页
```

仅仅「相关」的 Report 不得被当作人工落点。

### 5.2 RESEARCH 首页呈现（V2-29 §5 · OD-3）

首页 RESEARCH 章不得再充当小型 Research Index。

```text
Featured Research
      ↓
1 份代表性 Research Report

ALL RESEARCH →
```

### 5.3 LIVE THESIS 压缩（V2-29 §5 · OD-4）

首页 LIVE THESIS 卡片是**状态面板**，不是 Thesis Detail 页。

移除：`industry` / `conflict.but`

保留：Thesis title / conviction / polarity / time window / last revised（+ 可选极短状态标签）

首页不得复制 Thesis Detail 页的解释逻辑。

### 5.4 NOW 约束（V2-29 §5 · OD-5）

NOW 保持 **Observation Language**。可保留既有 `thesisId` 直链（合法的 Observation → Judgment 导航捷径），但：

> NOW 文案不得复述、总结或预判 Thesis 结论。观察保持为观察。

不得把 NOW 变成：Thesis 摘要 / Research 摘要 / 板块分析 / 投资结论。

### 5.5 Semantic Layering Rule（V2-29 §4 · OD-7）

全部首页文案必须遵守语义层：

| 层 | 回答 |
|---|---|
| OBSERVATION | 现实发生了什么变化？ |
| QUESTION | 我想搞清楚什么？ |
| EVIDENCE | 我研究/发现了什么？ |
| BELIEF | 我现在相信什么？ |
| REVISION | 什么改变了我的判断？ |

任何首页章节不得悄悄替另一层做语义工作：

- FOCUS：允许「我想搞清楚什么」；禁止「我结论的浓缩版」
- RESEARCH：允许「我产出了什么研究」；禁止「第二份 Thesis 摘要」
- LIVE THESIS：允许「我现在相信什么、信到什么程度」；禁止「为什么这个 Thesis 是对的」
- NOW：允许「什么变了」；禁止「所以我的 Thesis 是对的」

### 5.6 Canonical Home Principle（V2-29 §2.3）

> **一个 Canonical Content Object，一个 Primary Home；Derived View 不拥有内容，只负责引用。任何非 Primary Home 的展示位置，只能提供该对象的上下文入口、状态或导航，不得重新承担该对象的完整语义。**

这是呈现层规则，不需要创建任何新的数据抽象。

---

## 6. Forbidden Scope Expansion（禁止范围扩大）

实施过程中，如遇到需要以下任一手段才能解决的问题，**必须停下来并报告为 OUT OF SCOPE**，不得自行解决：

Topic Entity / Focus Entity / ResearchObject Entity / Content Registry / 语义去重引擎 / AI 判重 / 动态推荐 / 排序算法 / CMS / Content Layer / 新数据库或 Schema / 新 Canonical 内容类型 / 新路由族 / IA 重设计。

---

## 7. Acceptance（完成标准 = V2-29 §8 AC-1～AC-8）

- **AC-1 · FOCUS 路由**：每张可见 FOCUS 卡片都有合法落点；优先级 Report → Thesis；Report 满足「直接回应」要求
- **AC-2 · 无悬空 Focus**：既无直接对应 Report、又无合法 Thesis 兜底的 Focus，不得出现在首页
- **AC-3 · RESEARCH 压缩**：首页 RESEARCH = 1 份 Featured + ALL RESEARCH，不成为多条目索引
- **AC-4 · LIVE THESIS 压缩**：首页 Thesis 卡片不含 `industry` 与 `conflict.but`；解释性内容留在 Thesis Detail
- **AC-5 · NOW 语义完整**：NOW 卡片可保留 Thesis 导航，但自身文案不复制 Thesis 结论
- **AC-6 · 语义层完整**：FOCUS=QUESTION / RESEARCH=EVIDENCE / LIVE THESIS=BELIEF / NOW=OBSERVATION / WHAT CHANGED MY MIND=REVISION
- **AC-7 · 零架构扩张**：未引入任何新实体 / Schema / CMS / Content Layer / 推荐引擎 / 排序系统 / 路由架构
- **AC-8 · 回归**：执行仓库当前已有验证流程（包括现有 build / check / 数据校验命令），全部通过，不引入无关失败；**不得为了本任务新增验证基础设施**

---

## 8. Required Implementation Report（请求 Commit 授权前必须提交）

1. 改动文件清单
2. 精确的行为改动说明
3. FOCUS → Report / Thesis 路由实例
4. Featured Research 的选择逻辑
5. LIVE THESIS 保留 / 移除字段清单
6. NOW 语义处理方式
7. 验证结果
8. 发现的任何 OUT OF SCOPE 问题
9. 确认未引入任何新实体 / Schema / CMS / Content Layer

**Human Approval 之前不得 Commit。**

---

## 9. Gate Discipline（闸门状态）

```text
Contract:                    V2-29 · v1.0 · LOCKED
Implementation Task:         TASK-003 · IMPLEMENTED（Report 已提交）
Implementation Authorization: GRANTED（2026-09-01）
Commit Authorization:         NOT GRANTED
```

---

**已完成任务存档：**

- TASK-001 导航分层（2026-08-22）：顶栏 11 项 → 6 项两组 + 三轮实测修正
- TASK-002 接入 GA4（2026-08-22）：G-CFRXCQLQMF，hash 路由手动上报 page_view

执行规则见 01_PROJECT_SPEC.md 的「AI 工作原则」。
