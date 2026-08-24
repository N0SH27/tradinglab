# V2-13 · HSN METHOD ARCHITECTURE — 方法架构

> **V2-07-02 产出（2026-08-24）。** Canonical Architecture Document，不写代码。
> **状态：CANONICAL · V2-07-02 · LOCKED**（PASS WITH LOCKS 裁决，2026-08-24；变更只走 versioned amendment，禁止 silent overwrite）。
> 上游契约：09（IP 架构，LOCKED）/ 10（Identity，LOCKED）/ 11（POV，LOCKED）/ 12（Principles，LOCKED）。
> 本文件回答一个问题：**How does HSN actually think?**
> 阶段纪律（战略侧授权条件）：**Audit Existing Method → Extract → Model → Test → Constitution。**
> 一～三节 = Audit 与 Extract（实码依据）；四节 = Canonical Method 结构（Review 裁决锁定）；
> 八节 = 裁决记录与 AI-05 / AI-06。
> 核心禁令：**不为了让 HSN 看起来「有方法」而人为创造漂亮的 Framework——
> Method Architecture is Extracted, not Invented.**

---

## 一、Method Audit（实码审计清单）

审计范围：`domains/system.ts` / `framework.ts` / `wuwei.ts` / `cycle.ts` / `dimensions.ts` /
`map.ts` / `theses.ts` / `now.ts` / `ledger.ts` / `journal.ts` / `essays.ts` 全文实码；
08 号文件（Ledger 契约）、02 号文件 §6（Loop）文档层。

| 实码资产 | 文件 | 方法内涵（它证明了 HSN 实际上怎么研究） |
|---|---|---|
| 七层金字塔 | `system.ts` `SYSTEM_PYRAMID` | 周期(战略)→市场结构(战术)→变化与信号(触发)→形态量价(确认)→操作止损仓位(执行)→心态(护栏)→复盘认知(进化)——一个完整闭环，复盘反哺周期 |
| 市场状态机 | `system.ts` `MARKET_STATES` | 四状态（趋势多/震荡/趋势空/情绪冰点）× 允许操作 × 仓位上限——「用状态机回答，不用感觉回答」 |
| 赌场模型 + 三要素 | `system.ts` `SYSTEM_CASINO / SYSTEM_THREE` | 正期望系统 × 资金管理 × 心理管控；玩的不是行情，是统计 |
| 方法演化史 | `system.ts` `SYSTEM_EVOLUTION` | 三阶段：交易就是交易 → 放下预判拥抱规则 → 从加法到减法——**Method 自身有 Revision History** |
| 交易三件事 | `framework.ts` 01 | EXPLAIN · DECIDE · PROTECT；开仓前先定逻辑失效点 |
| 信号分层 | `framework.ts` 02 | 信号三特征 **真、新、大**；领先/同步/滞后分层，各层用途不同（把滞后信号当领先信号用是散户死法） |
| If-Then 预案 | `framework.ts` 03 | 预案先于操作——「让下一个选择不再左右为难」 |
| 触发器库 | `framework.ts` 04 | 每条触发器三要素：**入场条件、失效条件、历史胜率** |
| 三层共振 | `framework.ts` 05 / `cycle.ts` | ≥2 层共振才动，禁止 3 层逆向——大盘定仓位、板块定赛道、个股定执行 |
| 周期定位 | `cycle.ts` | 七阶段循环（萌芽…重构）：「重要的不是预测拐点，而是知道自己站在圆环的哪一段」；题材生命周期五阶段；四面权重按市场状态调权 |
| 四象阴阳 | `dimensions.ts` | 量价可测为阳、时空不可测为阴——**传统技术分析的误区是只盯阳面；时空往往比量价更具决定性**；逆时针曲线九位置中「持有/观察」两个不操作状态时间最长 |
| 产业地图 | `map.ts` | 节点双层状态：**产业景气(state) × 估值位置(valuation)** 分离；渗透率坐标定分析重心；佩雷斯时代标尺定宏观位置；地图 = 一组相互等待的 S 曲线 |
| 命题结构 | `theses.ts` | `conflict{although,but}` + `yang[]/yin[]` + `evidence[]≤3` + `counter` + `window` + `invalidation[]` + `assumptions[]`——可证伪结构是实码级强制 |
| 观察层 | `now.ts` | 只记「正在发生、值得观察的变化」，3–5 条人工维护，可挂 mapNodeId / thesisId——观察先于命题 |
| 修正账本 | `ledger.ts` | append-only；reason 必填；delta=0 的 confirm 也是有效入账——修正即认知活动 |
| 命题写作五步法 | `essays.ts` `thesis-writing-os` | 已成文：核心矛盾(虽然/但是) → 证据链≤3条可外部验证 → 亲笔反面论证 → 概率+时间窗口 → 证伪信号 |
| 止损即证伪 | `wuwei.ts` `STOP_LOSS` | 「止损位必须是一个能证明『我看错了』的位置——逻辑失效点」——**交易侧的 invalidation 与研究侧同构** |
| 行为底座 | `wuwei.ts` 全文 | 止损=自我宽恕；情绪=认知缺失的副产物；生活是 OS、交易是高风险程序；钱是坐着等来的 |

---

## 二、审计发现（五个关键结论）

**F-1 · Method 早已存在，且是双回路结构。**
HSN 的方法不是一个流程，是两个共享同一世界观的回路：

```text
研究回路（慢）        OBSERVE → MAP → THESIS → TEST → BELIEVE → REVISE → ARCHIVE
                      落点：now / map+cycle / theses / evidence / ledger / essays

交易回路（快）        状态机 → 信号分层 → 触发器 → 执行 → 止损 → 复盘
                      落点：system / framework / cycle / dimensions / wuwei

行为底座（横跨）      WUWEI + LIFE OS：无为、止损纪律、情绪管理、生活即系统
```

V2 品牌文档 §6 的 TradingLabb Loop 是研究回路；System/Framework 页是交易回路。
**两回路经「行为底座」连接——这就是「产业认知 × 交易纪律」双系统（10 号文件 Lens 层）的实码形态。**

**F-2 · 研究方法五步法已经成文，不需要发明。**
Essay《如何写一个产业命题》就是 Thesis Formation 的正式协议文本；
`theses.ts` 的 schema 是它的数据级强制。方法早已从「隐性实践」走到「显性文本+实码」，
V2-07-02 的工作是**登记与连接**，不是创作。

**F-3 · 证伪纪律在两侧同构且都已强制。**
研究侧：`invalidation[]`（新命题必填，check 断言）；交易侧：逻辑失效点（开仓前必定）。
同一个原则的两个投影——这是审计中发现的**最强的跨回路一致性证据**。

**F-4 · 方法学习有叙事、无结构。**
方法演化目前只存在于：`SYSTEM_EVOLUTION` 三阶段文本、Journal 的 new 条目
（TL 指标更新 2026.07.31 / 止损页重写 2026.07.28 / 七层金字塔补全 2026.07.29）、Essays。
**Method 自身的 Revision 没有 Ledger 那样的正式账本**——这是唯一真实的结构缺口，
但它属 Method Versioning 议题（协议 10），候选方案见四节，本阶段不锁定。

**F-5 · 观察入口有纪律、无量化。**
信号「真、新、大」与「识别异常值」已成文；`now.ts` 人工维护 3–5 条是刻意克制
（防观察层退化为新闻流）。观察协议目前依赖人工判断——**这是特性不是缺陷**：
方法的去自动化边界本身就是 POV-02/POV-05 的表达。

---

## 三、十二协议逐项（Extract · 每条标注来源状态）

状态标记：`[实码]`= 有数据结构强制；`[成文]`= 有正式文本无实码；`[候选]`= 本文件新增提议，Review 前不生效。

| # | 协议 | 内容 | 状态与锚点 |
|---|---|---|---|
| 1 | **Observation Protocol** | 为什么观察：现实不等观点。观察什么：正在发生、值得观察的**变化**（非新闻/行情/ticker）。选择标准：**真、新、大**= 异常值识别。容量纪律：3–5 条人工维护。观察必须可挂地图节点或命题，否则不入账 | `[实码]` now.ts；`[成文]` framework 02 |
| 2 | **Context / Mapping Protocol** | 变化必须定位：产业地图节点（景气×估值双层状态）→ 渗透率坐标定分析重心 → 周期七阶段定圆环位置 → 佩雷斯标尺定时代位置。四把尺子量完，一个观察才算有了上下文 | `[实码]` map.ts / cycle.ts |
| 3 | **Thesis Formation** | 触发条件：观察积累到可下注的程度。成形五步法（已成文）：虽然/但是写出核心矛盾 → 证据≤3 → 亲笔 counter → 概率+window → invalidation 预登记。写不出虽然/但是 = 没想清楚，不许立题 | `[实码]` theses.ts schema；`[成文]` essay thesis-writing-os |
| 4 | **Evidence Standard** | 只收可被外部验证的事实（出货/招标/产能/现金流），拒收研报措辞与圈内情绪。≤3 条——三条撑不住的命题，三十条也撑不住。交易侧同构：触发器三要素含历史胜率 | `[实码]` evidence 字段 + check；`[成文]` essay |
| 5 | **Belief Updating** | 信念 = 0–100 的诚实刻度。更新唯一入口：Ledger 入账 → `deriveCurrentBelief()`。组件内禁止 current−previous 持久化；`probability` 是 migration-era 快照，长期降级为派生显示 | `[实码]` ledger.ts + 08 号文 Rule 02 |
| 6 | **Revision Protocol** | 触发：现实出现可被验证的新证据（非情绪、非行情波动本身）。入账：reason 必填、evidence 可选、note 叙事。confirm（delta=0）正式入账——复核后维持也是判断。同日多条允许。禁令：沉默地改观点 = 研究的死亡 | `[实码]` ledger.ts；08 号文 OD-3 |
| 7 | **Contradiction / Polarity Handling** | 矛盾即信息：任何命题强制阴阳双面；polarity 只由 MapNode.state 派生、禁止字段化（观察框架，不是事实属性）。分析重心向阴面倾斜：时空（不可测）比量价（可测）更具决定性；不操作（阴）与操作（阳）同为系统状态 | `[实码]` theses schema + G-03 裁决 + dimensions.ts |
| 8 | **Invalidation** | 事先约定证伪信号，事后不认「我早就觉得不对」。invalidation 必须可观察/可验证/可判断，不收「我感觉错了」。结业（closed/invalidated）封存不删除——证伪是原则遵守的证据，不是失败（12 号文 AI-03） | `[实码]` invalidation 字段 + check；`[实码]` wuwei 逻辑失效点（交易侧同构） |
| 9 | **Method Learning** | 复盘反哺周期（金字塔第 7 层闭环）；先分析自己的亏损模式；连损是朋友（风险释放的读法）；Revision 积累到阈值 → 回头改 Method 本身（飞轮核心段 Revision→Method→Body of Work） | `[成文]` system.ts 进化层 + essays；`[候选]` 阈值目前靠人工判断 |
| 10 | **Method Versioning** | Method 属 Slowly Evolving 档：修订走 versioned amendment、禁止 silent overwrite（AI-04 已锁）。**载体未定**：现状是 journal 叙事 + SYSTEM_EVOLUTION 文本；候选 = 为 Method 建立轻量版本记录（不建实体，先文档层） | `[候选]` 见 OD-2 |
| 11 | **Research ↔ IP Boundary** | AI-01/02 已锁：Method 是 IP 层六实体之一，但只做研究行为的**形式化引用**；Thesis/Revision/Belief 永远留在 Research Canonical。Method 文档可以解释 Thesis 怎么产生，永不复制 Thesis 数据 | `[实码]` 09 号文十五节 |
| 12 | **Method Proof** | 每条协议必须能被站内实体证明（R-11 解法）：协议 1–8 的证明 = 一表实码锚点本身；协议 9 的证明 = Ledger 厚度 + SYSTEM_EVOLUTION；**Proof 不需要新页面，审计表即证明** | `[实码]` 本文件一节 |

---

## 四、Canonical Method 结构（OD-1 / OD-3 裁决锁定 · 2026-08-24）

战略侧 Review 裁决：**八步循环锁定为 Research Loop v1.0，而不是「HSN Method = 八步」。**
HSN Method 是上位体系（AI-05），由两个不同时间尺度的运行回路 + 一个约束层构成：

```text
HSN METHOD（上位体系）
│
├── RESEARCH LOOP v1.0（慢回路 · 研究）
│
│   OBSERVE      观察变化（真·新·大）              ← 协议 1    [实码 ✓]
│      ↓
│   CONTEXT      定位：地图/渗透率/周期/时代        ← 协议 2    [实码 ✓]
│      ↓
│   FRAME        框定核心矛盾：Dominant narrative    ← 协议 3 前段 [成文 ✓]
│                → Counterforce → Research question
│      ↓
│   THESIS       立题：证据/counter/概率/窗口/证伪   ← 协议 3 后段 [实码 ✓]
│      ↓
│   TEST         对照现实：证据监测 + 证伪信号值守    ← 协议 4/8   [实码 ✓]
│      ↓
│   BELIEVE      刻度化信念：conviction 唯一派生     ← 协议 5    [实码 ✓]
│      ↓
│   REVISE       入账修正：up/down/confirm          ← 协议 6    [实码 ✓]
│      ↓
│   REFLECT      复盘反思：改命题库，必要时改方法     ← 协议 9/10  [成文 ✓，版本化见 AI-06]
│      ↺
│
├── TRADING LOOP（快回路 · 交易）
│
│   STATE        市场状态机：用状态机回答，不用感觉回答
│      ↓
│   SIGNAL       信号分层：领先/同步/滞后，各层用途不同
│      ↓
│   TRIGGER      触发器三要素：入场条件/失效条件/历史胜率
│      ↓
│   RISK         失效点执行：跌破逻辑，无条件离场
│
└── BEHAVIORAL CONSTRAINTS（约束层，不是步骤）
    └── WUWEI / LIFE OS —— Method Constraint Layer：
        在任一步介入回答「是否需要行动？」
        （Observe→Wuwei? Frame→Wuwei? Thesis→Wuwei? Trade→Wuwei? Revise→Wuwei?）
```

**裁决要点（锁定）：**

1. **FRAME 独立成步。**「虽然……但是……」不是文字修辞，是认知动作：
   Dominant narrative → Counterforce → Research question。写不出核心矛盾不许立题。
2. **ACT 不进 Research Loop。** 避免 HSN Method 被理解成「投资交易方法」——
   交易执行属 Trading Loop（另一种时间尺度、另一种风险约束），
   且「判断公开、操作不公开」（10 号文 4.1）。
3. **WUWEI 是约束层，不是节点。** 它永远可以回答「是否需要行动」，
   与 02 号文 §6「WUWEI 是行为原则」一致。
4. **Trading Loop ≠ Research Loop 的下半段。** 双回路相互关联但不互相污染，
   不合并为一个大流程（OD-3 附加限制）。
5. **Invalidation Principle（统一命名）。** 研究侧 invalidation 与交易侧逻辑失效点
   是同一 Method Principle 在两个时间尺度上的投影：
   「什么事实出现之后，我必须承认原来的逻辑不再成立？」——概念统一，实现层保持分离。

---

## 五、Method Proof 链（R-11 闭环核查）

```text
Principle（12 号文五条）
   ↓ 约束
Method（本文件十二协议）
   ↓ 产生
Work（8 Thesis / 6 Essay / 5 Observation / Map / Journal）
   ↓ 接受检验
Revision（Ledger 3 条起步，append-only 增长）
   ↓ 时间积分
Body of Work → PROOF 层（V2-07-03 待建）
```

核查结论：**链条每一环都有实码承载，无空词环节。**
本文件一节的审计表即 Method Proof 的当前形态——「HSN 有方法」不是声明，
是一张可以逐行抽查的实码清单。

---

## 六、禁止发明清单（本阶段的自我约束）

以下东西**看起来**会让 Method 更完整，但审计中没有实码或成文支撑，禁止加入：

| 禁止项 | 理由 |
|---|---|
| 量化评分卡 / 打分流程图 | 观察与研究判断刻意人工（F-5），评分卡是虚假精确 |
| 「每日研究流程」时间表 | 无日更义务（POV-05），不存在的东西不画 |
| 信息源清单 / 工具栈展示 | 无实码锚点，且滑向 Biography（10 号文三节） |
| 回测框架 / 收益归因模块 | Performance Theatre 禁令（09 号文 13.3） |
| 给八步循环配图解/动画 | 视觉设计不属本阶段；且首页七章冻结 |

---

## 七、Open Decisions（交战略侧 / 用户裁决）

1. **OD-1 · 八步循环是否锁定为 Canonical Method？** 含三处具体裁决：
   FRAME 独立成步、ACT 排除、WUWEI 作底座标注（四节裁决建议 1–3）。
2. **OD-2 · Method Versioning 载体**（协议 10 / F-4 缺口）：候选 = 文档层版本记录
   （在本文件维护 Method 修订表，不建数据实体）；是否批准？还是维持 journal 叙事现状？
3. **OD-3 · 双回路关系的形式化程度**：交易回路目前只在本文档以「并行回路」登记——
   是否需要在 V2-07-03 为「研究回路 × 交易回路 × 行为底座」建立正式的关系图，
   还是保持叙述层即可？
4. **OD-4 · 本文件封板编号**：通过 Review 后标记 CANONICAL · V2-07-02 · LOCKED，
   与 10/11/12 统一。

---

## 八、V2-07-02 Review 裁决记录（2026-08-24 · PASS WITH LOCKS）

战略侧对本文档 v0.9-draft 的 Review 结论：**PASS WITH LOCKS**——四项 OD 全部 ACCEPT，
commit 前补两条 Architecture Locks（AI-05 / AI-06，已补入本节）。

**OD 终裁：**

| OD | 裁决 | 落定形态 |
|---|---|---|
| OD-1 | ✅ ACCEPT | 八步循环锁定为 **Research Loop v1.0**（LEARN 更名为 REFLECT）；**不得**表述为「HSN Method = 八步」——Method 是上位体系（四节结构图） |
| OD-2 | ✅ ACCEPT | Method 必须有正式 Version History：`Method { currentVersion, versions[], revisions[] }`——属 **IP Architecture Layer 的版本记录**，不靠 Journal 叙事（Journal 是 narrative，Method Versioning 是 architecture state），且不复制 Thesis/Ledger 数据模型 |
| OD-3 | ✅ ACCEPT | 双回路正式化：两个相互关联但不互相污染的 Method Loop；Trading Loop ≠ Research Loop 的下半段 |
| OD-4 | ✅ ACCEPT | 维持 `13_V2_HSN_METHOD_ARCHITECTURE.md`；**文档编号 ≠ Method Version**（`13_V2...` 是文档编号，`Research Loop v1.0` 才是 Method Version，两者必须分离，防 `14_V2...` 被误读为 Method v14） |

**新增 Architecture Invariants（追加进 09 号文 AI 序列）：**

| # | 不变量 |
|---|---|
| **AI-05** | **Method ≠ Research Loop。** HSN Method 是上位体系；Research Loop 与 Trading Loop 是其中两个不同时间尺度的运行回路。禁止未来把交易系统吞进 Research |
| **AI-06** | **Method Version History ≠ Research Ledger。** Research Ledger = What I believed / when / why changed；Method History = How my way of thinking evolved。两个完全不同的问题，分属 IP Architecture Layer 与 Research System |

**本阶段确立的永久规则（随锁定生效）：**

1. **Method Architecture is Extracted, not Invented.** 方法架构只能抽取，不能发明——
   V2-07-01「从已有实践中抽取」纪律在 Method 层的延续。
2. **Invalidation Principle（概念统一，实现分离）**：研究侧证伪与交易侧止损是同一原则
   在两个时间尺度的投影（四节裁决要点 5）。
3. **观察的自动化边界**：「真、新、大」+ 3–5 条人工维护是特性不是缺陷——
   **Automation 可以帮助整理 Evidence，但不能替 HSN 决定什么值得观察。**
   人工观察的稀缺性本身就是 Author Lens。禁止「AI 自动抓取 → 排序 → 信号 → Thesis」式改造。

**Commit 授权：** 纯架构文档 commit；零代码 / 零 UI / 不动 G-08、G-05、InkTransition；
commit message `docs(v2): establish HSN method architecture`；**不 Push**。

**阶段状态：**

```text
V2-07-00  LOCKED
V2-07-01  LOCKED
V2-07-02  LOCKED（Who HSN is → How HSN thinks 已闭合）
        ↓
V2-07-03  Body of Work Architecture——从严格问题开始：
          「什么东西经过 3 年以后，仍然值得保留？」
          把 Thesis / Journal / Map / Essay / Observation
          从 Research Objects 提升为 Long-term Intellectual Assets
```

---

**修订记录**

| 版本 | 日期 | 内容 |
|---|---|---|
| v0.9-draft | 2026.08.24 | Audit + Extract + 候选模型；未锁定，待 Review |
| v1.0 | 2026.08.24 | PASS WITH LOCKS 裁决落定：八步锁定为 Research Loop v1.0（LEARN→REFLECT）；四节改写为 Canonical Method 结构；补 AI-05 / AI-06；CANONICAL · V2-07-02 · LOCKED |
