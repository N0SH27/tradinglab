# V2-30 · COGNITIVE EXPERIENCE DESIGN SPEC — 认知体验设计规格（V2 产品设计母文档）

> **状态：SPEC · CANONICAL · V2-30 · v1.0 · LOCKED（2026-09-04）**
> Human Review（2026-09-04）：**PASS——HDG-1～HDG-7 全部 PASS，无 MODIFY，无 REJECT**；OQ-1～OQ-4 全部裁决落定（§21 / 附二）。HDG-2 附带条件：DESIGN.md 动效增补随 V2-C 第一步同步修订。
> **Contract LOCKED ≠ Implementation Authorized**——实施须先完成 V2-30 Implementation Readiness Audit（31 号文 Prompt），再经 Human Implementation Authorization；范围限定 Experience / Representation Layer，验收 AC-H1～H6 / AC-R1～R4（§22）。
> 本轮**零代码、零数据改动、零新实体、零新 Schema、零新页面、零 Commit、零 Push。**
> 上游契约：V2-01～V2-29（重点：02 Design Constitution / 03 IA / 04 HOME SPEC / 07 V2-07 Architecture Closure / 10 Identity / 13 Method / 14 Body of Work / 25 Framework-System / 26 Framework-System Contract / 28 Research Product Architecture / 29 Homepage Dedup & Routing），全部 LOCKED 或 DRAFT 在审。
> 触发：**Human 明确决策（2026-09-04）**——从「讨论方向」正式进入 **V2 产品方案收敛**，将已锁定的 V2-07 / V2-28 / V2-29 / Framework-System 架构翻译为更好的用户体验。
> 问题定性：**Experience Layer Redesign，不是 Cognitive Architecture Redesign，也不是 IA Redesign。** Canonical Content Layer 不动，Framework/System 架构不动，Research Loop 不动；改的是 Representation Layer / Reader Experience Layer。
> 最终原则：**Deep Architecture, Simple Surface, Rich Exploration. 底层架构可以深，表层表达必须简单，探索方式可以丰富。**

---

## 0. 开档合规声明：与 V2-29 止损线的关系（必须先读）

V2-29 附二明令：**「禁止预开 V2-30 式架构文档——下一轮问题由真实使用证据触发。」** 本文档编号恰为 V2-30，因此必须在开档第一页处理这条止损线，而不是绕开它。

**逐项对照：**

| V2-29 止损线意图 | 本文档的实际性质 | 判定 |
|---|---|---|
| 防止「在架构层预演未来需求」——没问题造问题 | 本文档由 **Human 明确决策触发**，不是 AI 自发预演；触发理由是已确认的体验问题（系统语言泄漏到产品语言、首页 Section Stack 模板感、Research 阅读缺少导航） | ✓ 不违反 |
| 防止继续加架构层（新实体 / 新 IA / 新基础设施） | 本文档**不新增任何架构层**：Cognitive Architecture 全部沿用 V2-07～V2-29 既有定义，只改 Experience Layer 与 Visual Surface | ✓ 不违反 |
| 防止把 V2-29 已 LOCK 的压缩成果重新膨胀回去 | 本文档**正式提出修订 V2-29 的 F-7（章序冻结）与 §5 模块职责表**——这是正面冲突点，必须经 Human Review 裁决后才生效；裁决前 V2-29 继续有效 | ⚠️ **HDG-1，待裁决** |

**正式登记（LOCK 候选）：**

> V2-30 的存在本身不构成对 V2-29 止损线的违反——止损线禁止的是「AI 在架构层自发预演」，不禁止「Human 决策启动的体验层重设计」。但 V2-30 中所有与 V2-29 LOCK 项冲突的条目（首页章序、模块职责、展示深度），在 Human Review PASS 之前一律不生效；V2-29 实施任务单（首页呈现层）与 V2-30 的关系由 HDG-1 一并裁决（取代 / 吸收 / 先后执行）。

---

## 1. V2-30 Executive Decision

**一句话结论：V2 不重新设计 TradingLabb，而是把已经形成的认知架构，重新翻译成更好的用户体验——首页从「八个模块的 Section Stack」收敛为「五个认知场景」，Research 从「字太多」重构为「认知导航」，全部改动发生在 Experience Layer，Canonical Content Layer 零触碰。**

七个关键决策（候选，待 Human Review）：

1. **V2 总命题锁定：Cognitive Experience。** 核心原则句：**Deep Architecture, Simple Surface, Rich Exploration.** 派生句：**极简不是减少内容，而是减少不必要的认知负担；丰富不是增加元素，而是增加有意义的探索路径。** 两句进入 V2 设计宪法（§2）。

2. **三层判断模型锁定。** 以后所有设计决策按 Cognitive Architecture（深）→ Experience Layer → Visual Surface（浅）的次序判断。任何视觉/交互提案必须回答「这个交互让用户理解了什么」，禁止「这个动画很好看所以放进去」（§3）。

3. **首页定位锁定：A Guided Entry Into HSN's Way of Seeing。** 首页不是目录、不是 Dashboard、不是 Research Feed、不是 Personal Homepage，而是进入 HSN 观察世界方式的一条入口。三条件：有逻辑（陌生用户可顺着理解）、有探索（不能一眼看完）、有克制（探索靠内容状态与交互方式，不靠堆元素）（§4）。

4. **首页结构决策：5 个认知场景，不是 8 个模块。** ENTRY → NOW → SEE → THINK → CHANGE。「这是信息逻辑，不是视觉排版」——视觉上不同场景拥有不同的阅读行为，不做等宽矩形 Section Stack（§5）。**此项正式修订 V2-29 F-7 与 V2-04 HOME SPEC 的章节纪律，须经 HDG-1 裁决。**

5. **Research 问题定性修正：根本问题不是「字太多」，而是「读者在阅读过程中缺少导航」。** 解法是建立认知导航：30 SEC（四句话原则）→ 5 MIN（WHAT/WHY/SO WHAT/BUT 隐藏结构）→ DEEP DIVE（完整证据链，章节标题从「分类」改为「问题」）（§8～§10）。

6. **术语体系表里分离。** Architecture 层保留正式术语（Observation / Thesis / Invalidation / Revision……），Reader-facing 层使用自然语言（发生了什么 / 当前判断 / 什么情况下会错 / 后来哪里变了……）。NOW / WORLD / THESIS / JOURNAL / POLARITY 保留为品牌语言；Canonical Research Object / Derived View / Entity Schema 等工程语言禁止出现在用户界面（§11）。

7. **V2 实施分三阶段：V2-A Experience Architecture（本文档，不改代码）→ V2-B Content Translation（内容保留/合并/删除/重写）→ V2-C Implementation（React/CSS/动效/路由）。V3 = System Reduction（文档债/代码债/命名债瘦身），V2 不为代码干净牺牲体验，V3 再做工程减法（§18）。**

---

## 2. Design Constitution（V2 设计宪法 · 候选增补）

以下原则句候选进入 02 号文 DESIGN CONSTITUTION 的 V2 增补节（增补程序走宪法修订，不直接改动原文）：

> **C-30-1 · Deep Architecture, Simple Surface, Rich Exploration.**
> 底层架构可以深，表层表达必须简单，探索方式可以丰富。

> **C-30-2 · 极简不是减少内容，而是减少不必要的认知负担。**

> **C-30-3 · 丰富不是增加元素，而是增加有意义的探索路径。**

> **C-30-4 · One Object → One Primary Home → Multiple Meaningful Entry Points.**
> （承接 V2-29 §2.3 Canonical Home Principle，扩展为：一个对象可以有多个有意义的入口，但每个入口必须提供不同的阅读动作，不得重复投影。）

> **C-30-5 · 结构标准化，表达个性化。**
> 页面结构固定（认知导航），表面语言自然（隐藏结构）；既不失研究系统，也不像 AI 生成的咨询报告。

> **C-30-6 · 它们应该被体验，而不是被讲解。**
> 首页不解释 Framework / System / Research Loop / Data Architecture。用户深入到 THINK / SYSTEM / FRAMEWORK 时自然理解——这才是 Progressive Disclosure。

---

## 3. 三层判断模型（Cognitive Architecture / Experience Layer / Visual Surface）

```text
                    COGNITIVE ARCHITECTURE
                           深
                           │
                           ↓
                    EXPERIENCE LAYER
                           │
                           ↓
                     VISUAL SURFACE
                           浅
```

### 3.1 第一层 · Cognitive Architecture（不动）

Observation / Context / Thesis / Belief / Decision / Research / Revision / Framework / System。

**纪律：不因为读者看不懂就删除。** 架构的正确性由 V2-07～V2-29 保证，本层不是 V2-30 的对象。

### 3.2 第二层 · Experience Layer（V2-30 的主战场）

把复杂结构翻译成读者问题：

| 读者问题 | 对应架构对象 |
|---|---|
| 发生了什么？ | Observation |
| 为什么？ | Context / Evidence |
| 我发现了什么？ | Research Finding |
| 为什么重要？ | So What |
| 哪里可能错？ | Counter Evidence / Invalidation |
| 后来改变了吗？ | Revision |

### 3.3 第三层 · Visual Surface（最后才谈）

卡片 / 阴阳 / Map / 动画 / 滚动 / Flip / Reveal / Timeline / Typography。

**执行测试（任何交互提案过这道问 · LOCK 候选）：**

> 这个交互让用户理解了什么？
> 答不上来 = 删除该交互，无论它多好看。

---

## 4. Home Cognitive Architecture

### 4.1 首页定位（LOCK 候选）

> **首页 = A Guided Entry Into HSN's Way of Seeing——进入 HSN 观察世界方式的一条入口。**

显式排除：不是网站目录；不是 Dashboard；不是 Research Feed；不是 Personal Homepage。

三个必要条件：

1. **有逻辑**：用户不知道 TradingLabb，也能顺着页面理解。
2. **有探索**：用户不能一眼把所有内容看完。
3. **有克制**：探索不是靠堆东西，而是靠内容状态和交互方式。

### 4.2 Homepage Cognitive Flow v1（LOCK 候选）

```text
ENTRY
│ Who is looking?
↓
NOW
│ What is changing?
↓
SEE
│ Where is it happening? How can we look at it?
↓
THINK
│ What did HSN find? What does HSN believe?
↓
CHANGE
│ What changed his mind?
↓
EXPLORE
```

### 4.3 五场景承载关系

```text
ENTRY  → HSN / TradingLabb
NOW    → Current Observations
SEE    → Polarity + World Map（Home Preview）
THINK  → Selected Research + Current Belief
CHANGE → Revision + Journal
```

### 4.4 与 V2-29 章序的映射（修订对照表 · HDG-1 核心）

| V2-29 现状章节（2026-08-31 裁决） | V2-30 场景 | 处理 |
|---|---|---|
| —（不存在） | **ENTRY** | 新增：极简第一屏，只建立气质（§5.1） |
| NOW | **NOW** | 保留对象，改形态：Reading Cards + Flip（§5.2） |
| POLARITY | **SEE**（上半） | 升级：Polarity 从展示变为 Filter（§7） |
| —（Map 不在首页） | **SEE**（下半） | 新增：World Map Home Preview（§8） |
| RESEARCH + LIVE THESIS | **THINK** | 合并：Selected Research + 唯一 Current Belief（§5.4） |
| FOCUS | — | **撤出首页**：Architecture 保留，Representation 删除——FOCUS 转为 Research / World 的 Derived View 入口，不占首页场景（§5.4.3） |
| WHAT CHANGED MY MIND | **CHANGE** | 保留对象，改形态：WHAT CHANGED? 对比卡（§5.5） |
| WUWEI / END | — | **OQ-1 待裁决**：建议 WUWEI 作为 CHANGE 之后的静默尾章保留（「静→动→探索→静」节奏需要终点），或并入 END |

**纪律声明：** 场景（Scene）是阅读行为单位，不是视觉 Section。禁止把五场景实现为五个等宽矩形区块堆叠——那是「八个模块」换皮，正是本规格要消灭的模板感。

---

## 5. Home Scene-by-Scene Spec

### 5.1 SCENE 01 · ENTRY

**任务：建立气质，不是解释产品。**

- 第一屏只有：
  - `TRADINGLABB`
  - 一句：`A public record of how HSN observes change.`
  - 一个克制的进入提示（ENTER / 向下指示）。
- **禁止**：第一屏介绍整个 TradingLabb、列栏目、放导航说明、放「关于我」段落。
- 这是极简美学唯一允许「空」的地方；其余场景的克制靠内容质量，不靠留白。

### 5.2 SCENE 02 · NOW

**回答：What is changing?** 不做传统新闻卡片，采用 **Reading Cards + Flip**。

正面（Surface）：

```text
AI INFRASTRUCTURE

Demand remains strong.

        ↓
      READ
```

点击翻转到背面（Hidden Variable）：

```text
AI INFRASTRUCTURE

Demand remains strong.

But the economics
are changing.

        ↓
   EXPLORE RESEARCH
```

- **Flip 的认知意义（必须保持）：表面现象 → 隐藏变量。** Flip 不是装饰动画，它本身就是「观察 → 洞察」的隐喻。若实现时丢失这层对应（例如变成随机翻面），则宁可不做 Flip。
- **数量纪律（LOCK 候选）：NOW 最多 3 条。** 判断标准：「如果今天只允许 HSN 告诉你三件事情，是什么？」——要 Editorial Judgment，不要 Information Dump。
- 语言层纪律沿用 V2-29 §4：NOW 卡片正面 = Observation Language（事实/变化），背面 = 唯一的隐藏变量提示，**不得预先复述 Thesis 结论**；EXPLORE RESEARCH 为路由出口。

### 5.3 SCENE 03 · SEE

**任务：不是「解释 Polarity」，而是让用户用 Polarity 看世界。**

详见 §7（Polarity Interaction Spec）与 §8（World Map Home Preview Spec）。本场景是首页最有机会成为 TradingLabb 独特资产的部分：

> 一般网站首页说「我最近关注 AI」；TradingLabb 说「我把 AI 放在这个世界结构中的什么位置」。这是 Information → Context，是真正的认知差异。

### 5.4 SCENE 04 · THINK

**回答：What did HSN find? What does HSN believe?** 只承载两个对象：Selected Research + Current Belief。

#### 5.4.1 Selected Research（阅读体验入口，不是列表）

禁止 `Research 01 / 02 / 03` 列表形态。采用阅读卡片 + Flip：

- 正面：研究主题 + 一句问题（例：**中国 AI 算力基础设施正在发生什么？**）
- 背面：核心发现一句（例：需求仍然强劲，但资本效率正在成为新的关键变量）+ `READ 5 MIN` / `DEEP DIVE →` 双出口
- 数量：1 份 Featured（沿用 V2-29 OD-3：人工指定，不建 featured 字段、不建算法）。

#### 5.4.2 Current Belief（唯一）

> **WHAT I BELIEVE NOW——首页只展示一个。**

形态：一句信念陈述 + 三个极小入口：

| 入口 | 落点 |
|---|---|
| WHY | Evidence（Thesis Detail 证据区） |
| WHAT COULD CHANGE IT | Invalidation |
| HISTORY | Journal / Revision |

禁止 Thesis 01/02/03/04 列表进首页。首页不重复 Thesis 页。

#### 5.4.3 FOCUS 撤出首页（LOCK 候选）

> **FOCUS 不删除，但从首页撤出。Architecture 保留，Representation 删除。**

理由：FOCUS 不拥有内容（V2-28 §4.1 LOCK：永不实体化），它是 Research / World 的 Derived View；首页同时放 NOW + FOCUS + RESEARCH + THESIS 必然重新产生同质化。FOCUS 的问题语言功能由 Selected Research 卡片的「一句问题」吸收。

### 5.5 SCENE 05 · CHANGE

**不是 Journal Feed，而是 WHAT CHANGED?——首页最重要的「人格资产」。**

对比卡形态（Compare 动作）：

```text
AI INFRASTRUCTURE

THEN
72%

NOW
64%

WHY
Capital intensity
rose faster
than expected.

        ↓
   SEE REVISION
```

- `SEE REVISION` → Journal 对应 Revision 条目。
- 数量纪律：1 条（最近且最有认知价值的一次修正）。无真实修正时本场景整体不展示（沿用 V2-29：无修正硬造修正 = 违约）。
- 认知意义：公开展示「我会错、我会改」——这是 HSN Author IP 与普通研究网站的分界。

---

## 6. Home Interaction Grammar（交互语法 · 封闭集合 · LOCK 候选）

V2 限制交互词汇表，**只允许六种阅读动作**，禁止无限增加：

| # | 动作 | 认知意义 | 使用位置 |
|---|---|---|---|
| ① | **Read** | 普通阅读 | ENTRY、BELIEF、全文场景 |
| ② | **Flip** | 看到另一面（表面 → 隐藏变量） | NOW 卡片、Selected Research 卡片 |
| ③ | **Reveal** | 展开隐藏信息 | Research 30 SEC → 5 MIN、入口 → 详情 |
| ④ | **Rotate** | 状态转换（YANG / YIN / TURN） | Polarity |
| ⑤ | **Explore** | 空间探索 | World Map |
| ⑥ | **Compare** | 前后对照 | Revision / Before–After |

**新增动作纪律：** 任何第七种交互动作必须走本规格修订 + Human Review，并回答 §3.3 执行测试。

### 6.1 首页交互节奏（LOCK 候选）

```text
ENTRY    静
NOW      Flip
POLARITY Rotate
MAP      Explore
RESEARCH Reveal
BELIEF   Read
REVISION Compare
END      静
```

> **静 → 动 → 动 → 探索 → 静。** 而不是全程动。这比「整个网站到处动画」高级，也给每种动作保留认知重量。

### 6.2 Curiosity Chain（探索欲的来源）

探索欲不是页面元素多，而是**用户不断发现「原来还有下一层」**：

```text
一句话 → 翻转 → 发现另一面 → 点击 → 进入 Map → 发现节点
→ 点击 → 发现 Research → 发现 Thesis → 发现 Revision
```

每个场景必须至少贡献一条通向更深层的链环；不允许死胡同场景。

---

## 7. Polarity Interaction Spec

### 7.1 定位升级（LOCK 候选）

> **Polarity 不是展示，而是 Filter。**

既有设计已有 `yang / yin / turn` 三态，且 Map 节点存在 `state` 与三态的对应（V2 既有数据域）。V2-30 不发明新体系，只把它产品化为交互闭环：

```text
POLARITY → VIEW → MAP → NODE → RESEARCH
（哲学 → 交互 → 数据 → 内容）
```

### 7.2 三态定义（Reader-facing）

| 态 | 关键词 | 激活后 Map 视图 |
|---|---|---|
| **YANG** | Expansion / Growth / Adoption | Expansion View：突出处于扩张态的节点 |
| **YIN** | Constraint / Clearing / Contraction | Constraint View：突出处于约束/出清态的节点 |
| **TURN** | Transition / Reversal / Inflection | Transition View：突出正在发生状态转换的节点 |

认知内核（与 HSN 思想一致）：投资真正值得关注的不是「涨还是跌」，而是**状态如何发生转换**。

### 7.3 交互细则

- 默认态：无滤镜的全貌（World at a Glance），三态按钮可见但未激活。
- 点击某一态：Map 平滑过渡到对应 View（Rotate 动作）；再次点击取消滤镜回到全貌。
- 同一时刻只允许一个激活态（三态互斥）。
- 态切换必须有节点级的视觉响应（颜色/亮度/规模变化），禁止只换标题文案。
- 用户看到的不是解释文字，而是**一个正在缓慢变化的世界**——Polarity 的语义由 Map 的变化来教，不由段落来讲。

---

## 8. World Map Home Preview Spec

### 8.1 定位（LOCK 候选）

> **Map 应该出现在首页——但它是 World Preview（WORLD AT A GLANCE），不是 World Map 页面本体。**

首页版只负责回答：**这些变化发生在哪里？** 不做完整产业地图。

### 8.2 首页版信息上限

只允许：核心产业节点（≤7 个候选）、少量关系边、当前状态（Polarity 态）、可能的变化方向（如 YANG → TURN 箭头）。

示意：

```text
                AI
              /    \
        COMPUTE    SOFTWARE
           │           │
        MEMORY       AGENT
           │
         POWER
```

### 8.3 交互细则

| 动作 | 响应 |
|---|---|
| Hover 节点 | 显示名称 + 当前态（例：AI Infrastructure · YANG） |
| 点击节点 | 节点放大卡：名称 + Current State（YANG → TURN）+ Related Research · NN + Related Thesis · NN + `ENTER WORLD` 入口 |
| ENTER WORLD | 路由到完整 Map 页面 |

### 8.4 边界纪律

- 首页 Preview 的节点数据**复用既有 Map 数据域的呈现层投影**，禁止新建 HomeMap 实体 / 数据文件（延续 V2-29 F-6/F-10）。
- Preview 不承载研究内容正文；Related 计数只做路由，不做摘要。
- 移动端允许降级为简化节点列（§14），但 Polarity Filter 功能必须保留。

---

## 9. Research Reader Architecture

### 9.1 问题定性（LOCK 候选）

> **Research 的根本问题不是「字太多」，而是读者在阅读过程中缺少导航。**
> 解法：Research 必须建立认知导航。

### 9.2 阅读层级总览

```text
LEVEL 2   RESEARCH OVERVIEW（30 SEC）   低密度 · 高判断性
LEVEL 3   KEY FINDINGS（5 MIN）         中密度 · 高解释性
LEVEL 4   DEEP DIVE                     高密度 · 高证据性
```

（LEVEL 1 = HOME，见 §17 密度梯度。）

### 9.3 报告第一屏：四个问题，不是元信息

禁止以 Title / Author / Date / Abstract / Table of Contents 开场。第一屏依次回答：

1. **THE QUESTION** —— 我们究竟在研究什么？
2. **THE FINDING** —— 目前最重要的发现是什么？
3. **WHY IT MATTERS** —— 为什么这个发现重要？
4. **WHAT COULD CHANGE THIS VIEW** —— 什么情况下我们会改变判断？

### 9.4 四句话原则（LOCK 候选）

任何 Research Report 必须有：一句问题、一句判断、一句意义、一句风险。**一个读者只读这四句话，应该已经知道这篇研究的大致价值。** 四句话是写作交付标准，不是版式模板。

---

## 10. 30 SEC / 5 MIN / DEEP DIVE 详细规范

### 10.1 30 SEC（Executive View）

即 §9.3 四问题。技术元信息（日期/版本/关联 Thesis）允许以小字元数据形式存在，但不占据第一屏叙事位置。

### 10.2 5 MIN（Key Findings）

每个核心发现统一按隐藏四段式组织：

```text
WHAT      发生了什么？
WHY       为什么？
SO WHAT   为什么重要？
BUT       什么可能让这个判断失效？
```

**隐藏结构原则（LOCK 候选）：页面结构固定，表面语言自然。**

禁止机械套模板（每节 WHAT:/WHY:/SO WHAT:/BUT: 四个大标题）。正确形态示例：

> **算力需求还在增长，但问题已经变了**
> 过去，行业最重要的问题是……现在……**真正值得关注的是：**……**但有一个变量需要警惕：**……

读者自然读完 WHAT → WHY → SO WHAT → BUT，却不需要看到这四个术语。即：

```text
VISIBLE   自然语言
HIDDEN    Research Architecture
```

### 10.3 SO WHAT 审核规则（写作治理 · LOCK 候选）

> 每写完一段内容，问一句：**「所以呢？」**
> 回答不了 = 这段内容要么压缩，要么移到 Deep Dive，要么删除。

SO WHAT 不作为固定标题出现，而作为写作审核标准。此规则直接进入 AI 内容生成的工作约束。

### 10.4 DEEP DIVE

恢复完整专业度：产业结构 / 供需 / 技术 / 成本 / 资本 / 公司 / 数据 / 风险 / Counter Evidence / Invalidation。

**章节标题纪律（LOCK 候选）：从「分类」变成「问题」。**

| 禁止（分类语言） | 改为（问题语言） |
|---|---|
| 产业链结构 | 谁掌握了产业链中最稀缺的环节？ |
| 供给 | 供给瓶颈到底在哪里？ |
| 市场规模 | 需求增长还能持续多久？ |
| 企业分析 | 哪些公司真正拥有定价权？ |

### 10.5 层级递进纪律（防重复投影）

> **不同层级之间不是复制，而是递进。**

- 已在 30 SEC 说过的：5 MIN 不重复原话，只做展开。
- Key Findings 已解释过的：Deep Dive 只提供证据和细节。
- Thesis 已表达的判断：Research 不再写一遍「我的观点」。

---

## 11. Reader-facing Language System（术语表里分离）

### 11.1 双层术语表（LOCK 候选）

| Architecture（内部保留） | Reader-facing（用户看到） |
|---|---|
| Observation | 发生了什么 |
| Context | 把它放到什么背景看 |
| Frame | 从什么角度理解 |
| Thesis | 当前判断 |
| Evidence | 为什么这么判断 |
| Counter Evidence | 什么在反驳 |
| Invalidation | 什么情况下会错 |
| Revision | 后来哪里变了 |
| Decision | 我决定怎么做 |
| Trigger | 什么条件触发行动 |

### 11.2 系统语言泄漏禁令

问题定性：**系统语言泄漏到了产品语言。** 修正对照：

| 禁止（泄漏） | 应显示 |
|---|---|
| `REPORT-00 · Research Object Prototype` | 中国 AI 算力基础设施 |
| `Thesis #03 · polarity: yang` | 当前判断：结构性看多 |
| `revision_date` | 上一次判断修正：2026.08 |

### 11.3 品牌语言白名单

以下保留英文，作为 TradingLabb 自有 vocabulary：**NOW / WORLD / THESIS / JOURNAL / POLARITY**（及场景名 ENTRY / SEE / THINK / CHANGE，若 HDG-1 通过）。

以下工程语言**禁止出现在用户界面**：Canonical Research Object / Derived View / Entity Schema / Context Revision Boundary / Primary Home / Semantic Layering 及一切数据字段名。

---

## 12. Content De-duplication Matrix（反同质化规则）

### 12.1 首页内容准入三问（LOCK 候选）

任何内容进入首页评审必须依序回答：

- **Q1**：它是不是一个新的 Canonical Object？—— 是 → 进入其 Primary Home，首页只做引用。
- **Q2**：它是否提供了新的阅读方式？—— 是 → 候选保留。
- **Q3**：它是否提供了新的认知价值？—— 否 → **删除。**

### 12.2 与 V2-29 的关系

本节不取代 V2-29 §4 Semantic Layering Rule（五种语言层），而是在其上增加「动作层」判据：同一主题跨场景出现时，不仅语义层必须不同（OBSERVATION / QUESTION / EVIDENCE / BELIEF / REVISION），**阅读动作也必须不同**（Read / Flip / Rotate / Explore / Compare）。语义不同 + 动作不同 = 好重复；任一同质 = 坏重复。

---

## 13. 路由：Home → Research → Thesis → Journal

```text
                    TRADINGLABB
                         │
                         ↓
                       HOME
              ┌──────────┴──────────┐
              ↓                     ↓
             NOW                 POLARITY
              │                     │
              │                     ↓
              │                    MAP
              │                     │
              └──────────┬──────────┘
                         ↓
                    RESEARCH
                ┌────────┴────────┐
                ↓                 ↓
             30 SEC             5 MIN
                └────────┬────────┘
                         ↓
                     DEEP DIVE
                         ↓
                      THESIS
                         ↓
                      JOURNAL
                         ↓
                     REVISION
```

形成完整循环：**Observe → Understand → Research → Believe → Revise。** Framework 层位于更高层，不塞进首页（C-30-6：被体验，不被讲解）。

路由规则细则沿用 V2-29 §3.3（Report 优先且「直接回应」/ Thesis 兜底 / 无承载不上架）；V2-30 只新增两条：

- NOW 卡片背面 `EXPLORE RESEARCH` 落点 = 与隐藏变量直接相关的 Report / Map 节点。
- Map 节点 `ENTER WORLD` 落点 = Map 页对应节点定位态，而不是 Map 页默认顶部。

---

## 14. Desktop / Mobile 原则

- **同一认知流，不同密度。** 移动端不改变五场景顺序与四句话原则，只降低同屏信息量。
- Flip 在移动端改为点击翻面（无 hover 依赖）；Hover 节点信息改为首击显示、再击进入。
- Map Preview 移动端允许降级为垂直节点列 + Polarity Filter 保留；禁止整段删除 SEE 场景。
- ENTRY / END 两端的「静」在所有端保持一致。

## 15. Accessibility / Reduced Motion

- `prefers-reduced-motion` 下：Flip / Rotate / Explore 过渡全部降级为即时切换，**信息结构不变**——翻转两面的内容须以可顺序阅读的方式同时可达。
- 所有 Flip 卡片的背面内容不得只存在于 hover/动效中（键盘与读屏可达）。
- 对比卡（THEN/NOW）数值不依赖颜色单独表意。
- 交互动作的触发目标 ≥ 44px；Polarity 三态为真实按钮语义（非纯图形热点）。

---

## 16. KEEP / COMPRESS / REMOVE / MOVE / REWRITE 规则（V2-B 执行总则）

| 动作 | 判据 | 典型对象 |
|---|---|---|
| **KEEP** | 已是 Canonical Object 且在其 Primary Home | Thesis Detail、Journal、Report 正文、Map 数据域 |
| **COMPRESS** | 语义正确但超出所在层级深度上限 | 首页各卡片（压到状态/问题/一句话） |
| **REMOVE** | 过不了 §12.1 三问的重复投影 | 首页 Thesis 列表、Research 编号列表 |
| **MOVE** | 内容有价值但放错层级 | 「为什么这样判断」从首页卡片 → Thesis Detail；FOCUS → Research/World 入口 |
| **REWRITE** | 结构正确但语言是系统语言/分类语言 | 报告章节标题（分类 → 问题）、所有泄漏字段名 |

**纪律：REMOVE 的对象是重复投影，不是内容本身；内容只准回到自己的 Primary Home（延续 V2-29 F-9）。**

---

## 17. Information Density Gradient（LOCK 候选）

```text
LEVEL 1   HOME                极低密度 · 高探索性    负责吸引和定位
LEVEL 2   RESEARCH OVERVIEW   低密度 · 高判断性      负责让人理解
LEVEL 3   KEY FINDINGS        中密度 · 高解释性      负责建立认知
LEVEL 4   DEEP DIVE           高密度 · 高证据性      负责建立可信度
```

任何页面提案先声明自己属于哪一级，然后接受该级密度上限约束。跨级代写 = 违约（与 V2-29 §4.2 执行测试同款逻辑）。

---

## 18. V2 实施阶段与 V2/V3 边界

### 18.1 三阶段

| 阶段 | 名称 | 内容 | 本文档的关系 |
|---|---|---|---|
| **V2-A** | Experience Architecture | Home Flow / Research Reading Flow / Information Density / Interaction Grammar / Map Preview / Polarity / Reader Language | **本文档即 V2-A 冻结候选；不改代码** |
| **V2-B** | Content Translation | 首页内容 KEEP/COMPRESS/REMOVE/MOVE/REWRITE；Research 文案重写；标题改问题语言；中英分层；Executive View 生成 | 本文档 §16 提供规则；另行开任务单 |
| **V2-C** | Implementation | React / Components / CSS / animation / routing / data binding / responsive / accessibility | 本文档 §19 提供禁令；另行开任务单 + 实施授权 |

### 18.2 V3 = SYSTEM REDUCTION（边界声明）

V3 解决：Document Debt / Code Debt / Context Debt / Naming Debt / Legacy Debt / Redundancy（文档数量、文件编号、重复文档、Legacy 文件、无效组件、重复代码、英文残留、后台命名、历史方案、无效 schema、技术债）。

> **V2 不为了「代码干净」牺牲体验；V3 再做工程减法。** 顺序不可颠倒。

### 18.3 Personal IP 完成形态（V2 终点愿景）

| 页面 | 展示 |
|---|---|
| Home | 我怎么看世界 |
| Research | 我研究出了什么 |
| Thesis | 我现在相信什么 |
| Journal | 我如何改变 |
| Framework | 我是如何从世界走到行动的 |
| System | 我如何真正执行 |

此时 HSN 是 **Author**，不是网站管理员（与 V2-07 Author / IP Layer 定义一致：TradingLabb 的核心不是文章集合，而是公开记录「我如何观察、形成判断、修正判断」的长期认知轨迹）。

---

## 19. Implementation 禁止事项（Forbidden Structures · LOCK 候选）

| # | 禁止 | 理由 |
|---|---|---|
| F-30-1 | 把五场景实现为五个等宽矩形 Section Stack | 场景是阅读行为单位，不是视觉区块；换皮即失败 |
| F-30-2 | 新增第七种交互动作（超出 Read/Flip/Reveal/Rotate/Explore/Compare） | 交互词汇表封闭；新动作走规格修订 |
| F-30-3 | 全程动效 / 为动效而动效 | 违反 §6.1 节奏与 §3.3 执行测试 |
| F-30-4 | Flip 丢失「表面 → 隐藏变量」语义 | 语义丢失则宁可不做 |
| F-30-5 | 首页解释 Framework / System / Research Loop / Data Architecture | C-30-6：被体验，不被讲解 |
| F-30-6 | NOW 超过 3 条 / Belief 超过 1 条 / Featured Research 超过 1 份 | Editorial Judgment，不是 Information Dump |
| F-30-7 | 为首页 Preview 新建 HomeMap / Scene / Focus 实体或数据文件 | 延续 V2-28 §4.1 / V2-29 F-6/F-10：全部是呈现层投影 |
| F-30-8 | 用户界面出现工程术语与字段名（§11.3 黑名单） | 系统语言不得泄漏到产品语言 |
| F-30-9 | Research 章节标题使用分类语言（产业链结构/供给/市场规模……） | §10.4：标题 = 问题 |
| F-30-10 | 机械套用 WHAT/WHY/SO WHAT/BUT 四标题模板 | §10.2：结构标准化，表达个性化 |
| F-30-11 | 任何层级重复上一层级的原话 | §10.5：层级是递进，不是复制 |
| F-30-12 | 本规格未过 Human Review 即开始 V2-C 实施 | Contract LOCKED ≠ Implementation Authorized |

---

## 20. 与既有契约逐项对照

| 契约 | 约束 | 本规格合规性 |
|---|---|---|
| V2-29 · F-7 章序冻结 | 不新增/删除/重排首页章节 | ⚠️ **正式申请修订**（HDG-1）：五场景替代八章；裁决前现状有效 |
| V2-29 · Canonical Home Principle | 一个对象一个 Primary Home | ✓ 承接并扩展为 C-30-4（多个有意义入口） |
| V2-29 · Semantic Layering Rule | 五种语言层，禁跨层代写 | ✓ §12.2 增加动作层判据，不削弱原规则 |
| V2-29 · FOCUS 路由 / LIVE THESIS 状态化 / Featured 人工指定 | 已定 LOCK | ✓ §5.2 / §5.4 全部沿用；FOCUS 撤出首页属修订项（HDG-1） |
| V2-28 · Focus 非实体化 | 永不建 Focus Entity | ✓ §5.4.3：撤出首页恰恰强化非实体化——它连固定展位都不占有 |
| V2-28 · M-3 Report ↔ Thesis 并行 | 非固定父子 | ✓ THINK 场景并列呈现 Research 与 Belief，路由不声明父子 |
| V2-28 · 证伪可见性 | 落地页可见 invalidation | ✓ 四句话原则第四句 + Belief 卡 WHAT COULD CHANGE IT 入口 |
| V2-04 · HOME SPEC 章节纪律 | 七章不得新增 | ⚠️ 随 HDG-1 一并修订；V2-B 阶段同步重写 04 号文 |
| V2-10 · Observer ≠ Stock Picker | 禁推荐语言 | ✓ Reading Cards / Belief 均为观察与判断语言，无推荐语义 |
| V2-13 · Research Loop | 八步不可改 | ✓ 本规格不触碰研究生产机制 |
| V2-15 · Distribution 边界 | 不追热点不日更 | ✓ NOW 三条纪律与「真·新·大」口径一致 |
| DESIGN.md · 动效禁令 | 新动效走宪法修订 | ⚠️ Flip/Rotate/Reveal 作为交互语法属新增，**须随 HDG-2 走 DESIGN.md 增补程序** |

---

## 21. Human Decision Gates 裁决总表（2026-09-04 · 全部落定）

| Gate | 裁决项 | 裁决 | 落定位置 |
|---|---|---|---|
| **HDG-1** | 五场景（ENTRY/NOW/SEE/THINK/CHANGE）替代 V2-29 八章现状；FOCUS 撤出首页；V2-29 首页实施并入 V2-B | **PASS** | §4.4 / §5；V2-29 F-7 与 §5 模块表由本规格取代；V2-04 HOME SPEC 随 V2-B 重写 |
| **HDG-2** | 六种交互动作进入交互语法封闭集合，Flip/Rotate/Reveal 走 DESIGN.md 动效增补 | **PASS**——附带条件：DESIGN.md 动效增补随 V2-C 第一步同步修订，未修订前不得实现新动效 | §6 / §15 / §19 F-30-2 |
| **HDG-3** | Polarity 升级为 Map View Filter（三态 → 三视图） | **PASS** | §7 |
| **HDG-4** | World Map Home Preview 进入首页（World at a Glance，≤7 节点，零新实体） | **PASS**——≤7 节点、零新实体限制获 Review 明确肯定 | §8 |
| **HDG-5** | Research 四句话原则 + 隐藏结构 + 问题式标题 + SO WHAT 审核规则成为写作交付标准 | **PASS**——Review 认定为本次 Research 改造的最核心 | §9 / §10 |
| **HDG-6** | Architecture / Reader / Brand 三层语言分离（§11） | **PASS** | §11 |
| **HDG-7** | V2-A → V2-B → V2-C 三阶段；V3 独立为 System Reduction | **PASS** | §18 |

**Open Questions 裁决（2026-09-04 · 全部落定）：**

1. **OQ-1 · WUWEI：保留，但不再形成完整内容 Section。** 作为 **CHANGE → WUWEI → END** 的静默尾章。理由不是「道家元素好看」，而是它恰好承担首页「静 → 动 → 探索 → 静」的终止节奏。
2. **OQ-2 · Map State：不修改数据，只做 Read-only audit。** 确认现有 Map 数据是否已支持 YANG / YIN / TURN 三态映射；若数据不完整，记为 **V2-C 阻塞项**，不临时补数据。
3. **OQ-3 · NOW 背面文案：AI 起草 → Human 定稿。** 背面是「隐藏变量」= Editorial Judgment，不是普通摘要；与 V2-29 F-11（判断与去重是 Human 职责）一致。
4. **OQ-4 · 场景名：ENTRY / SEE / THINK / CHANGE 不进入品牌语言白名单。** 它们是 **Internal Cognitive Scene Names**——用户看到内容，不看到架构标签；进一步杜绝「后台系统直接暴露给用户」。

---

## 22. 最终验收 Checklist（V2 验收标准 · LOCK）

**HOME：**

| # | 标准 |
|---|---|
| AC-H1 | 陌生用户 30 秒内知道 TradingLabb 是什么 |
| AC-H2 | 30 秒内知道 HSN 正在关注什么 |
| AC-H3 | 不需要理解 Framework / System 才能使用首页 |
| AC-H4 | 同一内容不会以多个完整形态重复出现（语义 + 动作双重判据） |
| AC-H5 | 每个交互都能回答「它让用户理解了什么」 |
| AC-H6 | 页面整体极简，但探索路径不少于一条完整 Curiosity Chain |

**RESEARCH：**

| # | 标准 |
|---|---|
| AC-R1 | 30 秒知道 Question / Finding / Why / Risk（四句话原则可抽查） |
| AC-R2 | 5 分钟能够复述核心论证 |
| AC-R3 | Deep Dive 保留完整证据链（含 Counter Evidence / Invalidation） |
| AC-R4 | 正文不要求读者理解内部架构术语（§11.3 黑名单全站扫描为零） |

---

## 附 · 执行规则遵守声明

```text
☑ 已读 V2-28 / V2-29 全文；V2-29 止损线已在 §0 正面处理，未绕开
☑ 未修改任何源码、任何数据；未新增 Entity / Schema / 页面 / 导航；未 Commit、未 Push
☑ 问题定性为 Experience Layer Redesign；Cognitive Architecture / IA / Research Loop 零触碰
☑ 与 V2-29 LOCK 项的冲突（F-7 章序 / §5 模块表 / FOCUS 展位）已经 Human Review 裁决（HDG-1 · PASS），V2-29 相应条款由本规格取代
☑ 新动效（Flip / Rotate / Reveal）经 HDG-2 · PASS，附条件：DESIGN.md 动效增补随 V2-C 第一步同步修订，未修订前不得实现
☑ FOCUS 非实体化、Report ↔ Thesis 并行（M-3）、证伪可见性纪律全部原样承接
☑ Human Review（2026-09-04）HDG-1～7 全 PASS + OQ-1～4 裁决全部落正文（§21 / 附二），无扩大
☑ 全文零代码授权、零数据授权、零 Commit / Push 授权；实施须先完成 31 号文 Readiness Audit + Human Implementation Authorization
```

---

## 附二 · Human Review 裁决记录（2026-09-04）

> Review 结论：**PASS——HDG-1～HDG-7 全部 PASS，无 MODIFY，无 REJECT；OQ-1～OQ-4 全部给出裁决。**
> Review 总判断：**「V2-30 已经足够进入 Human Review，不需要继续堆设计；本方案值得实施。」** 最大价值不是「首页变漂亮」，而是解决两个根本问题：**Home 从「内容集合」变成「认知旅程」；Research 从「信息堆积」变成「可导航的论证」。**
> Review 纪律：**正式结束方案发散**——不得再以「首页再加一个动画 / Research 加一个 AI summary / Map 加一条时间轴」等理由扩张本规格；交互封闭集合、首页信息上限、Map ≤7 节点、Research 三层密度与 Forbidden Structures 即本规格的边界。

### HDG 裁决要点（入档）

1. **HDG-1 · PASS**：五场景正式替代 V2-29 首页结构；V2-29 的首页实施任务单并入 V2-B，不单独执行。
2. **HDG-2 · PASS（附条件）**：交互语法进入 V2，但 **DESIGN.md 必须同步修订**；修订完成前任何新动效不得实现。
3. **HDG-3 · PASS**：Polarity 从视觉状态升级为 Map View Filter。
4. **HDG-4 · PASS**：World Map Preview 进首页；「≤7 节点、零新实体」限制获 Review 明确肯定。
5. **HDG-5 · PASS**：四句话原则 + 隐藏结构 + 问题式标题 + SO WHAT 审核规则 = Research 改造最核心，成为写作交付标准。
6. **HDG-6 · PASS**：Architecture / Reader / Brand 三层语言分离。
7. **HDG-7 · PASS**：V2-A → V2-B → V2-C；V3 独立为 System Reduction。

### OQ 裁决要点（入档）

- **OQ-1**：WUWEI 保留为静默尾章（CHANGE → WUWEI → END），承担「静→动→探索→静」的终止节奏，不再形成完整内容 Section。
- **OQ-2**：Map state 只做 Read-only audit；数据不完整 = V2-C 阻塞项，不临时补数据。
- **OQ-3**：NOW 背面「隐藏变量」= Editorial Judgment，AI 起草 → Human 定稿。
- **OQ-4**：ENTRY / SEE / THINK / CHANGE = Internal Cognitive Scene Names，不进品牌语言白名单，不对用户暴露。

### 封板后的推进顺序（Review 明令 · LOCK）

```text
V2-30 DRAFT
      ↓
Human Review（2026-09-04 · PASS）              ✓ 已完成
      ↓
本文档 v1.0 · LOCKED                           ←—— 当前停在这里
      ↓
V2-30 Implementation Readiness Audit
（31 号文 Prompt → V2-30_IMPLEMENTATION_READINESS_REPORT.md）
      ↓
Human Implementation Authorization
      ↓
V2-B Content Translation
      ↓
V2-C Implementation（含 DESIGN.md 动效增补先行）
      ↓
Verification（AC-H1～H6 / AC-R1～R4）
      ↓
Commit Authorization → Commit
```

**明确禁止的路径**：V2-30 → Kimi 自行理解 → 直接改代码。Contract → Audit → Mapping → Approval → Implementation，顺序不可颠倒。

**无代码授权、无数据授权、无 Commit / Push 授权。**

---

**修订记录**

| 版本 | 日期 | 内容 |
|---|---|---|
| v0.1-candidate | 2026.09.04 | V2-A 冻结候选稿：§0 开档合规声明（V2-29 止损线对照）；Executive Decision ×7；设计宪法增补 C-30-1～C-30-6；三层判断模型；首页定位 + Cognitive Flow v1 + 五场景 Spec（ENTRY/NOW/SEE/THINK/CHANGE）；交互语法封闭集合（6 动作 + 节奏 + Curiosity Chain）；Polarity Filter Spec；World Map Home Preview Spec；Research Reader Architecture + 30 SEC/5 MIN/DEEP DIVE 规范（四句话原则 / 隐藏结构 / 问题式标题 / SO WHAT 审核）；术语表里分离；反同质化矩阵；路由；Desktop/Mobile；Accessibility/Reduced Motion；KEEP/COMPRESS/REMOVE/MOVE/REWRITE 规则；密度梯度；V2-A/B/C 与 V3 边界；Forbidden Structures F-30-1～F-30-12；契约对照表；HDG-1～HDG-7 + OQ-1～OQ-4；验收 Checklist AC-H1～H6 / AC-R1～R4；待 Human Review，零代码 / 零 Commit / 零 Push |
| **v1.0 · LOCKED** | **2026.09.04** | **Human Review PASS：HDG-1～HDG-7 全 PASS，无 MODIFY / REJECT；OQ-1～OQ-4 全部裁决（WUWEI 静默尾章保留 / Map state 只读审计不补数据 / NOW 背面 AI 起草 Human 定稿 / 场景名为内部术语不进品牌白名单）。§21 转裁决总表；追加附二裁决记录与封板推进顺序；头部标记 SPEC · CANONICAL · V2-30 · v1.0 · LOCKED；HDG-2 附条件：DESIGN.md 动效增补随 V2-C 第一步同步修订；零代码 / 零 Commit / 零 Push，实施须先完成 31 号文 Readiness Audit + Human Implementation Authorization** |
