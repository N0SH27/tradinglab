# V2-26 · FRAMEWORK × SYSTEM IMPLEMENTATION CONTRACT — 框架 × 系统实施契约

> **状态：CONTRACT · LOCKED · V2-26 · v1.0（2026-08-27 · Human Approval PASS，四项 Open Question 全部闭环，见末节裁决记录）**
> 起草授权来源：Human Review 裁决（2026-08-27，对 25 号文「原则通过 + 修改批准」）。
> 上游基线：25 号文（Architecture Review，DRAFT 经裁决）/ 09～15（LOCKED）/ 16 / 17 / 18 / 20 / 22 / 23 / 24（全部 LOCKED）。
> **Contract LOCKED ≠ Implementation Authorized**——实施须另发 Implementation Authorization（18 号文九节同款闸门）。
> 本阶段全程纪律：**零代码、零 data 改动、零新 Entity、零新 Schema、零新 Data Layer、零 Commit、零 Push。**
> 本契约不重新研究已裁决问题、不扩大 Scope、不修改 LOCKED 的 V2-07 / Method / Research Loop v1.0。

---

## 〇、Human Review 裁决登记表（本契约的全部输入）

| 项目 | 裁决 | 本契约落点 |
|---|---|---|
| A 最大问题（名实错位 + Decision 缺环） | ✅ APPROVE | A / B 节直接引用，不重议 |
| B Current Audit | ✅ APPROVE | 作为事实基线引用 |
| E Framework 定义 | 🟢 APPROVE WITH REVISION | B 节：Operating Architecture，非单纯 Path |
| F System 定义 | 🟢 APPROVE WITH REVISION | B 节：Execution Rules |
| G Signal（NEW/BIG/TRUE） | ✅ APPROVE | G 节：Research-side Signal Qualification / Admission Filter；**不叫 Signal Model** |
| G Tape Signal 消歧 | ✅ APPROVE | G 节：仅术语，**不建 Entity** |
| H Trigger | 🟡 MODIFY | G 节：Trigger = Framework → System 的 **Action Interface**；不简单归 System |
| I IF–THEN 双层 | ✅ APPROVE | G / I 节沿用 |
| J Review 双层 + Revision Gate | ✅ APPROVE | I 节沿用 |
| K Framework IA | 🟡 MODIFY | D 节：Framework 页必须成为真正的 **Operating Map** |
| L System IA | 🟢 APPROVE WITH REVISION | E 节：内容迁移 + 重组为执行规则机 |
| M Historical Corpus | ✅ APPROVE | 验证角色，非输入；本契约不再展开 |
| N Future Evolution | ✅ APPROVE | Usage-driven；O 节排序遵守 |
| O No-Go | ✅ APPROVE | M / N 节锁死 |
| P Implementation Impact | ✅ APPROVE | K / L 节细化 |

**裁决后的锁定结构（Human 裁决十一节，本契约不再改动）：**

```text
                HOW I THINK
                  METHOD
                    ↓
               HOW I OPERATE
                FRAMEWORK
                    │
       ┌────────────┴────────────┐
       ↓                         ↓
  RESEARCH LOOP             TRADING LOOP
       ↓                         ↓
    BELIEF                    SYSTEM
                                 ↓
                               TRADE
                                 ↓
                              REVIEW
                                 ↓
                             REVISION
                                 ↺
```

---

## A. Final Architecture（最终架构 · 锁定候选）

```text
METHOD（认知方法 · How I Think）
    │  原则、研究协议、证据标准、修正纪律
    ↓
FRAMEWORK（操作架构 · How I Move From Reality To Action）
    │  完整 Operating Map：
    │
    │    WORLD → INFORMATION → OBSERVATION
    │              │
    │    ┌─────────┴──────────┐
    │    ↓                    │
    │  RESEARCH LOOP v1.0     │   ← Framework 内部的完整认知循环（非一个步骤）
    │  OBSERVE→CONTEXT→FRAME  │
    │  →THESIS→TEST→BELIEVE   │
    │  →REVISE→REFLECT        │
    │    ↓                    │
    │  BELIEF                 │
    │    ↓                    │
    │  DECISION ★（行动授权；一等输出含 INACTION）
    │    ↓                    │
    │  TRIGGER（Action Interface）
    │    │                    │
    │    ↓                    ↓
    │                       TRADING LOOP（Framework 内部的执行循环）
    │                       DECISION→TRIGGER→ENTRY→POSITION
    │                       →MANAGEMENT→EXIT→REVIEW
    │                         │
    │                       SYSTEM（规则容器，被循环消费）
    │                         ↓
    │                       TRADE / INACTION
    │                         ↓
    │    TRADING REVIEW → COGNITIVE REVIEW
    │                         ↓（仅经 Research → Judgment）
    │                     REVISION → ↺
    ↓
SYSTEM（执行规则 · How I Actually Trade）
    状态机 / 盘面信号分层 / 触发器规格 / 仓位 / 止损 / 管理 / 退出
```

**三条不变式（随本契约锁定候选）：**

- FA-1 · **Method > Framework > System** 层级唯一；Framework 是连接者，不与 Method 争上位（AI-05 完好）。
- FA-2 · **双循环是 Framework 内部的两个完整 Cycle**，不是链条上的两段——Research Loop v1.0 八步一字不改（Human 裁决 4）。
- FA-3 · **授权线唯一**：Decision → Trigger → System → Trade；任何绕过 Decision 的「Signal → Trade」直连非法。

---

## B. Final Definitions（最终定义 · 锁定候选）

| 概念 | 定义（中英） | 层级 |
|---|---|---|
| **Method** | **How I think —— 我采用什么原则、方法和逻辑形成判断。** 上位体系：双循环 + Wuwei 约束 + 演化史（13 号文 LOCKED，不重定义） | 认知方法 |
| **Framework** | **How the whole process operates —— 把 Research、Decision、Trading、Review 连接起来的 Operating Architecture。** | 操作框架 |
| **Research Loop** | **Framework 内部负责 Belief 更新的认知循环**（v1.0 八步，LOCKED） | 认知循环 |
| **Decision** | **行动授权判断：在既定信念与市场状态下，决定是否行动、等待什么条件、以多大风险行动。** 一等输出含 **INACTION**（不操作是持仓，POV-05） | 授权层（概念，非实体） |
| **Signal** | **Research-side：一个通过 NEW / BIG / TRUE 准入检验、值得更新注意力或解释的观察判定。** Signal = Observation × Verdict，不是事物 | 认知判定（非实体） |
| **Tape Signal** | **Trading-side：盘面或交易数据中可直接用于交易判断的信号（Price / Volume / Momentum / Order Flow 等）。** 仅 System 内部消歧术语 | 执行输入（非实体） |
| **Trigger** | **an actionable condition recognized by the Decision layer and consumed by the Trading System —— 经 Decision 确认后，被交易系统用于启动、调整或终止行动的可执行条件。** Trigger 是 Framework → System 的 **Action Interface**；可由 System 消费，但不等于 System | 接口（非实体） |
| **System** | **What rules govern execution —— 行动获得授权之后，具体按照什么规则执行、管理、退出；同样负责在未经授权时禁止行动。** | 执行规则 |
| **Trade** | 实际执行或执行不操作的行为层输出 | 行为 |
| **Trading Review** | Did I execute the System correctly?（Entry / Position / Risk / Management / Exit / Execution） | System / Trading Loop |
| **Cognitive Review** | Was my understanding correct?（Signal 有效性 / Thesis 成立性 / Evidence 充分性 / Probability / Framework 本身） | Research / Framework |
| **Revision** | 仅经 Research → Judgment 后的入账修正（Ledger / CONTEXT_HISTORY / ESSAY_VERSIONS / Method amendment 四通道，均已有归属） | 修正动作 |

---

## C. Boundary Matrix（边界矩阵 · 修订版）

在 25 号文 C 节基础上按裁决修订：Trigger 行重写为 Interface；Decision 行正式入列。

| Layer | Responsibility | Input | Output | Owns Belief? | Owns Action? |
|---|---|---|---|---|---|
| World | 现实本身 | — | 变化 | ✗ | ✗ |
| Information | 未筛选资讯流 | World | 候选注意对象 | ✗ | ✗ |
| Method | 为什么/如何形成判断（上位体系） | Revision 长期积累 | 更好的回路 | ✗（经 REFLECT 间接） | ✗ |
| Framework | 连接 Research / Decision / Trading / Review 的 Operating Architecture | Method 约束 + 全链路状态 | 运行中的双循环与授权 | ✗ | ✗（承载授权，不执行） |
| Research Loop | 信念如何形成与修正 | Observation / Signal | Thesis · Belief · Revision | **✓（唯一所有权域）** | ✗ |
| Signal（Research-side） | 观察的准入判定（NEW/BIG/TRUE） | Observation | 注意力/解释更新 | ✗ | ✗ |
| Thesis | 当前可证伪判断 | FRAME + Evidence | 信念对象 | **✓（载体）** | ✗ |
| Belief | conviction 刻度 | Thesis + Ledger | 当前信念 | **✓** | ✗ |
| **Decision** | 行动授权：动不动、等什么、多大风险 | Belief + Context + Market State | Trigger 确认 / **INACTION** | ✗ | **✓（授权）** |
| **Trigger** | **Action Interface：Decision 确认的可执行条件，交给 System 消费** | Decision 确认 + 预写条件 | 执行许可 | ✗ | ✗（许可，非动作） |
| Tape Signal | 盘面交易判断输入（领先/同步/滞后） | 盘面数据 | 交易判断原料 | ✗ | ✗ |
| System | 执行、管理、退出交易的规则 | Trigger 许可 | 行为规则与参数 | ✗ | **✓（规则层）** |
| Trade | 执行或不执行 | System 规则 | 交易结果 | ✗ | **✓（行为层）** |
| Trading Review | 执行是否正确 | Trade 结果 | 执行层修正建议 | ✗ | ✗ |
| Cognitive Review | 理解是否正确 | Belief/Signal/Evidence 历史 | 认知层修正建议 | ✗ | ✗ |
| Revision | 入账修正 | Review → Research → Judgment | 账本新条目 | **✓（改变信念的唯一动作）** | ✗ |
| Distribution | 单向投影（AI-09～12） | Canonical Work | 站外表达 | ✗ | ✗ |

---

## D. Final Framework IA（Framework 页 · Operating Map）

> 页面回答：**How I Move From Reality To Action.**
> Framework 页不是五个步骤清单，是**完整操作地图**：每个概念在图上有位置，每个位置链到它的 Canonical 家。
> 约束：零新实体；全部内容可溯源 LOCKED 结构；INACTION 可见；**不做 About 化**（R-8 P0）。

```text
FRAMEWORK — How I Move From Reality To Action
│
├── Ⅰ · THE MAP（操作地图 · 全页主干）
│      WORLD → INFORMATION → OBSERVATION
│        → [RESEARCH LOOP] → BELIEF → DECISION → [TRADING LOOP]
│        → TRADE / INACTION → REVIEW → REVISION ↺
│      每节点一句职责 + 链到 Canonical 家：
│      OBSERVATION→#/（NOW）；CONTEXT→#/map #/cycle；THESIS→#/thesis；
│      BELIEF/REVISION→#/journal；METHOD→#/method；SYSTEM→#/system；
│      约束层→#/wuwei
│
├── Ⅱ · TWO CYCLES（Framework 内部的两个完整循环）
│      RESEARCH LOOP v1.0（认知循环 · 慢）——八步名序一字不动，链 #/method
│      TRADING LOOP（执行循环 · 快）——DECISION→TRIGGER→ENTRY→…→REVIEW，链 #/system
│      + WUWEI 约束层（不是步骤，永远可回答「是否需要行动」）
│
├── Ⅲ · DECISION（授权层 · 本轮正名）
│      「我认为是真的」≠「我决定行动」；BELIEF = YES / ACTION = NO 是合法状态
│      认知侧 IF–THEN（invalidation = 预写的认知预案）
│      INACTION 是一等输出
│
├── Ⅳ · THE ACTION INTERFACE（行动接口）
│      Decision → Trigger → System：Trigger 是接口不是系统
│      Research Signal ≠ Tape Signal 消歧声明
│
└── Ⅴ · REVIEW → REVISION（回流）
       双 Review 各回答什么；亏损 → 改框架 = 非法直连
       修正只经 Research → Judgment 入账
```

## E. Final System IA（System 页 · How I Actually Trade）

> 页面回答：**授权之后，具体按什么规则交易。**
> System 是机器，不是哲学页；现有哲学内容（三要素/赌场/心法）保留但重新归位为「机器为什么这样造」。

```text
SYSTEM — How I Actually Trade
│
├── Ⅰ · WHY THIS MACHINE（机器的存在理由）
│      三要素（正期望 / 资金管理 / 心理管控）+ 赌场模型 —— 现有内容原位
│
├── Ⅱ · STATE（市场状态机）—— 现有内容原位
│      四状态 × 允许操作 × 仓位上限：先回答「现在允许做什么」
│
├── Ⅲ · TAPE SIGNAL（盘面信号分层）★ 消歧更名
│      领先 / 同步 / 滞后；用途分层纪律 —— 自 framework.ts 02 后半迁入
│
├── Ⅳ · TRIGGER SPECS（触发器规格库）
│      三要素：入场 / 失效 / 历史胜率；形态 / 数量 / 事件 / 反向触发
│      交易侧 IF–THEN 预案 —— 自 framework.ts 03 / 04 迁入
│      （规格存于此；确认动作属 Decision，见 Framework 页 Ⅳ）
│
├── Ⅴ · EXECUTION（入场 · 仓位 · 止损 · 退出）
│      三层共振 + 资金管理；逻辑失效点 —— 自 framework.ts 05 迁入 + wuwei 链接
│
├── Ⅵ · TRADING REVIEW（执行复盘）
│      好交易标准（事前尺 = 事后尺）—— 自 framework.ts 06 迁入；金字塔 L7 归位
│
├── Ⅶ · EVOLUTION（系统演进）—— 现有内容原位
│
└── Ⅷ · 四字心法（等忍断持）—— 现有内容原位，末端链 #/wuwei
```

**七层金字塔保留为 System 页总图**（STATE→…→REVIEW 的现成目录）。

## F. Method / Framework / System 三者关系（锁定候选）

| | METHOD | FRAMEWORK | SYSTEM |
|---|---|---|---|
| 回答 | How I Think | How I Operate | How I Actually Trade |
| 本质 | 认知方法（引擎） | 操作架构（地图） | 执行规则（机器） |
| 时间尺度 | 年（Slowly Evolving） | 持续运行 | 单笔交易（快） |
| 持有内容 | Principles / Research 协议 / 证据标准 / 修正纪律 / 演化史 | 完整 Operating Map + 双循环连接 + 授权线 | 状态机 / Tape Signal / Trigger 规格 / 仓位 / 止损 / 执行复盘 |
| 治理 | 13 号文 LOCKED + AI-04/05/06 | 本契约 | 文本域内容修订（任务单授权） |

## G. Signal / Tape Signal / Trigger / Decision 边界（锁定候选）

1. **NEW / BIG / TRUE = Research-side Signal Qualification（Signal Attention Gate / Research Admission Filter）**——不是 Signal Model，不是 Trading Signal Specification，永不直连 BUY/TRIGGER。链路：`Something changed → NEW? → BIG? → TRUE? → Worth researching`。
2. **Research Signal ≠ Tape Signal**：前者改变解释，后者服务交易判断；后者是 System 内部术语，**不建 TapeSignal Schema**。
3. **Trigger = Decision → System 的 Action Interface**：`Decision / Authorization → Trigger → System → Trade`。可由 System 消费，不等于 System；**不建 Trigger Entity**。
4. **Decision 是概念层**：授权判断（含 INACTION 一等输出）；**不建 Decision Entity**。
5. 候选链 `Signal → Thesis → Trigger` 的非法压缩版永久禁止；合法链必须过 BELIEF → DECISION。

## H. Research Loop / Trading Loop 双循环（锁定候选）

```text
                 FRAMEWORK
                     │
        ┌────────────┴────────────┐
        ↓                         ↓
   RESEARCH LOOP             TRADING LOOP
   （完整认知循环）           （完整执行循环）
   OBSERVE→CONTEXT→          DECISION→TRIGGER→
   FRAME→THESIS→TEST→        ENTRY→POSITION→
   BELIEVE→REVISE→REFLECT    MANAGEMENT→EXIT→REVIEW
        ↓                         ↓
      BELIEF                   TRADE / INACTION
        │                         │
        └────────────┬────────────┘
                     ↓
        TRADING REVIEW → COGNITIVE REVIEW
                     ↓（仅经 Research → Judgment）
                  REVISION ↺
```

**Research Loop v1.0 不修改**（Human 裁决 4；八步名序原样）；它是 Framework 内部的完整循环，不是 Framework 的一个普通步骤。Trading Loop 同步正名为完整执行循环（DECISION→…→REVIEW），其规则容器 = System。

## I. Review / Revision Architecture（沿用裁决，不重议）

- Trading Review（System / Trading Loop）：执行是否正确。
- Cognitive Review（Research / Framework）：理解是否正确。
- Revision Gate：`Trade Result → Trading Review → Cognitive Review → Research → Judgment → Revision`；「每一次亏损都修改 Framework」= 非法直连（四重 LOCKED 防线：Ledger 准入 / AI-04 / AI-06 / P-05）。
- 文本域（framework.ts / system.ts 等静态方法层）的修订 = 内容修订（任务单授权），不进任何账本。

## J. Current Content Migration Map（逐项迁移表 · 本契约核心）

> 纪律：**不得笼统处理。** 每一项给出处置 + 理由 + 落点。

### J.1 `domains/framework.ts`（当前 6 条目）

| # | 条目 | 处置 | 理由与落点 |
|---|---|---|---|
| 01 | 交易系统只做三件事（EXPLAIN · DECIDE · PROTECT） | **MOVE TO SYSTEM** | 纯交易回路总纲（解释/决策/风险三件事都发生在授权之后）；落 System Ⅰ 或 Ⅱ 导入段 |
| 02 | 信号的分层与识别 | **SPLIT** | 前半「真、新、大 = 异常值识别」= Research Admission → **MOVE TO METHOD**（观察协议文本）；后半「领先/同步/滞后分层」= Tape Signal → **MOVE TO SYSTEM** Ⅲ |
| 03 | If-Then 预案表 | **MOVE TO SYSTEM** | 四条全部为交易执行语义（Trading IF–THEN）；落 System Ⅳ |
| 04 | 触发器库 | **MOVE TO SYSTEM** | 规格库（入场/失效/胜率）由 System 消费与维护；落 System Ⅳ；确认权归属在 Framework 页 Ⅳ 表述 |
| 05 | 周期三层共振 | **MOVE TO SYSTEM** | 仓位资格与执行匹配规则（≥2 层共振才动）；落 System Ⅴ |
| 06 | 什么算一笔好的交易 | **MOVE TO SYSTEM** | Trading Review 的事前标准；落 System Ⅵ |

**framework.ts 文件本身：KEEP + 全文改写**——改写后成为 Framework 页（Operating Map）的文本源；文件类不变（静态方法文本域，非实体）。

### J.2 `domains/system.ts`（当前 6 组）

| 组 | 处置 | 落点 |
|---|---|---|
| SYSTEM_PYRAMID（七层） | **KEEP** | System 页总图 |
| SYSTEM_THREE（三要素） | **KEEP** | System Ⅰ |
| SYSTEM_CASINO（赌场） | **KEEP** | System Ⅰ |
| MARKET_STATES（状态机） | **KEEP** | System Ⅱ |
| SYSTEM_EVOLUTION（演进） | **KEEP** | System Ⅶ |
| SYSTEM_PRINCIPLES（等忍断持） | **KEEP** | System Ⅷ |

### J.3 METHOD 页内容来源

| 内容 | 来源 | 处置 |
|---|---|---|
| Research Loop v1.0 八步呈现 | 13 号文（LOCKED 文档）→ 页面投影 | **NEW PAGE CONTENT**（文本新写，语义零改动，链到各 Canonical 家） |
| 观察协议（真新大 + 3–5 条纪律 + 自动化边界） | framework.ts 02 前半 + 13 号文协议 1 | 迁入 METHOD |
| 证据标准 / 证伪纪律 / Invalidation Principle | 13 号文协议 4/8 + Essay thesis-writing-os | 文本引用 + 链接，不复制 Essay 全文 |
| 修正纪律（Ledger 准入 / confirm 三态） | 08 号文 + ledger.ts | 文本引用 + 链 #/journal |
| 行为约束层指针 | wuwei.ts | 仅链接（WUWEI 页独立存在，不搬家） |
| 方法演化 | SYSTEM_EVOLUTION 原位留 System；Method 演化走 13 号文 OD-2 通道 | **DEFER**（本契约不建 Method Versioning 载体） |

### J.4 其余对象处置

| 对象 | 处置 | 说明 |
|---|---|---|
| Manifesto / Wuwei / Cycle / Dimensions / Thesis / Journal / Essays / Map / Home 七章 | **KEEP 零改动** | 全部 LOCKED 或既有冻结面 |
| 「盘面信号」中文文案 | 沿用「信号分层」中文 + 英文 TAPE SIGNAL 消歧 | 文案级，非概念变更 |
| 02 号文 §6 旧映射（THINK→SYSTEM/FRAMEWORK） | **DEFER** 文档层 versioned amendment | 与本契约分开的任务 |
| 13 号文登记 Framework/Decision/Trigger 定义 | **DEFER** versioned amendment（AI-04） | 同上 |

## K. Existing Code Impact（代码影响 · 仅登记）

> 实施若获授权，改动面如下。**本契约不授权任何改动。**

| 类别 | 文件 | 变更性质 |
|---|---|---|
| data（静态文本域） | `src/data/domains/framework.ts` | 全文改写为 Framework 页（Operating Map）内容源 |
| data（静态文本域） | `src/data/domains/system.ts` | 吸收 J.1 迁入内容；新增导出分组（TAPE SIGNAL / TRIGGER SPECS / EXECUTION / REVIEW 文本） |
| data（静态文本域） | `src/data/domains/method.ts` | **新增文件**（与 framework.ts 同类的静态文本模块）——**OQ-1 已终裁确认**：不构成「新增 Data Layer」（与 C1 契约对 framework.ts/system.ts 的「静态框架层」定性同类；无实体、无 id 体系、无关系字段、无消费者契约之外的读取方） |
| page | `src/pages/Framework.tsx` | 结构重写（五段 Operating Map，D 节） |
| page | `src/pages/System.tsx` | 结构扩展（八段，E 节；现有六段内容原位保留） |
| page | `src/pages/Method.tsx` | **新增页面**（三页结构裁决的直接推论） |
| navigation | `src/data/domains/site.ts` | NAV 增加 METHOD 项；ARCHIVE_TREE 的 System/Framework 子项同步 + 新增 Method 子树 |
| routing | `src/App.tsx` | 注册 `#/method` 路由 |
| copy | 两页 PageHead intro | 按 B 节定义重写 |
| **零触碰** | theses / ledger / journal / now / map / cycle / dimensions / essays / context-history / essay-versions / manifesto / wuwei / polarity / analytics / 全部 LOCKED 域 | —— |

## L. Navigation Impact（导航影响 · 仅登记）

当前 NAV（site.ts）：NOW / WORLD（地图·周期·四象）/ THESIS（命题·系统·框架）/ JOURNAL（日志·文集）/ WUWEI / HSN（宣言）。

**导航方案 A 已锁定（OQ-2 终裁）**：THESIS 组扩展为 命题 · **方法** · 框架 · 系统（四项）。理由：三页同属「认知—行动系统」，组内聚集语义最准确；零新增导航组。（被否方案 B「新建 METHOD 一级组」记录于此：层级更显性，但导航膨胀，违背 03 号文「最少页面」倾向。）

ARCHIVE_TREE：新增 `Method` 子树（研究循环 / 证据标准 / 证伪纪律 / 修正纪律）；`Framework` 子树改为（操作地图 / 双循环 / 决策授权 / 行动接口 / 复盘回流）；`System` 子树改为（状态机 / 盘面信号 / 触发器 / 资金管理 / 执行复盘）。

## M. No-New-Entity Boundary（再次锁死）

```text
Signal        不建 Entity / Schema / Database —— 判定，不是事物
Tape Signal   不建 Entity / Schema —— System 内部术语
Trigger       不建 Entity / Database / CMS —— 接口，不是对象
Decision      不建 Entity —— 概念层
Framework     不建 Entity —— 组合视图
Method        不建 Entity —— 13 号文已治理
```

## N. No-Data-Layer Boundary（再次锁死）

- 本阶段不建立 Trading Data Layer / Quant Data Layer / Signal Database / Trigger Database。
- `method.ts` 新增的唯一合法性依据 = 它是**静态方法文本模块**（framework.ts 同类），不是 Canonical Entity、不含 id 引用体系、不含关系字段、不含状态字段。
- check-data.mjs 断言扩展不在本契约内；如实施任务需要，另行提案（LOCK-C2A-01 同款纪律：契约 ≠ 断言授权）。

## O. Implementation Sequence（实施顺序 · 提案，待授权）

```text
Contract LOCKED（本文件）
      ↓
Implementation Authorization（另发闸门）
      ↓
T1 文本域：framework.ts 改写 + system.ts 吸收 + method.ts 新增（纯文本，零页面）
      ↓ npm run check / build / lint
T2 页面：Framework.tsx / System.tsx / Method.tsx + 路由注册
      ↓ check / build / lint + CDP 实测（沿用 V2 验证纪律）
T3 导航与归档树：site.ts NAV + ARCHIVE_TREE
      ↓ 全量验证
STOP —— 每步独立可回滚；不顺手修 G-08 / G-05 / InkTransition
```

**第一轮任务单 = T1 + T2 合并（OQ-3 终裁锁定）**——文本与页面同语义，拆开会产生中间态页面；T3 随后单独授权。沿用 17 号文「宁少勿多」纪律。

## P. Verification Plan（验证计划 · 契约级承诺）

| 验证 | 标准 |
|---|---|
| 语义零漂移 | Method 页八步名序与 13 号文逐字一致；Research Loop 不被表述为「Framework 的一个步骤」 |
| 双源检查 | 迁入 System 的文本在 framework.ts 中不再出现（grep 实证）；Method 页不复制 Thesis/Ledger 任何事实字段 |
| 消歧检查 | 全站文本中「信号」在交易语境可识别为 Tape Signal 语义；NEW/BIG/TRUE 不与 BUY/TRIGGER 同段出现 |
| 既有断言 | `npm run check` 既有 222 项全过；build / lint 无新增 error |
| 回归 | 未触碰页面 CDP 实测与实施前一致 |
| 冻结面 | 首页七章 / Manifesto / Wuwei / Thesis / Journal / Map / Cycle / Dimensions 零 diff |
| 回滚演练 | 见 Q |

## Q. Rollback Boundary（回滚边界）

- 全部变更为**纯文本与页面结构**：无数据迁移、无 Schema 变更、无实体增删（method.ts 为新增文件，删除即回滚）。
- 回滚 = 单 commit revert；无历史状态污染风险（append-only 账本零触碰）。
- 回滚不触碰：Ledger / CONTEXT_HISTORY / ESSAY_VERSIONS / 全部 LOCKED 文档。
- 若 T2 后发现 IA 判断错误：页面回滚不影响文本域内容归属（T1 迁移语义仍成立），两级回滚解耦。

---

## Open Questions（已全部裁决闭环 · 2026-08-27）

| # | 问题 | 终裁 |
|---|---|---|
| OQ-1 | `domains/method.ts` 新增静态文本模块的定性 | **✅ ACCEPT**——确认为静态文本模块（framework.ts 同类），不构成新增 Data Layer |
| OQ-2 | 导航方案 | **✅ 方案 A 锁定**——THESIS 组扩展为 命题 · 方法 · 框架 · 系统（四项），不新建一级导航组 |
| OQ-3 | 第一轮任务单授权范围 | **✅ T1 + T2 合并为一个任务单**——文本与页面同语义，拆开会产生中间态页面 |
| OQ-4 | 25 号文是否做修订注记 | **✅ 25 号文保留原样**，本文档为裁决后唯一契约基准（沿用 09 号文十三节先例） |

---

## 裁决记录（2026-08-27 · Human Approval PASS）

**四项 Open Question 全部闭环（上表），无 REJECT、无 MODIFY、无遗留开放点。**

随裁决生效的锁定项：

1. `domains/method.ts` = 静态方法文本模块（非实体、非 Data Layer），其新增授权随未来 Implementation Authorization 生效；
2. 导航 = 方案 A（THESIS 组四项：命题 · 方法 · 框架 · 系统）；ARCHIVE_TREE 按 L 节同步；
3. 实施顺序 = T1+T2 合并任务单先行，T3（导航与归档树）随后；每步独立可回滚；
4. 25 号文（Architecture Review）保留原样不改写；凡 25 号文与本文档冲突处（E/H/K/L 四处的原提案），**以本文档为准**。

**Commit 授权：** 纯架构文档 commit（仅 26 号文单文件，commit message 建议 `docs(v2): establish framework × system implementation contract`）；**不 Push**；Commit 后立即停止。

**闸门重申：**

```text
26 号文 LOCKED（本文件，当前状态）
      ↓
❌ 仍然不能自动写代码
      ↓
Implementation Authorization（T1+T2 任务单，另行明确发出）
      ↓
Code → Validation（P 节）
```

**当前阶段状态：**

```text
25  Framework × System Architecture Review      ✅ 裁决通过（经修改批准）
26  Framework × System Implementation Contract  🔒 LOCKED（本文档）
        ↓
Implementation Authorization（T1+T2）            ⏸ 等待 Human 明确发出
```

---

**STOP。等待 Implementation Authorization。**
