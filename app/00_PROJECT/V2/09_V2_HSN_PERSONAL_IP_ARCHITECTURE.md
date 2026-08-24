# V2-09 · HSN PERSONAL IP ARCHITECTURE — V2-07-00 架构审查

> **V2-07-00 产出（2026-08-24）。** 只审计 + 设计，未修改任何生产代码。
> 编号说明：交接文档建议编号 10，V2 目录实际现有 01–08，本文档按实际结构顺延为 09。
> 本文件是 V2-07 后续阶段（Identity / PoV / Body of Work / Distribution）的
> Canonical Contract 候选——经 Review 裁决后生效，冲突记入 06_V2_IMPLEMENTATION_LOG.md。
> 阶段目标（V2-07 交接文档）：从「TradingLabb 是什么产品」切换为
> 「HSN 为什么值得长期被关注」。
> **2026-08-24 战略侧 Review（ChatGPT）已整合，见十三节——该节与上文冲突时以该节为准。**

---

## 一、Architecture Review（现状审计）

### 1.1 审计范围与方法

实码读取（非记忆）：`src/data/domains/` 全部 12 个 domain 文件、`src/data/ledger.ts`、
`domains/site.ts`（SITE / NAV / ARCHIVE_TREE）、V2 文档 01–08 全部、
`08_TASKS/CURRENT_TASK.md`、仓库外 `V2-07-HANDOFF.md`（执行侧交接笔记）。

### 1.2 实码事实（2026-08-24 时点）

| 层 | 实体 | 实码现状 |
|---|---|---|
| Observation | `domains/now.ts` | 5 条 Observation，可挂 `mapNodeId` / `thesisId`；SIGNALS 完整形态挂 C-04 未裁决 |
| Context | `domains/map.ts` / `cycle.ts` / `dimensions.ts` | Map ↔ Thesis 双向结构化已通；polarity 唯一事实源在 `MapNode.state` |
| Thesis | `domains/theses.ts` | **8 个命题全部 active**（compute 72 / ai-app 58 / robot 51 / newenergy 63 / optical-module 60 / memory-cycle 65 / rare-earth 68 / innovative-drug 62）；`status` / `assumptions` / `invalidation` 字段已落地 |
| Revision | `domains/ledger.ts` | Belief Ledger 已建立，append-only，**当前仅 3 条入账**（compute 2026.07.31 / newenergy 2026.07.05 / robot 2026.06.25）；`deriveCurrentBelief()` 为唯一派生入口 |
| Narrative | `domains/journal.ts` | 7 个日期组；conviction 字段已迁出，仅经 `thesisId` 叙事关联 |
| Essay | `domains/essays.ts` | 6 篇（世界观×2 / 市场观 / 系统 / 研究 / 心法）；`related[]` 仅栏目级（G-05 挂起） |
| Worldview | `domains/manifesto.ts` | 六公理 + closing，全站最稳定的世界观文本 |
| Method | `domains/system.ts` / `framework.ts` / `wuwei.ts` | 七层金字塔、信号分层、If-Then、止损与情绪——Method 已经产品化 |
| Author | `domains/site.ts` | **HSN 仅作为字符串存在**（`SITE.author: 'HSN'` + Header lockup 字面量 + Footer 落款）；无实体、无 About 页、无署名体系数据层 |

### 1.3 审计结论

**V2 已经把 Method 建成了产品，但还没有把 Author 建成实体。**

具体三个断层：

1. **Identity 断层**：HSN 在产品里是署名，不是结构。`site.ts` 里只有一个 `author` 字符串；
   NAV 的 HSN 组下只有 MANIFESTO 一个子项（03 号文件已预留 ABOUT 缺口，标注「V2-07 阶段新建」）。
   「HSN 到底是谁」目前没有任何产品落点。
2. **PoV 断层**：Point of View 实际已经存在——散落在 MANIFESTO 六公理、Essays 世界观类、
   System/Framework 的方法文本里——但没有被正式命名为「PoV 层」，
   访客无法回答「这个人看世界的一贯立场是什么」。
3. **Distribution 断层**：02 号文件 §10 已定策略（站内 = Canonical Archive，外部 = Distribution Layer），
   但没有任何执行层设计：首发平台、同步纪律、内容裁剪规则全部空白。

**正面事实**：V2-06 建立的 Ledger / Thesis / Revision 体系，恰好是 Personal IP 最稀缺的原料——
「可验证的修正记录」。多数个人 IP 只有观点流；TradingLabb 已经有观点的**版本历史**。
V2-07 不需要新建认知系统，只需要让「作者」在这个系统里变得可辨认。

---

## 二、Core Thesis（核心论断）

交接文档的定义成立，本审查予以确认并加固：

> **Personal IP = 长期可验证的 Method + Body of Work + Author Identity**
> Content 是结果，Belief 是中间状态，Method 才是核心资产。

五条推论（V2-07 全部后续决策必须能回溯到其中之一）：

1. **Method 不缺，Author 缺。** System / Framework / Wuwei / Thesis / Ledger 已构成完整方法论产品。
   V2-07 的主战场不是再加方法内容，而是建立 Author 层——让方法有一个可辨认的主人。
2. **Identity 是数据实体，不是 About 页面。** 页面只是投影；先立数据契约，页面自然生成。
   这从根本上防止 Identity 退化成简历（交接文档禁止事项）。
3. **PoV 与 Thesis 必须分离。** PoV 是慢变量（世界观公理，年以年计）；
   Thesis 是快变量（可证伪命题，周以周计）。两者混为一谈会让世界观被证伪机制污染，
   或让命题失去修正纪律。
4. **Body of Work = Ledger 的时间积分。** 认知资产不按「内容篇数」组织，
   按「可验证记录」组织：命题注册表 + 修正账本 + 结业档案（closed / invalidated）。
   8 个 active 命题 + 3 条 Revision 是起点，密度目标沿用 02 号文件：20+ Thesis / 50+ Revision / 100+ Observation。
5. **Distribution 是单向管道。** 站内是 canonical，外部是 projection；
   外部平台的反馈、热度、选题逻辑**永不回流**影响研究系统。
   Distribution 不生产新事实，只搬运已有事实。

---

## 三、十二问速答（交接文档 §16 的逐项回应）

| # | 问题 | 审查结论（详见对应章节） |
|---|---|---|
| 1 | Identity 如何定义 | 数据实体 `Author`：HSN = Founder · Observer · Researcher（沿用 02 号文件 §3，升级为正式契约）。见四节 |
| 2 | Point of View 是什么 | 「产业认知 × 交易纪律」的双系统视角——用产业命题形成信念，用交易系统决定行动，用无为连接两者。MANIFESTO 六公理是其公理化表达。见五节 |
| 3 | 已形成的 Thinking System | OBSERVE → MAP → THINK → THESIS → ACT/DON'T ACT → REVISE → ARCHIVE（02 号文件 §6），数据层已对应 NOW/MAP/THESIS/LEDGER。见五节 |
| 4 | IP 与研究如何解耦又互增 | 解耦：研究系统只认证据，IP 层只搬运结果；互增：每一次 Revision 同时是站内资产与分发素材。见七节 |
| 5 | Body of Work 资产结构 | 三层：ACTIVE BELIEFS（在持命题）/ ARCHIVE（结业档案）/ METHOD（方法文本）。见六节 |
| 6 | Distribution 如何设计 | Canonical-first 单向管道 + 编辑纪律（选题只能来自 Ledger/Thesis/Observation）。见七节 |
| 7 | 哪些内容永久存在 | PoV（Manifesto）、Method（System/Framework/Wuwei）、Thesis Registry 全量（含 closed/invalidated）、Ledger 全量、Essays。见六节 |
| 8 | 哪些周期性更新 | Observation（滚动）、Journal（事件驱动）、Thesis conviction（证据驱动）、WHAT I BELIEVE NOW（月度，派生）。见六节 |
| 9 | 哪些进 Ledger | 仅 conviction 事件：up / down / confirm（维持也是判断）。PoV 修订、方法迭代、生活感悟**不进 Ledger**。见六节 |
| 10 | 哪些永不进产品 | 实盘持仓与资金曲线、实时行情、社交指标（粉丝/点赞/订阅数）、个人生活流水、为分发平台定制的流量内容。见六节 |
| 11 | 是否需要 Canonical Data Model | 需要，但极小：`Author` 一个实体 + 既有实体复用，默认派生、默认不新建。见四节 |
| 12 | V2-07 增什么、不增什么 | 增：Author 实体、PoV 正名、Body of Work 呈现规格、Distribution 纪律、月度 Belief 快照机制。不增：About 简历页、Newsletter、社交墙、第三阴阳图形、任何行情/新闻流。见九节 |

---

## 四、Data Architecture（数据架构）

### 4.1 裁决建议：Personal IP 需要 Canonical Data Model，且只有一个新实体

沿用 V2-06 纪律：「一个事实只允许一个 Source of Truth；默认派生，默认复用。」

```ts
// domains/identity.ts（V2-07-01 候选，本阶段不实现）
export interface Author {
  id: 'hsn'
  name: string              // 'HSN'
  roles: string[]           // ['Founder', 'Observer', 'Researcher']——02 号文件 §3 裁决，禁扩 Investor/Trader/Analyst/Expert
  signature: string         // 'Observe change. Update beliefs.'——02 号文件 §9 长期核心句
  since: string             // 研究/交易起始年（ tenure 锚点，如 '2019'——具体值待用户确认，OD-2）
  oneLiner: string          // 「HSN 如何观察世界」的一句定义（Identity 叙事锚点）
  brand: {
    canonical: 'TradingLabb'          // 不变
    lockup: 'trading-lab by HSN'      // 视觉 lockup，已解耦（site.ts HEADER_LOCKUP 注释）
  }
}
```

**设计理由：**

- 现状 `SITE.author: 'HSN'` 是字符串；Footer / Header / 未来 About / 分发署名各写各的，
  必然漂移。`Author` 实体把「人」变成与 Thesis / Ledger 同等级的一等公民。
- 实体刻意**不含**：bio 简历字段、社交链接数组、头像路径、粉丝数——
  这些要么违反禁止定位（简历式 Profile），要么是 Distribution 层的事，不进 canonical 数据。

### 4.2 PoV 不需要新实体——MANIFESTO 即 PoV Registry

MANIFESTO 六公理（创造与交易 / 计划与应变 / 概率与确定性 / 价格即共识 / 风险优先 / 道法自然）
已经是结构化数组、稳定编号、低频变更——**事实形态上它就是一个 PoV 注册表**。

裁决建议：不新建 `pov.ts`。V2-07 只在叙事层正式命名：
`MANIFESTO = HSN Point of View Registry`，公理条目即 PoV 条目。
PoV 修订走文档纪律（改 manifesto.ts 需任务单授权），**不进 Ledger**——
Ledger 只收 conviction 事件，世界观公理的演化用 Essay 记录叙事。

### 4.3 WHAT I BELIEVE NOW 不需要新实体——Ledger 派生 + Journal 叙事

02 号文件 §9 的月度栏目（3 more confident / 2 less confident / 1 changed mind）
三个数字全部可由 Ledger 窗口查询派生：

```text
moreConfident  = Ledger 窗口内 direction = up 的命题（按 delta 排序取前 3）
lessConfident  = Ledger 窗口内 direction = down 的命题（取前 2）
changedMind    = Ledger 窗口内方向反转或 status 变更的命题（取 1）
```

**硬约束：快照的数字部分禁止手工填写**——必须从 Ledger 派生，
防止月度栏目退化成脱离账本的表演（风险 R-4）。叙事部分（为什么）作为 Journal 条目入账，
经 `thesisId` 关联，不复制事实。

### 4.4 Source-of-Truth Matrix 增量（追加到 08 号文件四节）

| 实体 / 字段 | Owner 文件（候选） | 分类 | 说明 |
|---|---|---|---|
| Author（name/roles/signature/since/oneLiner） | `domains/identity.ts`（新） | **Source of Truth**（自身） | 全站署名、About、分发署名唯一事实源 |
| PoV 公理 | `domains/manifesto.ts` | **Source of Truth**（自身，正名为 PoV Registry） | 慢变量，不进 Ledger |
| WHAT I BELIEVE NOW 数字 | Ledger 派生查询 | **Derived** | 禁止持久化、禁止手填 |
| WHAT I BELIEVE NOW 叙事 | `domains/journal.ts` | **Source of Truth**（叙事层） | 经 thesisId 关联，不复制 conviction 事实 |
| 分发内容 | 无（站外） | **Projection** | 从站内实体裁剪生成，禁止回流写入任何 domain |

---

## 五、Information Architecture（信息架构）

### 5.1 原则：V2-07 不新增一级页面，只点亮既有缺口

03 号文件预留的两个缺口即 V2-07 的 IA 主战场：

| 缺口（03 号文件五节） | V2-07 处置建议 |
|---|---|
| HSN / ABOUT 页不存在 | **Identity 页**——不是简历，是「What HSN uniquely sees」的叙事页，数据全部投影自 `Author` + PoV + Ledger 统计。路由候选 `#/hsn` 或 `#/about`（OD-3） |
| NOW 独立页不存在（C-04 未裁决） | **维持挂起**——NOW 暂由首页 ACT I 承接的现状不动；SIGNALS 裁决不属于本阶段 |

HSN 导航组的目标形态（过渡态允许，机制零新增）：

```text
HSN
 ├── IDENTITY      What HSN uniquely sees.（新，V2-07-0x）
 └── MANIFESTO     Point of View Registry.（已有，叙事层正名）
```

### 5.2 Identity 与首页的关系

首页七章已冻结，不动。Identity 页与首页的分工：

- 首页回答「这个**系统**在做什么」（NOW → POLARITY → HOW I THINK → …）；
- Identity 页回答「这个**人**为什么值得长期关注」——同一批数据，换一个主语。
- 二者经 Footer / HSN 导航组互链，不互相嵌套内容（防双源）。

---

## 六、Content Lifecycle & Body of Work（内容生命周期与资产结构）

### 6.1 四档生命周期（回答十二问 7/8/9/10）

| 档位 | 内容 | 更新机制 | 实码落点 |
|---|---|---|---|
| **永久（Permanent）** | PoV 六公理；Method（System / Framework / Wuwei）；Thesis Registry 全量（含 closed / invalidated）；Ledger 全量；Essays | 修订需任务单授权；Ledger append-only | manifesto / system / framework / wuwei / theses / ledger / essays |
| **周期（Periodic）** | Observation（滚动 3–5 条）；Journal（事件驱动）；Thesis conviction（证据驱动）；WHAT I BELIEVE NOW（月度，派生） | 证据或日历触发，无强制频率上限以外的纪律 | now / journal / ledger |
| **Ledger 专属** | 仅 conviction 事件：up / down / confirm | 现实出现新证据才入账；同日多条允许（Rule 01） | ledger.ts |
| **永不进产品（Forbidden）** | 实盘持仓与资金曲线；实时行情；社交指标（粉丝/点赞/订阅）；个人生活流水；为分发平台定制的流量内容；BUY/SELL 建议 | ——（交接文档 §15 + 02 号文件 §12 双重禁止） | 不建实体、不建页面 |

特别说明「实盘持仓永不进产品」：公开持仓会把 Observer 人设拖向 Stock Picker 人设
（02 号文件 §12 禁止定位），并引入合规风险与跟单噪音。**判断公开，操作不公开。**

### 6.2 Body of Work 三层资产结构

```text
BODY OF WORK
│
├── ACTIVE BELIEFS     在持命题注册表（现状 8 个 active）
│                      「我现在相信什么」——含 conviction / horizon / invalidation
│
├── ARCHIVE            结业档案（closed / invalidated）
│                      「我曾经相信什么、现实如何裁决」——Epistemic Track Record，
│                      绝不删除，不做失败案例墙（08 号文件 OD-4 裁决）
│
└── METHOD             方法文本（System / Framework / Wuwei / PoV）
                       「我如何形成与修正判断」——最难被复制的层
```

时间维度（沿用 02 号文件 §13）：一年后 Ledger 是资产，三年后是信誉，五年后本身就是履历。
**Body of Work 的呈现规格（含 ARCHIVE 分区）属 V2-07-03，本阶段只立结构。**

---

## 七、Personal IP Flywheel & Distribution（飞轮与分发）

### 7.1 飞轮

```text
        ┌──────────────────────────────────────────────┐
        ↓                                              │
   IDENTITY（我是谁）                                   │
        ↓                                              │
   POINT OF VIEW（我一贯怎么看世界）                    │
        ↓                                              │
   METHOD（我如何形成判断）                             │
        ↓                                              │
   OBSERVATION → THESIS → REVISION（认知循环，V2 已建成）│
        ↓                                              │
   BODY OF WORK（可验证记录的时间积分）                  │
        ↓                                              │
   DISTRIBUTION（单向投影到站外）                       │
        ↓                                              │
   新读者 → 新质询 → 新观察（反馈只进 Observation，不进结论）┘
```

**飞轮的燃料是 Revision。** 每一次修正同时产生：
站内资产（一条 Ledger 记录）+ 分发素材（「什么改变了我」是最天然的个人 IP 内容）。
这就是 Personal IP 与 Investment Research「解耦又互增」的机制（十二问 4）：
研究系统只认证据；IP 层只搬运已经入账的结果。

### 7.2 Distribution 设计（单向管道）

沿用 02 号文件 §10：`External Platform → Discovery → TradingLabb → Permanent Archive`。

**编辑纪律（防反向污染的三条铁律）：**

1. **选题只能来自站内**：Ledger 新条目 / Thesis 更新 / Observation 积累——
   禁止根据平台热点反向选题。
2. **裁剪不创造**：分发内容是对站内事实的删减与转译，
   不得出现站内不存在的判断、数字或持仓暗示。
3. **指标不回流**：平台数据（阅读/点赞/涨粉）不进入站内任何页面与决策；
   站内永不展示社交指标。

**平台优先级建议（OD-4 待裁决）：**

| 平台 | 适配内容 | 备注 |
|---|---|---|
| X / Twitter | Revision 短帖（「我改变了什么 + 为什么」）、Observation | 英文 signature 天然适配；个人 IP 国际面 |
| 即刻 | 同上中文版；过程感强，契合「展示过程而非结果」 | 中文互联网研究者密度高 |
| 小红书 | PoV / Method 的图文转译（无为、止损、阴阳） | 泛受众入口，只做引流不做沉淀 |
| 微信公众号 | Essay 全文转载 + 月度 WHAT I BELIEVE NOW | 长文存档的第二落点 |
| Newsletter / Podcast / Video | **暂缓** | 02 号文件已禁 Newsletter 商业产品；认知资产密度达标前不开新渠道 |

---

## 八、Risks（风险登记）

| # | 风险 | 等级 | 缓解 |
|---|---|---|---|
| R-1 | Identity 页退化成简历式 Profile | 中 | 数据实体不含 bio 字段（4.1）；页面规格阶段用 AC 拦截（十一节） |
| R-2 | Distribution 反向污染研究系统（为流量选题） | 高 | 7.2 三条编辑纪律；选题溯源检查——每条分发内容必须能指向站内 thesisId / revisionId / observationId |
| R-3 | IP 层稀释研究密度（写作时间挤占研究时间） | 中 | 密度目标前置（02 号文件：20+ Thesis / 50+ Revision / 100+ Observation）；V2-07 不新增任何日更义务 |
| R-4 | 月度 WHAT I BELIEVE NOW 退化成表演 | 中 | 数字部分强制 Ledger 派生，禁止手填（4.3）；某月无 Revision 则该月停刊——「没有修正也是记录」 |
| R-5 | 实体膨胀（每个新概念都建新 domain） | 低 | 本审查全程默认复用：PoV 用 manifesto、快照用 Ledger 派生、叙事用 journal——只新增 identity.ts 一个实体 |
| R-6 | Author 实体字段被渐进加料（社交链接、头像、简历条目……） | 低 | 4.1 明确「不含」清单；check-data 可加字段白名单断言（V2-07-01 定） |
| R-7 | 「HSN 是谁」定义过满，锁死未来 5–10 年演化空间 | 低 | oneLiner 只定义「如何观察」，不定义「观察什么领域」；roles 沿用 02 号文件三角色，禁扩不禁改叙事 |

---

## 九、Open Decisions（交 ChatGPT / 用户裁决）

1. **OD-1 · Author 实体落地**：批准新建 `domains/identity.ts`（4.1 schema）？
   还是主张扩展 `site.ts`（本审查反对——SITE 是站点配置，Author 是内容实体，混放会重蹈 journal/Ledger 双源覆辙）？
2. **OD-2 · tenure 锚点**：`Author.since` 的具体起始年份，由用户提供（本审查不猜测）。
3. **OD-3 · Identity 页路由与命名**：`#/hsn`（人）还是 `#/about`（用户语言）？
   03 号文件原则「Semantic Clarity > Conceptual Purity」倾向 `/about`，
   但 HSN 组已用人名命名，二者皆可——需裁决。
4. **OD-4 · 首发分发平台**：X / 即刻 / 小红书 / 公众号 的启动顺序与首批内容形式。
5. **OD-5 · PoV 正名方式**：MANIFESTO 页面 Hero 是否加「POINT OF VIEW」kicker
   （沿用 03 号文件 kicker 机制，零新组件）？还是仅文档层正名、页面不动？
6. **OD-6 · WHAT I BELIEVE NOW 首刊时点**：Ledger 当前仅 3 条、覆盖 3 个命题——
   首刊是等 Ledger 覆盖更厚，还是以「Ledger 现状如实派生」为原则尽快首发？
   本审查倾向后者（如实是品牌资产），但需确认停刊规则（R-4）可接受。
7. **OD-7 · Newsletter 维持禁令？** 02 号文件将 Newsletter 商业产品列入 V2 禁止项；
   V2-07 是否维持？本审查建议维持（密度未达标），待裁决确认。

---

## 十、V2-07 Roadmap（建议，待裁决后排期）

| 阶段 | 目标 | 是否改代码 | 前置 |
|---|---|---|---|
| **V2-07-00** | 本文档：Personal IP Architecture Review | 否 | —— |
| V2-07-01 | Identity Contract：`domains/identity.ts` 数据契约 + check-data 字段白名单断言（设计稿 + 数据层，不动页面） | 是（纯数据层） | OD-1 / OD-2 裁决 |
| V2-07-02 | PoV 正名：MANIFESTO 叙事层升级为 Point of View Registry（kicker 或文档层，按 OD-5） | 视裁决 | V2-07-01 |
| V2-07-03 | Body of Work 呈现规格：ACTIVE BELIEFS / ARCHIVE 分区规格（衔接 08 号文件 OD-4 已定语义） | 设计稿 | V2-07-02 |
| V2-07-04 | Identity 页实施：`#/about` 或 `#/hsn`，全部投影自既有实体 | 是 | V2-07-01/03，OD-3 |
| V2-07-05 | Distribution Layer 启动：编辑纪律成文 + 首发平台首批内容（按 OD-4） | 否（运营） | 可与 03/04 并行 |
| V2-07-06 | WHAT I BELIEVE NOW 首刊：Ledger 派生 + Journal 叙事（按 OD-6） | 视实现 | Ledger 机制就绪 |

**顺序原则**（沿用 V2 先例）：先契约后呈现；不在 Identity 数据层就绪前做页面；
commit / push 必须用户明确授权；push 前必做 Pre-Push Audit。

---

## 十一、Acceptance Criteria（V2-07 全阶段验收预留）

| AC | 标准 |
|---|---|
| AC-01 | HSN 署名信息在全站只有一个事实源；grep 不到第二处硬编码的 roles / signature |
| AC-02 | Identity 页所有内容可溯源到 `Author` / PoV / Ledger / Thesis 实体，无页面私藏事实 |
| AC-03 | 无简历式字段（教育/职业履历/头像墙）；无社交指标；无 BUY/SELL 语义 |
| AC-04 | WHAT I BELIEVE NOW 数字部分 100% 由 Ledger 派生；无 Revision 的月份如实停刊 |
| AC-05 | 每条分发内容可指向站内 thesisId / revisionId / observationId（选题溯源） |
| AC-06 | 阴阳图形仍 ≤2；首页七章零改动；V2 冻结页面零改动 |
| AC-07 | `npm run check` 全量通过；build / lint 无新增 error；CDP 实测沿用 V2-05 验证纪律 |
| AC-08 | G-08 / G-05 / InkTransition 既有债保持挂起，不被顺手修 |

---

## 十二、本阶段纪律复述（交接文档 §15）

在 Architecture Review 通过裁决之前：

不修改 Homepage；不新增阴阳图形；不加 Newsletter / Social Wall / About 页 / 简历式 Profile /
粉丝点赞订阅 Dashboard；不重新设计 V2 已冻结页面；不修 G-08 / G-05 / InkTransition；
不 commit、不 push——等 Review。

---

## 十三、战略侧 Review 整合与裁决记录（2026-08-24）

> 来源：用户转交的战略侧 Review《V2-07-00 · HSN Personal IP Architecture Review》（ChatGPT）。
> 效力声明：**本节与一～十二节冲突时，以本节为准；与 V2 已冻结文档（02 号等）冲突时，
> 不直接生效，记入 13.6 待用户裁决清单。** 本节为裁决记录，不改动任何生产代码。

### 13.1 阶段性结论（正式采纳）

战略侧对 V2-07-00 的四句收敛结论，本文件正式采纳为阶段定论：

1. **TradingLabb 是 HSN 思考方式的公开记忆**（the public memory of how HSN thinks）。
2. **Research 是认知生产系统，Personal IP 是认知身份与长期资产层。**
3. **Revision 是连接 Research 与 Personal IP 的核心桥梁。**
4. **真正的 Personal IP 不是「我说过什么」，而是「我长期如何思考，以及现实如何证明、修正和丰富这种思考」。**

阶段命名升级：**V2-07 = HSN Author System，不是 HSN Personal Brand System。**
Personal Brand 的目标是「让更多人知道 HSN」；Author System 的目标是「让时间证明 HSN 是怎么思考的」。

**V2-07 最高判断标准（后续所有设计的准入闸门）：**

> 任何新增能力，都必须回答：它是否让我们更清楚地知道 HSN 如何观察、如何判断、
> 如何修正，以及这些行为如何随时间形成不可替代的认知资产？
> 回答「不」的东西，即使对个人品牌有帮助，也不进入核心产品。

### 13.2 Core Thesis 公式升级

二节的加法公式被战略侧精炼为**乘法公式**，正式替换：

> **Personal IP = Identity × Method × Evidence × Time**

乘法理由：缺 Identity → 谁都可以做；缺 Method → 只是观点；
缺 Evidence → 只是自我叙事；缺 Time → 无法证明稳定性与进化。任一因子为零则整体为零。

### 13.3 对我方提案的裁决对照

| 议题 | 本文件原提案（节） | 战略侧裁决 | 处置 |
|---|---|---|---|
| 核心公式 | 加法（二节） | 乘法：Identity × Method × Evidence × Time | **替换**（13.2） |
| Identity 定义法 | 数据实体先行（三节） | 「不要发明 HSN 的个人品牌，要从 HSN 已经反复做过的事情中发现 HSN」；Identity 四层：Role / Lens / Obsession / Method | **采纳加固**——抽取而非发明，与本文件实码审计方法一致 |
| Author roles | Founder · Observer · Researcher（沿用 02 号文件 §3 冻结裁决） | Observer / Researcher / **Builder**，明确排除 Investor | **冲突**——触及已冻结的 02 号文件 §3，转用户裁决（OD-A） |
| IP 数据模型 | 只新增 `identity.ts` 一个实体（4.1–4.3） | 六实体轻量模型：Person / Principle / Method / Theme / Work / Evidence；Distribution 仅消费层 | **替换**——但受战略侧硬约束「不得再造与 Thesis/Ledger 平行的内容系统」：六实体是**引用/索引层**，Thesis 不属于 IP 核心实体、留在 Research System，`Work` 经 id 引用 Research Objects。4.2/4.3 的派生纪律（MANIFESTO 数据落点不变、快照禁手填）保留，作为 Principle/Work 的实现细则 |
| PoV 形态 | MANIFESTO 即 PoV Registry（4.2） | POV Stack：Worldview → Principles → Questions → Lens → Method → Judgment；现阶段**不写宏大人生宣言**（Body of Work 尚薄） | **采纳为叙事框架**——Stack 是上层结构，MANIFESTO 仍是其数据落点，两者不冲突 |
| Worldview 提炼 | 未展开 | 四条：Reality is dynamic / Knowledge is provisional / Contradictions are information / Time reveals structure | **采纳**——与阴阳系统、Ledger 纪律实码互证，非新发明 |
| Body of Work | 三层：ACTIVE / ARCHIVE / METHOD（6.2） | 五层：PRINCIPLES / METHODS / THEMES / WORKS / **PROOF** | **替换**——PROOF 层是最关键增量：「过去怎么判断，现在怎么看」；**Revision Ledger 本质就是 IP Proof System**，V2 已意外建成个人 IP 最重要的基础设施 |
| 内容生命周期 | 四档：永久/周期/Ledger 专属/禁止（6.1） | 四类：Permanent / **Slowly Evolving** / Dynamic / **Ephemeral** | **替换**——新增两类的关键规则：Slowly Evolving 走 **Version 而非覆盖**；Ephemeral（X 帖/小红书/即刻/短视频等分发碎片）**永不成为核心产品真相源** |
| 更新节奏 | 月度 WHAT I BELIEVE NOW（4.3） | Daily-Weekly Observation / Monthly Research-Thesis / Quarterly Revision-Synthesis / Yearly Method-Principle Review | **采纳为节奏框架**——把 IP 从「内容发布机制」锚定为「认知迭代机制」；月度快照机制保留，纳入 Monthly 档 |
| Ledger 准入 | 仅 conviction 事件（十二问 9） | 「只有会改变未来判断状态的信息才进 Ledger」——含 Thesis 开立/结业、invalidation、关键证据、重大修正 | **采纳措辞**——内涵一致，外延更清晰；新闻/观点/随手记录/社媒转发/情绪表达永不入账 |
| 禁止清单 | 十二问 10（持仓/行情/社交指标/生活流水） | 四分类：Vanity Layer（粉丝/浏览/点赞/资产规模/炫耀收益率）· Algorithm Layer（热点榜/Trending）· Performance Theatre（每日收益/P&L 炫耀）· Identity Noise（简历堆砌/无关私人动态） | **采纳**——更完整；核心理由：这些东西把 Attention 从 Method 拉向 Persona Performance，而站内最稀缺资产是 Cognitive Integrity |
| 战略判断 | Revision 是飞轮燃料（7.1） | **Revision History 是护城河本身：Cognitive Memory Moat**——文章/观点/网站/Method 表面形式都可模仿，长期连续真实带时间戳的修正历史不可复制 | **升级为核心战略判断** |
| 飞轮 | 7.1 单向管道飞轮 | 见 13.5 定稿飞轮 | **替换** |
| Identity 页 | OD-3 候选 `#/about` 或 `#/hsn`（5.1，路线图 V2-07-04） | **现阶段 No-Go**：About / Profile / Resume 明确列入不新增清单；「不要因为 Personal IP 这个词就本能地增加 About 页面」 | **撤回**——第一阶段只增架构资产、不增 UI；OD-3 关闭 |
| Roadmap | 7 阶段（十节） | 5 阶段（13.7） | **替换** |

### 13.4 新增风险登记（并入八节，编号续接）

| # | 风险 | 等级 | 缓解 |
|---|---|---|---|
| R-8 | Personal IP 被做成 Personal Homepage（About/Bio/Resume/Contact/Social Links） | **P0** | Identity 必须进入 Method 而非 Resume；现阶段 About 类页面整体 No-Go |
| R-9 | Personal IP 被内容化（不断堆 Essays/Posts/Newsletter，退化为 HSN Content CMS） | **P0** | 新增内容必须能挂进 PRINCIPLES/METHODS/THEMES/WORKS/PROOF 五层之一；挂不进的不生产 |
| R-10 | Distribution 污染 Research（平台热点反向决定研究方向） | **P0** | 7.2 三条铁律 + 战略侧方向锁：Observation → Research → Belief → Canonical Work → Distribution，绝不反向 |
| R-11 | Method 只有口号没有 Proof（「第一性原理」「长期主义」式空词） | P1 | 每条 Method 必须可见 Principle → Method → Work → Revision 全链；链不全的不上站 |
| R-12 | IP Model 复制 Research Model（在 IP 层重建 Thesis/Journal/Revision/Belief） | P1 | 六实体只做引用；check 层面未来可断言 IP 实体不持有 conviction 字段（V2-07-03 定） |
| R-13 | Body of Work 无时间维度（只剩「最佳文章」合集） | P1 | 每个 Work 呈现必须携带「当时怎么想 → 后来发生什么 → 为什么改变」时间链 |

### 13.5 飞轮定稿（替换 7.1）

```text
        OBSERVE
           ↓
        RESEARCH
           ↓
        BELIEVE
           ↓
         ACT / WRITE
           ↓
         REVISE
           ↓
      ACCUMULATE
           ↓
      FORMALIZE METHOD
           ↓
       BODY OF WORK
           ↓
       DISTRIBUTE
           ↓
     ATTRACT ATTENTION
           ↓
    BETTER OBSERVATIONS
           ↺
```

飞轮最关键段不是 Distribution，而是：

```text
Revision → Method → Body of Work  =  Compounding Intellectual Capital
```

这是 HSN Personal IP 真正的复利机制。外部反馈只进 Observation（更好的观察问题），
**永不直接进入结论层**。

### 13.6 剩余 Open Decisions（原九节收敛后的现行清单）

| # | 议题 | 状态 |
|---|---|---|
| **OD-A** | Author roles：02 号文件 §3 冻结的 `Founder · Observer · Researcher` 是否改为战略侧提议的 `Observer / Researcher / Builder`？**触及 V2 已冻结品牌文档，必须用户本人裁决**（本文件无立场，两案各有依据：Founder 强调「这个系统是我建的」，Builder 强调「我在持续建造方法」） | 待用户 |
| **OD-B** | `Author.since`（tenure 锚点）具体起始年份 | 待用户提供 |
| **OD-C** | Core POV 工作版本是否确认为「Understand reality by observing change, testing beliefs, and updating through evidence.」？战略侧附注：可作工作版本，**不立刻变成首页大标语** | 待用户 |
| **OD-D** | Newsletter：现阶段维持禁止（No-Go 清单在列）；远期定位仅为「阶段性思想总结」分发界面（Delivery Layer，非 Knowledge Layer） | 待用户确认 |
| ~~OD-1~~（原） | 单实体 identity.ts | **关闭**——被六实体轻量模型替换（13.3） |
| ~~OD-3~~（原） | Identity 页路由 `#/about` vs `#/hsn` | **关闭**——页面本身现阶段 No-Go |
| OD-4/5/6（原） | 首发分发平台 / PoV kicker / 首刊时点 | **顺延**——随 V2-07-04（Distribution Architecture）与后续阶段再议，本阶段不裁决 |

### 13.7 V2-07 Roadmap 定稿（替换十节）

战略侧裁决的五阶段路线图，正式替换十节：

| 阶段 | 目标 | 产出 | 是否改代码 |
|---|---|---|---|
| **V2-07-00** | Personal IP Architecture Review（本阶段，已完成） | 本文件 + 本节裁决记录 | 否 |
| V2-07-01 | **HSN Identity & POV Constitution** | HSN Identity Constitution / HSN POV Constitution / HSN Principles 三份架构文档 | 否（架构资产） |
| V2-07-02 | **HSN Method Architecture** | 把 V2 隐含的 Method 显性化（Observe / Context / Frame / Test / Believe / Revise / Reflect），目标是「让别人理解 HSN 怎么思考，而不只是看到 HSN 想了什么」 | 否（架构资产） |
| V2-07-03 | **Body of Work Architecture** | Research Objects → Intellectual Assets 的映射；Theme → Work → Evidence → Method 关系；六实体数据模型定稿 | 设计稿，数据层待定 |
| V2-07-04 | **Distribution Architecture** | Canonical Source → Platform Adapter；最后才进入 X / 小红书 / Newsletter / Podcast / Video | 否（运营架构） |

顺序原则：先 Constitution，再 Method，再 Body of Work，最后 Distribution——
**架构资产先行，UI 后置**；每阶段完成经 Review 后再进入下一阶段；
commit / push 必须用户明确授权。

---

## 十四、OD 终裁与 V2-07-00 封板记录（2026-08-24 · 用户裁决）

**四项 Open Decisions 全部闭环：**

| Decision | 最终裁决 |
|---|---|
| **OD-A** | Author roles 维持 `Founder · Observer · Researcher`（02 号文件 §3 冻结裁决不变；战略侧 Builder 提议否决） |
| **OD-B** | `Author.since = 1998` |
| **OD-C** | Core POV 工作版本确认（见 11 号文件），**不作为首页大标语** |
| **OD-D** | Newsletter 当前 No-Go；远期仅作为 Distribution Interface（Delivery Layer，非 Knowledge Layer） |

**V2-07-00 正式封板，ARCHITECTURE BASELINE LOCKED。锁定七条：**

1. Author Identity 不改：`Founder · Observer · Researcher`；
2. `Author.since = 1998`；
3. TradingLabb = HSN 思考方式的公开记忆；
4. V2-07 = HSN Author System；
5. Personal IP 核心公式：Identity × Method × Evidence × Time（乘法）；
6. Cognitive Memory Moat = Revision History；
7. Newsletter 不是 Research System，也不是当前产品能力。

**阶段状态：**

```text
V2-07-00  HSN Personal IP Architecture Review     ✅ 封板（本文档）
V2-07-01  HSN Identity & POV Constitution          进行中——产出：
          10_V2_HSN_IDENTITY_CONSTITUTION.md
          11_V2_HSN_POV_CONSTITUTION.md
          12_V2_HSN_PRINCIPLES_CONSTITUTION.md
```

---

## 十五、V2-07-01 Review 裁决记录（2026-08-24 · PASS WITH LOCKS）

战略侧对 V2-07-01 三份宪章（10/11/12 号文件）的 Review 结论：**PASS WITH LOCKS**——
架构内容封板、可以 commit；commit 前锁定四条 Architecture Invariants。

**四条 Architecture Invariants（10/11/12 号文件共同遵守，长期有效）：**

| # | 不变量 | 等价表述落点 |
|---|---|---|
| **AI-01** | Personal IP ≠ Research System——六实体（Person/Principle/Method/Theme/Work/Evidence）只能引用、聚合、解释、索引，不能复制 | 本文件 13.3 数据模型裁决行 |
| **AI-02** | Thesis 永远属于 Research System；Revision 永远属于 Ledger；Current Belief 永远由 Research System 派生 | 本文件 13.3；08 号文件 Rule 02（deriveCurrentBelief 唯一入口） |
| **AI-03** | 原则约束行为，而不保证结果（Principles constrain behavior; they do not guarantee outcomes）——禁止「Thesis 错了 → Principle 也错了」的层位混淆 | 12 号文件三节（本次 Review 补写显式句） |
| **AI-04** | 所有 Identity / POV / Principle 变更只走 versioned amendment，禁止 silent overwrite——认知架构也应该有 Revision History | 10/11/12 号文件各自的修订纪律节 |

**本次 Review 触发的三处加固（已执行，均为文档内编辑）：**

1. 12 号文件三节补写 AI-03 显式句（Principle 规定如何研究 / Thesis 规定当前相信什么 / Evidence 决定是否需要 Revision）；
2. 10 号文件 `since = 1998` 语义锁：**identity metadata，不是 `investment_start_year`**——
   任何 UI/文案不得解释为「1998 年开始投资/研究市场」，除非未来有明确证据并经任务单授权；
3. 10/11/12 号文件头部统一加注状态标签 **CANONICAL · V2-07-01 · LOCKED**。

**Review 确认的既有正确裁决（不改，仅记录）：** Identity ≠ Biography；五条 X over Y POV 的
防双源核查；「被证伪 ≠ 违背原则」升级为 V2-07 核心原则；PROOF 层闭环 R-11；
POV-04（polarity 禁止字段化）是必须保持的硬约束——Polarity 是观察框架，不是事实属性；
Identity Page / Newsletter / UI 改动维持 NO-GO。

**Commit 授权：** 纯架构文档 commit，不混入代码/格式化/lint/backlog 修复；
commit message 采用战略侧推荐 `docs(v2): establish HSN identity, POV and principles`；**不 Push**。

**阶段状态：**

```text
V2-07-00  LOCKED
V2-07-01  LOCKED
        ↓
V2-07-02  HSN Method Architecture——回答「How does HSN actually think?」
```
