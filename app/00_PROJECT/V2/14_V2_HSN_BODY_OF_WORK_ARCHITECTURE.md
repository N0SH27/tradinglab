# V2-14 · HSN BODY OF WORK ARCHITECTURE — 思想资产架构

> **V2-07-03 产出（2026-08-24）。** Canonical Architecture Document，不写代码。
> **状态：CANONICAL · V2-07-03 · LOCKED**（二次 Review PASS · APPROVED FOR COMMIT，2026-08-24；变更只走 versioned amendment，禁止 silent overwrite）。
> 上游契约：09（IP 架构）/ 10（Identity）/ 11（POV）/ 12（Principles）/ 13（Method），全部 LOCKED。
> 本文件回答一个问题：**什么东西值得 HSN 保存十年？**
> 阶段纪律（战略侧授权条件）：**先 Audit，不预设最终模型**；
> 从 2030 年第一次认识 HSN 的读者视角往回推；**Publication ≠ Work**；
> 不为架构完整而增加实体。
> 一～三节 = Audit；四～五节 = Extract 与最小模型（两轮 Review 裁决锁定）；
> 九节 = Canonical Themes v1.0；十节 = 两轮 Review 裁决记录（AI-07 / AI-08）。

---

## 一、Audit 方法：3-Year Test

任何候选对象逐项过五问（战略侧授权测试框架）：

| # | 测试 | 问题 |
|---|---|---|
| T1 | **Persistence** | 三年以后还有意义吗？ |
| T2 | **Authorship** | 没有 HSN 的观察/判断/方法，它是否仍然成立？（只是行业新闻摘要 = 不是 IP） |
| T3 | **Evidence** | 它能否证明 HSN 如何观察、判断或者修正？ |
| T4 | **Revision** | 它能否与过去或未来的认知形成 Before → Work → Evidence → Revision → After 关系？ |
| T5 | **Reusability** | 它能否被未来的 Essay / Thesis / Map / Method 引用？（能 = 开始成为 Knowledge Primitive） |

审计对象（实码现状，2026-08-24）：Observation 5 条（now.ts）、Thesis 8 个
（theses.ts，全部 active，assumptions/invalidation 覆盖率 8/8）、Ledger 3 条（ledger.ts）、
Journal 7 日期组（journal.ts）、Essay 6 篇（essays.ts）、Map 20+ 节点（map.ts）。

---

## 二、六类资产逐个审计

### 2.1 Observation（now.ts，5 条）

| 测试 | 结果 | 依据 |
|---|---|---|
| T1 Persistence | ✗ 弱 | 单条观察有时效（「2026.08 存储价格背离」三年后是旧闻） |
| T2 Authorship | △ 中 | 「真、新、大」的选择本身体现 Lens，但单条文本接近事实摘要 |
| T3 Evidence | ✓ 高 | 证明 HSN **当时在看什么**——Lens 的化石记录 |
| T4 Revision | ✓ 高 | 是 Thesis 的前因（`thesisId` 关联），纵向链条的第一环 |
| T5 Reusability | △ 中 | 被 Thesis / Map 引用，自身不被再引用 |

**裁决：单条 Observation 不是独立 Work。** 它的资产属性在**链条位置**——
纵向记录的第一环（观察在先、命题在后，这本身是 POV-02 的证据）。
处置：作为链条节点保留，不作为作品陈列；NOW 层的滚动替换不视为资产损失
（旧观察若已触发 Thesis，其历史已由 Thesis + Ledger 承接）。

### 2.2 Thesis（theses.ts，8 个）

| 测试 | 结果 | 依据 |
|---|---|---|
| T1 | ✓ 高 | 自带 `window` 保质期与 `status` 生命周期；结业后进入 ARCHIVE 反而增值 |
| T2 | ✓ 高 | `conflict{although,but}` + 亲笔 `counter` 是独有的判断结构——去掉 HSN 就不成立 |
| T3 | ✓ 高 | evidence/assumptions/invalidation 8/8 全覆盖，判断全程可审 |
| T4 | ✓ 最高 | 天然处于 Before→After 链中心：observation 在前、revision 在后 |
| T5 | ✓ 高 | 被 Map（`nodes` 双向）、Essay、Journal 引用 |

**裁决：核心 Work。** 且 active / closed / invalidated 三态皆为资产——
 invalidated 是原则遵守的证明（12 号文三节），不是负资产。

### 2.3 Ledger / Revision（ledger.ts，3 条）

| 测试 | 结果 | 依据 |
|---|---|---|
| T1 | ✓ 最高 | append-only、带时间戳、不可变——时间越长越难伪造 |
| T2 | ✓ 最高 | 修正记录是「不可复制的认知履历」（Cognitive Memory Moat 本体） |
| T3 | ✓ 定义即证明 | 它**就是** Evidence 维度的载体 |
| T4 | ✓ 定义即关系 | 它**就是** Revision 维度本身 |
| T5 | ✓ 高 | 全站所有 belief 投影的数据源 |

**裁决：不是 Work，是 Proof 基础设施。** Ledger 不「生产作品」，
它给所有 Work 提供证据维度——这是「Layer ≠ Asset Type」的第一个实锤。

### 2.4 Journal（journal.ts，7 日期组）

**异质性审计——Journal 不是统一资产类型，必须拆类：**

| 条目类 | 实例 | 资产判定 |
|---|---|---|
| conviction 类（up/down + thesisId） | 2026.07.31 国产算力 65→72 | ✗ **不是独立 Work**——事实已在 Ledger，journal 条目是叙事投影；当作资产 = 双源 |
| 方法演化类（new） | TL 指标更新（07.31）/ 止损页重写（07.28）/ 七层金字塔补全（07.29）/ 生活即 OS（05.21） | ✓ **Work 候选**——这是 Method History 的叙事层（AI-06：Method 演化与 Research Ledger 是两回事，其证据目前主要在这里） |
| 风险观察类（risk） | 存储背离（08.09）/ 液冷格局（07.31） | △ 半资产——若后续触发 Thesis/Revision 则进链条，否则随时间折旧 |

**裁决：Publication ≠ Work 的最典型案例。** Journal 的价值按条目类分别判定，
不允许「整个日志页」自动成为 Body of Work。

### 2.5 Essay（essays.ts，6 篇）

| 测试 | 结果 | 依据 |
|---|---|---|
| T1 | ✓ 高 | 全部是世界观/方法/心法类慢内容，无时效依赖 |
| T2 | ✓ 最高 | 最完整的个人表达；`thesis-writing-os` 是 Method 的成文形态 |
| T3 | ✓ 中高 | 方法定义类 Essay 直接证明 Method（13 号文协议 3 的锚点） |
| T4 | △ 中 | Essay 自身目前无版本机制——修订即覆盖，违反 Slowly Evolving 纪律（缺口 G-BoW-1，见三 F-5） |
| T5 | ✓ 高 | 被 Map（`MAP_ESSAY`）、Observation 引用；`related[]` 栏目级链接（G-05 挂起） |

**裁决：核心 Work。** 内部再分两档：**方法定义类**（thesis-writing-os / casino-boss /
art-of-not-trading——Method 的 canonical 文本）与**世界观类**（PoV 的叙事表达）。
未来「为分发节奏而写的 Essay」在五问测试下会被拦截（T1/T2 不过）——本框架天然防伪。

### 2.6 Map（map.ts，20+ 节点）

| 测试 | 结果 | 依据 |
|---|---|---|
| T1 | ✓ 中高 | 地图是活结构；产业认知的演化本身有价值 |
| T2 | ✓ 高 | **景气 × 估值双层状态分离**是 HSN 独创结构（实码注释：源自凌鹏框架 + MEMORY v51 背离判断） |
| T3 | ✓ 高 | 每个节点是带 stageFocus 的观察档案 |
| T4 | ⚠️ Deferred Gap | **节点状态变化没有任何版本记录**——Context 层的修正目前不可追溯。**G-BoW-2 = Deferred Architecture Gap（延期架构缺口，非拒绝）**：架构上必须承认 Context 是可演化状态，未来如需形成长期 IP Proof 必须支持版本化（见三 F-4） |
| T5 | ✓ 高 | Thesis/Observation/Essay 的关联枢纽 |

**裁决：Work，且是 Theme 维度的天然载体**（产业链即长期主题簇）。
但 T4 缺口意味着：**研究回路里 Context 的修正目前不进任何账本**——
Observation（now 滚动覆盖）与 Map（节点状态直改）都存在「前态丢失」。

---

## 三、审计发现（五个关键结论）

**F-1 · 「Layer ≠ Asset Type」实锤。**
09 号文五层（Principles/Methods/Themes/Works/Proof）经审计不能作为最终 IA：
**Proof 不是与 Work 平行的内容类型，而是 Work 的证据维度**（Ledger 即其基础设施）；
**Theme 不是作品，是长期聚类维度**。五层应降级为「视角」，不作为实体清单。

**F-2 · 「Publication ≠ Work」实锤。**
Journal 异质性（2.4）证明：发布过的内容不自动成为资产。
资产准入必须过 3-Year Test，与是否已发布无关。

**F-3 · 真正的资产单元不是对象，是纵向链条。**
单项测试中 T4（Revision 关系）得分最高的对象，恰好都处在链条上：
`Observation → Thesis → Evidence → Revision → (Essay) → (Method Revision)`。
**Longitudinal intellectual record 的单元是「一条认知轨迹」，不是「一个内容对象」。**
这直接决定候选模型的形态（四节）。

**F-4 · Context 层修正不可追溯（G-BoW-2 = Deferred Architecture Gap）。**
研究回路中 Thesis/Belief 的修正有 Ledger，但 Context（Map 节点状态、Observation 滚动）
的修正在发生即覆盖——「我曾经怎么看这个产业环节」三年后无法回答。
**战略侧裁决（OD-3 MODIFY）：接受「暂不实现」的成本控制，不接受「架构上不记录」的永久裁决。**
由此确立 **Context Revision Boundary（架构契约，当前不实现）**：

```text
现在：Context = mutable Research State（发生即覆盖，成本控制）
未来：Context History = versioned / append-only（如需形成长期 IP Proof，必须支持版本化）
永不：Context = 永远覆盖（架构上禁止把「覆盖」固化为终态）
```

登记：`G-BoW-2 = Deferred Architecture Gap`——Deferred, not rejected。

**F-5 · Essay 修订即覆盖（G-BoW-1）。**
世界观/方法类 Essay 属 Slowly Evolving 档（09 号文 13.3：Version 而非覆盖），
但现状无版本机制。属轻缺口，候选解法 = 文档层版本注记（不建实体），OD-4。

---

## 四、Extract：Work 的 Canonical 定义

> **Body of Work = longitudinal evidence of authorship over time.**
> Body of Work 是「作者身份随时间展开的纵向证据」——战略侧裁决定名，本文件正式定义。

> **Work = What did HSN produce that did not exist before?**
> HSN 产出的、在其产出之前不存在的东西。

逐项套用：判断结构（Thesis）✓；成文方法（Essay）✓；独创产业地图结构（Map）✓；
不可伪造的修正记录（Ledger）✓（但它是 Proof 基础设施，非作品）；
单条 Observation ✗（事实摘要，链条节点）；conviction 类 Journal 条目 ✗（Ledger 投影）。

由此得到**最小候选模型——两个实体 + 一个关系**（审查「是否最小且正确」后的结论）：

```text
                 BODY OF WORK
                      │
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
     WORK(实体)    THEME(实体)    PROOF(关系·非实体)
        │             │             │
   引用层·不复制    聚类维度·      Work ↔ Evidence
   type + refId    长期问题/      ↔ Revision 链——
   → 研究对象       产业/概念      由 Ledger + 引用派生
```

| 概念 | 形态 | 关键约束 |
|---|---|---|
| **Work**（实体候选） | `{ id, type, refId, themeIds[], span, status }`——`type ∈ thesis / essay / map / method-note`；`refId` 指向 Research System 对象 | **纯引用层**（AI-01/02）：不复制 Thesis/Essay 内容，只建立索引与归属；Research Objects 仍是唯一事实源 |
| **Theme**（实体候选） | `{ id, title, question, workIds[] }`——长期反复研究的主题簇（例：国产算力链 / 周期与估值的背离 / 无为与纪律） | 数量克制（首批 ≤6）；Theme 是**问题**不是标签——「标签三年后无意义，问题三年后仍值得回答」 |
| **Proof**（关系，不建实体） | Work ↔ Evidence ↔ Revision 的可遍历链 | 完全由 Ledger + Work 引用**派生**；禁止把 Proof 做成第二张表（否则双源） |

**为什么不增第三个实体**：Proof 实体化 = 复制 Ledger；Method 已有 13 号文
（Method History 属 AI-06 管辖）；Principles/POV 已有 11/12 号文。
两个实体 + 一个派生关系是当前证据支撑下的最小完备解。

---

## 五、候选模型的生命周期与淘汰规则

| 档 | 内容 | 规则 |
|---|---|---|
| Permanent | Ledger 全量；Thesis 全量（含 closed/invalidated）；方法定义类 Essay；本系列宪章 | 永不删除；修订走 versioned amendment |
| Slowly Evolving | 世界观 Essay；Map 结构；Theme 清单 | Version 不覆盖（G-BoW-1 待补机制，OD-4） |
| Dynamic | active Thesis 的 conviction；Observation 滚动层 | 当下态可变，**事实变化必须落 Ledger**，否则前态丢失 |
| Ephemeral | 分发碎片；未进链条的 risk 类 journal 条目 | 永不成为真相源；不进入 Body of Work |

**淘汰测试（什么应该被淘汰）**：过不了 T1+T2 的内容不进 Body of Work；
已在站内的事实性内容不删（Ledger 纪律），但**不陈列**——
「保留在数据库里」与「列为思想资产」是两回事。

---

## 六、Test：2030 年读者场景检验（候选模型压测）

> 2030 年，一个第一次认识 HSN 的人打开 TradingLabb。

| 场景问题 | 候选模型如何回答 | 判定 |
|---|---|---|
| 什么东西仍然值得看？ | Theme 清单（长期问题）→ 各 Theme 下的 Works——按问题组织，不是按日期 | ✓ |
| 什么东西证明 HSN 曾经怎样思考？ | 任一 Work → refId 回溯到当时的 Thesis 全文（含当时的 conflict/counter/概率） | ✓ |
| 什么东西证明 HSN 如何改变？ | Proof 关系：Work → Ledger 修正链（up/down/confirm 全历史，含被打脸的） | ✓ |
| 什么东西证明 Method 不是自我包装？ | Proof 链终点 = 带时间戳的 append-only 账本 + Method History（AI-06） | ✓ |
| 什么东西应该被淘汰？ | Ephemeral 与未过 3-Year Test 的内容已在准入处拦截 | ✓ |

**压测结论：两实体一关系模型通过五问。** 它不依赖任何新页面即可成立——
Body of Work 首先是**资产结构**，页面呈现是后续阶段的事。

---

## 七、本阶段禁止事项（战略侧授权边界，已遵守）

不改 UI；不增加 Work / Archive / About 页面；不增加 Essay CMS；不设计 Portfolio；
不建立新的平行 Research DB；**不修改 Thesis / Ledger schema**；不 Push；不碰 V2 backlog
（G-08 / G-05 / InkTransition 保持挂起）。

---

## 八、Open Decisions（交战略侧 / 用户裁决）

1. **OD-1 · 最小模型批准**：两实体（Work / Theme）+ 一关系（Proof 派生）是否批准？
   尤其确认 **Proof 不实体化**（防双源）这一取舍。
2. **OD-2 · 首批 Theme 清单来源**：建议从既有内容聚类（候选：国产算力链 /
   周期与估值的背离 / AI 应用价值回流 / 无为与纪律），≤6 个，以「问题」而非标签命名——
   清单由用户最终定夺，本文件不锁定。
3. **OD-3 · Context 层修正追溯（G-BoW-2）**：Map 节点状态变化是否需要版本记录？
   候选：a) 进 Ledger（扩展 thesisId 为 nodeId——**违反 Ledger 准入纪律，不推荐**）；
   b) 独立 context log（新实体——违反最小模型，不推荐）；
   c) **暂不记录，Theme/Work 层的 span 字段间接承接**（推荐，成本最低）——待裁决。
4. **OD-4 · Essay 版本化机制（G-BoW-1）**：候选 = 文档层版本注记
   （essay frontmatter 加 `version` + 修订注记，不建实体、不改渲染）——是否批准？
5. **OD-5 · Work / Theme 实体的落地时点**：本阶段只立契约；数据实现（疑似
   `domains/works.ts` + `themes.ts`，纯引用层）放 V2-07-03 后段还是 V2-07-04 之前？
   注意：实现仍是**零 UI** 的纯数据层任务，需单独任务单授权。

---

## 九、Canonical Themes v1.0（OD-2 裁决锁定 · 2026-08-24）

入选纪律（战略侧锁定）：**Theme ≠ Industry / Asset Class / Company / Topic；
Theme = Long-term Question——HSN 会反复回来研究的问题，而不是 HSN 最近关注什么。**
全部 Theme 从既有 Works 聚类抽取，不新造研究方向。
**用户终裁：6 候选 → 4 个 Canonical Themes v1.0**（保留 4、合并 1、降级 1）；
命名 **Canonical Themes · v1.0**（不是「首批 4 个」——未来演进走九节末 Admission Test）。

### T-01 · 当技术范式切换时，资本如何重新定价产业链？

- **Definition**：追踪技术革命（佩雷斯范式）中金融资本与生产资本的脱钩与再耦合，
  观察产业链各环节被重新定价的顺序与错位。
- **Why HSN**：地图的佩雷斯时代标尺（狂热后期、转折前夜）+ 「一组相互等待的 S 曲线」
  正是这个问题的结构化表达；HSN 的研究从产业地图出发，天然是范式定价视角。
- **Existing Works**：Thesis `compute` / `ai-app`；Map 全图（20+ 节点）；Observation `ai-inference-economics`。
- **子问题簇**：「当模型能力商品化时，价值向何处迁移？」（原候选 T-04 并入，
  见九节末非 Canonical 处置①）——Works：`ai-app` / `app`·`token`·`cloud` 节点。
- **Overlapping Theme**：与 T-02 在存储/光模块节点相交（同一对象可被两个 Theme 引用——Work 多挂是特性）。
- **3-Year Test**：T1 ✓ 范式切换以十年计；T2 ✓ 佩雷斯标尺 + 双层状态是 HSN 独创组装；
  T3 ✓ Map + Thesis 全链可审；T4 ✓ 范式位置判断必将随现实修正；T5 ✓ 未来任何新产业 Thesis 都可挂入。

### T-02 · 周期顶部与底部的信号，为什么总是先于基本面出现？

- **Definition**：研究价格与基本面的背离结构——顶部信号不是价格下跌而是上涨失效，
  底部信号不是利润转正而是现金流先见底。
- **Why HSN**：「碳酸锂前鉴」（30 万股价见顶、60 万股价不跟）是 HSN 反复引用的原创判断框架；
  景气 × 估值双层状态分离即为此问题而建。
- **Existing Works**：Thesis `memory-cycle` / `optical-module` / `newenergy` / `rare-earth`；
  Map `hbm` 节点（产业阳 × 估值阴）；Journal risk 条目（存储背离 2026.08.09）。
- **Overlapping Theme**：与 T-01 在算力链节点相交；与 Method/WUWEI 层（原候选 T-05）
  在「出清期不操作」处相交。
- **3-Year Test**：T1 ✓ 周期是永恒问题；T2 ✓ 背离判断框架为 HSN 原创；
  T3 ✓ 四个周期类 Thesis 全带 invalidation；T4 ✓ 背离信号触发 Revision 是已发生行为；T5 ✓ 可复用于任何周期品。

### T-03 · 政策意志与产业能力之间的距离，如何度量？

- **Definition**：当需求由政策意志驱动时，如何区分「叙事兑现」与「库存游戏」——
  用供给端可验证事实（产能、出货、招标条款）度量意志与能力的剪刀差。
- **Why HSN**：命题一的核心 counter 即此问题（「把政策意志当成了产业能力」）——
  HSN 立题时就把这个问题设为自己的证伪条件。
- **Existing Works**：Thesis `compute`（含 assumptions/invalidation）；Observation `china-semiconductor-localization`；Map `equip` / `power` 节点。
- **Overlapping Theme**：与 T-01 共享 compute 命题（T-01 看定价，T-03 看兑现）。
- **3-Year Test**：T1 ✓ 国产替代是十年尺度问题；T2 ✓ 剪刀差度量是 HSN 自拟的检验方法；
  T3 ✓ invalidation 已预登记；T4 ✓ 2026.07.31 Revision 即此类证据入账；T5 ✓ 可迁移到军工、创新药等政策敏感行业。

### T-04 · 人性与共识如何在价格中显形？

- **Definition**：读价即读心——价格是阳、共识是阴；
  群体心理的一级/二级加工如何形成可观察的市场结构。
  （原候选 T-06 改编号；保留理由：与 T-01 技术资本 / T-02 周期信号 / T-03 政策能力
  构成第四个不同的观察层——Human → Consensus → Price。）
- **Why HSN**：「对人性进行套利，才是终极的可持续竞争优势」（Essay 成文）；
  四象阴阳（量价可测 / 时空不可测）是 HSN 独创的观察坐标系。
- **Existing Works**：Essay `price-as-consensus`；`dimensions.ts` 全域；`cycle.ts`
  题材生命周期与四面权重；MANIFESTO 04 价格即共识。
- **Overlapping Theme**：与 Method/WUWEI 层（原候选 T-05）在「情绪是认知缺失的副产物」
  处相交——Method 管行为，本 Theme 管读解。
- **3-Year Test**：T1 ✓ 人性千年不变；T2 ✓ 四象坐标系为独创结构；
  T3 ✓ Essay + dimensions 实码；T4 ✓ 四面权重随市场状态调权即已发生的框架修正；T5 ✓ 是解释一切 Trading Loop 行为的底层语言。

**非 Canonical Theme 处置（用户终裁）：**

① **原候选 T-04「当模型能力商品化时，价值向何处迁移？」→ 并入 T-01 子问题。**
它是 T-01 在 AI 领域的重要实例而非独立长期 Theme；若独立，Theme 会滑向行业分类器
（AI / Memory / Optical……），违背 Theme ≠ Industry / Topic。其 Works 改挂 T-01，
研究价值全部保留。

② **原候选 T-05「不操作如何成为一种可验证的方法？」→ 降级为 Method / WUWEI Core Question。**
不删除，降级层位：它回答的不是「HSN 如何研究世界」，而是「HSN 应该如何行动」——
正确层位是 POV → Principle → Method → WUWEI → Behavior（11/12/13 号文管辖）。
放进 Theme Registry 会造成 Method Constitution 与 Body of Work Theme 的概念污染。
其 Works（wuwei 全域 / 方法类 Essays / framework / system）继续在 Method 层承载，
由 13 号文 Behavioral Constraints 与 12 号文 P-05 保护。

**Theme Admission Test（新增 Theme 必须五问全过，随 v1.0 锁定）：**

1. Is it a recurring question?（是反复回来的问题吗）
2. Does it have existing Work?（已有 Work 反向证明它存在吗）
3. Is it distinct from existing Themes?（不能被已有 Theme 吸收吗）
4. Can it survive 3+ years?（三年后仍值得回答吗）
5. Does removing it create a meaningful blind spot?（删掉它会留下真实盲区吗）

**增一退一纪律**：新 Theme 进入，必须证明它不能被已有 Theme 吸收；
不允许「想到一个好问题 → 加一个 Theme」——防 Theme Registry 膨胀成标签系统。
（用户附注：不再做第二轮 Theme brainstorming——现在已经足够少、足够硬。）

**最终结构（Canonical Themes v1.0）：**

```text
BODY OF WORK
│
├── Theme 01   Technology → Capital → Industry
│              当技术范式切换时，资本如何重新定价产业链？
├── Theme 02   Cycle → Signal → Fundamentals
│              周期顶部与底部的信号，为什么总是先于基本面出现？
├── Theme 03   Policy → Capability → Reality
│              政策意志与产业能力之间的距离，如何度量？
└── Theme 04   Human → Consensus → Price
               人性与共识如何在价格中显形？
```

---

## 十、V2-07-03 Review 裁决记录（2026-08-24 · PASS WITH LOCKS — 1 HOLD + 1 MODIFY）

战略侧对本文档 v0.9-draft 的 Review 结论：**PASS WITH LOCKS — 1 HOLD + 1 MODIFY**；
**明确暂不 commit**，补件后二次 Review。

**OD 终裁表：**

| OD | 裁决 | 落定 |
|---|---|---|
| OD-1 | ✅ ACCEPT | 两实体（Work / Theme）+ 一关系（Proof 派生）；**Work 是 Reference Entity，不是 Content Entity**——只回答「这个 Research Object 为什么属于 Body of Work」，禁止 `Research Object ↔ Work Copy`（AI-08 保护） |
| OD-2 | ✅ ACCEPT·MODIFIED | 6 候选 → **Canonical Themes v1.0（4 个）**：原 T-04 并入 T-01 子问题；原 T-05 降级 Method/WUWEI Core Question（不删除，降层位）；Theme Admission Test 五问 + 增一退一纪律随 v1.0 锁定（九节）；用户附注：不再做第二轮 Theme brainstorming |
| OD-3 | ⚠️ MODIFY | 延后实现可以，永久不记录不可以——`G-BoW-2 = Deferred Architecture Gap`，Context Revision Boundary 已立（三 F-4） |
| OD-4 | ✅ ACCEPT | Essay 文档层版本化；**Thesis Revision 属 Research Ledger，Essay Revision 属 Work/Publication Layer，两者不得混成一个 Revision**；当前只立契约 `Essay { current version, revision history }`，不建 Entity/CMS |
| OD-5 | ✅ ACCEPT | V2-07-03 只锁架构不实施；顺序 = Architecture → Data Contract → Implementation Task → Implementation → Validation，防页面需求反向塑造架构 |

**新增 Architecture Invariants（追加进 09 号文 AI 序列）：**

| # | 不变量 |
|---|---|
| **AI-07** | **Body of Work ≠ Publication Archive。** Body of Work records intellectual authorship, not everything published——发布过 ≠ 属于 Body of Work；Journal 是容器/表达层，不是 IP Asset（「Journal 100 篇 = 100 个 Works」为非法推理） |
| **AI-08** | **Work ≠ Canonical Research Object。** Work only references Research Canonical Objects; it never duplicates their canonical content——保护 Thesis / Ledger / Journal / Map 不被 IP 层复制（No Duplicate Canonical Content） |

**Review 确认的正式定义（已写入四节）：**

> **Body of Work = longitudinal evidence of authorship over time.**

**Review 确认的阶段判断（记录）：** Time is what turns Research into Body of Work——
Thesis 是一个判断；Observation → Thesis → Evidence → Revision → Work → Method Revision
才开始成为 HSN 的思想史。

**当前状态：CANONICAL · V2-07-03 · LOCKED（二次 Review PASS · APPROVED FOR COMMIT，2026-08-24）。**

---

## 十一、二次 Review 终裁记录（2026-08-24 · PASS）

战略侧对 v1.0-rc 的二次 Review 结论：**PASS，可以封板，可以 Commit。**
无遗留 P0/P1 架构问题。五 OD 终态：OD-1 ✅ / OD-2 ✅ ACCEPT·MODIFIED /
OD-3 ✅ MODIFY→DEFERRED（Deferred ≠ Rejected，长期盯住）/ OD-4 ✅ / OD-5 ✅。

**二次 Review 特别确认（记录）：**

1. 四 Theme 共同特征成立：长期问题非热点；已有 Works 反向支撑；有重叠但不强行合并；
   可跨行业/跨 Thesis/跨时间；过 3-Year Test；新增受 Admission Test + 增一退一约束。
2. **Theme 问「世界中什么问题值得持续研究」；Method 问「HSN 如何行动与思考」**——两层必须分层。
3. Context Revision Boundary 的处理符合工程哲学：先保护架构边界，
   不为了未来可能的价值过早增加系统复杂度。
4. **不因已有 Work/Theme 模型就马上在 UI 展示 Theme Registry**——
   防 Architecture Asset 过早变成 Product Feature。
5. BoW 定义句 **"Body of Work = longitudinal evidence of authorship over time."
   保持原句，不再润色**——Authorship + Evidence + Time 三变量恰对应
   Identity × Method × Evidence × Time 乘法公式；Body of Work 是该公式落地后的时间维度结果。

**Author System ↔ Research System 边界图（二次 Review 确认为 V2-07 重要架构成果，入档）：**

```text
AUTHOR SYSTEM
│
├── Identity
├── POV
├── Principles
├── Method
│
└── Body of Work
      │
      ├── Work
      └── Theme
             │
             └── references
                    ↓
              RESEARCH SYSTEM
                    │
                    ├── Observation
                    ├── Thesis
                    ├── Ledger
                    ├── Revision
                    ├── Journal
                    └── Map
```

**Commit 授权：** 仅 14 号架构文档；零代码 / 零 UI / 不碰 V2 backlog / 不 Push；
commit message `docs(v2): establish HSN body of work architecture`；commit 后 workspace clean。

**阶段状态：**

```text
V2-07-00  LOCKED
V2-07-01  WHO · Identity & POV          LOCKED
V2-07-02  HOW · Method                  LOCKED
V2-07-03  WHAT REMAINS · Body of Work   LOCKED
        ↓
V2-07-04  HOW IT TRAVELS · Distribution Architecture
          总原则不变：Research → Canonical Work → Body of Work → Distribution，不能反过来
```

---

**修订记录**

| 版本 | 日期 | 内容 |
|---|---|---|
| v0.9-draft | 2026.08.24 | 六类资产 3-Year Test 审计 + 最小候选模型；未锁定，待 Review |
| v0.95-review-fix | 2026.08.24 | Review #1 补件：九节候选 Theme 清单（6 个）；G-BoW-2 改 Deferred Architecture Gap + Context Revision Boundary；四节补 BoW 正式定义；十节裁决记录 + AI-07/AI-08；仍未锁定、未 commit |
| v1.0-rc | 2026.08.24 | OD-2 终裁（ACCEPT·MODIFIED）：九节锁为 Canonical Themes v1.0（4 个）；原 T-04 并入 T-01、原 T-05 降级 Method/WUWEI 层；Theme Admission Test + 增一退一纪律入档；5 项 OD 全部闭环，待二次 Review |
| v1.0 | 2026.08.24 | 二次 Review PASS · APPROVED FOR COMMIT：头部 LOCKED；十一节终裁记录 + 边界图入档；CANONICAL · V2-07-03 · LOCKED |
