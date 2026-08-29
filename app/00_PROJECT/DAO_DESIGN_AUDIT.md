# DAO_DESIGN_AUDIT.md — TradingLabb V2 视觉审计（Phase A · 仅供 Human Review）

> 依据：《Dao × 损 × Minimalism Design Refinement Implementation Brief》（2026-08-29）
> 方法：通读 14 个页面 / 5 个组件 / 全局 CSS / ink 层后的逐元素审计
> 本文件只发现和裁决，不实施。**未经 Human 批准，不进入 Phase B。**

判断标准（Brief §28）：

> 不是「页面有没有变得更漂亮」，而是「页面有没有变得更安静、更清楚、更少、更有秩序」。

---

## 0. 总体判断

TradingLabb 当前的视觉骨架已经相当接近「道」的目标态——发丝线、朱砂单点、衬线/等宽双语字体、无阴影无圆角无渐变。**主要问题不在「多了什么错误的东西」，而在三类系统性冗余**：

1. **中英文机械重复**（违反 Brief §19）——全站最普遍的噪音，几乎每个区块都在用英文复述中文；
2. **装饰性小元素**（违反 §4 损）——圆点、重复状态标签、冗余 CTA 文案，单个无害，累积成噪音；
3. **容器惯性**（违反 §13 朴）——`border + gap-px` 卡片网格被用作默认容器，即使内容用排版就足以表达。

动效层面意外地健康：没有粒子、没有 parallax、没有 hover scale；现存动效大多能回答 §20 的四问。 ink 层（InkTransition / InkCursor / SwipeBack）是既有品牌资产，且 InkTransition 身负挂起债 C11——本轮一律不动。

---

## 1. P0 · 全站设计语言级发现

| # | 发现 | 位置（证据） | Dao 原则 | 建议 | 级别 |
|---|---|---|---|---|---|
| G1 | **中英文整句复述**：中文论断下面紧跟一句全大写英文翻译，信息为零增量 | Home：POLARITY「CHANGE IS NOT LINEAR.」+ 正文整句英译（Home.tsx:116-120）；HOW I THINK「I DON'T PREDICT…」（:154-156）；WUWEI「SOMETIMES THE CORRECT POSITION…」（:257） | 损 · §19「中英文重复表达」 | 删除整句英译；英文只保留在 Canonical term / 导航身份处 | **MUST** |
| G2 | **双 Label 成对出现**：同一区块头用两个 Label 各说一遍（英 + 中） | Journal 01 区头「REVISION · WHAT CHANGED MY MIND」+「认知变化记录」（Journal.tsx:29-30）；02 区头同构（:65-66） | 损 | 每区头只留一个 Label；中文已在内容里，英文留 canonical | **MUST** |
| G3 | **逐行重复的状态标签**： ACTIVE 分区里每一行都挂 `ACTIVE` Label——分区标题已表达，行内标签零信息 | Thesis.tsx:63（BeliefRow） | 损 · §4「两个元素表达同一件事：合并」 | 删除行内 `ACTIVE` Label | **MUST** |
| G4 | **卡片即链接还写「READ →」**：整张卡已是 `<a>`，卡内再印 `READ THESIS →` / `阅读 →` | Home LIVE THESIS 卡（Home.tsx:199）；Essays 列表「阅读 →」（Essays.tsx:34） | 损 | 删除卡内 CTA 文案，hover 态已承担可点击暗示 | SHOULD |
| G5 | **装饰性圆点**：LIVE THESIS 卡右上角 `ink-dot`，无语义无状态 | Home.tsx:179 | 损 | 删除 | SHOULD |
| G6 | **容器惯性**：`border + gap-px` 网格用于一切——包括纯列表（操作地图、七层金字塔、Archive 行），边框墙带来「格子感」而非「秩序感」 | Framework.tsx:20、System.tsx:22、Thesis.tsx:139 等全站 ~15 处 | 朴 · §13「Typography + Space 优先于 Component + Border」 | 单列纵向列表去掉外框，只留 hairline 分隔（Home NOW 行已是这个形态，全站向它对齐）；真正的并列对比（阴阳两面、双循环）保留网格 | SHOULD |
| G7 | **页尾签名行**：ThesisDetail CTA 行右侧 `HSN / LIVE THESIS / {no}` 纯装饰 | ThesisDetail.tsx:281 | 损 | 删除 | OPTIONAL |
| G8 | **Essay 页头部家具偏多**：4 个 Label（date / category / 阅读时长 / HSN·RESEARCH·no）+ subtitle + 作者行，其中「HSN / RESEARCH / {no}」与 category 语义重叠 | Essay.tsx:86-89 | 损 | 删「HSN / RESEARCH / {no}」Label（落款已有署名与 №） | OPTIONAL |

---

## 2. P1 · 页面级审计

### HOME（损 → 虚 的重点）

| # | 现状 | 问题 | 建议 | 级别 |
|---|---|---|---|---|
| H1 | 七章连续 `hairline-t` + 相同的 `py-16/24` 节奏 | 节奏均匀 = 没有节奏（§22：应 Dense↓Space↓Dense↓Space，目前 Dense×7） | 拉开章节间距层级：内容章 24，呼吸章（POLARITY / WUWEI）32-40；终幕前留最大空白 | SHOULD |
| H2 | POLARITY 章：中文论断 + 英文大写 + 正文整句英译 + 可交互仪器 | G1 的典型现场；仪器本身语义成立（阴阳消长） | 删两处英译；仪器保留（见 M2） | **MUST**（文案部分） |
| H3 | HOW I THINK 章：右侧论断「我不预测未来」与封面 h1「观察变化，而非预测未来」语义重复 | 同一页说两遍同一句话 | 删右侧论断，只留 Loop 列表 + CTA | SHOULD |
| H4 | 终幕「反者道之动，弱者道之用」 | §24 警告道德经引文作 UI copy——但此处是品牌落款（与 Essay 朱砂竖线、HSNSeal 同源），且全站仅此一处 | 保留。它是落款，不是装饰 | DO NOT TOUCH |
| H5 | ChapterMark 的英文 note（如「What is changing?」） | 半 canonical 半装饰，但与 zh 标题互补而非重复 | 保留 | DO NOT TOUCH |

### METHOD

| # | 现状 | 问题 | 建议 | 级别 |
|---|---|---|---|---|
| Me1 | 六节结构（循环 → 准入 → 时序 → 证据 → 修正 → 约束） | 结构干净；每节只回答一个问题，符合「静」 | 无需动结构 | DO NOT TOUCH |
| Me2 | Ⅰ 研究循环末行的闭合注记（方块 + 一句） | 小方块是装饰性符号 | 删方块留文字 | OPTIONAL |
| Me3 | Ⅱ 准入三关卡片（grid-3） | 三字并列是真正意义上的对比，网格成立 | 保留 | DO NOT TOUCH |

### FRAMEWORK

| # | 现状 | 问题 | 建议 | 级别 |
|---|---|---|---|---|
| F1 | Ⅰ 操作地图：9 行单列纵向链路，却装在 `border` 外框里 | 它是「一条路」，不是「一张表」——外框把它变成了 Dashboard（§18 FRAMEWORK 禁忌） | 去外框，hairline 分隔即可（G6 头号受益者） | **MUST** |
| F2 | Ⅳ 行动接口 chain 用 `c.split(' ')` 拆中英文渲染 | 同 G6，且拆分逻辑脆弱 | 去外框；顺带把渲染改稳健（不改数据） | SHOULD |
| F3 | Ⅲ 决策 lead 用 `font-black text-4xl` 巨型强调 | 「大标题喊观点」倾向（§6 静） | 降一档（text-2xl/3xl）即可保住分量 | OPTIONAL |

### SYSTEM

| # | 现状 | 问题 | 建议 | 级别 |
|---|---|---|---|---|
| S1 | 全文 9 节（Ⅰ-Ⅸ），是全站最长页 | 知足（§14）边界——但每节都是 V2-26 契约规定的规则容器，**内容不可删** | 不动内容；用 G6 去框 + 间距层级化降低视觉重量 | SHOULD |
| S2 | Ⅱ「机器为什么这样造」内套两个块（ESSENTIALS + THREE） | 信息职责清晰，但视觉上两个独立容器连续出现 | 合并为一个节奏单元（间距代替边框分隔） | OPTIONAL |
| S3 | 赌场心法巨字引用 + 四字心法 + 演进三卡 | 三个「强调区」连续，强调通胀 | 保留内容；赌场语录已是全页唯一巨字，四字心法降为常规字号 | OPTIONAL |
| S4 | 状态机表（仓位上限列） | 真正的表格语义，边框成立 | 保留 | DO NOT TOUCH |

### WUWEI

| # | 现状 | 问题 | 建议 | 级别 |
|---|---|---|---|---|
| W1 | 三节（止损 / 情绪 / 生活），密度低、留白好 | 已是全站最接近「虚」的页面 | 本轮不动，作为其他页的对标基准 | DO NOT TOUCH |

### THESIS（聚合页）

| # | 现状 | 问题 | 建议 | 级别 |
|---|---|---|---|---|
| T1 | 行内 ACTIVE Label | 见 G3 | 删 | **MUST** |
| T2 | ARCHIVE 分区：两个子组各自带 border 容器 | 列表语义，可用 hairline | 随 G6 处理 | SHOULD |
| T3 | BeliefRow 右栏三个右对齐小字（Polarity / HORIZON / LAST REVISED） | 信息都有用，但三行等宽灰字略密 | 不改内容；行距微调即可 | OPTIONAL |

### THESIS DETAIL

| # | 现状 | 问题 | 建议 | 级别 |
|---|---|---|---|---|
| TD1 | 页头 4 Label（no / industry / 更新日期 / LIVE THESIS） | 「LIVE THESIS」与聚合页语境重复 | 删 LIVE THESIS Label | OPTIONAL |
| TD2 | 七节 Label 均为「EN · 中文」双语 | 这些是 canonical term（WHY / EVIDENCE / INVALIDATION），符合 §19 保留条件 | 保留 | DO NOT TOUCH |
| TD3 | CTA 行装饰签名 | 见 G7 | 删 | OPTIONAL |

### JOURNAL

| # | 现状 | 问题 | 建议 | 级别 |
|---|---|---|---|---|
| J1 | 区头双 Label | 见 G2 | 各区只留一个 | **MUST** |
| J2 | Revision 行同时有「prev → curr（+delta）」和「UP/DOWN」标签，方向表达两遍 | 数字箭头已含方向 | 删 direction 标签，保留 delta 着色 | SHOULD |
| J3 | 页尾「错误的修正记录，比正确的预测更值得展示。」 | 一句收束，有信息职责（反 = 系统的一部分） | 保留 | DO NOT TOUCH |

### WORLD（Map / Cycle / Dimensions）

| # | 现状 | 问题 | 建议 | 级别 |
|---|---|---|---|---|
| Wo1 | Cycle 页太极 `slow` 90s 无限旋转 | §20：无限循环动画四问只能答「体现系统逻辑」一半——旋转本身不增加认知 | 去旋转，静态太极即成立（reduced-motion 用户看到的就是静态） | OPTIONAL |
| Wo2 | Dimensions 反方向的钟 2s 走针 | 四问可答「建立状态变化 + 体现系统逻辑」——它是这个概念的演示本身，且已有 reduced-motion 兜底 | 保留 | DO NOT TOUCH |
| Wo3 | 七阶段网格的「— 空 —」占位 | 「空也是信息」是知常的表达，且文案已说明 | 保留 | DO NOT TOUCH |

### ESSAYS / ESSAY

| # | 现状 | 问题 | 建议 | 级别 |
|---|---|---|---|---|
| E1 | Essays 列表「阅读 →」 | 见 G4 | 删 | SHOULD |
| E2 | Essay 页头家具 | 见 G8 | 删一个 Label | OPTIONAL |
| E3 | 阅读进度条（朱砂 2px） | 回答「帮助导航」——长文定位有用 | 保留 | DO NOT TOUCH |
| E4 | 落款（朱砂线 + 署名 + 印章 + №） | 品牌落款，与终幕同源 | 保留 | DO NOT TOUCH |

### NAV / FOOTER

| # | 现状 | 问题 | 建议 | 级别 |
|---|---|---|---|---|
| N1 | 导航分组下拉：中文 label + 英文 label-sm | 英文是导航身份（§19 保留条件） | 保留 | DO NOT TOUCH |
| N2 | Footer 归档树 11 列 | 密，但它是 canonical ARCHIVE_TREE 的直接呈现，且「沉淀为树」本身是内容主张 | 保留 | DO NOT TOUCH |

---

## 3. Motion Reduction Audit（§20 专项）

| 动效 | 位置 | 四问判定 | 裁决 |
|---|---|---|---|
| `[data-reveal]` 10px 浮现 | Home 各章 | 弱通过（建立节奏） | 保留但收敛：仅在章节首元素使用，行内列表不再逐个 reveal —— OPTIONAL |
| PolarityInstrument 旋转 + 指针跟随 | Home | 体现系统逻辑（阴阳消长），且 8-27 刚重设计 | DO NOT TOUCH |
| 太极 90s 无限旋转 | Cycle | 弱 | 去旋转（Wo1） |
| 反方向的钟走针 | Dimensions | 通过 | DO NOT TOUCH |
| clock-cell 墨滴晕开 | Dimensions | 通过（走针的组成） | DO NOT TOUCH |
| `dot-breathe` 朱砂呼吸点 | ink 层 | 未在页面源码中发现活跃使用 | 待 Phase B 确认后清理死代码 —— OPTIONAL |
| InkTransition / InkCursor / SwipeBack | ink 层 | 品牌资产 + C11 挂起债 | **DO NOT TOUCH（硬边界）** |
| hover 反白（btn-line / ink-row） | 全站 | 导航反馈 | DO NOT TOUCH |

---

## 4. 汇总：行动清单（待批准）

**MUST（5 项）**
1. G1 — 删 Home 三处整句英译
2. G2 — Journal 区头双 Label 各留一
3. G3 — Thesis 行内 ACTIVE Label 删除
4. F1 — Framework 操作地图去外框（G6 首站）
5. H2 — POLARITY 章英译清理（同 G1，单列因其为典型现场）

**SHOULD（8 项）**
G4 卡内 CTA 文案 / G5 ink-dot / G6 全站容器收敛 / H1 首页节奏层级 / H3 重复论断 / T2 Archive 容器 / J2 direction 标签去重 / S1 System 视觉减重

**OPTIONAL（10 项）**
G7 / G8 / Me2 / F2 / F3 / S2 / S3 / T3 / TD1 / Wo1 + reveal 收敛 + dot-breathe 死代码确认

**DO NOT TOUCH（硬边界）**
ink 层全部（C11）· PolarityInstrument · 反方向的钟 · 终幕与落款 · 归档树 · 导航双语 · 所有 canonical 内容文本与数据结构 · 状态机表 · 双语 canonical Label

---

## 5. Phase B 建议次序（批准后执行）

1. **损**（MUST 5 项 + G4/G5）：纯删除，不动布局 —— 一个 commit
2. **朴**（G6 容器收敛 + T2 + S1）：边框墙 → 排版秩序 —— 一个 commit
3. **虚**（H1 + S1 间距层级）：节奏与留白 —— 并入 2 或独立
4. **OPTIONAL 批次**：由 Human 从清单中勾选后执行

每步完成后 `npm run check && npm run build && npm run lint`；Kimi 负责 commit，HSN 负责 push。

---

*审计人：Kimi · 2026-08-29 · 本文件不含任何代码变更；批准后逐项实施。*
