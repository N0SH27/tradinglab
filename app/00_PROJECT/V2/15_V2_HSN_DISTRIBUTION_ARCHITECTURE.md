# V2-15 · HSN DISTRIBUTION ARCHITECTURE — 分发架构

> **V2-07-04 产出（2026-08-24）。** Canonical Architecture Document，不写代码、不写 UI。
> **状态：CANONICAL · V2-07-04 · LOCKED**（Review PASS · APPROVED FOR COMMIT，2026-08-24；变更只走 versioned amendment，禁止 silent overwrite）。
> 上游契约：09 / 10 / 11 / 12 / 13 / 14 号文，全部 LOCKED。
> 本文件回答一个问题：**Canonical Intellectual Assets 如何被转换成不同媒介的表达，而不改变其认知真相？**
> 核心定位：**Distribution = Representation Layer，不是 Knowledge Layer。**
> 阶段纪律：先 Audit，暂不写代码；不讨论发多少条 / 更新频率 / 粉丝增长 / 流量 KPI / 爆款 /
> 平台收益 / 首页社交入口——那些是运营问题，不是 Architecture。

---

## 一、Distribution Audit（现状审计）

审计发现：**TradingLabb 目前没有任何分发基础设施，但已经有一整套分发纪律。**
这决定了本阶段的工作性质——把散落在六份 LOCKED 文档中的分发契约**收敛为正式架构**，
而不是设计新的运营体系。

| 来源 | 已锁定的分发契约 | 实码/文档状态 |
|---|---|---|
| 02 号文 §10 | 站内 = Master Content / Canonical Archive；外部平台 = Distribution Layer；「外部平台负责获客，TradingLabb 负责沉淀」；禁止外部平台成为认知资产唯一存储；不做 Newsletter、不日更、不追热点 | LOCKED（V2-01） |
| 02 号文 §9 | 签名句 "Observe change. Update beliefs." 天然可同步外部平台 | LOCKED |
| 09 号文 7.2 | 编辑纪律三条铁律：选题只能来自站内（Ledger/Thesis/Observation）；裁剪不创造；指标不回流 | LOCKED（V2-07-00） |
| 09 号文 13.5 | 飞轮末段：DISTRIBUTE → ATTRACT ATTENTION → BETTER OBSERVATIONS——外部反馈只进 Observation，不进结论 | LOCKED |
| 09 号文 AC-05 | 每条分发内容必须可指向站内 thesisId / revisionId / observationId（选题溯源） | LOCKED（验收预留） |
| 10 号文 4.3 | Author vs Distribution Persona：允许压缩、不允许虚构；平台人设演化永不写回 Author 实体；跨平台署名统一 `TradingLabb by HSN` | LOCKED |
| 12 号文 P-05 | 无日更义务；分发端需要频率维持存在感是 P-05 的「被挑战情形」 | LOCKED |
| 13 号文八节 | 自动化边界：Automation 可整理 Evidence，不能替 HSN 决定什么值得观察 | LOCKED |
| 14 号文五节 | Ephemeral 档：分发碎片永不成为真相源、不进 Body of Work | LOCKED |
| 实码 `analytics.ts` | GA4（G-CFRXCQLQMF）——全站唯一的「分发相邻」设施：被动测量，不展示、不进决策 | 已上线（TASK-002） |
| 实码全站 | **零社交组件**：无分享按钮、无社交链接、无关注入口、无 Newsletter 表单 | 审计确认 |
| Journal 2026.08.03 | 唯一一次「分发行为」记录：Notion 私密知识库 → 公开网站——上线本身就是迄今最大的 Distribution 动作 | 叙事在案 |

**审计结论（三个发现）：**

- **F-1 · 纪律先于架构存在。** 三条铁律、指标不回流、选题溯源、Ephemeral 档——
  防污染机制在 V2-07-00 已锁；本阶段增量是**分层模型与适配器抽象**，不是重写纪律。
- **F-2 · 上线即分发的实证。** Notion → 公开站这一动作验证了「平台负责发现，站内负责记忆」
  的原始形态：外部（Notion 私有）→ Canonical（公开站）。方向从未反过。
- **F-3 · 零基础设施是正确状态。** 站内无社交组件、无分享机制——
  Distribution 至今没有反向塑造产品（对比：多数内容站第一步就是分享按钮+关注数）。

---

## 二、三层定义（Canonical / Representation / Distribution）

```text
Canonical Truth      HSN 真正相信、研究、修正过的东西（Research System + Body of Work）
      ↓
Representation       同一认知资产在不同媒介中的表达（X 帖 / 长图 / 转载 / Podcast）
      ↓
Distribution         把 Representation 送达外部平台的动作
```

**不变量候选（AI-09 前置定义）：** 方向只能向下。
`Platform → Content → Knowledge` 的反向流动在任何一层都非法。

**第二锁定（AI-10 前置定义）：** 一个 Canonical Work 可衍生多个 Representation，
但 Canonical Source 只有一个——**一条爆款 X 帖不能成为 Thesis 的事实源**；
Representation 里出现的每个判断、数字、命题状态，必须能在站内找到原文。

---

## 三、Fidelity 分层与平台无关 Roles

### 3.1 按认知距离分三档（不做平台等权分配）

| 档 | 使命 | 形态示例 | 纪律 |
|---|---|---|---|
| **A · High-Fidelity** | 保存完整思想：上下文完整、论证完整、可引用 | TradingLabb（本体）；公众号全文转载；长 Essay；Podcast；远期 Newsletter | Representation 必须保留完整论证链；转载不改写结论 |
| **B · Medium-Fidelity** | 传播核心观点：压缩，但不能改变 Thesis | X；即刻；小红书 | 压缩 = 删减与转译，禁止出现站内不存在的判断/数字/持仓暗示（10 号文 4.3） |
| **C · Low-Fidelity / Discovery** | 让陌生人第一次发现 HSN | 短视频 / Shorts / 短帖 | 不承载完整思想；**不进 Body of Work 任何组成**；唯一 KPI 是「回到站内」 |

### 3.2 Platform-independent Distribution Roles（平台无关角色）

现阶段**不具体化「X 做什么、小红书做什么」**——先锁角色，平台只是 Adapter：

| Role | 回答 | 典型承接档 |
|---|---|---|
| **DISCOVERY** | 陌生人怎么第一次遇见 HSN | C |
| **DISCUSSION** | 读者在哪里提问、反驳、对话 | B |
| **EXPLANATION** | 复杂概念在哪里被讲清楚 | A/B |
| **DEPTH** | 完整论证在哪里存在 | A |
| **RELATIONSHIP** | 长期读者在哪里持续跟随 | A（远期 Newsletter 候选位） |
| **ARCHIVE** | 一切最终沉淀在哪里 | 仅 TradingLabb——**此角色不外包** |

**ARCHIVE 角色永驻站内**是全表唯一硬绑定；其余角色的平台归属可随时调整（AI-12）。

---

## 四、Data Model 裁决建议：契约先行，实体缓建

**问题：Distribution 是否需要自己的 Canonical Data Model？**
裁决建议：**现在不建实体。** 分发当前零启动，建实体 = 为不存在的行为造表（违反最小模型纪律）。

但**契约先立**（防未来临时造表时污染模型）：

```ts
// 契约候选（当前不实现）：DistributionItem 是日志，不是知识对象
DistributionItem {
  id: string
  workRef: string      // → Work.id（14 号文引用层）——核心字段，唯一事实锚点
  platform: string     // Adapter 标识，可替换（AI-12）
  format: string       // thread / image-essay / repost / podcast / video
  publishedAt: string
  status: 'live' | 'retired'
}
// 明确不含：thesis / belief / evidence / likes / views / followers——
// 知识字段双源禁令（AI-08 延伸）；指标字段 Vanity 禁令（09 号文 13.3）
```

落地时点：首次真实分发启动时，以任务单授权建立（疑似 `domains/distribution.ts` 或文档层登记表——
实现形态届时裁决）。在此之前，**09 号文 AC-05 选题溯源靠编辑纪律人工执行**。

---

## 五、反馈回路：External Observation Surface（永不成为 Belief Surface）

```text
平台反馈（评论 / 反驳 / 提问 / 互动）
        ↓
External Observation——进入 HSN 视野
        ↓
HSN 判断是否值得观察（自动化边界：机器可整理，HSN 做判断——13 号文）
        ↓ 是
Observation（now.ts，与其他观察同纪律：真、新、大）
        ↓
Evidence / Context
        ↓
Research Loop（13 号文 Research Loop v1.0）
        ↓
Revision（如需）→ Ledger
```

**两条禁令（AI-11 前置定义）：**

- `X Reply → Thesis Revision` 直连**非法**——平台反馈不得绕过 Research Loop 改变 Belief；
- 完全忽略也**非法**——强反驳是潜在观察，Distribution 因此成为**外部观察面**，
  这是飞轮「BETTER OBSERVATIONS」段的正式机制（09 号文 13.5 的落地）。

---

## 六、生命周期：什么永久保存，什么是 Ephemeral

| 对象 | 档位 | 规则 |
|---|---|---|
| Canonical Work（站内） | Permanent | 已有纪律（14 号文五节） |
| **分发溯源记录**（哪篇 Work → 哪个平台 → 何时） | Permanent（轻量） | 这是 Distribution 唯一值得永久保存的东西——它证明「认知资产如何旅行」；载体 = 四节契约实体（缓建） |
| Representation 内容副本（X 帖文、长图稿） | **Ephemeral** | 永不成为真相源（14 号文）；平台删除/失效不影响 Author System 完整性 |
| 平台指标（阅读/点赞/涨粉） | **Ephemeral + 禁回流** | 不进站、不进决策、不进 Body of Work（09 号文铁律三） |

---

## 七、Platform Contamination Test（污染压测）

| 场景 | 架构应对 | 判定 |
|---|---|---|
| S-1 某 X 帖意外爆火，流量压力要求「趁热再发十条同题」 | 选题只能来自站内（铁律一）；爆火本身不产生新选题——Ledger 无新条目则无新内容 | ✓ 拦截 |
| S-2 X 消失 / 小红书算法剧变 | 平台是 Adapter（AI-12）；ARCHIVE 永驻站内；Author System 零重构 | ✓ 通过 |
| S-3 X 上出现高质量反驳，直击命题三 | 走五节回路：External Observation → HSN 判断 → Observation → Research Loop → 如需则 Revision；禁止直连改命题 | ✓ 通过 |
| S-4 某平台运营方建议开「每日复盘」栏目换流量扶持 | P-05 无日更义务 + 频率不反向塑造研究（Distribution cadence ↛ Research） | ✓ 拦截 |
| S-5 诱惑在站内展示「全网阅读 100 万」 | Vanity Layer 禁令（09 号文 13.3）；指标不回流（铁律三） | ✓ 拦截 |
| S-6 三年后复盘「我的思想如何传播」 | 分发溯源记录（六节 Permanent 轻量档）可回答；内容副本已失效不影响 | ✓ 通过 |

---

## 八、Newsletter 状态确认（OD-D 延续，不再重议）

现阶段 **No-Go** 维持。层位锁定：**Newsletter = Distribution Interface（A 档 High-Fidelity /
RELATIONSHIP 角色候选），永不成为 Author System Entity、永不成为知识真相源。**
启动前置条件沿用 02 号文 §2：认知资产密度达标（20+ Thesis / 50+ Revision / 100+ Observation）
+ 用户主动提出。V2-07-04 不开启此讨论。

---

## 九、十四问速答（战略侧授权清单逐项回应）

| # | 问题 | 结论 |
|---|---|---|
| 1 | Distribution 在 Author System 中是什么 | Representation Layer（最外层），不是 Knowledge Layer |
| 2 | 三层如何分 | Canonical Truth → Representation → Distribution（二节），方向只向下 |
| 3 | 一个 Work 如何产生多个分发物 | One Work → Multiple Representations；Canonical Source 唯一（AI-10） |
| 4 | Platform 是否需要 Data Model | 平台不需要；分发物有契约（DistributionItem，workRef 为核心）但实体缓建（四节） |
| 5 | 外部反馈如何回到 Research | External Observation Surface 回路（五节），HSN 判断为唯一入口 |
| 6 | 什么可以进 Research | 经 HSN 判断转化为 Observation 的外部信号——与内部观察同纪律 |
| 7 | 什么永远只留 Distribution | 内容副本、平台指标、人设形象、流量叙事 |
| 8 | Newsletter 为何 No-Go | 密度未达标 + 防 Distribution cadence 反向塑造 Research（八节） |
| 9 | 平台消失 Author System 是否完整 | 完整——Platform Is Replaceable（AI-12），ARCHIVE 永驻站内 |
| 10 | Distribution 是否要 Canonical Data Model | 现在不要；契约先行、实体缓建（四节） |
| 11 | 哪些 Distribution 永久保存 | 仅分发溯源记录（轻量日志） |
| 12 | 哪些是 Ephemeral | Representation 副本、平台指标 |
| 13 | 如何避免「流量→选题→Thesis」 | 铁律一 + AI-11 + S-1/S-4 压测（七节） |
| 14 | V2-07 完成后 Author System 完整边界 | 十节边界图 |

---

## 十、V2-07 完成态：Author System 完整边界图

```text
                         HSN
                          │
                    Identity / POV          ← 10/11/12 号文 · LOCKED
                          │
                        Method              ← 13 号文 · LOCKED
                          │
                    Research System         ← V2 · LOCKED（Observation/Thesis/Ledger/Journal/Map）
                          │
                    Canonical Work
                          │
                    Body of Work            ← 14 号文 · LOCKED（Work/Theme 引用层 + Proof 关系）
                          │
              ┌───────────┴───────────┐
              ↓                       ↓
       Long-term Memory          Distribution          ← 15 号文 · 本文件
       （站内 ARCHIVE 永驻）       Representation Layer
                                          │
                              ┌───────────┼───────────┐
                              ↓           ↓           ↓
                          Discovery   Discussion   Depth …（平台 = Adapter，可替换）
                                          │
                              External Feedback
                                          │
                                    Observation（HSN 判断）
                                          │
                                    Research Loop ↺
```

> **Research produces Knowledge. Body of Work preserves Memory.
> Distribution creates Reach. Time creates Intellectual Capital.**
> **Distribution 可以扩大 HSN 的影响力，但不能改变 HSN 的认知系统。**

---

## 十一、Open Decisions（交战略侧 / 用户裁决）

1. **OD-1 · AI-09～AI-12 四条新不变量批准**：
   AI-09 Distribution ≠ Canonical Knowledge；AI-10 One Work, Multiple Representations；
   AI-11 Distribution Cannot Revise Belief；AI-12 Platform Is Replaceable。
2. **OD-2 · DistributionItem 契约形态确认**：确认「契约先行、实体缓建」，
   首次真实分发时再经任务单落地？还是连契约也推迟？
3. **OD-3 · 首发平台与首发内容**：本文件刻意平台无关——但 V2-07-04 封板后，
   「第一次真实分发」的平台选择与首发 Work（候选：一条 Revision 故事 / 一篇方法 Essay）
   属运营决策，建议另起轻量任务单，由用户定夺。
4. **OD-4 · 本文件封板编号**：通过 Review 后标记 CANONICAL · V2-07-04 · LOCKED——
   同时 **V2-07 全阶段收官**，09～15 号文构成完整 Author System 契约链。

---

**修订记录**

| 版本 | 日期 | 内容 |
|---|---|---|
| v0.9-draft | 2026.08.24 | Audit（纪律先于架构存在）+ 三层模型 + Fidelity 分档 + 反馈回路 + 污染压测；未锁定，待 Review |

---

## 十二、V2-07-04 Review 终裁记录（2026-08-24 · PASS · V2-07 全阶段收官）

战略侧对本文档 v0.9-draft 的 Review 结论：**PASS。四项 OD 全部通过。可以封板并 Commit。**

**OD 终裁表：**

| OD | 裁决 | 落定 |
|---|---|---|
| OD-1 | ✅ ACCEPT | **AI-09～AI-12 全部锁定**：AI-09 Distribution ≠ Canonical Knowledge；AI-10 One Work, Multiple Representations；AI-11 Distribution Cannot Revise Belief；AI-12 Platform Is Replaceable。与 AI-01～08 连续：AI-01～08 = Author Core，AI-09～12 = Distribution Boundary |
| OD-2 | ✅ ACCEPT | DistributionItem「契约先行、实体缓建」——当前无真实分发行为，不为架构完整造实体；`workRef` 为核心字段；**指标字段（views/likes/engagement 等）不得进入 Author System 知识模型** |
| OD-3 | ✅ ACCEPT · 顺延 | 首发平台/首发 Work **不是 Architecture 决策**——属 Distribution Activation / Operating Task，另起轻量任务单；不让具体平台战略污染平台无关 Architecture；不阻塞封板 |
| OD-4 | ✅ ACCEPT | `15_V2_HSN_DISTRIBUTION_ARCHITECTURE.md` = CANONICAL · V2-07-04 · LOCKED；commit message `docs(v2): establish HSN distribution architecture`；仅本文档、零代码、不改 V2 与 V2-07-00～03、不 Push |

**Review 特别确认（记录）：**

1. **F-2 获正式认可**：Notion → 公开站的已发生行为证明「平台负责发现，站内负责记忆」——
   本阶段不是为不存在的业务造架构，而是把已发生行为提炼成正式原则，
   与「Method Architecture is Extracted, not Invented」方法论一致。
2. **F-3 零基础设施获正式认可**：无分享按钮/社交墙/关注/Newsletter/Engagement Dashboard
   是健康状态，**禁止收官时「顺手补」**——
   **Distribution Architecture 已存在，Distribution Product 还没有必要存在**，两概念保持分离。
3. V2-07 最终定性：不是 Personal Brand System，是 **HSN Author System**——
   `Observation → Thinking → Revision → Method → Work → Time → Memory → Trust`；
   **Distribution 只是最后的放大器，不是发动机。**

**V2-07 收官状态（终裁锁定）：**

```text
V2-07-00  Personal IP Architecture    LOCKED
V2-07-01  WHO · Identity & POV        LOCKED
V2-07-02  HOW · Method                LOCKED
V2-07-03  WHAT REMAINS · Body of Work LOCKED
V2-07-04  HOW IT TRAVELS · Distribution LOCKED

Architecture Invariants:
AI-01 ～ AI-08   Author Core
AI-09 ～ AI-12   Distribution Boundary
```

**战略侧建议的下一步（记录，非本阶段任务）：**
不马上进入 V2-08——先做 **V2-07 Final System Review / Architecture Closure**：
把 09～15 全部架构文档压缩成一张最终系统地图，
明确哪些已 LOCKED、哪些 Deferred（G-BoW-1 / G-BoW-2 / DistributionItem 实体 / Newsletter）、
哪些才允许进入 Implementation Backlog。

---

**修订记录**

| 版本 | 日期 | 内容 |
|---|---|---|
| v0.9-draft | 2026.08.24 | Audit（纪律先于架构存在）+ 三层模型 + Fidelity 分档 + 反馈回路 + 污染压测；未锁定，待 Review |
| v1.0 | 2026.08.24 | Review PASS：AI-09～12 锁定；OD-3 顺延运营任务；头部 LOCKED；十二节终裁记录；**V2-07 全阶段收官** |
