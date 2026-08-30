# DAO_VOCABULARY_AUDIT.md — Dao Vocabulary Integration Audit（Phase A/B/C · 仅供 Human Review）

> 依据：《TradingLabb V2 — Dao Vocabulary Integration & Semantic Refinement》（2026-08-30）
> 方法：基于全站 14 页面 + 全部静态文本域的实际代码审查（承接 08-29 DAO_DESIGN_AUDIT 的代码认知）
> 本文件只研究、只建议。**未经 Human Approval，不修改任何代码与内容，不 commit。**

核心策略（Brief §05）：

> **Dual-Layer Vocabulary —— 现代术语负责精确，道家术语负责意义。**
> 局部高密度，整体低密度。不为匹配而匹配（§22 ANTI-FORCING）。

---

## Phase A · 语义审计：候选词汇映射表

审查基准：四问——A 结构同构 / B 语义一致 / C 实用价值 / D 品牌辨识度。

| Dao | 出处与原始语义 | TradingLabb 现存概念（代码证据） | A 结构 | B 语义 | C 实用 | D 品牌 | 结论 |
|---|---|---|---|---|---|---|---|
| **观** | 常无欲，以观其妙（ch.1）——无欲之看，先于判断 | OBSERVE（研究循环第一步）；NOW 观察层「不是新闻，不是行情」（method.ts:13）；Home 封面「观察变化，而非预测未来」 | 高 | 高 | 高 | 高 | **ADOPT 候选** |
| **静** | 致虚极，守静笃（ch.16）——判断前的认知空间 | 观察与行动的两层分离：「回答值不值得研究，不回答要不要行动」（method.ts:29）；BELIEF≠ACTION（framework.ts:44） | 高 | 高 | 高 | 中高 | **ADOPT 候选** |
| **常** | 知常曰明（ch.16）——变化中的不变量 | 周期页全部：「不是看多看空的投票，而是阴阳消长的位置判断」（cycle.ts:14）；四面权重按市场状态变、框架本身不变 | 高 | 高 | 中高 | 中高 | **ADOPT 候选** |
| **玄** | 玄之又玄，众妙之门（ch.1）——认知边界之外 | 「WHY · 阴阳两面，不作结论」（ThesisDetail.tsx:182）；概率 0–100「不是精确，是诚实」（method.ts:18） | 中高 | 中（易被误读为神秘主义，§11 已警示） | 中 | 中 | **KEEP**——现无自然槽位，不强行开门 |
| **谷** | 谷神不死（ch.6）——虚空而能容 | Thesis 的 COUNTER + assumptions/invalidation 与信念同页共存（ThesisDetail.tsx §4/§6）——结构上**已经**是谷 | 高 | 高 | 中 | 中高 | **KEEP**——结构已在，语义词留给 Essay / WUWEI commentary，不进 UI（Brief §八同判） |
| **虚** | 当其无，有室之用（ch.11）——无之以为用 | INACTION 一等输出：「不行动是一等输出。空仓是持仓，等待是工作」（framework.ts:15）；「有时，正确的仓位是空仓」（Home WUWEI 章） | 高 | 高 | 高 | 高 | **ADOPT 候选** |
| **损** | 为道日损（ch.48）——减法即方法 | 已成为设计与研究实践：「证据不超过三条：三条撑不住的命题，三十条也撑不住」（method.ts:43）；08-29 设计减法净 −42 行 | 高 | 高 | 高 | 高 | **ADOPT 候选**（最有资格成为第一个 Native Term） |
| **反** | 反者道之动（ch.40）——返回与反转是道的运动方式 | REVISION 全链：Journal「REVISION · WHAT CHANGED MY MIND」；「修正不是认错，是研究还活着的证据」（essays.ts:99）；终幕「反者道之动」已在落款 | 高 | 高 | 高 | 高 | **ADOPT 候选** |
| **止** | 知止不殆（ch.32/44）——知道边界所以不危险 | INVALIDATION「What would make this thesis wrong」（ThesisDetail.tsx:205）；止损位 = 逻辑失效点（wuwei.ts:16）；IF-THEN 预案 | 高 | 高 | 高 | 中高 | **ADOPT 候选** |
| **无为** | 为无为，则无不治（ch.3）——不妄动 | 已是一级 Canonical：WUWEI 页 + 行为约束层（framework.ts:36 / method.ts:63） | 高 | 高 | — | — | **KEEP（维持现状）**——已是 Canonical，无需动作（§15） |

### 辅助词审查（第二批，本轮不建议进 UI）

| Dao | 判定 | 说明 |
|---|---|---|
| 不争 | KEEP（文案层） | 与「不与市场争论——不跟趋势争高低，不跟观点谈恋爱」（essays.ts:137）已同构；适合 Essay，UI 无槽位 |
| 自然 | KEEP（隐性原则） | Reality-first 已是操作地图第一性（framework.ts:9）；做成词反而是口号（§17） |
| 柔 | KEEP（文案层） | 「随器而形」已在 Essay 001；System 不需要新增哲学标签（§18） |
| 知足 | **NO MATCH（部分）** | 知足 = 对贪婪设界；现有资金管理是「单笔风险 1–5% + 连损反推」（system.ts:14）的工程语言，两者只擦边。强行对应会稀释两边 |
| 朴 | KEEP（设计原则） | 已在 DAO_DESIGN_AUDIT 作为设计方法运行；不是 UI 词汇 |
| 有/无 → Position/Cash | **NO MATCH** | 私人密码风险（Brief §二.2）；且「虚」已承载该语义，不必再拆 |
| Trigger → 机 | **NO MATCH（暂）** | 「机」在《道德经》语境非「触发条件」；听着像 ≠ 同构。留作研究候选 |

---

## Phase B · 减法残留审计（WHAT SHOULD BE REMOVED）

上一轮减法（commit 3f77cb8，净 −42 行）后全站复扫：

| # | 项 | 状态 | 本轮建议 |
|---|---|---|---|
| B1 | G6 容器惯性（System 等页 border 网格） | 上轮裁决：暂不改 | 维持观察。Framework 去框已立样板，待 HSN 看到效果后再议 |
| B2 | S1 System 间距层级化 | 上轮裁决：存疑 | 同上，不重提 |
| B3 | T2/T3、G8、data-reveal 收敛、Wo1 太极旋转 | 上轮裁决：存疑/不改 | 不重提 |
| B4 | ThesisDetail 双语 Label 已偏长（如 `INVALIDATION · What would make this thesis wrong`） | **新发现** | 若 P3 采纳「止 ·」，建议同步截短英文为 `INVALIDATION · What makes it wrong`，防止 Label 过长——减法与加法同案处理 |
| B5 | Home HOW I THINK 右栏删除论断后仅剩 CTA | 新增减法后的留白检查 | 现状可接受（虚）；不做补偿性填充 |

本轮**没有**新的大宗可删项——减法已边际递减，符合「损」的预期曲线。

---

## Phase C · 具体提案（Human Review 前不实施）

密度预算自检：全站 14 页，本批共 **7 处单字级**改动 + 1 处句级改动，全部落在 §19 页面级建议的候选位置上；零新增组件、零新增《道德经》引文（「知常曰明」类引句一个不加）。

---

**P1 · 反 → Journal 修正区**

```text
CURRENT  Journal.tsx:29  Label「REVISION · WHAT CHANGED MY MIND」
PROPOSED Label「反 · REVISION · WHAT CHANGED MY MIND」
WHY      反者道之动——Revision 是道的运动方式在认知系统的直接对应；
         Journal 是「我如何改变自己」的页面，是反的主场
RISK     低（单字前缀，现代术语完整保留）
STATUS   Human Review
```

**P2 · 反 → Home 修正章**

```text
CURRENT  Home.tsx WHAT CHANGED MY MIND 章 note「Revision, not news」
PROPOSED note「反 · Revision, not news」
WHY      与 P1 同族呼应；首页只此一处 Dao 单字，密度安全
RISK     低
STATUS   Human Review
```

**P3 · 止 → ThesisDetail 证伪区**

```text
CURRENT  ThesisDetail.tsx:205  Label「INVALIDATION · What would make this thesis wrong」
PROPOSED Label「止 · INVALIDATION · What makes it wrong」
WHY      知止不殆——INVALIDATION 就是「预先登记的止」；
         冷静、明确、不可误解，无 warning theatre（§14 合规）
RISK     低（同步截短英文，Label 长度不增反降，见 B4）
STATUS   Human Review
```

**P4 · 观 → Home NOW 章**

```text
CURRENT  Home.tsx NOW 章 note「What is changing?」
PROPOSED note「观 · What is changing?」
WHY      NOW 是「正在发生、值得观察的变化——不是新闻，不是行情」，
         观 = 无欲之看、先看后判，是该章已有语义的名字
RISK     低
STATUS   Human Review
```

**P5 · 虚 → Home WUWEI 章**

```text
CURRENT  Home.tsx WUWEI 章 note「When not to act」
PROPOSED note「虚 · When not to act」
WHY      当其无，有室之用——「有时，正确的仓位是空仓」的哲学名；
         虚 = Inaction/Optionality 的合法化，与 Framework 一等输出互文
RISK     低
STATUS   Human Review
```

**P6 · 常 → Cycle 页首**

```text
CURRENT  cycle.ts CYCLE_NOTE「……重要的不是预测拐点，而是知道自己站在圆环的哪一段。」
PROPOSED 句末追加：「常——在变化中寻找稳定结构。」
WHY      周期页是全站「常」的主场：阶段在循环，框架不循环；
         直接回应 §10「不要只展示 Change，缺乏 Invariant」
RISK     低（一句静态文本，不动 schema）
STATUS   Human Review
```

**P7 · 静 → Method 研究循环**

```text
CURRENT  method.ts METHOD_LOOP.note「信念如何形成与修正的完整认知循环——它不是一个流程图，是一套纪律。」
PROPOSED 「信念如何形成与修正的完整认知循环——先观，后判；它不是一个流程图，是一套纪律。」
WHY      静 = 判断前保留认知空间；「先观，后判」是 HSN 原生短句候选，
         也是观察层与行动层既有分离（值不值得研究 ≠ 要不要行动）的名字
RISK     低（note 文本，不碰八步名序 LOCKED）
STATUS   Human Review
```

**P8 · 损 → Method 证据与证伪（Native Term 首用）**

```text
CURRENT  Method.tsx Ⅳ 证据与证伪 SectionHead 无 note
PROPOSED note「损 · 删除无法增加认知价值的东西」
WHY      损已是运行中的设计/研究方法（上轮净 −42 行；证据不超过三条），
         此注使它从「隐性实践」成为「显性原则」——第一个 TradingLabb Native Term
RISK     中低（首个 Native Term，措辞即定义，需 HSN 亲自敲定）
STATUS   Human Review
```

---

## 刻意不提的提案（Anti-Forcing 记录）

- **不给导航、页名、Research Loop 八步加任何 Dao 字**——Layer 1 精确性不可动（§04/§09）
- **不给玄开门**——现无自然槽位；强行加一个「玄｜UNKNOWN」模块正是 §11 警告的神秘主义化
- **不给谷开门**——COUNTER/ASSUMPTIONS 结构已是谷；再贴标签是重复表达（违损）
- **不做词典页、不做词汇 Entity**——词典必须沿 Research Loop 生长（§21）
- **不动终幕「反者道之动，弱者道之用」**——它是落款不是 UI copy，上轮已裁决 DO NOT TOUCH

---

## Human Decision Table（§28）

```text
DAO VOCABULARY ADOPTION

01 观   提案：P4（Home NOW）                Status: KEEP / ADOPT / REJECT
02 静   提案：P7（Method 循环 note）         Status: KEEP / ADOPT / REJECT
03 常   提案：P6（Cycle 页首句）             Status: KEEP / ADOPT / REJECT
04 玄   提案：无（现无槽位，留研究候选）      Status: KEEP / REJECT
05 谷   提案：无（结构已在，留 Essay 层）     Status: KEEP / REJECT
06 虚   提案：P5（Home WUWEI）              Status: KEEP / ADOPT / REJECT
07 损   提案：P8（Method Ⅳ note，Native 首用）Status: KEEP / ADOPT / REJECT
08 反   提案：P1 + P2（Journal + Home）      Status: KEEP / ADOPT / REJECT
09 止   提案：P3（ThesisDetail 证伪区）      Status: KEEP / ADOPT / REJECT
10 无为  提案：无（已是 Canonical，维持）     Status: KEEP
```

KEEP = 保留为研究候选 · ADOPT = 进入网站语言层 · REJECT = 当前不采用

批准后实施范围：7 处文本级修改（Journal.tsx / Home.tsx ×2 / ThesisDetail.tsx / cycle.ts / method.ts / Method.tsx），零组件、零 schema、零路由变动；预计净增 ≤ 20 字符级改动，check/build/lint 全量复验后由 Kimi commit、HSN push。

---

*审计人：Kimi · 2026-08-30 · 本文件不含任何代码变更。*
