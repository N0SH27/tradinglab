# V2-25 · FRAMEWORK × SYSTEM ARCHITECTURE REVIEW — 框架 × 系统架构审查

> **状态：DRAFT · RESEARCH ONLY · 待 HUMAN REVIEW（2026-08-27）**
> 本轮**零代码、零数据改动、零新实体、零新 Schema、零 Commit、零 Push**。
> 上游契约：09～15（V2-07 全阶段，LOCKED）/ 16（Closure）/ 17（Prioritization）/
> 18（C1 Contract）/ 20（C4 Contract）/ 22（C1+C4 Closure）/ 23（C2 Re-Prioritization）/ 24（C2-A Contract），全部 LOCKED。
> 实码依据：`src/pages/*`、`src/data/domains/*` 全文实读（2026-08-27）。
> 外部材料：`TRACK-A_HISTORICAL_CORPUS_AUDIT.md`、`TRACK-A_HISTORICAL_TO_CANONICAL_MATCHING_REVIEW.md`。
> 本文件回答一个问题：**Framework 与 System 各是什么，边界在哪里，两个页面应该表达什么。**
> 最终原则：**Do not build the system you might need. Define the system you actually use.**
> **Research first. Architecture second. Infrastructure last.**

---

## A. Executive Judgment（执行判断）

**当前 Framework / System 最大的问题不是内容缺失，而是名实错位加上一个概念缺环。**

名实错位：现在叫「Framework（框架）」的页面，实码内容（framework.ts 六个条目）里至少五个是**交易侧方法**——信号分层、If-Then 预案、触发器库、三层共振、好交易标准。它实际上是一个 Trading Method Library，而不是「Framework = 从信息到判断到行动的操作架构」。与此同时，V2-07 最有区分度、已 LOCKED、且已有完整实码承载的资产——**Research Loop v1.0**——在全站没有任何一个页面级的家：它只存在于 13 号文档和首页的零散片段里。两个页面都在回答「怎么交易」，没有页面回答「信息如何变成判断」。

概念缺环：**Decision 不存在。** 现有链条从 BELIEVE（conviction 刻度）直接跳到交易动作，中间「信念如何获得行动授权」这一层没有名字、没有归属、没有页面落点。Trigger 因此无处安放——它既被当成 Framework 内容（触发器库挂在框架页），又在 13 号文里属于 Trading Loop 的一步。

结论：候选方向（Framework = 从信息到决策、交易与修正的 operating framework）**成立**，但它必须以**组合既有 LOCKED 结构**的方式实现，而不是新建层。本轮推荐的解法是一个三层句型：**Method 管「为什么这样做」（上位体系，不动）；Framework 管「按什么路径走」（操作主干，本轮正名）；System 管「动手之后按什么规则」（执行规则系统，收窄正名）。**

---

## B. Current Architecture Audit（现状审计）

### B.1 当前 Framework 是什么

**页面**（`pages/Framework.tsx`，导航 no=09，THESIS 组）：intro 自称「网站的知识底座。把私人的研究习惯沉淀为公开的方法论」。

**实码内容**（`domains/framework.ts`，6 条目）：

| # | 条目 | 真实层位判定 |
|---|---|---|
| 01 | 交易系统只做三件事（EXPLAIN · DECIDE · PROTECT） | 跨层：交易回路的总纲 |
| 02 | 信号的分层与识别（真新大 + 领先/同步/滞后） | **Trading Loop · SIGNAL** |
| 03 | If-Then 预案表（炸板率/10日线/跳空/连损） | **Trading Loop · 预案**（全部四条都是交易执行语义） |
| 04 | 触发器库（入场条件/失效条件/历史胜率） | **Trading Loop · TRIGGER** |
| 05 | 周期三层共振（大盘/板块/个股） | Decision/System 边界的仓位资格规则 |
| 06 | 什么算一笔好的交易 | Trading Review 的事前标准 |

**审计结论：当前 Framework 页 ≈ Trading Method Library。** 六个条目中没有任何一个属于 Research Loop（OBSERVE/CONTEXT/FRAME/THESIS/TEST/BELIEVE/REVISE/REFLECT 全部缺席）。

### B.2 当前 System 是什么

**页面**（`pages/System.tsx`，no=03，THE SYSTEM）：intro =「计划交易，交易计划……三要素：正期望系统、资金管理、心理管控」。

**实码内容**（`domains/system.ts`）：七层金字塔（周期→市场结构→变化与信号→形态量价→操作止损仓位→心态→复盘认知）、三要素、赌场模型、市场状态机（四状态×允许操作×仓位上限）、系统演进三阶段、四字心法（等忍断持）。

**审计结论：当前 System 页 = 交易系统的哲学 + 总图 + 状态机 + 演化史。** 它已经是「How HSN actually trades」的合格载体，但缺了触发器/If-Then/信号分层这些**执行规则的细节**——那些恰好被错放在 Framework 页。注意金字塔第 1 层（周期=战略）与第 7 层（复盘认知=进化）实际越界伸进了 Research Loop 的 CONTEXT 与 REFLECT——这是有意为之的闭环表达（复盘反哺周期），登记为**受控重叠**，不是错误。

### B.3 当前 Research Loop 是什么

13 号文（LOCKED）：Research Loop v1.0 = OBSERVE → CONTEXT → FRAME → THESIS → TEST → BELIEVE → REVISE → REFLECT，每步都有实码承载（now / map+cycle / theses schema / evidence+invalidation / ledger / essays+journal）。**产品落点分散**：NOW（首页 ACT I 承接）→ MAP/CYCLE → THESIS → JOURNAL/LEDGER。没有单一页面表达这个循环本身。02 号文 §6 的旧映射（THINK → SYSTEM/FRAMEWORK）已落后于 V2-07——SYSTEM/FRAMEWORK 两页现在都不承载 THINK。

### B.4 冲突与概念重叠清单

| # | 冲突/重叠 | 性质 |
|---|---|---|
| CF-1 | **Framework 页名实错位**：名叫框架，实为交易方法库 | 本轮核心问题 |
| CF-2 | **「信号」一词双义**：framework.ts 02 的「信号」是盘面/交易信号（领先同步滞后）；本轮候选 Signal 是研究侧概念（足以改变解释的有意义变化）。两个概念共用一词，是全部边界混乱的语义源头 | 必须消歧 |
| CF-3 | **Research Loop 无页面之家**：LOCKED 的核心资产只有文档形态 | IA 缺口 |
| CF-4 | **Decision 概念缺环**：BELIEVE → ACTION 之间无授权层；Trigger 因此归属不明 | 架构缺口（本轮正名，不建实体） |
| CF-5 | **Review 未分型**：金字塔 L7「复盘认知」与 Ledger Revision 并存，但「执行复盘」与「认知复盘」从未被区分为两种 Review | 概念重叠 |
| CF-6 | 金字塔 L1/L7 与 Research Loop 的 CONTEXT/REFLECT 重叠 | 受控重叠（闭环表达），保留 |
| CF-7 | 02 号文 §6 映射（THINK→SYSTEM/FRAMEWORK）与 V2-07 现实脱节 | 文档层待更新（Future Revision） |

---

## C. Boundary Matrix（边界矩阵）

| Layer | Responsibility | Input | Output | Owns Belief? | Owns Action? |
|---|---|---|---|---|---|
| **World** | 现实本身；不负责被理解 | — | 变化 | ✗ | ✗ |
| **Information** | 未筛选的资讯流（新闻/行情/他人观点） | World | 候选注意对象 | ✗ | ✗ |
| **Research**（Loop v1.0） | 信念如何形成与修正 | Observation / Signal | Thesis · Belief · Revision | **✓（唯一所有权域）** | ✗ |
| **Method** | 上位体系：双回路 + Wuwei 约束 + 演化史（AI-05） | Revision 的长期积累 | 更好的回路本身 | ✗（经 REFLECT 间接） | ✗ |
| **Framework** | 操作主干：信息→判断→授权→复盘→修正的**路径与边界** | Belief + Context | Decision / 行动授权 | ✗（承载路径，不持有信念） | ✗（授权，不执行） |
| **Signal** | 观察的判定：值得更新注意力/解释 | Observation | 注意力与解释更新 | ✗ | ✗ |
| **Thesis** | 当前可证伪判断（Research System 的 Canonical Judgment） | FRAME + Evidence | 信念对象（阴阳双面 + 证伪条件） | **✓（载体）** | ✗ |
| **Belief** | conviction 刻度（0–100，Ledger 唯一入口） | Thesis + Revision | 当前信念 | **✓** | ✗ |
| **Decision** | 行动授权判断：信到什么程度、什么条件、动不动 | Belief + Context + State | Trigger 确认 / **INACTION** | ✗ | **✓（授权）** |
| **Trigger** | 预写条件集合的满足确认 | 市场事实 + 条件库 | 执行许可 | ✗ | ✗（它是许可，不是动作） |
| **System** | 执行规则：状态机/信号分层/触发器/仓位/止损/管理 | 执行许可 | 行为规则与参数 | ✗ | **✓（规则层）** |
| **Trade** | 实际执行或执行不操作 | System 规则 | 交易结果 | ✗ | **✓（行为层）** |
| **Review** | 双型复盘（执行是否正确 / 理解是否正确） | Trade 结果 / Belief 历史 | 修正建议 | ✗ | ✗ |
| **Revision** | 入账修正（Ledger / CONTEXT_HISTORY / ESSAY_VERSIONS / Method amendment） | Review → Research → Judgment | 新的账本条目 | **✓（改变信念的唯一动作）** | ✗ |
| **Distribution** | 单向投影到站外（AI-09～12） | Canonical Work | 站外表达 | ✗（永不） | ✗ |

**三条矩阵级原则：**

1. **Belief 所有权唯一**：只有 Research 域（Thesis/Belief/Revision）能持有和改变信念。Framework 经过信念但不拥有信念；System 消费信念但不触碰信念。
2. **Action 分三段**：Decision 授权 → System 给规则 → Trade 是行为。三者不得合并——合并即「看到信号就下单」的散户结构。
3. **INACTION 是一等输出**：Decision 与 Trade 的合法输出都包含「不动」（POV-05 / WUWEI）。任何把链条画成「必然通向交易」的图都是错的。

---

## D. Recommended Architecture（推荐架构）

### D.1 对候选假设链的验证结论

候选链 `WORLD → INFORMATION → RESEARCH → DECISION → TRADING → REVIEW → REVISION`：**方向成立，需四处修正**。

| # | 修正 | 理由 |
|---|---|---|
| M-1 | RESEARCH 不得是黑箱——必须展开为 LOCKED 的 Research Loop v1.0 八步 | 13 号文 LOCKED；任何压缩表达都是未经授权的重新定义 |
| M-2 | SYSTEM 不是一个「步骤」，是一个**规则容器**——链条穿过 System，不停留在 System | System 无时间相位；把容器画成相位会让 System 看起来执行决策（它只提供规则） |
| M-3 | 必须加入 **INACTION** 作为 Decision 与 Trade 的一等输出 | POV-05 / WUWEI / 「不操作是持仓」；候选链全部版本都漏了它 |
| M-4 | REVISION 之后必须显式回到 OBSERVATION（经 REFLECT），并标注 Distribution 在链外 | 09 号文 13.5 飞轮 + 15 号文：外部反馈只进 Observation |

### D.2 最终推荐链

```text
REALITY / WORLD
    ↓   信息 ≠ 信号
INFORMATION
    ↓   HSN 人工选择（真·新·大；3–5 条纪律；自动化边界 LOCKED）
OBSERVATION ────────────── Signal = Observation 的判定结果，不是新一层
    ↓
┌─ RESEARCH LOOP v1.0（LOCKED · 慢回路）─────────────────┐
│  CONTEXT   定位：地图 / 渗透率 / 周期 / 时代            │
│    ↓                                                   │
│  FRAME     核心矛盾：Dominant narrative → Counterforce │
│            → Research question                         │
│    ↓                                                   │
│  THESIS    可证伪命题（阴阳双面 / 证据≤3 / 证伪预登记） │
│    ↓                                                   │
│  TEST      证据监测 + 证伪信号值守                      │
│    ↓                                                   │
│  BELIEVE   conviction 0–100，Ledger 唯一派生入口        │
└────────────────────────────────────────┬───────────────┘
                                          ↓
★ DECISION   行动授权：信到什么程度、等什么条件、动不动
             （一等输出含 INACTION；认知侧 IF–THEN 在此工作）
                                          ↓
  TRIGGER    预写条件的满足确认
═══════════ Framework × System 边界（授权线）═══════════
                                          ↓
┌─ TRADING LOOP（LOCKED · 快回路）────────────────────────┐
│  STATE     市场状态机：先回答「现在允许做什么」          │
│    ↓                                                   │
│  SIGNAL    盘面信号分层：领先 / 同步 / 滞后              │
│    ↓                                                   │
│  TRIGGER   触发器三要素：入场 / 失效 / 历史胜率          │
│    ↓                                                   │
│  RISK      逻辑失效点执行：跌破逻辑，无条件离场          │
└──────────────── 规则容器 = SYSTEM ────────┬─────────────┘
                                            ↓
                              TRADE / INACTION（行为层）
                                            ↓
        ┌─ TRADING REVIEW ──「我执行得对吗？」（System / Trading Loop）
        ↓
        └─ COGNITIVE REVIEW ─「我理解得对吗？」（Research / Framework）
                                            ↓
        仅经 Research → Judgment 之后：
                                            ↓
        REVISION（Ledger / CONTEXT_HISTORY / ESSAY_VERSIONS / Method amendment）
                                            ↓
        REFLECT → 更好的 OBSERVATION ↺

（链外）Canonical Work → Body of Work → Distribution → External Observation
        → 仅经 HSN 判断回到 OBSERVATION（AI-11：Distribution 永不直连 Belief）
```

### D.3 分层句型（全链只有三句话）

```text
METHOD     为什么这样做   —— 上位体系：双回路 + Wuwei 约束 + 演化史（13 号文，不动）
FRAMEWORK  按什么路径走   —— 操作主干：信息→判断→授权→复盘→修正（本轮正名）
SYSTEM     动手后按什么规则 —— 执行规则系统：状态机→信号→触发→风险（收窄正名）
```

---

## E. Framework Definition（框架定义）

**一句话定义：**

> **Framework = How HSN moves from information to judgment, from judgment to authorized action, and from results back to revised understanding.**
> **Framework 是 HSN 从信息走向判断、从判断获得行动授权、并从行动结果回到认知修正的操作主干。**

**Scope**：操作路径本身——Research Loop（认知段）+ Decision（授权段）+ Trading Loop 的接口段 + Review/Revision 的回流段；各节点的**职责定义与相互边界**。

**Non-Scope**：不持有信念（那是 Thesis/Ledger）；不持有执行规则（那是 System）；不是世界观（那是 POV）；不是约束层（那是 Wuwei）；不是一个实体（永远不会存在 `framework` 数据实体——当前 `framework.ts` 是方法文本域，C1 契约已将其定性为「静态框架层，非演化状态」）。

**对 §06 七问的逐项裁决：**

| # | 问题 | 裁决 |
|---|---|---|
| 1 | 与 V2 Method 冲突？ | **潜在冲突，可解。** 若 Framework = 包含双回路的上位体系，则与 13 号文「HSN Method = 上位体系」（AI-05）正面相撞。解法：Framework 降为 Method 的**操作主干**——Method 额外包含 Wuwei 约束层与演化史，这两样不是「路径」。Method > Framework，AI-05 完好。 |
| 2 | 应包含 Research Loop？ | **支持包含，禁止重定义。** Research Loop v1.0 是 Framework 的认知段；其名称、八步、实码锚点一字不动。 |
| 3 | 应包含 Trading Loop？ | **包含其路径，不包含其规则。** Trading Loop 作为链条的一段出现在 Framework 中；规则本体（状态机/触发器/仓位）归 System。**路径 vs 规则**是 Framework/System 边界的全部内容。 |
| 4 | 与 Method 的层级？ | Method（为什么）> Framework（怎么走）> System（动手规则）。 |
| 5 | 与 Research Loop 的层级？ | Framework ⊃ Research Loop（作为其前半段）；Framework 是 Research Loop 的**组合者**，不是其上级管理者——Research Loop 的内容治理仍属 13 号文。 |
| 6 | 与 System 的边界？ | **授权线**：Framework 终于 Decision/Trigger 确认；System 始于执行规则。Framework 回答「该不该动、何时获得动的资格」；System 回答「动了之后每一步怎么做」。 |
| 7 | Operating Architecture 而非 Method？ | **支持。** Framework = Operating Architecture（操作架构/运行主干）；Method 是上位认知体系。这个区分让「Framework」一词第一次有了不与其他 LOCKED 概念打架的独立语义。 |

**总评：候选定义「支持，经修改」**——原定义把「decision, trade, and revision」并列，掩盖了授权线与双回路时间尺度差；修改后定义保留其方向，补上 Method 层级与授权边界。

---

## F. System Definition（系统定义）

**一句话定义：**

> **System = The rule system that executes what Decision has authorized — and constrains what it has not.**
> **System 是在 Decision 授权之后具体执行、管理与退出交易的规则系统；它同样负责在未经授权时禁止行动。**

**Scope 分类（§07 候选清单逐项判定）：**

| 候选 | 判定 | 依据 |
|---|---|---|
| Entry | **Core**（已存在） | 触发器入场条件、状态机允许操作 |
| Risk | **Core** | 三要素之二（资金管理）、逻辑失效点 |
| Position / Position Sizing | **Core** | 状态机仓位上限（100/60/30/0–20%）、单笔风险 1–5% |
| Stop | **Core** | wuwei.ts 逻辑失效点（与研究侧 invalidation 同构，13 号文裁决 5） |
| Management | **Core** | 三层共振、四面权重调权 |
| Exit | **Core** | 反向触发（出局）已有实码文本 |
| Execution | **Core** | 「执行是干净的」、If-Then 预案 |
| Validation（历史胜率） | **Core（文本级）** | 触发器三要素之三已存在——但仅作为**人工维护的文本纪律** |
| Indicators | **Future** | 实码已有原型（ATR 收敛、炸板率>50% 阈值）散在状态机文本里；独立指标层等真实使用需求 |
| Models / Parameters | **Future** | 同上 |
| Backtest | **Future（且警惕）** | 历史胜率当前靠人工记忆；回测引擎属 §20 No-Go 清单，除非出现真实需求证据 |
| Performance | **Out of Scope（永久）** | 收益展示 = Performance Theatre 禁令（09 号文 13.3）；「判断公开，操作不公开」 |

**Non-Scope**：不形成信念、不解释世界、不决定「该不该信」、不展示收益、不出现 BUY/SELL 语义、永远不执行自动化交易（自动化边界 LOCKED：机器可整理证据，不替 HSN 判断）。

---

## G. Signal Architecture（信号架构）

### G.1 Signal 是什么

> **Signal = an Observation that has passed the admission screen (真·新·大) and is judged to demand an update of attention, interpretation, or belief.**
> **Signal 不是一类新对象，而是 Observation 的一种判定结果：这个变化值得我们更新解释。**

形式化：`Signal = Observation × Verdict`。Observation 是被记录的变化（now.ts，实码存在）；Signal 是其中通过质量检验、且与活跃认知发生关系的那部分。这就是为什么**不需要 Signal Entity**——它是判定，不是事物。

### G.2 Signal 不是什么（§09 五个不等式逐项验证）

| 不等式 | 裁决 | 精确化 |
|---|---|---|
| News ≠ Signal | **成立** | News 属 Information 层（未筛选）；Signal 要求异常值判定 + 解释相关性。新闻是原料，信号是判定。 |
| Observation ≠ Signal | **成立，但需登记现状坍缩** | 实码诚实声明：now.ts 的 3–5 条人工容量纪律意味着 OBSERVATIONS 实际上已经过预筛选——**现状下 Observation ≈ Signal 已部分坍缩**。这是刻意的（F-5：人工观察的稀缺性是 Lens 本身），概念区分保留，数据层不动。 |
| Signal ≠ Thesis | **成立** | Signal 是问题级的（「这里有事」）；Thesis 是答案级的（「我相信如此，且可证伪」）。信号立题必须过 FRAME（写不出虽然/但是不许立题）。 |
| Signal ≠ Trigger | **成立，且是本架构最重要的消歧** | Signal 是**认知事件**（改变解释）；Trigger 是**执行授权**（允许行动）。当前 framework.ts 02 的「信号」其实是盘面信号（Trading-side）——建议概念更名：**盘面信号 / Tape Signal 归 System；Signal 保留给研究侧**。一词两义就此拆开。 |
| Trigger ≠ Trade | **成立** | Trigger 给出许可；Trade 是行为；许可之后 System 仍可否决（状态机），人仍可选择 INACTION。 |

### G.3 NEW / BIG / TRUE 是否成立

**成立——因为它不是新提案，而是既有实码与成文纪律的正名。** 「信号最重要的三个特征：真、新、大」已在 framework.ts 02（成文+产品化），且 13 号文协议 1 已将「真、新、大 = 异常值识别」锁定为 Observation 选择标准。本轮的工作是把它的**适用层位**说清楚：

```text
TRUE（真）  可被外部验证，不是措辞与情绪        → 对应 POV-01 / 证据标准（协议 4）
NEW（新）   是变化本身，不是已知状态的复读       → 对应 POV-02 / 异常值识别
BIG（大）   足以改变注意力分配的量级            → 对应 3–5 条容量纪律的准入门槛
```

**是否足够？分两层回答：**

- **作为注意力准入筛（admission to attention）：足够，且不需要加维度。** Persistence / Confirmation / Acceleration 不是准入问题，是 TEST 步的工作（证据监测天然检验持续性；证伪值守天然检验确认性）。把这些塞进信号模型会让入场哨兵干裁判的活。
- **作为行动资格（qualification for action）：本来就不够，也从来不该由它负责。** 行动资格在下游：共振检查、invalidation 对照、状态机允许性。信号模型超载 = 散户结构。

**唯一值得补充命名的维度**：**Materiality-to-Active-Thesis（与活跃命题的相关性）**——不是准入筛，是**路由问题**：一个信号若触及某 active Thesis 的 evidence/invalidation 字段，直接进入 TEST 值守而非排队等 FRAME。这是路由规则，不是第四个准入维度，不进 Schema。

**NEW/BIG/TRUE 维持认知框架地位，本轮不 Schema 化（§10 纪律确认）。**

---

## H. Trigger Architecture（触发器架构）

### H.1 Trigger 是什么

> **Trigger = a pre-written, objectively checkable condition set whose confirmed satisfaction — authorized by Decision — moves the System from readiness to execution permission.**
> **Trigger 是一组事先写明的、可被客观检验的条件；它的满足经 Decision 确认后，System 获得执行许可。**

三要素已在实码成文（framework.ts 04）：**入场条件、失效条件、历史胜率**。定义候选成立，补两点：条件必须**事先**写明（事后拼凑的条件不是 Trigger，是叙事）；满足必须**可客观检验**（与证据标准同纪律）。

### H.2 候选链验证

`SIGNAL → EVALUATION → CONDITION → TRIGGER → SYSTEM → TRADE`：**部分成立，修正为**：

```text
SIGNAL → (Research Loop) → THESIS / BELIEF → DECISION → TRIGGER 确认 → SYSTEM 规则 → TRADE / INACTION
```

候选链的 EVALUATION→CONDITION 段把 Research 压缩成了流水线一步——条件不是评估出来的，**条件是事先写好的（If-Then 预案），评估是把现实对照到预写条件上**，这个对照动作就是 Decision。

### H.3 Trigger 属于哪里（§11 核心问题）

**裁决：Trigger = Framework × System Interface——定义权在 System，确认权在 Decision（Framework 侧）。**

| 方面 | 归属 | 理由 |
|---|---|---|
| Trigger **规格**（条件库、三要素、历史胜率） | **System** | 它是执行规则的一部分：改变一条触发器 = 改变系统行为，与改仓位上限同级 |
| Trigger **确认**（现实是否满足条件） | **Decision**（Framework 的授权段） | 这是判断动作，不是规则动作 |
| Trigger **库（Trigger Library）** | **System**（§13 裁决） | 从 Responsibility 出发：库的内容全部是执行规则（入场/失效/胜率）；它当前挂在 Framework 页是 **UI 历史错位（CF-1 的一部分）**，不是职责所在 |

### H.4 实体化判定

不建 Trigger Entity / Database / Schema / CMS。**真实使用需求不存在的证明**：全站没有任何消费者需要按 id 读取一条触发器；触发器库的全部功能由静态文本完整承载。「页面出现 Trigger Library」不构成建实体的理由（§22：页面 ≠ 系统）。未来若出现真实消费场景（如复盘时需要引用具体触发器条目），按 C2-A 的证据门槛先例重开评估。

---

## I. IF–THEN Architecture

**裁决：IF–THEN 分裂为两个物种成立，且两个物种在仓库中都已有实码祖先。**

### Cognitive IF–THEN（认知侧）

```text
IF X occurs → reassess interpretation / thesis.
```

**已有实码形态：`Thesis.invalidation[]` 与 `assumptions[]` 就是数据级的认知 If-Then。** 例（theses.ts 实码）：「IF 连续两年国产芯片出货增速低于智算中心投资增速 → THEN 命题证伪」。归属：**Framework / Research**——它是 Thesis 的组成部分，受 Research System 治理（check 断言强制）。

### Trading IF–THEN（交易侧）

```text
IF A + B + C → System permits Entry.
```

**已有实码形态：framework.ts 03 的四条预案**（炸板率 50% → 降仓停打板；跌破 10 日线量能不缩 → 卖一半……）。归属：**System**——全部条款都是执行语义。

### 最终判断

**IF–THEN 应成为概念层（protocol layer），不是 Entity。** 确认 §12 候选结论。两种 If-Then 共享同一语法（预案先于操作）但归属不同层位、不同时间尺度——与 Invalidation Principle 的「概念统一，实现分离」（13 号文 LOCKED）完全同构：**If-Then Principle：认知侧证伪预案与交易侧执行预案是同一原则在两个时间尺度的投影。**

---

## J. Review Architecture（复盘架构）

**裁决：Review = Cross-layer function，两个不同实例 + 一道 Revision 闸门。**

### Trading Review（执行复盘）

回答「Did I execute the System correctly?」范围：Entry / Position / Risk / Management / Exit / Execution。归属：**System / Trading Loop**。现状锚点：金字塔 L7（复盘与认知）、framework.ts 06（好交易标准 = 其事前形态）、Journal 叙事。

### Cognitive Review（认知复盘）

回答「Was my understanding correct?」范围：Signal 是否有效 / Thesis 是否成立 / Evidence 是否充分 / Probability 是否变化 / Framework 是否出问题。归属：**Research / Framework**。现状锚点：Ledger Revision（信念级）、CONTEXT_HISTORY（Context 级，C1 已建成）、REFLECT 步（方法级）。

### Revision 闸门（§15 验证）

候选流程 **成立并已与既有治理同构**：

```text
Trade Result → Trading Review → Cognitive Review → Research → Judgment → Revision
```

**「每一次亏损都修改 Framework」为非法直连**，且现有 LOCKED 纪律已经四重设防：

1. Ledger 准入纪律：只有改变未来判断状态的信息入账（09 号文 13.3）；
2. AI-04：Identity/POV/Principle/Method 变更只走 versioned amendment；
3. Method Versioning（AI-06）：方法演化有独立通道，不经交易结果直达；
4. P-05：系统有休眠期且不视为异常——亏损本身不是修改理由。

**新增的显式规则（本轮正名，非新机制）**：交易结果对 Framework/System 的唯一合法输入路径是 **Trading Review → Cognitive Review → Research**。System 规则本身的修改（如调整仓位上限）也必须附带 reason 并走 Method/文本域的版本纪律——framework.ts / system.ts 属「静态框架层」，其修改是内容修订（任务单授权），不是数据事件，不进任何账本。

---

## K. Framework IA（框架页信息架构 · 提案）

> 页面回答：**How information becomes judgment, judgment becomes authorized action, action becomes revision.**
> 设计约束：零新实体、零新组件机制、全部内容可溯源到 LOCKED 结构；INACTION 必须可见。

```text
FRAMEWORK（操作主干）
│
├── Ⅰ · THE OPERATING CHAIN（操作主干图）
│      WORLD → INFORMATION → OBSERVE → CONTEXT → FRAME → THESIS
│      → BELIEVE → DECIDE → ACT / NOT ACT → REVIEW → REVISE ↺
│      每个节点：一句职责 + 链到它的 Canonical 家
│      （OBSERVE→#/ 首页 NOW；CONTEXT→#/map #/cycle；THESIS→#/thesis；
│        BELIEVE→#/journal（Ledger）；SYSTEM→#/system；约束→#/wuwei）
│      ——Framework 页由此成为 Research Loop 的页面之家（补 CF-3）
│
├── Ⅱ · TWO LOOPS, TWO TIMESCALES（双回路）
│      Research Loop v1.0（慢 · 信念如何形成与修正）
│      Trading Loop（快 · 授权之后如何执行）
│      + WUWEI 约束层（不是步骤，永远可以回答「是否需要行动」）
│
├── Ⅲ · DECISION（授权段——本轮正名的缺环）
│      信念如何获得行动资格：信到什么程度、等什么条件、动不动
│      认知侧 IF–THEN（invalidation 即预写的认知预案）
│      INACTION 是一等结果（不操作是持仓）
│
├── Ⅳ · THE AUTHORIZATION LINE（授权线）
│      Trigger 的确认在左（Framework），Trigger 的规格在右（System）
│      SIGNAL（认知）≠ 盘面信号（执行）的消歧声明
│
└── Ⅴ · REVIEW & REVISION BOUNDARY（复盘与修正闸门）
       两种 Review 各回答什么；亏损 → 改框架 是非法直连
       修正只经 Research → Judgment 入账
```

**迁移说明**：现 framework.ts 的 02（信号分层）/ 03（If-Then 预案）/ 04（触发器库）/ 05（三层共振）/ 06（好交易标准）属 System 内容，概念上迁往 System 页（见 L）；01（EXPLAIN · DECIDE · PROTECT）改写后保留为「授权段」的交易侧摘要。**全部迁移都是文本域内的内容重组，无实体变更。**

---

## L. System IA（系统页信息架构 · 提案）

> 页面回答：**授权之后，HSN 如何具体执行、管理与退出交易。**
> 设计约束：现有六段（金字塔/三要素/赌场/状态机/演进/心法）全部保留并重新归位；只吸收属于它的内容。

```text
SYSTEM（执行规则系统）
│
├── Ⅰ · WHY RULES（为什么需要规则）
│      三要素（正期望 / 资金管理 / 心理管控）+ 赌场模型 —— 现有内容，原位
│
├── Ⅱ · STATE（何时允许行动）
│      市场状态机（四状态 × 允许操作 × 仓位上限）—— 现有内容，原位
│
├── Ⅲ · TAPE SIGNAL（盘面信号分层）★ 消歧更名
│      领先 / 同步 / 滞后；把滞后信号当领先信号用是散户死法
│      —— 自 framework.ts 02 迁入；概念更名为盘面信号，与研究侧 Signal 分家
│
├── Ⅳ · TRIGGER（触发器库 + 预案）
│      三要素：入场条件 / 失效条件 / 历史胜率
│      形态 / 数量 / 事件 / 反向触发；交易侧 IF–THEN 预案
│      —— 自 framework.ts 03/04 迁入（归位，CF-1 修正的主体）
│
├── Ⅴ · EXECUTION（操作 · 仓位 · 止损）
│      三层共振与资金管理；逻辑失效点（跌破逻辑，无条件离场）
│      —— 三层共振自 framework.ts 05 迁入；止损链到 #/wuwei
│
├── Ⅵ · REVIEW（执行复盘）
│      什么算一笔好的交易（事前标准 = 事后复盘的同一把尺）
│      复盘反哺周期，闭环完成 —— 金字塔 L7 + framework.ts 06 归位
│
├── Ⅶ · EVOLUTION（系统演进）—— 现有内容，原位
│      交易就是交易 → 放下预判拥抱规则 → 从加法到减法
│
└── Ⅷ · 心法（等 / 忍 / 断 / 持）—— 现有内容，原位
       末端链到 #/wuwei：规则之外，约束层接管
```

**七层金字塔保留为页面总图**——它本来就是 STATE→…→REVIEW 的完整表达，恰好是 System 页最好的目录。

---

## M. Historical Corpus Relationship（历史语料关系）

历史语料审计（TRACK-A 两份，已读）对本架构的作用是**验证，不是输入**：

| 架构概念 | 历史语料中的对应证据 | 验证结论 |
|---|---|---|
| Observation → 判定 | §3 Historical Judgment Inventory（31 条，全部保留原始 epistemic 语气） | 历史材料存在「记录变化」与「形成判断」的自然分层 ✓ |
| Signal（候选） | §4 Historical Signal Inventory（S1–S6，跨期反复/双层结构/升级追踪） | 「信号 = 值得更新解释的变化」在历史材料中可被识别 ✓；但注意该审计对 Signal 的用法是**候选标记**，与本架构正名后的概念一致化属未来文案工作 |
| Thesis（proto 形态） | AI 主线 18 个月判断链（先疑后信） | 命题有考古层；E2 链证明 Thesis 是 Research 的终点而非起点 ✓ |
| Review / Revision | E1 方法论演变链（止损观→三不原则→仓位伪命题）；E6 预测悬置群 | **最有力的反向验证：历史上「提出-跟踪」存在而「验证-结案」系统性缺失**——Ledger / Review / Revision 体系恰好补上这个历史缺口。本架构不是发明了纪律，是把历史上最弱的环节变成了结构 |
| Historical State ≠ Current Interpretation | 审计全程执行（保留 epistemic status、禁止事后判定、E3 稀土标 Unresolved） | 历史材料不得被今天的 System 重写——**历史链的每一环都应按当时状态理解**：Historical Observation → Historical Judgment →（当时无 Trigger/System 形态）→ 沉默或演变。用今天的 Trigger Library 反推历史交易是非法重构 |
| 缺口即信息 | 券商 / 国家队两线历史投入最大但 Canonical 缺席（Human Review Queue P1） | 历史语料的角色是提出 Human 裁决项，不是自动生成 Canonical Update（两轮审计 Update = 0 的纪律延续） |

---

## N. Future Evolution（演进路线）

```text
NOW（本轮 · 已完成即为全部产出）
  · Framework / System / Signal / Trigger / Decision / Review 的定义与边界（本文档）
  · Framework / System 页面 IA 提案（K / L 节）
  · 零代码、零数据、零实体、零 Commit

NEXT（仅当 Human 批准本架构后，且逐项走任务单授权）
  · Framework 页 / System 页的内容重组（framework.ts / system.ts 文本域改写 +
    Framework.tsx / System.tsx 结构更新；site.ts ARCHIVE_TREE 同步）
    —— 全部是既有静态方法文本域内的内容迁移，无新实体、无新数据层
  · 「盘面信号 / Tape Signal」消歧在文本层落地
  · 02 号文 §6 旧映射（THINK → SYSTEM/FRAMEWORK）的文档层更新（versioned amendment）
  · 若定义需入 13 号文家族：走 AI-04 versioned amendment，不是静默编辑

LATER（观察真实使用后再评估，全部沿用 C2-A 证据门槛先例）
  · System └── Indicators / Models / Parameters 工具层（实码原型已散见于状态机文本；
    独立成层等真实需求——如复盘中反复手工计算同一指标）
  · Signal Quality Model 的任何结构化（维持认知框架，直到出现非结构化无法回答的真实问题）
  · Trigger 条目级引用（若复盘实践产生「引用具体触发器」的真实消费场景）
  · Method Versioning 载体（13 号文 OD-2 已裁决方向，文档层版本记录，与本架构无关但同纪律）
```

---

## O. No-Go（本轮及当前的禁止建设清单）

§20 清单全部确认并沿用，补充标注理由：

```text
Signal Entity / Signal Database        —— Signal 是判定，不是事物（G.1）
Trigger Entity / Trigger Database      —— 无消费者；文本完整承载（H.4）
Strategy Entity                        —— 「策略」在本系统无独立语义；其内容已被 System 规则覆盖
Indicator Entity / Indicator Data Layer —— 工具未发生真实使用需求（N · LATER）
Trade Entity / Trade History Infrastructure —— 「判断公开，操作不公开」（10 号文 4.1）；
                                          建仓即把 Observer 拖向 Stock Picker
Universal Trading Schema / Trading CMS  —— 为不存在的行为造表（15 号文四节同例）
Backtest / Execution / Portfolio / Risk Engine —— Performance Theatre 禁令 + 自动化边界 LOCKED
Quant Data Layer                       —— 同上
Strategy / System Versioning           —— System 文本的演化已有 SYSTEM_EVOLUTION 叙事 +
                                          文档层纪律；实体化 = 复制 C1/C4 machinery（AF-6 禁令）
Universal Relationship Graph           —— 知识图谱滑坡（C2-A F-9 同禁令）
```

另加四条本轮特有 No-Go：

1. **不建 Framework Entity**——Framework 是路径的组合视图，不是对象。
2. **不改 Research Loop v1.0 的任何步骤名或顺序**——LOCKED，本架构只组合不重定义。
3. **不合并双回路**——Trading Loop ≠ Research Loop 的下半段（13 号文 OD-3 附加限制）。
4. **不把 Framework 页做成 About / 个人品牌页**——R-8（P0）延续；Framework 页表达的是操作架构，不是作者人设。

---

## P. Implementation Impact（实施影响 · 仅登记，不执行）

> **本轮不修改任何东西。** 以下仅说明：若未来 Human 批准本架构，实施会触碰什么。

| 类别 | 对象 | 影响 |
|---|---|---|
| 页面 | `src/pages/Framework.tsx` | 按 K 节重组（新 intro + 五段结构；节点外链既有页面） |
| 页面 | `src/pages/System.tsx` | 按 L 节吸收迁移内容 + 新增 TAPE SIGNAL / TRIGGER / EXECUTION / REVIEW 段 |
| 数据（静态文本域） | `src/data/domains/framework.ts` | 条目 02–06 迁出，01 改写；全文件重构为 Framework 页内容源 |
| 数据（静态文本域） | `src/data/domains/system.ts` | 吸收迁入条目；MARKET_STATES / PYRAMID / 三要素等原位保留 |
| 站点配置 | `src/data/domains/site.ts` | ARCHIVE_TREE 的 Framework / System 子项同步 |
| 文档 | 02 号文 §6；13 号文（若登记 Framework 定义） | versioned amendment（AI-04 纪律） |
| 校验 | `scripts/check-data.mjs` | 仅在实施任务中被评估是否需要文本域断言；本轮无任何断言提案 |
| **不变** | now / map / cycle / theses / ledger / journal / essays / context-history / essay-versions / wuwei / manifesto / dimensions / polarity / 全部分发层 | 零触碰 |
| **不新增** | 任何实体、任何 Schema、任何 Data Layer、任何页面路由 | —— |

---

## 附 · 本轮执行规则遵守声明

```text
☑ 已读 02 节要求的全部文档与实码（09–18 / 20 / 22–24 / 10–12 / 03 IA / 02 §6 /
  Framework.tsx / System.tsx / 全部页面 PageHead / domains 全部数据文件 /
  TRACK-A 历史审计与 Matching Review）
☑ 未修改任何源码、任何数据；未新增 Entity / Schema / Data Layer
☑ 未 Commit、未 Push、未进入 Implementation
☑ 所有 LOCKED 架构（Identity / POV / Principles / Method / Research Loop v1.0 /
  Body of Work / Distribution / C1 / C4 / C2-A / AI-01～12）零重定义；
  冲突候选（Framework vs Method 层级）以降级组合方式解决，AI-05 完好
☑ NEW/BIG/TRUE 维持认知框架，未 Schema 化
☑ Signal / Trigger / Trade / Indicator 等全部未实体化；未来项均附证据门槛
☑ 历史语料仅用于验证；Historical State ≠ Current Interpretation 全程保持
```

**STOP。等待 Human Review。只有 Human 明确批准 Architecture 后，才能进入下一阶段。**
