# V2-29 · CANONICAL CONTENT ROUTING & HOMEPAGE DEDUPLICATION CONTRACT — 规范内容路由与首页去重契约

> **CONTRACT · CANONICAL · V2-29 · v1.0 · LOCKED**
> Human Review（2026-09-01）：**PASS WITH LOCKS**——6 × PASS + 1 × PASS WITH MODIFICATION（OD-1），无 REJECT。
> OD-1 三层切分修正、OD-2 落点规则严格化、OD-6 Research Object 术语纪律、OD-7 升级 Semantic Layering Rule 均已落正文；止损线与完整裁决记录见附二。
> 本轮及 LOCK 后持续有效：**零代码、零数据改动、零新实体、零新 Schema、零新页面、零 Commit、零 Push。**
> **Contract LOCKED ≠ Implementation Authorized**——实施须另开任务单（08_TASKS/CURRENT_TASK.md），范围限定首页呈现层与必要文案，验收 AC-1～AC-8。
> 上游契约：V2-01～V2-28（重点：03 IA / 04 HOME SPEC / 10 Identity / 14 Body of Work / 15 Distribution / 24 C2-A Contract / 27 ARK Benchmark Audit / 28 Research Product Architecture Audit），全部 LOCKED 或 DRAFT 在审。
> 触发：战略侧分析文档（2026-09-01，基于 2026-08-31 后 GitHub 实码 HEAD 复核）——首页同一认知对象（国产算力 / 存储 / 电力）在 FOCUS / LIVE THESIS / RESEARCH / NOW 四章反复出现且语义重复；FOCUS 三卡片混用 THESIS / REPORT 两种落点类型。
> 问题定性（战略侧原文承接）：**Presentation Architecture Compression，不是 Information Architecture Redesign。** IA 不推倒，章序不推翻，只锁每一章的唯一职责。
> 最终原则：**一个 Canonical Content Object 一个 Primary Home；Derived View 不拥有内容；首页只承担 Orientation + Preview + Routing，不成为第二个内容库。**

---

## 1. 问题定义与实码证据基线

### 1.1 实码证据（2026-09-01 · 本地仓库复核，与 GitHub main 一致）

| # | 证据 | 位置 |
|---|---|---|
| E-1 | FOCUS 三卡片混用两种落点类型：国产算力链 `THESIS · ACTIVE → #/thesis/compute`；存储周期 `THESIS · REVISED → #/thesis/memory-cycle`；电力约束 `REPORT · ACTIVE → #/research/report-3` | `src/pages/Home.tsx` L31–63（FOCUS 常量） |
| E-2 | LIVE THESIS 首页卡片已携带 industry + title + `conflict.but` + conviction + polarity + window + last revised——接近一张完整判断卡，与 Thesis Detail 页信息高度重叠 | `Home.tsx` L146–176 |
| E-3 | RESEARCH 章完整列出全部 3 份报告（REPORT #1–#3），而非「1 份代表 + ALL RESEARCH 出口」 | `Home.tsx` L66–85, L240–264 |
| E-4 | NOW 章直接渲染 `OBSERVATIONS.slice(0, 5)`，且 observation 带 `thesisId` 时直链 Thesis 页——同一主题第四次出现 | `Home.tsx` L268–298 |

### 1.2 问题定性

```text
表面症状：算力 / 存储 / 电力在首页出现 3～4 次。
真实病因：首页同时承担「目录 / 摘要 / 状态面板 / 研究入口 / 认知展示」五种职责，
         同一认知对象被不同栏目反复当成主角，且每次说的是同一种话。
```

**关键区分（本契约的判断标准）：**

> **同一主题出现 N 次没有关系；同一语义出现 N 次就是问题。**

- 好重复：FOCUS 问问题 → RESEARCH 给研究 → THESIS 给信念状态 → JOURNAL 给修正记录——四种不同动作，用户每次获得新信息。
- 坏重复：四章都在说「算力很重要」——信息冗余，用户无法分辨是层级不同还是单纯重复。

**认知结构声明**：HSN 的研究对象天然是网状的（世界 → 产业 → 研究 → 判断 → 修正 → 交易），同一节点属于多个位置是内部知识图谱的合法形态。本契约不压缩思想，只压缩**同一思想在前台的重复投影**。用户的线性体验应该看到「我现在处于这条链上的哪一个位置」，而不是整张网络。

---

## 2. Canonical Home Principle（三层切分 · OD-1 修正落定）

> **Human Review 修正（OD-1 · PASS WITH MODIFICATION）**：原则拆为三层，防止 Derived View 被误读为「暂未实体化的对象」，进而滑向 Focus Entity → Topic Entity 的退化路径——那正是 V2-24（F-10 / Canonicalization 风险）与 V2-28（Focus 非实体化 LOCK）一直在防的事情。

### 2.1 三层切分

| 层 | 定义 | 例 | 规则 |
|---|---|---|---|
| ① **Canonical Content Object** | 拥有内容真相的研究对象 | Observation / Research Report / Thesis / Revision | 每个对象有且仅有一个 Primary Home |
| ② **Derived View** | 非实体化的呈现视图 | FOCUS（注意力声明，V2-28 §4.1 LOCK：永不实体化） | **不拥有任何内容**，只为 Canonical Object 提供上下文入口 |
| ③ **Page / IA** | 展示层位置 | NOW / RESEARCH / THESIS / JOURNAL / WUWEI 等页面 | 是对象的 Home 或引用位，自身不产生内容语义 |

### 2.2 Primary Home 映射（① 层）

| Canonical Content Object | 唯一 Primary Home | 其他位置允许的行为 |
|---|---|---|
| Observation（世界正在发生什么） | NOW / WORLD（now.ts 数据域） | 引用事件，不复述分析 |
| Research Report（完整研究） | RESEARCH（Canonical Research Content） | 引用标题与元信息，不复述结论 |
| Thesis（当前判断） | THESIS（theses.ts + Thesis Detail 页） | 引用信念状态，不复述论证 |
| Revision（判断如何变化） | JOURNAL / LEDGER | 引用修正摘要，不复述命题 |

SYSTEM / FRAMEWORK / METHOD / WUWEI 为方法与价值观页面，其页面即其内容本身的 Home，不参与上述引用链。

### 2.3 正式原则句（LOCK）

> **一个 Canonical Content Object，一个 Primary Home；Derived View 不拥有内容，只负责引用。任何非 Primary Home 的展示位置，只能提供该对象的上下文入口、状态或导航，不得重新承担该对象的完整语义。**

**推论：首页只能是 Preview / Orientation / Routing 层，不是第二个内容库。**

---

## 3. Canonical Content Routing（核心产品链）

### 3.1 链条定义

```text
FOCUS          Question     我现在想搞清楚什么？
    ↓
RESEARCH       Work         我对此研究出了什么？
    ↓
THESIS         Judgment     研究之后，我现在相信什么？
    ↓
JOURNAL        Revision     后来我为什么改变？
```

上游输入：`OBSERVATION（世界在变什么）→ FOCUS`（V2-28 §2.2 已 LOCK 的链条原样保留）。

### 3.2 与 V2-28 M-3 的兼容性声明（重要）

V2-28 第二轮 Review · M-3 已 LOCK：**Report 与 Thesis 是并行 Research Outputs，经 Evidence 互相连接，不是固定父子关系。**

本契约的 FOCUS → RESEARCH → THESIS 是**呈现层默认阅读路径**，不是数据模型：

- 数据层：Report ↔ Thesis 并行、Evidence linkage，维持 M-3 不变；
- 呈现层：陌生用户的自然预期是「你在研究什么 → 研究出了什么 → 所以你现在相信什么」，FOCUS 卡片的默认点击落点应沿此预期路由；
- 两者不冲突：路由是读者路径的默认值，不声明对象的父子关系。

### 3.3 FOCUS 落点规则（OD-2 · PASS，含严格化修正 · LOCK）

**正式规则（Review 原文落定）：**

> **若该 Focus 所对应的问题已有直接覆盖该问题的 Research Report，则默认进入该 Report；否则进入最相关的 Thesis；若不存在任何可承载该问题的 Research Object，则不展示该 Focus。**

| 优先级 | 规则 |
|---|---|
| R-1 | 默认落点 = **直接回应（directly addresses）该 Focus 问题**的 Research Report（存在时）。「直接回应」= 报告的研究问题与 Focus 问题同一；**禁止为了给 Focus 找落点，强行把泛泛相关的 Report 当落点**（语义污染防线） |
| R-2 | 无直接对应的 Report 时，落点 = 最相关的 Thesis Detail |
| R-3 | 不存在任何可承载该问题的 Research Object 时，该 Focus 不上首页（悬空 Focus = 观点广告，V2-28 §4.2 既有禁令的吸收与扩展） |

**证伪可见性的保持**：V2-28 §4.2 要求每条 Focus 的落地页必须能看到 invalidation。V2-28 §5.2 报告骨架已内嵌 `07 THESIS LINK` + `08 知止 · INVALIDATION` 两节——因此落点为 Report 时该要求**天然满足**，本契约不削弱证伪可见性纪律。

**对 V2-28 §4.2 的正式修正（OD-6 · PASS · LOCK）**：「必备链接：每条必须挂到至少一个 Thesis 或 Map 节点」→「每条必须挂到至少一个 **Research Object**（当前封闭集合：Research Report / Thesis / Map 节点）」。V2-28 仍为 DRAFT，本修正在其 Human Review 时一并确认。

**术语纪律（LOCK）**：**Research Object = 架构术语 / 封闭类型集合，不是新实体。** 禁止由此创建 `ResearchObject` 类型、数据文件、索引层或任何代码形态——否则正面撞上 V2-24 的 Canonicalization 风险。未来新增合法 Research Object 类型时，走既有契约程序扩展该集合，不得泛化为开放枚举。

---

## 4. Semantic Layering Rule（五种语言规则 · OD-7 升级为项目规范 · LOCK）

> **OD-7 裁决：PASS，并提升为项目级内容治理规则。** 它解决的不只是这一次首页重复，而是未来 AI 持续生成内容时最容易发生的问题——**AI 会把「换一种说法」当成新内容，实际上不是。**

### 4.1 语义层定义

任何页面生成内容之前，先判定其属于哪一层，然后**禁止跨层代写**：

```text
OBSERVATION / QUESTION / EVIDENCE / BELIEF / REVISION
```

| 位置 | 语言层 | 回答 | 禁止出现 |
|---|---|---|---|
| NOW | **Observation Language** | 世界刚刚发生了什么？ | 行业总结、Thesis 摘要、判断语言 |
| FOCUS | **Question Language** | 我正在试图搞清楚什么？ | 结论、论证、信念强度 |
| RESEARCH | **Evidence Language** | 我研究发现了什么？ | 信念状态（conviction）、交易含义 |
| THESIS | **Belief Language** | 我现在相信什么、信到什么程度？ | 产业全景复述（那是 Report 的） |
| JOURNAL / WHAT CHANGED MY MIND | **Revision Language** | 什么改变了我的判断？ | 新闻综述、无修正硬造修正 |

### 4.2 执行测试（任何文案过这道问）

> 这句话放到它的 Primary Home 里，会不会一字不改也成立？
> 会 = 重复投影，删或改写。

---

## 5. 首页模块职责锁定表（OD-2～OD-5 裁决落定 · LOCK）

章序维持 2026-08-31 裁决现状（FOCUS → LIVE THESIS → WHAT CHANGED MY MIND → POLARITY → RESEARCH → NOW → WUWEI → END），**不动顺序，只锁职责**。

| 章节 | 唯一问题 | 首页展示深度上限（LOCK） | 深层落点 | 语言层 |
|---|---|---|---|---|
| **FOCUS** | 我正在研究什么？ | 名称 + 一句研究问题（现有 ResearchProductCard 形态保留） | §3.3 路由规则（Report 优先 / Thesis 兜底） | QUESTION |
| **LIVE THESIS** | 我现在相信什么？ | **纯信念状态**：title + conviction + polarity + window + last revised（+ 可选极短状态标签）；**移除 industry 描述与 `conflict.but`**——「为什么这样判断」归 Thesis Detail（OD-4） | Thesis Detail | BELIEF |
| **WHAT CHANGED MY MIND** | 我何时改变过判断？ | Revision 摘要（现状合规，保持） | Journal / Thesis | REVISION |
| **POLARITY** | 节奏读法 | 现状保留不动 | — | — |
| **RESEARCH** | 我研究出了什么？ | **1 份 Featured Research + ALL RESEARCH 出口**；Featured 由内容状态决定当前最值得进入的那一份，不固定「最新」或「最重要」，报告增多后无需改首页架构（OD-3） | Research Report / Research 索引 | EVIDENCE |
| **NOW** | 世界刚发生什么？ | 3–5 条观察，**只准事件/事实/变化**；**链接可经既有 `thesisId` 提供事实→判断的导航捷径，但 NOW 卡片不得预先复述 Thesis 结论**（OD-5） | Observation（链接捷径 → Thesis） | OBSERVATION |
| **WUWEI** | 什么时候不行动？ | 价值观入口（现状合规，保持） | Wuwei 页 | — |
| **END** | 我是谁 | 终幕（现状保留） | — | — |

**三条总规则（本契约最硬的三句话 · LOCK）：**

1. **首页不承担完整内容，只承担 Orientation + Preview + Routing。**
2. **一个主题可以在首页出现多次，但每一次必须改变语义，不得重复解释。**
3. **任何首页模块都不能比其目标页面说得更多。**

---

## 6. Forbidden Structures（防御节 · 含止损线 · LOCK）

| # | 禁止结构 | 禁止理由 |
|---|---|---|
| F-1 | 首页成为第二内容库（任何章节展示目标页的核心正文） | 首页 = 路由层，不是内容层 |
| F-2 | 同一语义跨章重复（两个章节用不同措辞说同一件事） | 语义重复 = 认知成本的真正来源 |
| F-3 | FOCUS 退化为 Research 缩略版 / 文章目录（列标题而不是列问题） | FOCUS = Question Queue / Research Agenda，不是 Output 索引 |
| F-4 | 首页模块的信息量超过其目标页面 | 违反「首页 ≤ 目标页」总规则 |
| F-5 | NOW 承载行业总结 / Thesis 摘要 / 判断语言（含在 NOW 卡片中预先复述 Thesis 结论） | NOW 只负责事实层；判断的唯一 Home 是 THESIS |
| F-6 | 为本契约新建任何实体 / 数据文件 / Schema（Focus Entity、Topic Entity、首页配置数据层等） | Focus 非实体化是 V2-28 LOCK；本契约全部规则落在既有数据域的**呈现层投影**上 |
| F-7 | 新增 / 删除 / 重排首页章节 | 本契约是 Compression，不是 Redesign；章序属 2026-08-31 裁决现状 |
| F-8 | 以「首页状态化」为由删改 Thesis Detail / Report 页任何内容 | 压缩只发生在首页投影层；Canonical 页面是认知资产，只增不损 |
| F-9 | 为去重而删除内容对象（删 Thesis、删 Report、减 Observation） | 去重的对象是重复投影，不是内容本身；内容只准回到自己的 Primary Home |
| F-10 | Topic Entity / Focus Entity / `ResearchObject` Entity / Homepage Content Registry 的任何代码或数据形态 | 本契约的全部规则是呈现层纪律；实体化即违约（V2-24 / V2-28 防线延续，OD-1/OD-6 裁决） |
| F-11 | 自动语义去重系统 / AI 自动判重 / 首页动态推荐算法（含 Featured 的算法化选择） | 去重与 Featured 判断是 Human 职责；算法化会把语言纪律退化为推荐系统 |
| F-12 | 新 CMS / 新 Content Layer | 止损线：V2-29 的边界 = 把首页从内容展示器压缩成认知导航器，到此为止 |

**止损线（Human Review 明令 · LOCK）**：不得因为发现「还有一点重复」就继续开 V2-30 式架构文档。本契约已把问题解决到产品规则层；下一轮问题由**真实使用证据**触发，而不是在架构层预演未来需求——与 C2-B 的克制逻辑同款：先让系统产生真实使用证据，再决定是否继续增加基础设施。

---

## 7. 与既有契约逐项对照

| 契约 | 约束 | 本契约合规性 |
|---|---|---|
| V2-28 · Focus 非实体化（LOCK） | 不建 Focus Entity / Schema / 数据文件 | ✓ §2.1 三层切分把 FOCUS 明确定性为 Derived View；F-6/F-10 双重延续 |
| V2-28 · M-3 Report ↔ Thesis 并行（LOCK） | 非固定父子，Evidence linkage | ✓ §3.2：路由是阅读路径默认值，不声明数据层级 |
| V2-28 §4.2 · Focus 必挂 + 证伪可见 | 落地页必须能看到 invalidation | ✓ §3.3：Report 骨架内嵌 THESIS LINK + INVALIDATION，纪律保持；链接集合扩展经 OD-6 裁决并含术语纪律 |
| 24 号文 · F-10 / Work Deferred | 禁 Work 代码占位 | ✓ 零实体、零数据层，全部规则为呈现层纪律 |
| 04 号文 · HOME SPEC「七章，不得新增」 | 章节数量纪律 | ✓ F-7 延续；本契约不改章序章数 |
| 10 号文 · Observer ≠ Stock Picker | 禁推荐语言 | ✓ Question Language 天然排除「看好/推荐」语义 |
| 15 号文 · Distribution 边界 | 不追热点、不日更 | ✓ Observation Language 与「真·新·大」准入口径一致 |
| 13 号文 · Research Loop v1.0 | 八步不可改 | ✓ 本契约不触碰任何研究生产机制 |

---

## 8. 未来实施验收标准（Contract Requirement → Future Acceptance Criteria）

> 实施任务单（改 `Home.tsx` 及相关文案）必须逐项过以下验收；**未带验收的实施 = 违约实施**。本契约不授权任何代码改动。

| # | 验收项 | 检测方式 |
|---|---|---|
| AC-1 | FOCUS 卡片落点全部符合 §3.3 路由规则（Report 优先且「直接回应」/ Thesis 兜底 / 无承载不上架），无类型混用、无强行挂靠 | 逐卡核对 href、落点页类型与问题对应关系 |
| AC-2 | 首页每章文案过 §4 Semantic Layering Rule：无跨层语言 | 逐章文案审查（人工） |
| AC-3 | 同一主题跨章出现时，每处语义可明确归类为 OBSERVATION / QUESTION / EVIDENCE / BELIEF / REVISION 之一，且互不重复 | 语义映射表核对 |
| AC-4 | 首页任何模块的信息字段集合 ⊆ 其目标页面对应字段集合（LIVE THESIS 卡片已移除 industry 与 `conflict.but`；RESEARCH 章 = 1 份 Featured + ALL RESEARCH） | 字段比对 + git diff |
| AC-5 | NOW 全部条目的标题 + 摘要为事件/事实/变化陈述，无判断语言、不预先复述 Thesis 结论；thesisId 直链保留 | 逐条审查 |
| AC-6 | 零新增实体 / 数据文件 / Schema / 算法（含 Featured 不建字段，人工指定）；改动范围限于 `Home.tsx` 及既有数据域既有字段的消费方式 | git diff 审查 |
| AC-7 | 章序、章节数量、POLARITY / WUWEI / END 零变化 | git diff 审查 |
| AC-8 | 构建通过 + 既有 check-data 断言全绿 | `npm run build` + 数据校验脚本 |

---

## 9. Human Decision Gates 裁决总表（2026-09-01 · 全部落定）

| Gate | 待裁决项 | 裁决 | 落定位置 |
|---|---|---|---|
| OD-1 | Canonical Home Principle | **PASS WITH MODIFICATION**——三层切分（Object / Derived View / Page），原则句升级 | §2 |
| OD-2 | FOCUS 默认落点：Report 优先 / Thesis 兜底 | **PASS**——附加严格化：「直接回应（directly addresses）」标准，禁强行挂靠 | §3.3 |
| OD-3 | RESEARCH 章展示深度 | **PASS**——1 份 Featured Research + ALL RESEARCH；Featured 由内容状态决定，不固定最新/最重要 | §5 |
| OD-4 | LIVE THESIS 首页卡片状态化 | **PASS**——移除 industry 与 `conflict.but`，保留 title / conviction / polarity / window / last revised（+ 可选极短状态标签） | §5 |
| OD-5 | NOW 的 thesisId 直链 | **PASS**——保留直链（Observation → Thesis 是核心认知链的合法导航捷径）；卡片不得预先复述 Thesis 结论 | §5 / F-5 |
| OD-6 | V2-28 §4.2 修正：Thesis/Map → Research Object | **PASS**——附术语纪律：Research Object = 封闭类型集合术语，非新实体 | §3.3 |
| OD-7 | 五种语言规则成文 | **PASS**——升级为项目级 Semantic Layering Rule，禁跨层代写 | §4 |

**Open Questions：**

1. **OQ-1**：FOCUS 落点为 Report 时，卡片 `type` 标签的统一口径（隐去落点类型 / 语义改为「该注意力的当前主载体」）——实施任务单内裁决，不阻塞实施。
2. **OQ-2**：Featured Research 的指定方式——建议：人工指定（任务单或数据注释），**不建 featured 字段、不建算法**（F-11 防线）；实施任务单内落定。
3. **OQ-3**：是否同步修订 04 号文 HOME SPEC 的对应章节描述——倾向：需要，随实施任务单一并处理。

---

## 10. Implementation Gate

```text
Human Review（2026-09-01）PASS WITH LOCKS      ✓ 已完成
      ↓
本文档 v1.0 · LOCKED                           ←—— 当前停在这里
      ↓
08_TASKS/CURRENT_TASK.md 开 Implementation Task
（范围限定：Home.tsx 呈现层 + 必要文案 + 04 号文 HOME SPEC 同步修订）
      ↓
实施
      ↓
§8 验收（AC-1～AC-8）
      ↓
Validation
```

**退出条件（契约级承诺）**：若未来真实使用证据表明「重复」被证伪（例如多章重复出现同一主题反而强化理解），正确动作是**回本契约登记修正**，而不是另起架构文档。

**本契约不授权**：任何代码改动；任何数据改动；任何新实体 / 新页面 / 新导航；对 V2-28 既有 LOCK 项的任何松动；Commit / Push。

---

## 附 · 执行规则遵守声明

```text
☑ 已读 V2-24 / V2-28 全文 / Home.tsx 实码 / CURRENT_TASK.md / V2-04 HOME SPEC 相关节
☑ 未修改任何源码、任何数据；未新增 Entity / Schema / 页面 / 导航；未 Commit、未 Push
☑ Focus 非实体化、Report ↔ Thesis 并行（M-3）、Work Deferred（F-10）全部原样承接
☑ 问题定性为 Presentation Architecture Compression，未滑向 IA Redesign
☑ 章序维持 2026-08-31 裁决现状；压缩只发生在首页投影层，Canonical 页面零触碰
☑ 对 V2-28 §4.2 的修正已经 Human Review 裁决（OD-6 · PASS）并含术语纪律
☑ Human Review 三处修正（OD-1 三层切分 / OD-2 严格化 / OD-7 规范升级）全部落正文，无扩大
☑ 止损线入档（§6 末）：不开 V2-30，下一轮问题由真实使用证据触发
```

---

## 附二 · Human Review 裁决记录（2026-09-01）

> 战略侧对本文档 v0.1-candidate 的 Review 结论：**PASS WITH LOCKS——6 × PASS + 1 × PASS WITH MODIFICATION（OD-1），无 REJECT。**
> Review 纪律遵守：不为 Lock 大改文档、不新增章节、不 redesign F 规则——三处文字级修正落正文 + 本记录即全部变更。

### 修正落定明细

1. **OD-1（唯一 MODIFICATION）**：§2 拆为三层（Canonical Content Object / Derived View / Page-IA），原则句升级为「一个 Canonical Content Object，一个 Primary Home；Derived View 不拥有内容，只负责引用。任何非 Primary Home 的展示位置，只能提供该对象的上下文入口、状态或导航，不得重新承担该对象的完整语义。」——防止 FOCUS 被误读为「暂未实体化的对象」而滑向实体化。
2. **OD-2 严格化**：R-1 由「覆盖该主题」收紧为「直接回应（directly addresses）该 Focus 问题」，禁止强行挂靠泛泛相关的 Report。
3. **OD-6 术语纪律**：Research Object = 架构术语 / 封闭类型集合，禁止实体化为 `ResearchObject` 类型或数据文件。
4. **OD-7 规范升级**：五种语言规则升级为项目级 **Semantic Layering Rule**（OBSERVATION / QUESTION / EVIDENCE / BELIEF / REVISION，禁跨层代写），定位为 AI 内容治理规则。

### Review 确认的架构细节（入档）

```text
              Reality
                 ↓
            Observation
                 ↓
               FOCUS          ← Derived View，不拥有内容
          Question Language
                 ↓
          ┌──────┴──────┐
          ↓             ↓
       REPORT        THESIS    ← 并行 Research Outputs（M-3 不变）
       Evidence      Belief
          │             │
          └──────┬──────┘
                 ↓
             REVISION

FOCUS → REPORT → THESIS 是「用户阅读路径」，不是数据模型。
```

### 止损线（明令 · 已落 §6 末）

全部禁止：Topic Entity / Focus Entity / Research Object Entity / Homepage Content Registry /
自动语义去重系统 / AI 自动判重 / 首页动态推荐算法 / 新 CMS / 新 Content Layer。
**V2-29 的边界 = 把首页从「内容展示器」压缩成「认知导航器」。这件事情完成以后，
通过真实使用观察下一轮问题，而不是继续在架构层预演未来需求。**

### 封板后的战略状态

```text
V2-29 Contract                     ✓ PASS WITH LOCKS → v1.0 LOCKED
Implementation Task（首页呈现层）    ⏸ 待开任务单（08_TASKS/CURRENT_TASK.md）
V2-30 式后续架构文档                 ⛔ 禁止预开——由真实使用证据触发
```

**无代码授权、无数据授权、无 Commit / Push 授权。**

---

**修订记录**

| 版本 | 日期 | 内容 |
|---|---|---|
| v0.1-candidate | 2026.09.01 | 契约候选稿：问题定性（Presentation Compression）+ 实码证据基线 E-1～E-4；Canonical Home Principle；FOCUS → RESEARCH → THESIS → JOURNAL 呈现层路由（与 M-3 兼容性声明）；五种语言规则；首页模块职责锁定表（章序不动）；Forbidden Structures F-1～F-9；验收标准 AC-1～AC-8；Human Decision Gates OD-1～OD-7 + OQ-1～OQ-3；待 Human Review，零代码 / 零 Commit / 零 Push |
| **v1.0 · LOCKED** | **2026.09.01** | **Human Review PASS WITH LOCKS：6 × PASS + 1 × PASS WITH MODIFICATION（OD-1），无 REJECT。修正落定：§2 三层切分 + 原则句升级（OD-1）；§3.3 R-1 严格化为「直接回应」标准（OD-2）；§3.3 Research Object 术语纪律（OD-6）；§4 升级 Semantic Layering Rule 项目规范（OD-7）；§5 四章职责按 OD-2～OD-5 裁决落定（Featured Research / LIVE THESIS 状态化 / NOW 直链保留 + 文案纯洁）；§6 新增 F-10～F-12 + 止损线（禁 V2-30 预开）；§9 转裁决总表；追加附二裁决记录；头部标记 CONTRACT · CANONICAL · V2-29 · v1.0 · LOCKED；零代码 / 零 Commit / 零 Push，Commit 由用户手动控制** |
