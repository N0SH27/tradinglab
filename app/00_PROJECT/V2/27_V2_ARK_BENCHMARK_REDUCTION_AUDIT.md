# V2-27 · ARK BENCHMARK × TRADINGLABB REDUCTION AUDIT — 对标审计与减法审计

> **状态：DRAFT · HUMAN REVIEW REQUIRED（2026-08-30）**
> 本轮**零代码、零数据改动、零新实体、零新 Schema、零新页面、零 Commit、零 Push**。
> 上游契约：V2-01～V2-26 全部 LOCKED（含 16 Closure / 25 Architecture Review / 26 Implementation Contract）。
> 实码依据：`src/pages/*`、`src/data/domains/*`、`DESIGN.md` 全文实读（2026-08-30）。
> 外部 Benchmark：ARK Invest 官网实读（2026-08-30）：Homepage / Research Center（Articles · White Papers · Videos · Big Ideas 2026 · Podcasts · Newsletters · Crypto Reports）/ Investment Process / Big Ideas 2026（第十届年度旗舰报告，"Own What's Next"，13 主题 × 作者署名 × 单段摘要；并发布 The Investment Opportunity Report，收敛为五大投资主题）。
> 本文件回答一个问题：**在不破坏 V2 已锁定架构的前提下，TradingLabb 可以向 ARK 借什么、必须拒绝什么、应该删掉什么。**
> 最终原则：**为道日损。Benchmark → Audit → Reduction → Human Decision → Implementation。**

---

## 1. Executive Summary

**一句话结论：TradingLabb 的架构完整度已经高于 ARK 的表达需要；差距不在架构，在"旗舰资产、信息压缩与认知入口"三个表达层。**

本轮最重要的五个判断：

1. **架构对标结果：KEEP。** ARK 的投资流程是 Top-Down → Ideation → Sizing → Bottom-Up → Selection → Portfolio & Risk 六步直线；TradingLabb 的 WORLD → THESIS → METHOD → FRAMEWORK → SYSTEM → TRADE/INACTION → REVIEW → REVISION ↺ 是带回流的双回路。ARK 是表达 Benchmark，不是架构 Benchmark。**Method > Framework > System 三层与 Research Loop v1.0 / Trading Loop 双回路一律不动。**

2. **最大单项差距：Thesis 是"注册表"，还不是"旗舰研究资产"。** ARK 用 Big Ideas 一个词承担了 Research Asset + Brand Asset + User Entry Point 三重职责；TradingLabb 的 Thesis 页自我描述是"信念注册表"——系统语言，不是品牌语言。但实码核查发现：**ThesisDetail 已经具备旗舰资产 80% 的骨架**（CURRENT BELIEF → THE CLAIM → WHY → WHAT WOULD CHANGE MY MIND → REVISION HISTORY → EVIDENCE → MAP），缺的不是结构，是品牌化的表达与命名。这是 P0 里成本最低、收益最大的一项。

3. **最需要"损"的页面：System。** 当前 System 页共 10 个区块（金字塔 / Why This Machine / 三要素 / 赌场心法 / 状态机 / 趋势生命周期 / 盘面信号 / 触发器+If-Then / 三层共振+仓位 / 执行复盘 / 演进+心法），作为公开页面已接近"手册"。ARK 的 Investment Process 用六步直线讲完同样复杂的事。建议方向不是删内容，而是 **Progressive Disclosure：第一屏只给骨架（金字塔总图已存在，恰好是天然目录），细节逐层深入**。

4. **重要事实修正：道家词典不是"要不要引入"的问题——它已经进生产了。** 实码核查：首页 NOW 章注「观」、WHAT CHANGED MY MIND 章注「反」、WUWEI 章注「虚」；Method Ⅳ 节注「损 · 删除无法增加认知价值的东西」；ThesisDetail 证伪段「止 · INVALIDATION」；Journal 修订区「反 · REVISION」。**观 / 反 / 虚 / 损 / 止 五个锚点已在 5 个位置静默上线，且用法与"双层语言"原则一致（现代术语负责可理解性，道字负责记忆）。** 因此本轮的正确动作不是"设计引入方案"，而是**把既成事实成文化、划定密度上限、防止漂移**——与朱砂规则的治理路径完全相同。

5. **绝对不能借的 ARK 资产：** Research Center 导航项（增加导航熵）、Big Ideas 命名克隆、Newsletter/订阅机制（15 号文 LOCKED：不做 Newsletter、不日更）、产品/策略目录式首页（TradingLabb 核心资产是 Intellectual Capital，不是 AUM）、业绩展示（Performance Theatre 禁令）。

---

## 2. ARK Benchmark Model

### 2.1 ARK 的底层链条（实读归纳）

```text
世界如何变化（Why Innovation）
    ↓
Innovation Platforms（研究主题）
    ↓
Big Ideas（年度旗舰：13 主题 → 收敛为 5 大投资主题）
    ↓
Research Center（Articles / White Papers / Videos / Podcasts / Newsletters / Crypto Reports）
    ↓
Investment Process（Top-Down: Ideation → Sizing / Bottom-Up: Selection & Valuation → Portfolio & Risk）
    ↓
Investment Strategies（产品目录）
```

### 2.2 ARK 做对了什么（只取信息设计原则，不取视觉）

| # | 原则 | 实读证据 |
|---|---|---|
| A-1 | **一个词扛住一个体系。** "Big Ideas" 三字同时是研究产品、品牌锚点、用户入口；第十届 = 十年连续性本身就是信任资产 | Big Ideas 2026 页首："10th annual flagship research report" |
| A-2 | **复杂研究的二级压缩。** 13 个主题各自独立成篇（作者署名 + 一段 "About"），再被 The Investment Opportunity Report 收敛为 5 大投资主题——先展开、后收敛，用户两种深度都能进 | Big Ideas 2026 主题卡结构：Title / About 一段 / Authors |
| A-3 | **流程页极度克制。** Investment Process 全页只有 Top-Down（Ideation → Sizing）+ Bottom-Up（Selection → Portfolio & Risk）两个半场、六个名词，每个名词一句话 | Investment Process 页 |
| A-4 | **研究输出统一收口。** 七种内容形态全部收进一个 Research Center，用户只需记住一个门 | Research Center 导航 |
| A-5 | **人负责制。** Cathie Wood final accountability、每个 Big Ideas 主题署分析师名——研究可信度由人背书 | Investment Process 末段、Big Ideas 署名 |

### 2.3 ARK 模型的前提（TradingLabb 不具备也不应追求）

- 核心资产是 AUM，网站最终指向 Investment Strategies（产品页）——** TradingLabb 核心资产是 Intellectual Capital（V2-01 边界声明 LOCKED）**；
- Open Research Ecosystem 依赖团队、社交媒体众包与订阅漏斗——**15 号文 LOCKED：不做 Newsletter、不日更、不追热点，Distribution 永不直连 Belief**；
- 周度组合会议、持仓调整透明化——**10 号文 LOCKED：判断公开，操作不公开；Performance Theatre 禁令**。

---

## 3. TradingLabb Current Model

### 3.1 架构现状（LOCKED，不重述定义，只列事实）

```text
WORLD（map / cycle / dimensions）
    ↓
THESIS（thesis 注册表 + thesis/:id 单命题页）
    ↓
METHOD（引擎：研究循环 / 真新大准入 / 信号时序 / 证据证伪 / 修正纪律 / 约束层）
    ↓
FRAMEWORK（操作主干：操作地图 / 双循环 / 决策 / 行动接口 / 复盘与修正）
    ↓
SYSTEM（执行规则：金字塔 / 三要素 / 状态机 / 盘面信号 / 触发器 / 共振仓位 / 复盘 / 演进 / 心法）
    ↓
TRADE / INACTION（不公开）
    ↓
REVIEW（双型复盘）→ REVISION（Ledger / CONTEXT_HISTORY / ESSAY_VERSIONS）↺
（链外）Canonical Work → Body of Work → Distribution → External Observation ↺
```

导航实码（site.ts）：NOW（→首页）/ WORLD（地图·周期·四象）/ THESIS（命题·方法·框架·系统）/ JOURNAL（日志·文集）/ WUWEI / HSN（宣言）。

### 3.2 关键实码事实（本轮核查新发现，后续各节引用）

| # | 事实 | 位置 |
|---|---|---|
| F-1 | 首页 7 章：封面 → NOW（注「观」）→ POLARITY → HOW I THINK → LIVE THESIS → WHAT CHANGED MY MIND（注「反」）→ WUWEI（注「虚」）→ END | `Home.tsx` |
| F-2 | 首页 HOW I THINK 章展示的是 Research Loop 八步，但 CTA 链接是 `EXPLORE SYSTEM → #/system`——**Research Loop 的家在 Method 页，不在 System 页**（V2-25 B.3 已登记"Research Loop 无页面之家"；T1/T2/T3 后 Method Ⅰ 即研究循环）。CTA 落点与内容错配 | `Home.tsx:147` |
| F-3 | Thesis 聚合页 intro 自称"信念注册表"；行投影 = Current Belief / Polarity / Horizon / Last Revised | `Thesis.tsx:101` |
| F-4 | ThesisDetail 信息优先级契约已是：CURRENT BELIEF → THE CLAIM → WHY → WHAT WOULD CHANGE MY MIND → REVISION HISTORY → EVIDENCE → MAP——**旗舰资产的论证骨架已存在** | `ThesisDetail.tsx:14-19` |
| F-5 | System 页渲染区块数 = 10（Ⅰ～Ⅸ + 赌场心法 + 四字心法收尾），为全站最长页面 | `System.tsx` |
| F-6 | 道家锚点已上线 5 处：观（Home NOW）、反（Home WCMM + Journal）、虚（Home WUWEI）、损（Method Ⅳ 节注）、止（ThesisDetail INVALIDATION） | 各文件见 §9 |
| F-7 | Thesis schema 已有 `assumptions[]` / `invalidation[]`（数据级认知 If-Then）、`status`（active/closed/invalidated）——ARCHIVE 分区已实现 | `theses.ts` |
| F-8 | ARCHIVE_TREE 已含 11 枝（含 Method / Framework）——知识树先于导航存在 | `site.ts:67` |
| F-9 | 视觉治理已有成文：朱砂三类用途 + 数据警示豁免；阴阳图形全站 ≤2；禁首屏动效 / 霓虹 / 3D / K线 / 太极图 / 整页深色 | `DESIGN.md §2` |

---

## 4. GAP Matrix

> 分类：KEEP（已更好，不动）/ STEAL（直接借信息设计原则）/ ADAPT（借，但转译成 TradingLabb 语言）/ REDUCE（过复杂，做损）/ BUILD（真缺失）。

| 维度 | TradingLabb 当前状态 | ARK 做法 | 差距 | 建议 | 归类 |
|---|---|---|---|---|---|
| Worldview | Manifesto 六公理 + POV/Principles 三宪章（LOCKED） | Why Innovation 一页 | ARK 更简，TL 更深 | 不动 | **KEEP** |
| Research | Research Loop v1.0 八步 LOCKED，Method 页承载 | Open Research Ecosystem + Top-Down | TL 更严，ARK 更开放 | 不动；开放生态不适用于单人实验室 | **KEEP** |
| Thesis | 注册表 + 单命题页完整论证骨架（F-3/F-4） | Big Ideas：品牌化旗舰 | TL 缺品牌语言与旗舰定位 | 升级表达，不改 schema | **ADAPT** |
| Method | 引擎页，六段完整 | 无对应物（ARK 不公开方法层） | TL 独有资产 | 不动 | **KEEP** |
| Framework | 操作主干页，V2-26 刚正名 | Investment Process 一页六步 | TL 更精确，ARK 更轻 | 不动结构；首页压缩时借用其"一句话一步"句式 | **KEEP** |
| System | 10 区块手册级页面（F-5） | Portfolio & Risk 一句话带过 | TL 首屏信息过载 | Progressive Disclosure | **REDUCE** |
| Research Output | Thesis / Journal / Essays / Map 各自成页；关系存在于数据层但未"表现" | Research Center 一门收口七种形态 | TL 栏目像栏目，不像产品 | 不新增栏目；把 Observation→Research→Thesis→Canonical→Journal→Distribution 链条**表现出来**（落点候选：Framework 页或 HSN 页） | **ADAPT** |
| Flagship Research Asset | 无旗舰；Thesis 最接近但未品牌化 | Big Ideas（十年十届） | 真缺口 | 由 Thesis 生长出旗舰属性（见 §6），不叫 Big Ideas | **BUILD（表达层）** |
| Homepage | 7 章认知地图（F-1） | 产品目录式：信念→流程→策略 | TL 偏作者展示，ARK 偏用户引导 | 不重做；做 15/30/60 秒压缩审计（§5） | **ADAPT** |
| Navigation | 6 组 Option C，哲学在 Hero kicker | 三层：Solutions / Why / Research | TL 已克制 | 不动；NOW 独立页属 C-04 待裁决 | **KEEP** |
| Information Density | 单页区块最高 10（System） | 单页极少超过 3 层信息 | TL 密度偏高 | 见 §10 与各页 REDUCTION CANDIDATES | **REDUCE** |
| Content Hierarchy | 页面内部层级清晰（PageHead/SectionHead 契约） | 站内统一"主题→摘要→深入" | 相当 | 不动 | **KEEP** |
| Brand Anchor | 川·标点 / HSN 印章 / Polarity / 两句宣言 + 已上线 5 个道字锚点（F-6） | Big Ideas / Own What's Next | TL 符号层强、语言层未成文 | 成文化道字词典（§9） | **ADAPT** |
| Visual Hierarchy | 纸墨朱砂 + 瑞士网格 + 严格朱砂规则 | 常规企业站，服务信息 | TL 更强 | 不动；只做密度损（§10） | **KEEP** |
| Distribution | 15 号文 LOCKED：平台=Adapter，当前近乎零运营分发 | Newsletter / Podcast / 社媒生态 | 方向性差异，非缺陷 | 暂不追；Canonical Work 成熟后再评估 | **DEFER** |

---

## 5. Homepage Compression Audit

> 不重写首页。只回答：第一次访问者 15 / 30 / 60 秒分别理解什么。

### 5.1 三秒级判断

| 时点 | 用户应该理解 | 当前实码是否支撑 | 判定 |
|---|---|---|---|
| 15s | TradingLabb 是什么 | 封面大标题「观察变化，而非预测未来。」+ description 四行 + motto——**能**。"交易研究实验室 + 活着的档案"已足够 | ✅ 基本达标 |
| 30s | HSN 如何思考 | NOW（观）→ POLARITY → HOW I THINK 八步——**能，但 HOW I THINK 的 CTA 指向 #/system 错配**（F-2）：用户点进去看到的是交易执行规则（状态机/触发器），不是"如何思考"。30 秒路径在这里断掉 | ⚠️ 断点 ×1 |
| 60s | 世界→命题→方法→框架→系统→交易 的全链 | LIVE THESIS（我相信什么）→ WHAT CHANGED MY MIND（反）→ WUWEI（虚）——认知段完整；**Method/Framework/System 三层在首页完全不可见**，60 秒内用户不知道这个体系有"引擎—地图—机器"三层 | ⚠️ 缺口 ×1 |

### 5.2 对照 ARK：为什么 ARK 显得简单

ARK 首页每个模块只回答一个问题（我们是谁 / 我们研究什么 / 我们怎么投 / 我们卖什么），模块之间是**并列的产品目录**，用户不需要理解模块间的关系。TradingLabb 首页七章是**串联的认知地图**——这是更高级的结构，但要求每章的"出口"指向正确。当前两个断点都出在出口，而不是内容。

### 5.3 HOMEPAGE COMPRESSION 结论（仅登记，不执行）

| # | 发现 | 性质 | 候选动作（待 Human 裁决） |
|---|---|---|---|
| H-1 | HOW I THINK 章 CTA `#/system` 与 Research Loop 内容错配 | 链接级 bug 级问题 | 改指 `#/method`（一行改动，但本轮不动代码，仅登记 P0） |
| H-2 | Method / Framework / System 三层在首页零露出 | 认知缺口 | 候选：HOW I THINK 章内增加一行三层句型「方法=引擎 · 框架=地图 · 系统=机器」（纯文案，P0 候选） |
| H-3 | 七章无冗余章 | 正向结论 | 不删章。**首页不做章级损，只做出口级修正** |
| H-4 | POLARITY 章是全站 ≤2 阴阳图形之一，承担品牌仪器职责 | 正向结论 | 保留 |

---

## 6. Thesis Flagship Asset Audit

> 问题：Thesis 能否在不新增实体、不改 schema 的前提下，成为 TradingLabb 的旗舰研究资产？

### 6.1 目标链 vs 实码现状

目标表达链（来自任务书）：Question → Observation → Context → Frame → Thesis → Evidence → Invalidation → Current State → Revision。

| 环节 | 实码现状 | 判定 |
|---|---|---|
| Question | ❌ 无。Thesis 直接以断言开场，没有问题形式 | 未来可做（纯文案层：从 conflict 提炼研究问题） |
| Observation | ⚠️ 间接存在。`now.ts` 观察条目有 `thesisId` 反链，首页 NOW 可点进命题；但 ThesisDetail 内不回链观察 | 页面表达不足，数据关系已在 |
| Context | ⚠️ 存在但未命名。`window`（时间窗口）+ MAP CONNECTIONS（产业地图位置）+ polarity 即语境 | 已有，缺"Context"叙事包装 |
| Frame | ✅ conflict.although/but「虽然……但是……」即核心矛盾框架 | 已存在，且是独家句式 |
| Thesis | ✅ THE CLAIM | 已存在 |
| Evidence | ✅ evidence[] + counter（反方证据） | 已存在，比 ARK 多数文章更完整 |
| Invalidation | ✅ invalidation[] + assumptions[]（数据级认知 If-Then） | 已存在，ARK 无对应物 |
| Current State | ✅ CURRENT BELIEF 仪表条（conviction/polarity/horizon/last revised） | 已存在 |
| Revision | ✅ REVISION HISTORY（Ledger 事实 + 叙事去重合并） | 已存在，ARK 无对应物 |

**结论：9 个环节中 6 个已完整存在，2 个数据关系已在但页面未表达，1 个（Question）是未来文案工作。Thesis 旗舰化不需要任何 schema 变更——它是纯粹的表达层升级。**

### 6.2 什么绝不能现在做

- ❌ 不叫 Big Ideas、不做年度合辑页（= 新页面 + 导航熵，且年度节奏与"活着的档案"定位冲突）；
- ❌ 不新增 Flagship 实体 / 不新增页面；
- ❌ 不把命题改写成营销文案（Thesis 的可信度恰恰来自阴阳双面 + 证伪预登记）。

### 6.3 什么只是表达不足（P0/P1 候选）

| # | 项 | 层 | 优先级候选 |
|---|---|---|---|
| T-1 | 聚合页 intro 从"信念注册表"（系统语言）升级为品牌语言——候选句式方向："HSN 当前仍然相信的判断，以及每个判断的证伪条件。"（具体文案待 Human 定） | 文案 | P0 |
| T-2 | ThesisDetail 增加 Question 段（从 conflict 提炼，纯文案） | 文案 | P1 |
| T-3 | ThesisDetail 回链相关 Observation（`now.ts` 的 thesisId 反链已存在，渲染层工作） | 表达 | P1 |
| T-4 | 单命题页首屏已是旗舰形态（仪表条 + 虽然/但是），无需动 | — | KEEP |

---

## 7. Method / Framework / System Audit

> 前提：Method=引擎、Framework=地图、System=机器（V2-25/26 LOCKED），三层边界不动。本轮只审表达与密度。

### 7.1 Method（147 行渲染，6 段）

- 用户进入最应理解：**判断是怎么被制造出来的**（准入→时序→证据→修正）。
- 当前是否同时回答多个问题：否。六段全部服务"引擎"一个主题。✅
- 核心：Ⅰ 研究循环、Ⅱ 真新大准入、Ⅳ 证据与证伪。
- 解释性内容：Ⅲ 信号时序、Ⅴ 修正纪律——保留。
- 内部系统细节：无。
- Progressive Disclosure 候选：无（当前长度健康）。
- 道字渗透：已有「损」（Ⅳ 节注）。候选增加「观」（Ⅱ 准入）——但一页已有一个锚点，**建议维持每页 ≤1**（见 §9），不增。
- 判定：**KEEP。全站信息密度最健康的页面之一，可作为其他页的密度基准。**

### 7.2 Framework（150 行渲染，5 段）

- 用户进入最应理解：**现实→判断→授权→复盘→修正 的路径**。
- 当前是否同时回答多个问题：基本否。五段 = 地图 / 双循环 / 决策 / 接口 / 复盘，职责单一。✅
- 核心：Ⅰ 操作地图（它同时是 Research Loop 的页面之家，V2-25 K 节）。
- 解释性内容：Ⅱ 双循环——保留。
- 内部系统细节：Ⅳ 行动接口的链条展开对首次读者偏细，属可延后层。
- Progressive Disclosure 候选：Ⅳ 接口段可折叠/延后——**弱候选，不强制**。
- 道字渗透：当前 0。候选「反」（Ⅴ 复盘与修正）或「知止」（Ⅲ 决策）——建议 ≤1。
- 判定：**KEEP，密度可接受；Ⅳ 段为弱 REDUCE 候选。**

### 7.3 System（287 行渲染，10 区块）——本轮 REDUCE 主战场

- 用户进入最应理解：**授权之后，规则是什么**。
- 当前是否同时回答多个问题：**是。** 至少四个：为什么需要规则（Ⅱ+赌场）、何时允许做什么（Ⅲ）、怎么执行（Ⅳ～Ⅶ）、系统如何演化（Ⅸ+心法）。
- 核心（第一屏应见）：Ⅰ 七层金字塔（天然目录 + 闭环图）+ Ⅲ 状态机。
- 解释：Ⅱ Why This Machine、赌场心法。
- 内部系统细节：Ⅳ 趋势生命周期、Ⅴ 盘面信号、Ⅵ 触发器规格、Ⅶ 共振与仓位——**这是操作手册内容，是深度资产，但不应全部首屏平铺**。
- Progressive Disclosure 候选：**Ⅳ～Ⅶ 四段**。金字塔本身就是最好的目录——每层的"职责一句话"已在金字塔里，细节段可作为深入层。
- 应进 Archive 而非首屏：无（全部是活体规则，不是历史）。
- 应删除：无。内容零冗余，问题全在呈现顺序。
- 道字渗透：当前 0。四字心法「等/忍/断/持」已是系统自有语言——**它就是 System 页的"道字"，不应再叠加虚/知止/损**（避免双层语言变三层噪音）。候选仅在状态机或复盘段补 1 个「知止」，且需 Human 裁决。
- 判定：**REDUCE（呈现层）。结构不动、内容不删；第一屏收敛为"金字塔 + 状态机 + 一句心法"，其余分层深入。此为全站收益最大的单项损。**

---

## 8. Research Output Audit

### 8.1 现状

TradingLabb 的内容形态已比 ARK 的 Research Center 更丰富：Thesis（注册表+单命题）/ Journal（事实层+叙事层双层）/ Essays（结构化长文+版本史）/ Map / Cycle / Dimensions / Canonical Themes v1.0（4 个，14 号文 LOCKED）。

**但它们是"栏目"，还不是"产品"。** 差距不在数量，在关系的表现：

```text
Observation（now.ts）
    ↓
Research（Method）
    ↓
Thesis（注册表 + Ledger）
    ↓
Canonical Work / Theme（14 号文，数据契约已立，页面未表现）
    ↓
Journal / Revision（回流留痕）
    ↓
Distribution（15 号文，当前仅"上线即分发"）
```

这条链在数据层已部分存在（observation→thesisId、thesis↔map 双向、ledger→thesis），但**全站没有任何一处让用户看见这条链**。

### 8.2 裁决

- ❌ **不新增 RESEARCH / RESEARCH CENTER 导航项**——增加导航熵，与 Option C 冲突，反"损"。
- ✅ **ADAPT：把链条表现出来，而不是把栏目加起来。** 落点候选（待 Human 裁决，二选一）：
  - a) Framework 页 Ⅰ 操作地图已有节点外链——可在页尾补一段"研究如何成为作品"（Research → Canonical Work → Distribution），零新页面；
  - b) HSN/Manifesto 升级为 WORLDVIEW 时（V2-07 已排期）一并承担。
- ✅ Distribution 维持 DEFER：15 号文 LOCKED 边界下，ARK 的 Newsletter/Podcast 生态明确不借。待 Canonical Work 产品化成熟后重估。

---

## 9. Daoist Trading Vocabulary Audit

### 9.1 关键事实：词典已静默上线（F-6）

| 锚点 | 位置 | 当前用法 | 合规性 |
|---|---|---|---|
| 观 | 首页 NOW 章注「观 · What is changing?」 | 观察 = 研究起点 | ✅ 双层语言范本 |
| 反 | 首页 WCMM 章注 + Journal 修订区「反 · REVISION · WHAT CHANGED MY MIND」 | 修正 = 道之动 | ✅ 与终幕「反者道之动」呼应，全站最成熟锚点 |
| 虚 | 首页 WUWEI 章注「虚 · When not to act」 | 空仓即状态 | ✅ |
| 损 | Method Ⅳ 节注「损 · 删除无法增加认知价值的东西」 | 证据减法 | ✅ |
| 止 | ThesisDetail「止 · INVALIDATION · What makes it wrong」 | 证伪 = 知止 | ✅（建议文案统一为「知止」，见下） |

**结论：引入问题不存在。真正的问题是治理——五个锚点是分散决策上线的，没有成文规则。朱砂规则 2026-08-15 成文前正是同样的漂移前夜。**

### 9.2 候选词裁决（本轮不大量新增）

| 词 | 语义 | 裁决 | 落点 |
|---|---|---|---|
| 观 | Observe | **已上线，成文保留** | 首页 NOW / 未来 WORLD 组 |
| 反 | Revision | **已上线，成文保留** | 首页 / Journal |
| 虚 | Optionality | **已上线，成文保留** | 首页 WUWEI 章 |
| 损 | Reduction | **已上线，成文保留**；同时升级为本审计方法论词 | Method |
| 止 → 知止 | Invalidation | **已上线，建议统一为「知止」**（双字更稳，且覆盖 Exit 语义） | ThesisDetail / 未来 System |
| 静 | Patience | 候选，**暂缓**——WUWEI 已承担，避免同义堆叠 | （预留） |
| 常 | Invariant | 候选，**暂缓**——等 WORLD 组或 Cycle 页有自然落点 | （预留） |
| 玄 | Uncertainty | 候选，**暂缓**——已出现在 SITE.description「玄之又玄，众妙之门」，暂不节点化 | 首页 description（现状） |
| 谷 / 无为 / 不争 / 自然 / 柔弱 / 知 / 知足 / 朴 / 少私寡欲 / 不自见 / 不自是 | — | **本轮全部不节点化**。「无为」已由 WUWEI 整页承担，无需再拆 | WUWEI 页（显性哲学层） |

### 9.3 治理规则（候选成文条款，待 Human 裁决后入 02_DESIGN_CONSTITUTION）

1. **双层语言**：现代术语负责可理解性，道字负责记忆。禁止替换（Observation→观 ✗），只允许标注（「观 · OBSERVE」✓）。
2. **密度上限**：每页至多 1 个道字锚点；WUWEI 与 HSN/Manifesto 例外（显性哲学层）。
3. **句式上限**：每个锚点 = 一字 + 英文 + ≤12 字释义（现有五处全部符合，作为范本）。
4. **新增需裁决**：新锚点上线走任务单，与朱砂规则同纪律。

### 9.4 页面密度表（裁决建议）

| 页面 | 当前密度 | 建议 |
|---|---|---|
| Home | 3（观/反/虚，分属三章注） | 保留——三章注 = 每章 1 个，合规 |
| WORLD（Map/Cycle/Dimensions） | 0 | 0–1，候选「常」（暂缓） |
| THESIS | 1（止→知止，Detail 页） | 1 |
| METHOD | 1（损） | 1 |
| FRAMEWORK | 0 | 0–1，候选「反」（与 Journal 复用，需裁决是否跨页复用同一锚点） |
| SYSTEM | 0 | 0–1，候选「知止」；四字心法优先，不叠加 |
| JOURNAL | 1（反） | 1 |
| WUWEI | 整页即哲学层 | 不设限 |
| HSN / Manifesto | 0 | 中–高，品牌哲学（V2-07 阶段再定） |
| Essays | 自由 | 按文章主题 |

---

## 10. Visual Reduction Audit

> 不新增任何视觉元素。DESIGN.md 全部禁令视为约束。

### 10.1 三层分类

| 层 | 内容 | 判定 |
|---|---|---|
| 品牌基础（必须留） | 纸 / 墨 / 朱砂（三类用途规则）/ 宋体标题 / 瑞士网格 | KEEP |
| 核心识别（品牌资产） | 川·标点（HSNSymbol）/ HSN 印章（手稿字形）/ Polarity Instrument（≤2 硬约束） | KEEP |
| 语义装饰（损的对象） | 极性方块字形（■/□/■朱砂）、状态方块（状态机 2.5px 方块）、Label/label-sm 标签密度、ink-3 装饰编号 | 审计见下 |

### 10.2 发现

| # | 发现 | 严重度 | 建议 |
|---|---|---|---|
| V-1 | 极性方块字形出现在 4 处：PolarityMark（Thesis 页）、PolarityTag（Detail/Map）、deriveThesisPolarity 文本、首页 LIVE THESIS 卡片——同一语义四种渲染 | 低 | 未来统一为单一组件（技术债登记，不紧急） |
| V-2 | System 页视觉密度问题本质是**内容密度**（10 区块），不是视觉元素过多 | 中 | 由 §7.3 Progressive Disclosure 解决，不动视觉 |
| V-3 | 朱砂规则执行良好，实码未发现漂移（Home 仅两处决断标记，合规） | — | KEEP |
| V-4 | 无新增视觉元素需求；ARK 侧无可借视觉（其视觉服务于产品目录，不适用于纸墨体系） | — | KEEP |

**结论：视觉系统不需要损元素，只需要损密度。当前视觉治理成熟度高于 ARK。**

---

## 11. KEEP / STEAL / ADAPT / REDUCE / BUILD 总清单

### KEEP（不动）
- Method > Framework > System 三层；Research Loop v1.0；Trading Loop；双回路；WUWEI 约束层
- Method 页（全站密度基准）；Framework 页结构；Manifesto 六公理；视觉系统与朱砂规则
- 导航 Option C；ARCHIVE_TREE；Thesis ARCHIVE 分区；Ledger SSOT 纪律
- 判断公开、操作不公开；Performance Theatre 禁令

### STEAL（直接借信息设计原则）
- ARK Investment Process 的"每个名词一句话"句式 → 用于首页 HOW I THINK 章与 Framework 页首屏
- Big Ideas 主题卡的"一段 About"压缩句式 → 用于 Thesis 聚合页行投影文案（现状 conflict 已接近，微调即可）
- Big Ideas 的"作者署名=可信度"→ 已是 HSN 单人站，天然满足，无需动作

### ADAPT（借，但转译）
- Big Ideas 旗舰概念 → Thesis 旗舰化（§6），不叫 Big Ideas，不做年度合辑
- Research Center 一门收口 → 不新增栏目，把 Research Output 链条表现出来（§8.2）
- ARK 首页产品目录清晰度 → 首页出口修正（§5.3），不做目录式重做
- 道字词典 → 成文治理（§9.3）

### REDUCE（做损）
- System 页：首屏收敛为金字塔 + 状态机（+一句心法），Ⅳ～Ⅶ 分层深入（P0 候选）
- Framework 页 Ⅳ 行动接口：弱候选，延后处理
- 极性方块四处渲染 → 统一（技术债，P2）
- 全站原则：本轮之后任何"新增页面/栏目/组件"提案默认举证"为什么不能由现有页面承担"

### BUILD（真缺失，全部在表达层，无实体）
- Thesis 旗舰品牌语言（T-1）
- 首页 15/30/60 秒出口修正（H-1/H-2）
- 道字词典成文条款（§9.3）
- Research Output 链条的可视化落点（§8.2，二选一待裁决）

### DEFER（明确不做）
- Research Center 导航项；Big Ideas 克隆；Newsletter/订阅；业绩/持仓展示；NOW 独立页（C-04 未裁决）；HSN/ABOUT 页（V2-07 排期）；Distribution 运营化；Indicators/Backtest/Trade 实体（V2-25 No-Go 清单全部沿用）

---

## 12. P0 / P1 / P2 / DEFER Roadmap

> 全部仅为优先级建议；任何一项进入实施前走任务单授权。

### P0（不做则品牌表达仍有明显缺口）
| # | 项 | 性质 | 依据 |
|---|---|---|---|
| P0-1 | 首页 HOW I THINK CTA `#/system` → `#/method` | 一行修正 | §5.3 H-1 |
| P0-2 | 首页 HOW I THINK 章补三层句型一行（方法=引擎 · 框架=地图 · 系统=机器） | 文案 | §5.3 H-2 |
| P0-3 | Thesis 聚合页 intro 品牌语言升级 | 文案 | §6.3 T-1 |
| P0-4 | System 页 Progressive Disclosure 方案设计（先出设计稿，再实施） | 设计→代码 | §7.3 |
| P0-5 | 道字词典治理条款成文（密度/句式/新增纪律） | 文档 | §9.3 |

### P1（值得做，不影响当前系统）
| # | 项 | 依据 |
|---|---|---|
| P1-1 | ThesisDetail 增加 Question 段（纯文案，从 conflict 提炼） | §6.3 T-2 |
| P1-2 | ThesisDetail 回链相关 Observation | §6.3 T-3 |
| P1-3 | 「止」统一为「知止」 | §9.2 |
| P1-4 | Research Output 链条落点实施（Framework 页尾 or HSN 页，待 OD-3 裁决） | §8.2 |
| P1-5 | Canonical Work 产品化（14 号文契约的页面表现） | 14 号文 |

### P2（内容资产成熟后）
- 极性标记组件统一（V-1）
- Framework Ⅳ 段延后/折叠
- WORLD 组「常」锚点（出现自然落点时）
- NOW 独立页（依赖 C-04 裁决）；HSN/ABOUT（V2-07）

### DEFER（本轮明确不做）
见 §11 DEFER 清单——尤其：Research Center、Big Ideas 命名、Newsletter、业绩展示、一切实体化。

---

## 13. Open Questions

1. **Q-1**：Thesis 旗舰化后的品牌句式——"HSN 当前仍然相信的判断"方向是否准确？是否存在一个像"Big Ideas"一样两字/三字的自有命名（候选方向：不设新名，直接让"命题 THESIS"一词沉淀为品牌词，如同 ARK 让 Big Ideas 沉淀）？
2. **Q-2**：System 页 Progressive Disclosure 的交互形式——折叠？分页？锚点目录？DESIGN.md 无折叠组件先例，Essay 文首锚点目录是最近似的既有机制，是否复用？
3. **Q-3**：道字锚点跨页复用——「反」已在首页 + Journal 两处，是否允许同一锚点多页出现（倾向：允许，锚点价值恰在重复中沉淀）？
4. **Q-4**：Research Output 链条的落点（Framework 页尾 vs HSN 页）？（对应 P1-4）
5. **Q-5**：首页 LIVE THESIS 卡片是否增加"证伪条件一行"（把 What would change my mind 提前到首屏，是 Thesis 区别于一切股评的最强信号，但会增加首屏密度）？

---

## 14. Human Decision Gates

| Gate | 待裁决项 | 选项 | 阻塞下游 |
|---|---|---|---|
| OD-1 | 本审计整体结论（KEEP 架构 / 损表达）是否批准 | 批准 / 修改 / 驳回 | 全部 |
| OD-2 | P0-1/P0-2 首页出口修正是否授权实施 | 授权 / 仅 P0-1 / 暂缓 | P0 启动 |
| OD-3 | Research Output 链条落点 | Framework 页尾 / HSN 页 / 暂缓 | P1-4 |
| OD-4 | 道字词典治理条款（§9.3 四条）是否入设计宪法 | 全文入 / 修改后入 / 不入 | §9 全部后续 |
| OD-5 | System 页 Progressive Disclosure 是否进入设计稿阶段 | 进入 / 换方案 / 暂缓 | P0-4 |
| OD-6 | Thesis 旗舰化方向（不设新名，沉淀"命题"一词）是否确认 | 确认 / 另议命名 | P0-3、P1-1/2 |

---

## 附 · 本轮执行规则遵守声明

```text
☑ 已读 V2-01/03/08/14/15/16/25/26、DESIGN.md、全部页面 tsx、主要数据域全文
☑ 已实读 ARK 官网 Homepage / Research Center / Investment Process / Big Ideas 2026（2026-08-30）
☑ 未修改任何源码、任何数据；未新增 Entity / Schema / 页面 / 导航
☑ 未 Commit、未 Push、未进入 Implementation
☑ V2-07 LOCKED 架构 / V2-25 / V2-26 / Method > Framework > System 零重定义
☑ 未把 ARK 作为视觉模仿对象；未提议 Research Center / Big Ideas 克隆
☑ 道字词典按"局部使用 + 双层语言"原则审计，未提议大面积替换现代术语
☑ 未提议任何视觉特效新增
```

**STOP。等待 Human Review。只有 Human 明确批准相关 Gate 后，才能进入对应实施阶段。**
