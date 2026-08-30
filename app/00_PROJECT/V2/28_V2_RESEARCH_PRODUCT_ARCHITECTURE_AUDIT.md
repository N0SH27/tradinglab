# V2-28 · RESEARCH PRODUCT ARCHITECTURE AUDIT — 研究产品架构审计

> **状态：DRAFT · HUMAN REVIEW REQUIRED（2026-08-30）**
> 本轮**零代码、零数据改动、零新实体、零新 Schema、零新页面、零 Commit、零 Push**。
> 上游契约：V2-01～V2-27（重点：03 IA / 10 Identity / 13 Method / 14 Body of Work / 15 Distribution / 23 C2 / 24 C2-A Contract / 27 ARK Benchmark Audit），全部 LOCKED 或 DRAFT 在审。
> 触发：用户对 V2-27 的产品层级追问——**Thesis 是认知（允许怀疑），不是"我最看好的东西"；旗舰产品应是行业/公司研究报告 + 周期复盘（周/月/季/年报）**；并对 ARK Research Center 的 UX（左侧分类 / 卡片 / 图文 / 动效 / To Top）提出借鉴意向。
> 本文件回答一个问题：**Focus → Research Report → Thesis → Journal → Annual Review → Distribution 这条链如何在不违反任何 LOCKED 契约的前提下成立，以及 Research 应以什么形式进入现有 V2 IA。**
> 最终原则：**先 Audit，不预设最终模型；Publication ≠ Work；防 Architecture Asset 过早变成 Product Feature。**
> **Human Review（2026-08-30，第一轮）：OD-1 ✅ / OD-2 ✅ / OD-3 ✅·MODIFIED / OD-4 ✅ 启动（选题：国产算力链）/ OD-5 ✅ / OD-6 ✅。**
> **Human Review（2026-08-30，第二轮）：17 项裁决（6 项 LOCK）+ 三项修改（M-1 周报三分 / M-2 Annual 降级 Candidate / M-3 Report↔Thesis 并行）已落正文。**
> 两处架构修正已按裁决落实（修正 1：Focus 定义，§4.1；修正 2：Canonical Research Content 语言，§5.1），完整裁决记录见文末「附二」「附三」。

---

## 1. Executive Summary

**一句话结论：Thesis ≠ Focus ≠ Research Report 的概念分离成立，且与 LOCKED 架构完全兼容——但实现路径不是"新增"，而是"正名"：Focus 是派生视图（不建实体），Research Report 是未来的 Canonical Content 类型（内容先行），Annual Review 是真正的旗舰节奏产品。**

七个关键判断：

1. **概念分离裁决：ACCEPT。** Thesis 承载可证伪判断（65% 相信 / 35% 怀疑是合法状态），认识论上它不是"最看好的东西"。把它品牌化为旗舰会诱导读者把命题读成推荐——这违反 10 号文 Observer ≠ Stock Picker 的边界。**由此正式修正 V2-27 §6 的 P0-3/T-1 建议**（见 §2.4）。

2. **"Focus"不能是行业清单实体——那会正面撞上 24 号文 F-5**（Theme 禁止 taxonomy 化：AI / Semiconductor / Robotics / Energy 恰是契约里点名的退化形态）。合法解法（OD-3 修改后批准）：**Focus = HSN 当前研究注意力的非实体化声明/视图**——现有 Research Objects（active Thesis / Map / Observation / Journal）只能提供**候选依据**，最终语义由 HSN 当前研究意图决定。Human Intent → Evidence → Focus，而不是 Data → Algorithm → Focus。**Focus 是声明，不是计算。**

3. **Research Report 是本轮唯一的真 BUILD**，但它的合法形态是**新的 Canonical Research Content 类型**（与 essays.ts 同级的 Research Object），**不是 14 号文的 Work 实体**——Work 在 24 号文中是 Deferred Entity，F-10 明文禁止任何代码占位。边界：**Report = 内容真相（可以建）；Work = 引用索引层（继续 Deferred）。**

4. **节奏裁决（第二轮 Review 修正后）：年报 > 季报 > 月报 > 周报——但这是合理假设，不是已验证的产品规律。** Annual Review 定位 = **Long-term Product Candidate**（不提前旗舰化：真正有价值的年报需要足够长的时间序列，资产尚未形成）；周报按 Review 裁决三分：**Weekly Research Processing（KEEP，TRACK-A 既有设计）/ Weekly Research Synthesis（KEEP，继续验证其形态）/ Newsletter 式热点周报（NO-GO，撞 15 号文）**——周度是生产机制，年度才是候选旗舰，公开的 Newsletter 节奏不存在。

5. **IA 裁决：现在不新增任何导航项。** 03 号文 §8 结构纪律：新栏目上线前必须回答"它沉淀为树的哪一枝"。正确顺序是**内容先行**——第一份报告先以纯内容形态存在（工作区 MD 或既有 Essay 载体），积累 ≥3 份后再裁决 Research 的 IA 落点（§7 给出三选项）。

6. **ARK UX 五项借鉴裁决**：To Top = STEAL（纯工具）；卡片元信息 = ADAPT（研究机构语言，不用"阅读时间"）；图文结合 = ADAPT（**视觉即研究结构**，代码绘制产业链图，不引入摄影图片）；左侧分类 = DEFER（内容规模不够时是空架子）；动效 = ADAPT（"动表达变化，静表达判断"——但 DESIGN.md 禁令全部保留，任何新动效走宪法修订）。

7. **每份报告必须内嵌 WHAT WOULD CHANGE MY MIND**——这是与普通券商研报、ARK 报告的真正分界，也把报告接进 Ledger 纪律（报告 → Thesis → Revision 纵向链，14 号文 F-3）。

---

## 2. 概念分离审计：Thesis / Focus / Research Report / Review

### 2.1 四层定义与认识论地位

| 层 | 回答 | 认识论地位 | 现有载体 | 实体判定 |
|---|---|---|---|---|
| **Observation** | 世界在变什么 | 事实记录（真·新·大 准入） | now.ts（5 条） | ✅ 已存在 |
| **Thesis** | 我现在如何理解一个问题 | 可证伪判断（允许怀疑/反证/失效） | theses.ts（8 个，8/8 带 invalidation） | ✅ 已存在 |
| **Focus** | 我的研究注意力现在集中在哪里 | **注意力声明**（不是信念，不是推荐，不是计算结果） | 无独立载体——HSN 声明，Research Objects 佐证 | ❌ **不建实体**（§4） |
| **Research Report** | 我对一个行业/链条/公司完整研究出了什么 | 结构化研究作品 | 无——Essay 是最接近载体但骨架不同 | 🔶 **未来 Canonical Research Content 类型**（§5） |
| **Periodic Review**（季/年报） | 这段时间我看过什么、什么成立、什么被修正 | 认知档案（复盘的产品化） | 无——TRACK-A 周报在工作区侧 | 🔶 **未来内容产品**（§6） |

### 2.2 四层之间的关系（正名后的链条）

```text
OBSERVATION（世界在变什么）
    ↓
FOCUS（注意力集中在哪里）—— 非实体化声明：HSN 意图为主，Research Objects 提供候选佐证
    ↓
RESEARCH（研究行为本身）
    │
    ├────── RESEARCH REPORT（完整研究出了什么）
    └────── THESIS（我相信/怀疑什么）
              │
              └──── Evidence linkage ────┘
              （Report 与 Thesis 是并行的 Research Outputs，
                经证据互相连接，不是固定父子关系——M-3）
    ↓
LEDGER / REVISION（什么改变了我的判断）
    ↓
PERIODIC REVIEW（季/年报：这段时间的认知档案）
    ↓
BODY OF WORK（14 号文：纵向作者性证据）
    ↓
DISTRIBUTION（15 号文：永不直连 Belief）
```

**与 V2-25 边界矩阵的一致性核验**：Focus 不持有信念（✓，它是注意力声明）；Report 不持有信念（✓，信念唯一所有权域仍是 Research 域 Thesis/Ledger）；**Report 与 Thesis 是并行 Research Outputs（第二轮 Review · M-3）**——Report 可以支持 / 质疑 / 更新已有 Thesis，也可以提出未来值得进入 Research Loop 的问题，但两者不是固定父子关系（研究可以先有命题再写报告验证，也可以先有研究再形成命题）；连接经 Evidence，且 Distribution 永不反向改变 Belief。

### 2.3 与 14 号文 Canonical Themes 的关系（关键划界）

| 概念 | 定义 | 数量纪律 | 用户看到什么 |
|---|---|---|---|
| **Canonical Theme**（14 号文 LOCKED ×4） | 长期**问题**（如「政策意志与产业能力之间的距离，如何度量？」） | ≤6，Admission Test 五问 + 增一退一 | 当前不在 UI 展示（14 号文 Review 特别确认 4：防过早产品化） |
| **Focus**（本轮正名候选） | 当前**注意力**（如「国产算力链」「存储周期」） | 3–5 个，随研究实际流动 | 首页/未来 Research 区的入口模块 |

**Theme 问"什么问题值得研究十年"；Focus 问"我现在在看什么"。** 两者正交：一个 Focus 可以服务多个 Theme（国产算力链同时服务 T-01 范式定价与 T-03 政策-能力剪刀差）；Focus 会漂移，Theme 几乎不动。**Focus 的行业命名是合法的（它是注意力，不是 Theme），但绝对禁止把 Focus 清单反向注册为 Theme。**

### 2.4 对 V2-27 的正式修正登记

> V2-27 仍是 DRAFT，以下修正在 Human Review 时一并生效，无需 amendment 程序：

| V2-27 条目 | 原建议 | 修正后 |
|---|---|---|
| P0-3 / T-1 | Thesis 聚合页 intro 升级为品牌语言（旗舰化方向） | **撤回旗舰化方向。** Thesis 保持"信念注册表"的系统语言——注册表的诚实（含怀疑与证伪）本身就是品牌；旗舰职责移交 Research Report / Annual Review 层。intro 文案可微调但不承担旗舰功能 |
| OD-6（Thesis 旗舰化方向确认） | 待裁决 | **改为否决候选**：Thesis 不旗舰化；替代方案见本文 §5/§6 |
| Q-1（旗舰品牌句式） | 开放 | 转移至 Research 层回答 |

V2-27 其余全部结论（System 损、首页出口修正、道字治理、视觉审计）不受影响。

---

## 3. LOCKED 契约逐项对照

| 契约 | 约束 | 本轮方案的合规性 |
|---|---|---|
| 14 号文 · AI-07 | Body of Work ≠ Publication Archive | ✓ 报告发布 ≠ 自动成为 Work；每份报告单独过 3-Year Test |
| 14 号文 · AI-08 | Work ≠ Canonical Research Object，禁复制 | ✓ Report 本身就是 Research Object（内容真相），不存在复制问题 |
| 14 号文 Review 确认 4 | 不因已有模型就马上在 UI 展示 Theme Registry | ✓ 本轮不提议 Theme UI；Focus 是另一概念 |
| 24 号文 · F-5 | Theme 禁止行业/板块 taxonomy 化 | ✓ Focus ≠ Theme（§2.3）；**若 Focus 被注册为实体则违约——故裁决不建实体** |
| 24 号文 · F-10 | Work 禁止任何代码占位 | ✓ Report 是内容类型（essays.ts 同级先例），不是 Work 索引层 |
| 24 号文 · R-1～R-6 | 关系层预锁 | ✓ Report → Thesis 的关系沿用既有先例（observation.thesisId / journal.thesisId 自由文本→id 链接），不建关系表 |
| 15 号文 | 不做 Newsletter、不日更、不追热点；Distribution 永不直连 Belief | ✓ 节奏审计 §6；周/月报不进公开发布节奏 |
| 10 号文 · 4.1 | 判断公开，操作不公开；Observer ≠ Stock Picker | ⚠️ **最大风险位**，见 §9 R-1；Focus/Report 的语言纪律必须成文 |
| 03 号文 · §8 | 新栏目必须回答"沉淀为树的哪一枝" | ✓ §7 三个 IA 选项均给出树的落点 |
| 13 号文 | Research Loop v1.0 八步不可改 | ✓ Report 是 Loop 的产出物，不改任何步骤 |
| DESIGN.md | 视觉禁令全集 | ✓ §8.4 动效裁决全部在禁令内 |

---

## 4. Focus 审计

### 4.1 定义（OD-3 修改后批准 · 修正 1 落定）

> **Focus = HSN 当前研究注意力的非实体化声明/视图。它可以由 active Thesis、Map、Observation、Journal 等现有 Research Objects 提供候选依据，但不是一个由算法计算出的 canonical fact。**

核心原则（Human Review 裁决原文吸收）：

```text
Research System 可以告诉 HSN：「哪些地方正在发生研究活动。」
但只有 HSN 可以决定：「我现在真正把注意力放在哪里。」

Human Intent → Research Evidence / Existing Objects → Focus
而不是：Data → Algorithm → Focus
```

理由：**Attention ≠ Data Intersection。** 数据交集只能反映"研究活动发生在哪里"，不能反映"注意力将要转向哪里"——HSN 可以在算力数据最热时决定转去研究存储，Focus 必须能立刻跟随意图，而不是被滞后数据锚定。机器记录认知，机器不拥有认知。

形式化（与 V2-25 G.1 同构但有意弱化派生关系）：`Focus = HumanIntent × Evidence`。它是声明，不是计算；**不建 Focus Entity / Schema / 数据文件**；注意力漂移不留痕（留痕的是判断，不是注意力）。四个不等式随定义锁定：**Focus ≠ Theme / ≠ Thesis / ≠ Recommendation / ≠ Stock Selection**——它只回答"我现在在研究什么"。

### 4.2 首页 INTRO/FOCUS 模块审计（回应用户问题 1）

用户提议：首页放"我特别看好的概念行业及板块"。**修正为：首页放"我当前重点研究什么"**——一词之差，是 Observer 与 Stock Picker 的分界。

| 设计约束 | 内容 |
|---|---|
| 数量 | 3–5 个（克制即信号） |
| 每条结构 | 名称 + 一句研究问题（不是一句看多理由） |
| 必备链接 | 每条必须挂到至少一个 Thesis 或 Map 节点；**悬空 Focus = 观点广告，禁止** |
| 语言纪律 | 用"研究/观察/跟踪"，禁用"看好/推荐/配置"；不出现 ticker、目标价、买卖语义 |
| 证伪可见 | 每条 Focus 的落地页必须能看到 invalidation（经 Thesis 链接天然满足） |

示意（非定稿文案）：

```text
FOCUS · 我正在研究什么

01  国产算力链
    政策意志与产业能力的剪刀差，如何在出货数据里显形？

02  存储周期
    价格与基本面的背离，这一次走到哪里了？

03  …

→ EXPLORE RESEARCH
```

### 4.3 与 NOW 章的重叠风险

NOW（首页第一章）回答"世界在变什么"（外部事实）；FOCUS 回答"我在研究什么"（内部注意力）。两者边界必须在设计上显式化，否则用户无法区分。**裁决：FOCUS 模块只有在 ≥3 份 Research Report 存在、有真实落点可链时才进入首页**——在此之前它只会重复 NOW 与 LIVE THESIS 的内容。列为 P2，与 §7 的 IA 裁决联动。

---

## 5. Research Report 审计

### 5.1 资格判定：能否成为 Canonical Research Content 类型？（修正 2 落定）

> **语言纪律（OD 裁决）：统一使用 Canonical Research Content，禁止使用 Canonical Work 指称报告。**
> Research Report = 正式研究内容 / Research Object；Work = Body of Work 的上位组织概念，
> 在 24 号文中维持 Deferred Entity。报告的存在不得产生 works.ts / Work type / Work ID /
> Work relationship engine / Work CMS / Work index layer 中的任何一个——24 号文 F-10 不变。

过 14 号文 3-Year Test（以《中国 AI 算力基础设施产业链研究》为例）：

| 测试 | 判定 | 依据 |
|---|---|---|
| T1 Persistence | ✓（有条件） | 产业链结构、竞争格局、周期位置三年有效；**前提：写作纪律 = 写结构不写新闻**（价格点位、单季数据进 Observation/Journal，不进报告正文） |
| T2 Authorship | ✓ 高 | 佩雷斯标尺、景气×估值双层、政策-能力剪刀差是 HSN 独创分析框架——去掉 HSN 不成立 |
| T3 Evidence | ✓ | 报告是 Method 的完整实战记录 |
| T4 Revision | ✓ | 报告 → Thesis → Ledger 修正链；报告自身修订走 C4 Essay Versioning 同款纪律 |
| T5 Reusability | ✓ | 被 Thesis / Map / Annual Review 引用 |

**裁决：资格充分，但实施顺序 = 内容先行（§5.4）。**

### 5.2 报告骨架（候选，融合 ARK 研报结构与道字双层语言）

```text
RESEARCH REPORT

Executive Summary          —— 一页结论
01  观 · OBSERVE            我看到了什么（事实层，真·新·大）
02  常 · STRUCTURE          产业链结构：什么东西没有变
03  FRAME                   核心矛盾：虽然……但是……
04  Key Drivers             驱动力与传导链
05  Landscape               格局：谁在什么位置
06  玄 · UNCERTAINTY        什么仍然未知
07  THESIS LINK             本报告支撑/修正哪些命题（id 链接）
08  知止 · INVALIDATION     WHAT WOULD CHANGE MY MIND
09  损 · CONCLUSION         删掉一切之后，真正重要的变量
────────────────────────
Revision Log               —— 本报告的修订留痕
```

纪律：**道字锚点密度**——报告属长文 Canonical Work，与 Essays/WUWEI 同级（自由/显性哲学层），允许每章一个锚点；英文现代术语永远在场（双层语言，V2-27 §9.3）。

### 5.3 公司报告：单独划线

用户提到"行业和公司报告"。**行业/产业链报告先放行；公司报告延后并加边界：**

- 公司报告最容易滑向荐股（target price / rating 语言）；
- 合法形态：公司在**链条中的位置**（What it does / Where it sits / Why it matters / What changes the thesis），不写估值结论、不写买卖建议；
- 候选门槛：第一份公司报告必须能挂到既有 Thesis，且自带 invalidation。

### 5.4 实施顺序（内容先行，防 IA 先行）

```text
STEP 0（纯内容，零代码）   在工作区用 MD 写报告 #0（试点）
                          —— 验证：能否过 T1 写作纪律？篇幅/骨架是否成立？
STEP 1（载体裁决）         报告 #0 评审后二选一：
                          a) 暂以 Essay 载体发布（body 支持 p/h/quote，够用但无图表）
                          b) 裁决建立 reports.ts（新 Canonical Research Content 域，走任务单）
STEP 2（≥3 份之后）        才裁决 IA 落点（§7）与首页 FOCUS 模块（§4.3）
```

**原则：先有作品，再有栏目；先有问题，再有分类。**

---

## 6. 节奏审计：周 / 月 / 季 / 年报

| 节奏 | 裁决 | 依据 |
|---|---|---|
| **周报** | **三分（第二轮 Review · M-1）** | **Weekly Research Processing = KEEP**（TRACK-A 既有设计：工作区侧、Human Review Gate 之外）；**Weekly Research Synthesis = KEEP，继续验证**（Weekly Raw Material + Canonical Research + Thesis State + Journal + Map Context → 研究合成：强化的判断 / 受挑战的判断 / 修正候选 / 开放问题——它是 Research Artifact，不是 Newsletter，不得污染 Canonical Data）；**Newsletter 式热点周报 = NO-GO**（"本周市场发生了什么"= 追热点，撞 15 号文）。可能的健康形态：周度研究（生产机制）→ 季度公开研究总结 → 年度 Research Review（候选旗舰）。 |
| **月报** | **DEFER** | 一个月尺度上产业结构很少发生值得成文的变化；月报容易退化为"为了更新而更新"。月度修正已由 Journal/Ledger 自然承载。 |
| **季报** | **P2 候选** | 与产业验证节奏（出货/招标/财报季）同频；合法形态 = **季度认知复盘**（哪些判断成立/失败/待验证），不是季度市场综述。首份季报应在一年的 Ledger 积累之后。 |
| **年报** | **Long-term Product Candidate（第二轮 Review · M-2：不提前旗舰化），P1** | Annual Research Review 很可能成为最重要的长期产品之一，但"年 > 季 > 月 > 周"目前只是**合理假设，不是已验证的产品规律**——真正有价值的年报需要足够长的时间序列（成立的命题 / 失败的命题 / 修正的记录 / 删除的东西），资产仍在形成中。功能角色对应 Big Ideas 的"年度认知档案"位，天然符合 反/损/观/常；但旗舰地位只能由连续产出证明，不能由架构提前授予。 |

**年报骨架（候选）：**

```text
TRADINGLABB ANNUAL RESEARCH 2026

01  观 · 今年世界变了什么（Observation 年选）
02  FOCUS 回顾 · 注意力去了哪里，对错如何
03  THESIS 年度状态 · 成立 / 被证伪 / 存续 全登记
04  反 · WHAT CHANGED MY MIND（年度修正全录）
05  损 · 今年删掉了什么（规则/关注/命题）
06  RESEARCH 作品登记（当年 Reports/Essays）
07  常 · 明年仍然值得研究的问题
```

**关键纪律：无修正亦可发。** 一年没有大修正本身就是记录（WUWEI 的年度形态）；禁止为了年报好看而制造修正。

---

## 7. IA 审计：Research 如何进入 V2 IA

### 7.1 三个选项

| 选项 | 结构 | 树的落点（03 号文 §8） | 评价 |
|---|---|---|---|
| **A · JOURNAL 组扩展** | JOURNAL = 日志 / 文集 / 研报 | ARCHIVE_TREE 新增 Research 枝（与 Essays 并列） | 最低熵，但 JOURNAL 组语义是"修正史"，研报是"作品"，同组略勉强 |
| **B · THESIS 组扩展** | THESIS = 命题 / 方法 / 框架 / 系统 / 研报 | 同上 | 研报是 Research Loop 的产出，归属合理；但 THESIS 组已有 4 子项，认知—行动系统（V2-26 方案 A）的组语义会被稀释 |
| **C · 一级 RESEARCH** | 独立一级导航 | 独立枝 | 最像 ARK，导航熵最高；V2-27 §8.2 曾否决——但当时否决的是"空壳 Research Center"，**有 ≥3 份真实报告后重估是合法的** |

### 7.2 裁决建议

**现在：不选。** 导航零改动，报告 #0 走 §5.4 STEP 0/1。
**触发条件：≥3 份报告发布后**，重开本轮裁决——届时倾向 **A 的变体**（JOURNAL 组正名为"作品与修正"语义）或 C，取决于报告与 Essays 的实际差异度。
**首页 FOCUS 模块**（§4.3）与 IA 裁决同一时点生效。

---

## 8. ARK Research Center UX Benchmark 逐项裁决

| # | 特征 | 裁决 | 说明 |
|---|---|---|---|
| 8.1 | **左侧内容分类** | **DEFER** | 分类是内容规模的函数。<6 份内容时的左侧分类 = 空架子。触发条件与 §7 相同；且分类轴必须是**研究对象类型**（Industry / Company / Review），不是 Theme（24 号文 F-5），不是体裁堆砌（Articles/Videos/Podcasts 是 ARK 的媒体结构，不是研究结构） |
| 8.2 | **卡片：大图 + 标题 + 元信息** | **ADAPT** | 卡面元信息用研究机构语言：`INDUSTRY · 2026 Q3 · CANONICAL RESEARCH`，不用"阅读时间"（内容平台语言）。**图不是摄影图**——TradingLabb 无摄影传统，卡面视觉 = 研究结构缩略图（产业链图/周期位置图，代码绘制，纸墨语言） |
| 8.3 | **图文结合** | **ADAPT（强烈支持）** | 原则：**视觉即研究结构，不是装饰。** 产业链图、生命周期图、Thesis 结构图全部由代码绘制（SVG），沿用纸/墨/朱砂/深水蓝令牌。禁止为"图文结合"引入 stock photo——那是另一个网站 |
| 8.4 | **动效** | **ADAPT（极小剂量）** | 采纳原则句：**"动，用来表达变化；静，用来表达判断。"**（候选入 DESIGN.md，待裁决）现状：data-reveal 滚动显现、墨入水转场已存在且合规。新增候选仅限：产业链节点连接、周期阶段迁移、图表数据显现——**逐案走任务单**；DESIGN.md 禁令全集保留（首屏动效/粒子/3D/视差/无限循环 全部继续禁止） |
| 8.5 | **Back to Top** | **STEAL** | 纯 UX utility，无品牌含义。长页（System 页、未来报告页）受益。形态：右下角静默文字钮，朱砂仅 hover 态（符合朱砂规则第 2 类交互状态）。与返回=收束系统无冲突。**列入 P1，可与任意授权任务顺带实施** |
| 8.6 | **长文阅读（章节再分级 + 锚点）** | **已有，KEEP** | Essay 已有 p/h/quote 结构 + 文首锚点目录；报告页复用同一机制即可，零新组件 |

---

## 9. 风险登记

| # | 风险 | 严重度 | 缓解 |
|---|---|---|---|
| R-1 | **Stock Picker 漂移**：Focus/报告被读成推荐（"特别看好的板块"） | **高** | §4.2 语言纪律成文；Focus 必须挂 Thesis/invalidation；无 ticker/目标价/买卖语义；disclaimer 维持 |
| R-1b | 公司报告比行业报告更接近荐股 | 中高 | §5.3 单独划线，先行业后公司 |
| R-2 | **内容跑步机**：周/月发布节奏自我绑架 | 高 | §6 裁决：公开节奏 ≤ 季度；无修正亦可发；15 号文不动 |
| R-3 | **IA 先行**：栏目先于作品 | 中 | §5.4/§7 触发条件（≥3 份）硬性化 |
| R-4 | **Theme 污染**：Focus 行业清单被误注册为 Theme | 中 | §2.3 划界成文；Focus 永不进数据层 |
| R-5 | **Work 实体偷渡**：把报告索引做成 Work 层 | 中 | 24 号文 F-10 继续有效；报告 = 内容域（essays.ts 同级），索引需求未出现 |
| R-6 | **写作纪律失守**：报告退化为新闻综述（T1 失败） | 中 | §5.4 STEP 0 试点报告先过 3-Year Test 再谈载体 |
| R-7 | 动效请求借"ARK 借鉴"复活已否决方向 | 低 | §8.4 原则句 + 逐案任务单；DESIGN.md 禁令不动 |

---

## 10. KEEP / STEAL / ADAPT / REDUCE / BUILD / DEFER

**KEEP**：Thesis 注册表定位（系统语言即诚实）；Research Loop v1.0；Essay 长文机制（锚点目录）；TRACK-A 周报 Processing Layer 定位；15 号文分发边界；Theme Registry 不上 UI。

**STEAL**：Back to Top（纯工具）；年报的"十年连续性"资产逻辑（不是 Big Ideas 的形式，是它的功能）。

**ADAPT**：卡片元信息（研究机构语言）；图文结合（视觉即研究结构，代码绘制）；动效（动=变化，静=判断，极小剂量）；ARK 研报骨架（融入道字双层语言）。

**REDUCE**：月报（砍）；Newsletter 式周报（NO-GO，Weekly Synthesis 保留并继续验证）；"看好"语言（砍，换"研究"语言）；V2-27 的 Thesis 旗舰化建议（撤回，§2.4）；Annual Review 的"旗舰"称谓（降级为 Candidate，M-2）。

**BUILD（全部内容先行，无一需要立即写代码）**：Research Report 内容类型（试点 #0）；Annual Research Review（Candidate，2026 年末为自然试点节点）；Focus 声明式视图（内容成熟后）。

**DEFER**：左侧分类；IA 落点裁决（≥3 份触发）；首页 FOCUS 模块；公司报告；Theme UI；Work 实体（24 号文既有 Deferred）。

---

## 11. P0 / P1 / P2 / DEFER Roadmap

### P0（本轮唯一行动层，且全部不是代码）
| # | 项 | 性质 |
|---|---|---|
| P0-1 | Human 裁决概念分离（§2）与 V2-27 修正登记（§2.4） | 决策 |
| P0-2 | Focus 语言纪律与 Report 写作纪律成文（§4.2 / §5.2 / §5.3）——可并入设计宪法修订 | 文档 |
| P0-3 | **报告 #0 试点**：工作区 MD 写第一份产业链研究报告，过 3-Year Test 评审 | 纯内容 |

### P1
| # | 项 |
|---|---|
| P1-1 | Annual Research Review 2026 试点（Candidate 定位：年末自然节点，纯内容起手；旗舰地位由连续产出证明，不由架构授予） |
| P1-2 | Back to Top（随任意授权任务顺带实施） |
| P1-3 | 报告载体裁决（Essay 暂载 vs reports.ts 新域，§5.4 STEP 1） |

### P2
- 季度认知复盘首发；首页 FOCUS 模块；IA 落点裁决（§7）；左侧分类；研究结构图组件（产业链/生命周期 SVG）；动效候选逐案评估。

### DEFER
公司报告；月报；Newsletter 式周报（NO-GO）；Theme UI；Work 实体；Newsletter。

---

## 12. Open Questions

1. **Q-1**：报告 #0 的选题——候选：国产算力链（Thesis compute + Map 20 节点 + T-01/T-03 双 Theme 支撑，证据最厚）还是存储周期（T-02，背离框架的最新实战）？
2. **Q-2**：Focus 的首批 3–5 个由谁定、多久评审一次？（建议：HSN 人工指定，季度评审，不进任何账本——注意力漂移不需要留痕，留痕的是判断。）
3. **Q-3**：年报是否需要一个区别于普通报告的呈现（如独立长页）？还是同为报告载体的一期？
4. **Q-4**："动表达变化，静表达判断"是否入 DESIGN.md 原则节？（不授权任何具体动效，只入原则。）
5. **Q-5**：报告与 Thesis 的时间关系——报告发布后，其支撑的 Thesis 是否必须在 Ledger 有一次 confirm/revise 入账？（倾向：不强制，Ledger 准入纪律不变；但报告链接进 Thesis 的 evidence 叙事是合法的。）

---

## 13. Human Decision Gates

| Gate | 待裁决项 | 选项 | 阻塞下游 |
|---|---|---|---|
| OD-1 | 概念分离（Thesis/Focus/Report/Review 四层）是否批准 | 批准 / 修改 / 驳回 | 全部 |
| OD-2 | V2-27 修正登记（§2.4：撤回 Thesis 旗舰化）是否确认 | 确认 / 维持 V2-27 原案 | P0-1 |
| OD-3 | Focus = 派生视图、永不实体化，是否锁定 | 锁定 / 再议 | §4 全部 |
| OD-4 | 报告 #0 试点选题与启动 | 算力链 / 存储 / 其他 / 暂缓 | P0-3 |
| OD-5 | 节奏裁决（年报 P1 / 季报 P2 / 月报 DEFER / 公开周报否决） | 全批 / 逐项调整 | §6 全部 |
| OD-6 | 语言纪律（Focus/Report 禁"看好/推荐"、必挂 invalidation）成文 | 成文 / 修改后成文 | R-1 缓解 |

---

## 附 · 本轮执行规则遵守声明

```text
☑ 已读 14 号文（全文）/ 24 号文（全文）/ TRACK-A 周报提案 / essays.ts 实码 / V2-27 全结论
☑ 未修改任何源码、任何数据；未新增 Entity / Schema / 页面 / 导航；未 Commit、未 Push
☑ Focus 未实体化；Work 维持 24 号文 Deferred；Theme Registry 未 UI 化
☑ Research Report 定位为 Canonical Research Content 类型候选（内容先行），未偷渡 Work 索引层
☑ 15 号文分发边界、10 号文 Observer 边界、03 号文结构纪律 全部零触碰
☑ 周/月/季/年报节奏审计与 TRACK-A Processing Layer 边界一致
☑ ARK UX 借鉴逐项裁决，视觉禁令全集保留
☑ 对 V2-27 的修正已显式登记（§2.4），DRAFT 状态文档无 LOCKED 违反
```

---

## 附二 · Human Review 裁决记录（2026-08-30）

> 战略侧对本文档 v1.0-draft 的 Review 结论：**4 项批准 + 1 项修改后批准 + 1 项批准启动**。
> 本记录落定后，P0-3（Research Report #0）获得启动授权；其余 Gate 的下游按各自条件阻塞。

### 裁决总表

| Gate | 裁决 | 落地 |
|---|---|---|
| OD-1 概念分离（Thesis / Focus / Research Report / Review 四层） | ✅ ACCEPT | §2 生效 |
| OD-2 撤回 V2-27 Thesis 旗舰化 | ✅ ACCEPT | §2.4 生效；V2-27 P0-3/T-1 同步作废（V2-27 仍为 DRAFT，Human Review 时一并确认） |
| OD-3 Focus = 非实体化声明/视图 | ✅ ACCEPT·MODIFIED | **修正 1**：删除"算法交集"隐含倾向，确立 Human Intent → Evidence → Focus；Attention ≠ Data Intersection；Focus 永不实体化、不留痕；四不等式（≠ Theme / ≠ Thesis / ≠ Recommendation / ≠ Stock Selection）随定义锁定。已落 §4.1 |
| OD-4 报告 #0 启动 | ✅ ACCEPT（启动） | 选题《中国 AI 算力基础设施产业链研究》；性质 = **Research Object Prototype**（目标不是发布，是验证 Method → Research Content 的完整转换）；验收 = 3-Year Test 五项 + 五项压力测试标准（§5.4 STEP 0） |
| OD-5 节奏（年 > 季 > 月 > 周；公开周报否决） | ✅ ACCEPT | §6 生效 |
| OD-6 语言纪律（研究 ≠ 推荐） | ✅ ACCEPT | §4.2 / §5.2 / §5.3 生效，并入 P0-2 |

### 修正 2 落定（Canonical 语言）

统一使用 **Canonical Research Content** 指称报告层级；**禁止**以 Canonical Work 指称报告。
Research Report = 正式研究内容 / Research Object；Work = Body of Work 上位组织概念，
维持 24 号文 Deferred Entity。报告不得派生 works.ts / Work type / Work ID /
Work relationship engine / Work CMS / Work index layer——F-10 不变。已落 §5.1。

### Review 确认的边界重申（入档）

```text
本轮及下一轮持续禁止：
新增 Research 页面 / NAV / ARCHIVE_TREE 项 / Focus Entity / Work Entity /
Theme Entity / reports.ts / Research CMS / Publication Archive / C2-B /
任何 speculative data layer；不修改 V2-07 LOCKED / 13 / 14 / 15 / 24 号文 /
Thesis / Ledger / Map / Observation / Journal schema / C1 / C4。
```

**阶段状态：V2-28 审计层闭环 → P0-3（Report #0 · Research Object Prototype）执行中。
Report #0 交付 + 3-Year Test 自评经 Human Review 后，才允许讨论 Research Content Layer 是否需要存在。**

---

**STOP。本文件审计职责已闭环；下游唯一授权动作 = P0-3 纯内容试点（工作区 Markdown，零代码）。**

---

## 附三 · Second Human Review 裁决记录（2026-08-30 · 第二轮）

> 战略侧对 V2-28 修正版 + Report #0 交付方式的第二轮 Review。
> 结论：**主方向通过，但不视为"完全闭环、无需修改"的正式契约**；三项修改（M-1 / M-2 / M-3）已落正文。
> 特别登记：本轮 Review 未审 Report #0 正文（评审方未获得文件）——**Report #0 的内容验收是下一轮独立 Human Review**，建议按六维进行：研究质量 / 认知原创性 / 3-Year Test / ARK 对标 / 道家语言密度 / 页面产品化潜力。

### 裁决总表（17 项）

| 项目 | 裁决 |
|---|---|
| Thesis ≠ Focus ≠ Report | APPROVE |
| Thesis 不旗舰化 | **APPROVE / LOCK** |
| Focus 非实体化（不留 Focus History） | **APPROVE / LOCK** |
| Human Intent → Focus | **APPROVE / LOCK** |
| Research Report 内容先行 | APPROVE |
| Report ≠ Work Entity | **APPROVE / LOCK** |
| Annual Review | APPROVE AS CANDIDATE，不提前旗舰化（M-2） |
| 月报 | REDUCE / DEFER |
| Newsletter 式周报 | **NO-GO** |
| Weekly Research Synthesis | KEEP，继续与公开 Newsletter 区分（M-1） |
| Report → Thesis 单向关系 | **修改为 Research ↔ Thesis / Evidence linkage（M-3）** |
| ≥3 Report 后再决定 IA | APPROVE |
| ARK 图文表达 | APPROVE |
| To Top | APPROVE |
| 左侧分类 | DEFER |
| 动效 | APPROVE 原则，不提前扩大 |
| Daoist vocabulary | APPROVE，严格控制密度（现代研究语言为表层，道字为深层；不做"道家投资网站"） |

### 三项修改落定

- **M-1 · 周报三分**（§6）：Weekly Research Processing = KEEP（TRACK-A 既有）；Weekly Research Synthesis = KEEP·继续验证（研究合成 Artifact：强化的判断 / 受挑战的判断 / 修正候选 / 开放问题，不污染 Canonical Data）；Newsletter 式热点周报 = NO-GO。健康形态：周度研究（生产机制）→ 季度公开总结 → 年度 Review（候选）。
- **M-2 · Annual Review 降级**（§6 / §10 / §11）：从"旗舰候选"改为 **Long-term Product Candidate**——"年 > 季 > 月 > 周"是合理假设而非已验证规律；旗舰地位由连续产出证明，不由架构授予。
- **M-3 · Report ↔ Thesis 并行**（§2.2）：Report 与 Thesis 是并行 Research Outputs，经 Evidence 互相连接，不是固定父子关系；研究可以先有命题再写报告验证，也可以先有研究再形成命题。

### Review 确认的阶段判断（入档）

> TradingLabb 已从"设计一个很完整的网站"进入"证明这个系统真的能持续生产高质量认知资产"的阶段。
> 下一步唯一有价值的 Review 对象不是架构，而是 **Report #0 本身**：
> 它是不是一份"未来三年仍然值得回来修改、引用、反驳和扩展"的研究作品——
> 是，则 Research Product 成立；不是，则退回 Essay，避免一次不必要的 reports.ts。

**阶段状态：V2-28 架构层两轮 Review 闭环（主方向通过 + 三项修改落定）。
下游唯一待办 = Report #0 内容验收（六维 Human Review）。
其余一切（IA / 载体 / Focus UI / Annual 旗舰化 / C2-B）继续阻塞，以 Report #0 验收结果为唯一解锁条件。**

---

**STOP。等待 Report #0 的六维 Human Review。**
