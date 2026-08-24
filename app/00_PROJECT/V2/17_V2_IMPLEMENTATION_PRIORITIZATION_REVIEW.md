# V2-17 · IMPLEMENTATION PRIORITIZATION REVIEW — 实施优先级评审

> **CANONICAL · V2 IMPLEMENTATION PRIORITIZATION · LOCKED**
> 第一轮 Prioritization Review **PASS**（2026-08-24），正式封板。
> 本文件是 V2-07 → Implementation 的**唯一入口**，承接 16 号文六节 Implementation Gate。
> **本文档只是 Prioritization Review + 裁决记录，不构成任何 Implementation Authorization（C1/C4 须各自走 Implementation Contract）。**
> 执行边界：纯文档、不改代码、不改 UI、Push 由用户手动。

---

## 一、目的与边界

16 号文已锁定唯一合法路径：

```text
Architecture（09～15，已 LOCKED）
      ↓
Implementation Backlog
      ↓
Prioritize ←—— 本文档（17 号文）
      ↓
Task Authorization（CURRENT_TASK 任务单）
      ↓
Implementation
```

本文档的任务只有一个：

> **回答「在已确定的 Architecture 中，什么最值得首先实现」。**

关键原则（贯穿全文）：

> **「架构上重要」≠「工程上应该优先实现」。**

本文档**不是**：功能列表、排期计划、实现方案、V2-08。
本文档**是**：候选盘点 → 五维评估 → 优先级提案 → 等待用户裁决。

---

## 二、Audit：候选清单盘点（只登记事实，不预排序）

候选项全部来自 09～16 号文已登记项，**不新增任何架构外候选项**。

| # | 候选 | 类别 | 出处 | 当前状态 |
|---|---|---|---|---|
| C1 | Context Revision Boundary | Research Integrity | 13/14 号文，G-BoW-2 | ⏸ Deferred（契约已立：Context = 可演化状态；机制未建） |
| C2 | Work / Theme 最小实现（数据层） | Author System | 14 号文 | 📋 Backlog（纯引用层，works.ts / themes.ts 候选，零 UI） |
| C3 | Work / Theme UI | Author System | 14/16 号文 | 📋 Backlog（**Architecture Asset ≠ Product Feature**） |
| C4 | Essay Versioning | Author System | 14 号文，G-BoW-1 | ⏸ Deferred（契约已立，机制未建） |
| C5 | DistributionItem 实体 | Distribution | 15 号文 | ⏸ Deferred（契约已定义：workRef 核心；实体未建） |
| C6 | Newsletter | Distribution | 15/16 号文 | ⏸ **No-Go**（不进入排序；未来仅 Distribution Interface） |
| C7 | G-BoW-2（Context 版本边界） | Legacy Debt | 14 号文 | **与 C1 合并评估**（同一问题） |
| C8 | G-BoW-1（Essay 版本化） | Legacy Debt | 14 号文 | **与 C4 同一问题**，单独注明 Deferred 出处 |
| C9 | G-08（IndustryMap → deriveCurrentBelief） | Legacy Debt | 08 号文十节 | 📋 挂起（SSOT 入口不规范；数值不漂移） |
| C10 | G-05（Essay → Thesis 命题级链接） | Legacy Debt | 03/08 号文 | 📋 挂起（related[] 仅栏目级） |
| C11 | InkTransition lint（react-refresh × 1） | Legacy Debt | 06 号文 | 📋 挂起（既有债，全程未触碰） |

**纪律确认**：G-08 / G-05 / InkTransition **不因为 V2-07 收官而自动进入 P0**；
它们与 V2-07 候选项在同一张矩阵里公平竞争，无特权。

---

## 三、五维评估矩阵

每个候选项过五个维度（H = 高 / M = 中 / L = 低）：

```text
Cognitive Value      认知收益：是否提升研究/思考质量本身
Research Integrity   研究完整性：是否保护 Ledger/Revision 证据链的诚实性
Author IP Value      IP 价值：是否构成 Body of Work 的长期证据
Engineering Cost     工程成本：实现 + 验证 + 维护的综合成本
Architecture Risk    架构风险：做错时违反 AI-01～12 的可能性
```

| 候选 | Cognitive Value | Research Integrity | Author IP Value | Engineering Cost | Architecture Risk |
|---|---|---|---|---|---|
| C1 Context Revision Boundary | **H**（保住「Context 是可演化状态」的诚实性） | **H**（缺它，长期证据链存在不可回溯缺口） | M | M（需设计版本/边界表示，不动 UI） | **L**（契约已在 13/14 号文立好，实现空间被约束） |
| C2 Work/Theme 数据层 | H（Work=Author 的时间证据） | M | **H**（Body of Work 的地基） | **L**（纯引用层、零 UI、与现有数据文件同构） | L（AI-07/08 已锁边界） |
| C3 Work/Theme UI | M | L | M | **H**（页面/交互/验证全套） | **H**（Architecture Asset 过早变 Product Feature 是 16 号文明示风险） |
| C4 Essay Versioning | H（观点演化可见 = Revision History Moat） | H | **H** | M（数据层机制，Essay 仅 6 篇，规模可控） | M（与 C1 有共享设计决策，需对齐） |
| C5 DistributionItem 实体 | L（当前无真实分发行为） | L | M | M | **H**（premature abstraction：无行为数据时实体化必然猜错字段） |
| C9 G-08 | L | M（SSOT 纪律） | L | **L**（单点改走 deriveCurrentBelief()） | L |
| C10 G-05 | M | M | M | M | M |
| C11 InkTransition lint | L | L | L | **L** | L |

（C6 Newsletter = No-Go，不进矩阵；C7 并入 C1；C8 并入 C4。）

---

## 四、「为什么现在不做」栏（控制复杂度的核心机制）

> 每一项 Deferred / No-Go / 降级，都必须写明**不做的理由**，而不是「以后再说」。

| 候选 | 处置提案 | 为什么现在不做 |
|---|---|---|
| C3 Work/Theme UI | **P2** | Architecture Asset ≠ Product Feature。数据层（C2）未落地前做 UI 必然返工；且 UI 是 16 号文明示的过早产品化风险点。 |
| C5 DistributionItem 实体 | **Deferred** | 不是没价值——当前**没有真实 Distribution Operating Behavior**，提前实体化属于 premature abstraction。首次真实分发时以任务单授权，字段由真实行为反推。 |
| C6 Newsletter | **No-Go** | 不是「以后可能做所以留着」——当前**明确禁止作为 Product Feature**，仅保留 Distribution Interface 的架构定位。前置条件 = 认知资产密度达标 + 用户主动提出。 |
| C10 G-05 | **P2** | related[] 栏目级链接当前可用；命题级链接的收益依赖 Work/Theme 引用层先存在（C2），单独做是半成品。 |
| C11 InkTransition lint | **Deferred** | 纯工程债，零认知收益；任一未来 Implementation 触碰该文件时顺手清理即可，不值得独立任务单。 |
| C9 G-08 | **P2（可从 P1 合并进入）** | 数值不漂移、仅入口不规范；成本低但认知收益也低，单独动代码的性价比不足以穿过 Gate。若 C1/C2 任务触碰 Ledger 派生层可合并处理。 |

---

## 五、Implementation Priority Matrix（提案，待裁决）

```text
                         高认知收益
                             ↑
                             │
        C1 Context Revision  │        C2 Work/Theme 数据层
        （Research Integrity）│        C4 Essay Versioning
              P0 候选         │          P1 候选
                             │
 ────────────────────────────┼────────────────────→
                             │              Engineering Cost
        C9 G-08              │        C3 Work/Theme UI
        （低成本低收益，P2）   │        C10 G-05（P2）
                             │        C5 DistributionItem（Deferred）
                             ↓
                         低认知收益
```

### 优先级提案（Proposal —— 最终 P0/P1 由用户裁决）

| 档 | 候选 | 提案理由（一句话） |
|---|---|---|
| **P0** | C1 Context Revision Boundary | 唯一同时命中 Cognitive Value + Research Integrity 双高的项；缺它，「Context 可演化」这句已 LOCKED 的架构承诺在代码层没有着落。 |
| **P1** | C2 Work/Theme 数据层 | Body of Work 地基；成本最低、架构风险最低、为 C3/C10 解锁前提。 |
| **P1** | C4 Essay Versioning | Cognitive Memory Moat = Revision History；与 C1 共享版本化设计决策，建议同一设计轮次、分开任务单。 |
| **P2** | C3 Work/Theme UI / C9 G-08 / C10 G-05 | 见四节「为什么现在不做」。 |
| **Deferred** | C5 DistributionItem / C11 InkTransition | 见四节。 |
| **No-Go** | C6 Newsletter | 不进入排序。 |

### 战略侧备注（仅登记，不构成排序预判）

- C1 与 C4 存在**共享设计决策**（版本/边界如何表示），建议先做一轮合并设计评审，再分别开任务单——避免两套版本化方言。
- C2 若裁决为 P1，定义必须守住 14 号文边界：**纯引用层，零 UI，不引入 Distribution 字段**。
- 本提案保守倾向明确：**第一轮最多授权 1～2 个任务单**，宁可少授权，不制造并发架构风险。

---

## 六、Review 流程（沿用 V2-07 纪律）

```text
Audit（二节，已完成）
    ↓
Candidate Matrix（三节，已完成）
    ↓
Cost/Value Analysis（三/四节，已完成）
    ↓
Priority Proposal（五节，已完成）
    ↓
用户第一轮 P0/P1 裁决 ←—— 当前停在这里
    ↓
（通过后）追加「裁决记录」节 → Commit（纯文档单文件）
    ↓
CURRENT_TASK 任务单授权 → 才允许动代码
```

**裁决时需要用户明确回答的问题：**（已裁决，结果见七节）

1. C1 是否确认为 P0？（若否，P0 是什么？）→ **是，唯一 P0**
2. C2 / C4 是否确认为 P1？顺序如何？→ **C4 = P1 且授权；C2 = P1 Candidate 但暂缓授权**
3. 第一轮授权的任务单数量上限：1 个还是 2 个？→ **2 个（C1 + C4），不是 3 个**
4. 四节「为什么现在不做」栏是否有任何一项裁决不成立？→ **全部成立，维持原判**

---

## 七、第一轮战略裁决记录（2026-08-24）

> **Prioritization Review ACCEPTED WITH PRIORITY ADJUSTMENT。**
> 五维评估框架与「宁少勿多」纪律被接受；最终排序对提案做了一次纠偏：
> **不是 C1 > C2/C4，而是 C1 = P0；C4 = P1；C2 = P1 Candidate 但暂缓授权。**

### 7.1 最终 Priority Matrix（锁定）

| Candidate | Priority | 第一轮授权 |
|---|---:|---:|
| **C1 Context Revision Boundary** | **P0** | **✅ YES** |
| **C4 Essay Versioning** | **P1** | **✅ YES** |
| C2 Work / Theme Data Layer | P1 Candidate | ⏸ NO（Deferred to next Prioritization Review） |
| C3 Work / Theme UI | P2 | ❌ |
| C9 G-08 | P2 | ❌ |
| C10 G-05 | P2 / Deferred | ❌ |
| C11 InkTransition lint | Deferred | ❌ |
| C5 DistributionItem | Deferred | ❌ |
| C6 Newsletter | No-Go | ❌ |

**第一轮只授权 2 个 Task，而不是 3 个。**

### 7.2 C1 → P0 的裁决理由

C1 不是普通 feature，它补的是 **Research Memory Integrity**：

```text
Context → mutable → 被修改 → 历史状态不可追溯
```

若不修，**三年后的 HSN 无法知道三年前自己当时是如何理解这个 Context 的**——
直接削弱 V2-07 已锁定的 Cognitive Memory Moat。

### 7.3 C4 → P1 的裁决理由

C4 与 C1 共享同一上层问题：**如何让 Slowly Evolving Knowledge 在时间轴上保留演化轨迹**
（Current Version + Historical Versions + Reason for Revision）。

**共享设计 ≠ 共享实现：**

```text
Versioning Design Review
        │
        ├── C1 Task
        │
        └── C4 Task
```

禁止形成过度抽象的「Universal Version System」。

### 7.4 C2 暂缓授权的裁决理由

> **Architecture 已经成立，不代表 Data Model 现在必须实现。**

Body of Work 已通过 3-Year Test + 2030 Reader Test + Work/Theme 最小模型完成架构层使命。
现在马上建数据层会触发：**Entity → 为证明有用 → 做 UI → 做管理能力 → Architecture Asset → Product Feature**——
正是 V2-07 全程防止的路径。等 C1/C4 完成后，按实际 Work / Essay / Theme 使用量重新评估。

### 7.5 C1 / C4 的共同 Implementation Gate

现在授权的是「实施任务」，不是「自由开发」。每个任务必须继续经过：

```text
Architecture → Implementation Contract → Task Authorization → Implementation → Validation
```

**C1 实施前必须回答四件事**（不允许直接「给 Context 加一个 revisions[]」复制 Ledger 结构）：

1. 什么东西产生 version？
2. version 的唯一标识是什么？
3. 历史版本如何读取？
4. Current 如何从 Version History 派生？

**C4 同理**（不允许简单变成 Essay.content + versions[] 复制 Thesis Revision）：

```text
Thesis → Revision → Ledger
Essay  → Version History → Work Layer
```

两者**概念同源、实现分离**——即 V2-07-03 已锁定的 AI-08 边界。

### 7.6 裁决边界声明

- 本裁决**不授权超出 C1 / C4 范围的任何 Implementation**。
- 核心原则：**不要因为 V2-07 架构完整，就急着把架构全部「兑现」为产品。**
  先修复**时间记忆能力**（C1），再修复**思想作品的版本记忆能力**（C4）。
- 下一步：分别为 C1、C4 建立 Implementation Task / Contract；**在 Contract 批准前不写代码。**

---

**修订记录**

| 版本 | 日期 | 内容 |
|---|---|---|
| v0.9-candidate | 2026.08.24 | Prioritization Review 候选稿：11 项候选盘点（C1～C11，C7/C8 合并）、五维评估矩阵、「为什么现在不做」栏、Priority Matrix 与 P0/P1 提案；待用户第一轮裁决，暂不 Commit |
| v0.95-candidate | 2026.08.24 | 追加七节「第一轮战略裁决记录」：ACCEPTED WITH PRIORITY ADJUSTMENT——C1 = P0 / Authorized（唯一 P0），C4 = P1 / Authorized，C2 = P1 Candidate 暂缓；第一轮只授权 2 个 Task；C1/C4 共同 Implementation Gate（四问 + 概念同源实现分离）落档；待 Review，暂不 Commit |
| **v1.0 · LOCKED** | **2026.08.24** | **第一轮 Review PASS：七节与裁决逐项一致，无越权/漏项/新架构判断；三处边界复核确认（C1 四问保留、C1/C4 实现分离、C2 暂缓线维持）；头部标记 CANONICAL · LOCKED；17 号文正式封板，单文件 Commit，不 Push** |
