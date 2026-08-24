# V2-11 · HSN POV CONSTITUTION — 世界观宪章

> **V2-07-01 产出（2026-08-24）。** Canonical Architecture Document，不写代码。
> **状态：CANONICAL · V2-07-01 · LOCKED**（PASS WITH LOCKS 裁决，2026-08-24；变更只走 versioned amendment，禁止 silent overwrite）。
> 上游契约：09 号文件（V2-07-00 封板）；10 号文件（Identity Constitution）。
> 本文件回答一个问题：**How does HSN see the world?**
> 生效纪律：**POV ≠ slogan；POV = Research orientation。**
> 每一条 POV 都必须能指导研究决策（观察什么、立什么命题、拒绝什么），
> 不能指导研究决策的表述不是 POV，是文案。

---

## 一、Canonical POV Statement（OD-C 终裁确认）

> **HSN studies change — how technology, industries, capital and human behavior evolve,
> and how beliefs should change as reality changes.**

中文工作版：

> **HSN 研究变化——技术、产业、资本与人性如何演化，以及当现实变化时，信念应当如何随之更新。**

使用纪律（OD-C 附加约束，锁定）：

- 这是**工作版本**：用于内部架构对齐、Identity 页（远期）与分发署名的语义基准；
- **不作为首页大标语**——首页七章已冻结，POV 不上墙、不做装饰性展示；
- `Author.oneLiner`（10 号文件六节）从本陈述派生，不另写一套。

---

## 二、五条 Canonical POV（终裁清单）

```text
01  Reality over narrative     现实优先于叙事
02  Change over prediction     变化优先于预测
03  Beliefs over certainty     信念优先于确定
04  Polarity over linearity    阴阳优先于直线
05  Discipline over activity   纪律优先于行动
```

表述形式统一为 **X over Y**——不是修辞偏好，而是**取舍声明**：
每条 POV 都明示当 X 与 Y 冲突时放弃哪一个。没有代价的 POV 不算 POV。

### POV-01 · Reality over narrative

**取舍**：当一个动人的叙事与可被验证的现实冲突时，放弃叙事。

研究取向：证据必须是可被外部验证的事实（出货数据、招标条款、产能交期），
而不是研报的措辞与圈内的情绪（Essay《如何写一个产业命题》已成文）。
每个 Thesis 必须亲笔书写让自己不舒服的反面论证（`counter` 字段的实码纪律）。

### POV-02 · Change over prediction

**取舍**：不做点状预测；只跟踪变化的条件、速度与方向。

研究取向：「我不预测拐点，只观察阴阳消长的速度」（MANIFESTO 06）。
首页终幕已公开声明："I don't predict the future. I update my beliefs as reality changes."
观察先行、命题后置——Observation 层的存在本身就是这条 POV 的产品形态。

### POV-03 · Beliefs over certainty

**取舍**：承认所有判断都是带概率的暂时状态，拒绝表演确定。

研究取向：概率不是精确，是诚实的刻度；时间窗口提醒命题有保质期
（Essay《如何写一个产业命题》）。Ledger 方向三态含 **CONFIRM**——
「没有改变也是判断」（08 号文件 OD-3 裁决：Reality changed, belief didn't.）。

### POV-04 · Polarity over linearity

**取舍**：拒绝 Bull/Bear 二元直线判断；任何命题同时呈现阳面与阴面。

研究取向：阴阳不是装饰，是结构——`Thesis.conflict = {although, but}`、
`yang[]` / `yin[]` 是实码级强制（写不出「虽然……但是……」的命题说明还没想清楚）。
矛盾即信息：反面证据不是噪音，是命题结构的组成部分。

### POV-05 · Discipline over activity

**取舍**：宁可什么都不做，不做系统外的动作。

研究取向：不操作是持仓——「钱是坐着等来的」（Essay《不操作的艺术》）；
止损保护的不是钱，是判断力（Journal 2026.07.28 已成文）。
产品形态：WUWEI 是一级页面；站内没有日更义务、没有行情流、
没有「每天都必须有新观点」的机制。

---

## 三、POV 与四层 Worldview 的关系

战略侧 Review 提炼的四条描述性 Worldview 与本文件五条规范性 POV 是同一现实的两个层：

| 描述层（世界是怎样的） | 规范层（因此研究怎么做） |
|---|---|
| Reality is dynamic | POV-02 Change over prediction |
| Knowledge is provisional | POV-03 Beliefs over certainty |
| Contradictions are information | POV-04 Polarity over linearity |
| Time reveals structure | POV-01 Reality over narrative（时间让叙事接受现实检验）+ POV-05（纪律需要时间兑现） |

描述层不入站、不展示；规范层（五条 POV）是唯一的对外/对内 Canonical 集合。
新增 POV 必须走版本化修订（六节），不得随手扩列。

---

## 四、POV 与既有实体的映射（防双源核查）

| POV | 已存在的实码/文本锚点 | 结论 |
|---|---|---|
| POV-01 | `Thesis.evidence` / `counter` 字段纪律；Essay `thesis-writing-os` | 已产品化 |
| POV-02 | `domains/now.ts`（Observation 层）；`SITE.subtitle`「观察变化，而非预测未来」；首页终幕声明 | 已产品化 |
| POV-03 | `probability` + Ledger 三态方向；MANIFESTO 03 概率与确定性 | 已产品化 |
| POV-04 | `conflict/yang/yin` 实码强制；MANIFESTO 06 道法自然；Polarity System（02 号文件 §7） | 已产品化 |
| POV-05 | `domains/wuwei.ts`；Essay `art-of-not-trading`；MANIFESTO 02/06 | 已产品化 |

**核查结论：五条 POV 全部不是新发明，而是对 V2 已建成行为模式的正式命名。**
这符合 09 号文件的核心设计原则——从 HSN 已经反复做过的事情中抽取，而非发明。
本文件的增量价值是**命名与收敛**：今后任何「HSN 怎么看世界」的表述需求，
只从这五条取，不再临时创作。

---

## 五、POV ≠ Slogan 的判别测试

一条表述要进入本文件，必须三问全过：

1. **取舍测试**：它明示了放弃什么吗？（「长期主义」不过——没有代价）
2. **决策测试**：它能否决一个研究动作吗？（例：POV-05 能否决「今天必须发条观点」）
3. **证伪测试**：存在可观察的行为能证明我违背了它吗？（例：若站内出现点状预测，POV-02 即被违背）

三问有任何一问答不出——退回，不是 POV。

---

## 六、修订纪律

- POV 是**慢变量**：修订节奏 = Yearly Review（09 号文件 13.3 节奏框架）。
- 修订走**版本化**，不覆盖：旧版本保留在本文件的修订记录中（见下）。
- POV **不进 Ledger**——Ledger 只收会改变未来判断状态的 conviction 事件
  （09 号文件 13.3 Ledger 准入）；POV 的演化叙事由 Essay 承载。
- 本文件变更需任务单授权；与 MANIFESTO（对外表达层）的同步修改单列 diff，
  不与研究内容混提。

**修订记录**

| 版本 | 日期 | 内容 |
|---|---|---|
| v1 | 2026.08.24 | 初版：Canonical Statement + 五条 POV（OD-C 终裁） |
