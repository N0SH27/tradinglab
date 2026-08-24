# V2-12 · HSN PRINCIPLES CONSTITUTION — 原则宪章

> **V2-07-01 产出（2026-08-24）。** Canonical Architecture Document，不写代码。
> **状态：CANONICAL · V2-07-01 · LOCKED**（PASS WITH LOCKS 裁决，2026-08-24；变更只走 versioned amendment，禁止 silent overwrite）。
> 上游契约：09 号文件（V2-07-00 封板）；10 号文件（Identity）；11 号文件（POV）。
> 本文件回答一个问题：**What does HSN refuse to compromise on?**
> 核心纪律（战略侧 R-11）：**Method 只有口号没有 Proof，就是品牌文案。**
> 每条原则必须走完 `POV → Principle → Behavior → Evidence` 全链，
> 终点落在站内可验证实体——链不全的原则不得进入本文件。

---

## 一、层位定义：POV 与 Principle 的分工

```text
POV（11 号文件）        我如何看世界——研究取向（orientation）
   ↓
Principle（本文件）     我拒绝妥协什么——行为承诺（commitment）
   ↓
Behavior                遵守时的可观察行为
   ↓
Evidence                证明遵守的站内实体锚点
```

POV 是「我看世界的方式」，Principle 是「即使付出代价也不退让我们之间的约定」。
判别：**POV 被违背产生错误的研究；Principle 被违背产生虚假的系统。**

五条 Canonical Principle 与五条 POV 一一对应——POV 声明取向，
Principle 把取向变成可被检验的承诺。不新增无 POV 来源的原则。

---

## 二、五条 Canonical Principle

### P-01 · REALITY OVER NARRATIVE —— 现实优先于叙事

**承诺**：当一个动人的叙事与可验证的现实冲突时，放弃叙事——包括我自己写的叙事。

| 链节 | 内容 |
|---|---|
| 研究实践含义 | 证据只收可被外部验证的事实（出货、招标、产能、现金流），不收研报措辞与圈内情绪；每个命题必须亲笔书写让自己不舒服的反面论证；证伪条件事先登记（`invalidation`），事后不认「我早就觉得不对」 |
| 遵守的行为证明 | 主题正热时对自己的命题做**下调**：机器人主题拥挤度创年内新高时 55→51（Ledger `rev-robot-20260625`）；对基本面无恙的光模块主动划出估值「死线」、立场偏空 60%（`optical-module`）——研究结论敢于逆着叙事站 |
| 被挑战的情形 | 深爱的命题遭遇反面数据时；被市场奖励的叙事恰是被我否决的叙事时（机器人继续大涨时，下调记录是否还挂在那里） |
| 站内证据锚点 | `domains/ledger.ts`；`Thesis.counter / invalidation` 实码字段；Essay《如何写一个产业命题》；Journal risk 条目 |

### P-02 · CHANGE OVER PREDICTION —— 变化优先于预测

**承诺**：不做点状预测。只记录变化的条件、速度与方向，让命题自带保质期。

| 链节 | 内容 |
|---|---|
| 研究实践含义 | 观察先行、命题后置——先有人工维护的 Observation，才有 Thesis；每个命题必须带 `window`（horizon），承认会过期；全站不出现目标价、点位预测、「看到多少」式语言 |
| 遵守的行为证明 | `domains/now.ts` 以「什么在变」而非「会怎么走」组织；`SITE.subtitle` = 「观察变化，而非预测未来」；首页终幕公开声明 "I don't predict the future. I update my beliefs as reality changes." |
| 被挑战的情形 | 读者追问「那到底看到多少」时；某次判断事后被证明方向正确、诱惑把运气包装成预测能力时 |
| 站内证据锚点 | `domains/now.ts`；`Thesis.window`；`domains/site.ts`；首页 ACT VII |

### P-03 · BELIEFS OVER CERTAINTY —— 信念优先于确定

**承诺**：所有判断都是带概率的暂时状态。不表演确定，不沉默地改观点。

| 链节 | 内容 |
|---|---|
| 研究实践含义 | 每个命题标注 conviction（概率是诚实的刻度，不是精确）；每次修正公开留日期、方向与原因；**维持也是判断**——复核后不变同样入账（CONFIRM），不许只记「动了」的时刻 |
| 遵守的行为证明 | Ledger 三态方向 up / down / **confirm** 是正式裁决产物（08 号文件 OD-3：「Reality changed, belief didn't.」）；ai-app 2026.07.18「维持 58%」已成文入账；`probabilityNote` 公开命题的犹豫状态（「观察中」「上调中」） |
| 被挑战的情形 | 分发平台上「确定」的表演更吸量时；公开判断被现实打脸、想悄悄改文案时——此时恰恰必须入账 |
| 站内证据锚点 | `domains/ledger.ts`；08 号文件十节；Essay《如何写一个产业命题》：「修正不是认错，是研究还活着的证据。沉默地改观点，是研究的死亡。」 |

### P-04 · POLARITY OVER LINEARITY —— 阴阳优先于直线

**承诺**：拒绝 Bull/Bear 二元直线。任何命题同时携带阳面与阴面，矛盾即信息。

| 链节 | 内容 |
|---|---|
| 研究实践含义 | 写不出「虽然……但是……」的命题不许成立（`conflict` 实码强制）；`yang[]` / `yin[]` 双侧必填；polarity 只能由地图节点状态**派生**，禁止任何人（包括作者）直接声明「现在该看多了」 |
| 遵守的行为证明 | G-03 裁决（08 号文件）：Thesis 永不持有 polarity 字段，唯一入口 `deriveThesisPolarity`——把「克制单边声明」做成了**数据结构级强制**，不是自律口号；8 个命题全部带完整阴阳双面与 counter |
| 被挑战的情形 | 单边逼空/崩盘行情中，双面呈现显得「软弱」「踏空」「过时」时 |
| 站内证据锚点 | `domains/theses.ts` schema；`data/polarity.ts`；MANIFESTO 06 道法自然；02 号文件 §7 Polarity System |

### P-05 · DISCIPLINE OVER ACTIVITY —— 纪律优先于行动

**承诺**：宁可什么都不做，不做系统外的动作。空仓是持仓，等待是工作。

| 链节 | 内容 |
|---|---|
| 研究实践含义 | 预案先于操作（If-Then 触发器库），止损保护判断力而非本金；系统有休眠期且不视为异常；站内不设日更义务、不设行情流、不设「今天必须有新观点」的任何机制 |
| 遵守的行为证明 | WUWEI 是一级页面而非角落博文；「止损不是保护钱的，是保护判断力的」（Journal 2026.07.28 重写止损页）；「不操作是阴」成文（Essay《不操作的艺术》）；连损 15 次仍按系统执行并记录（Essay《做赌场，不做赌徒》） |
| 被挑战的情形 | 长期安静期在读者看来「什么都没有发生」时；热点行情中 FOMO 时；分发端需要更新频率维持存在感时 |
| 站内证据锚点 | `domains/wuwei.ts`；`domains/framework.ts`；`domains/journal.ts`；Essays `art-of-not-trading` / `casino-boss` |

---

## 三、与 Ledger / Revision / Body of Work 的接续

> **架构不变量 AI-03（V2-07-01 Review 锁定）：
> 原则约束行为，而不保证结果。—— Principles constrain behavior; they do not guarantee outcomes.**
> Principle 规定如何研究；Thesis 规定当前相信什么；Evidence 决定 Thesis 是否需要 Revision。
> 禁止「Thesis 错了 → 认为 Principle 也错了」的混淆——二者层位不同。

1. **Ledger 是原则遵守的审计轨。** P-01/P-03 的遵守证明直接就是 Ledger 条目——
   这使「原则」从自我声明变成可抽查记录（09 号文件 13.4 R-11 的解法）。
2. **被证伪 ≠ 违背原则。** 命题 invalidated 恰恰是 P-01/P-03 的遵守证据
   （现实变了，信念跟着变）；违背原则是**该改不改、改了不认**。
   Body of Work 的 ARCHIVE 层（closed / invalidated）因此是原则的证明陈列，
   不是失败展览（08 号文件 OD-4：不做失败案例墙）。
3. **PROOF 层的构成**（09 号文件 13.3 五层资产）：每条原则的 Evidence 锚点集合
   即 PROOF 层的原始素材；V2-07-03 的 Body of Work Architecture 负责把
   `Principle → Behavior → Evidence` 链做成可浏览结构，本阶段只立契约。

---

## 四、不是原则的东西（准入负面清单）

以下表述**看起来**像原则，但不允许进入本文件：

| 伪原则 | 拒绝理由 |
|---|---|
| 「长期主义」 | 无取舍、无成本——拿不住仓的人也说长期主义 |
| 「第一性原理」 | 无行为判别——无法指出哪个动作违背了它 |
| 「独立思考」 | 无证据锚点——无法被 Ledger 或任何实体证明 |
| 「知行合一」 | 修辞不是承诺——没有挑战情形定义 |
| 「诚实 / 透明 / 敬畏市场」 | 美德不是原则——缺 Behavior 与 Evidence 两节 |

准入测试（三问全过才收）：
**它要我放弃什么具体东西？违背它的可观察行为是什么？站内哪个实体能证明我遵守了？**

---

## 五、修订纪律

- Principle 属 **Permanent Set**（09 号文件 13.3 生命周期）：不随市场状态、
  读者反馈、分发效果修订；修订只因「HSN 真实的研究承诺变了」。
- 修订走版本化、不覆盖（同 11 号文件六节）；节奏 = Yearly Review。
- 原则条目数刻意保持五条——新增一条必须同时退役一条并写明理由
  （原则集合的稀释比缺失更危险）。
- 本文件变更需任务单授权。

**修订记录**

| 版本 | 日期 | 内容 |
|---|---|---|
| v1 | 2026.08.24 | 初版：五条 Canonical Principle 全链定稿 |
