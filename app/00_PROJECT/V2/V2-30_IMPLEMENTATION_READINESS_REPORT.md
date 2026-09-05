# V2-30 · IMPLEMENTATION READINESS REPORT — 实施就绪审计报告

> **状态：AUDIT COMPLETE · 2026-09-04 · 等待 Human Implementation Authorization**
> 执行依据：V2-31 · V2-30 IMPLEMENTATION PREPARATION PROMPT；上游：V2-30 · COGNITIVE EXPERIENCE DESIGN SPEC · v1.0 · LOCKED。
> 本轮纪律遵守：**零代码改动、零数据改动、零新实体 / Schema / 页面 / 路由、零 Commit、零 Push。** 全部结论基于本地仓库实码只读审计（与 git HEAD `197b7bf` 一致；工作区仅有 30/31 两份新文档未跟踪）。
> 审计范围：`src/pages/Home.tsx`、`src/pages/research/*`、`src/pages/IndustryMap.tsx`、`src/components/{PolarityInstrument,ResearchProductCard,Layout,Bits}.tsx`、`src/data/{polarity,ledger,content}.ts`、`src/data/domains/{map,now,thesis,ledger,site}.ts`、`src/hooks/{useReveal,useHashRoute}.ts`、`src/ink/*`、`src/App.tsx`、`src/index.css`、`DESIGN.md`、`scripts/check-data.mjs`。

---

## 1. Executive Summary

**结论（详见 §20）：READY WITH BLOCKERS。**

三个核心判断：

1. **架构可行性高于预期。** V2-30 所需的全部数据基础已经存在：Map 15/15 节点带 `state: 'yang'|'yin'|'turn'`（OQ-2 裁决的只读审计结果 = **数据完备，无阻塞**）；Polarity 仪器已是带键盘 / Reduced Motion 支持的交互组件；Belief Ledger 提供 THEN/NOW 对比所需的 `previous/current` 全部字段。**零数据改动即可支撑 V2-30 全部五个场景。**

2. **差距集中在三个组件级缺口与一个内容层缺口。** 组件缺口：① 真正的点击 Flip 卡片（现有 ResearchProductCard 是 hover 反转，不是 Flip）；② Map Home Preview（不存在）；③ Polarity → Map 的 Filter 连线（仪器状态是组件内 `useState`，未外接）。内容缺口：Research 缺 **5 MIN 层**——现有结构是「研究四格（≈30 SEC）→ 九段全文（Deep Dive）」两段跳，中间的可复述论证层不存在。

3. **阻塞项全部是治理项，不是技术项。** ① HDG-2 附条件：DESIGN.md 动效增补必须先于 Flip 实现；② V2-B 内容决策（NOW 卡片背面「隐藏变量」= Editorial Judgment，OQ-3 裁决 AI 起草 → Human 定稿；Map Preview ≤7 节点的人工圈选；Featured / Current Belief 的人工指定）等待 Human 输入；③ Human Implementation Authorization 本身未授予。

---

## 2. Current Repository State

| 项 | 状态 |
|---|---|
| Git HEAD | `197b7bf`（W37 入账 part 2/2），工作区干净，仅 V2-30 / V2-31 两份新文档未跟踪（符合零 Commit 纪律） |
| 技术栈 | Vite + React + TS + Tailwind；hash 路由（`useHashRoute`），按路由 `React.lazy` 分包 |
| 页面 | 17 个路由页面 + 4 份固定内容报告页（Report1–4 经 `ReportPage.tsx` 渲染器） |
| 数据域 | `src/data/domains/`：thesis / now / ledger / map / journal / essays / framework / system / method / cycle / dimensions / wuwei / manifesto / site 等；派生层 `polarity.ts`（Polarity SSOT）、`ledger.ts`（Belief 派生 SSOT） |
| 既有防线 | `npm run check` = `scripts/check-data.mjs`（80 项数据断言）；ErrorBoundary；非空防御渲染 |
| V2-29 实施状态 | **已落地**：Home.tsx 头部注释确认 TASK-003 完成（FOCUS 路由 Report 优先 / LIVE THESIS 纯信念状态 / RESEARCH = Featured + ALL RESEARCH / NOW Observation Language）。V2-30 是在已完成压缩的基线上做场景化重组，不是在旧版八章上叠加 |

---

## 3. Homepage Audit

### 3.1 当前首页实码结构（Home.tsx · 339 行）

| 序 | 章节 | 内容 | 数据来源 | 交互 | 语言层（V2-29 判定） |
|---|---|---|---|---|---|
| 0 | 封面 | 「观察变化，而非预测未来。」+ SITE.description + HSN 符号 + motto | `site.ts` | 无 | — |
| 1 | FOCUS | 4 × ResearchProductCard（国产算力链 / 存储周期 / 电力约束 / 商保支付端），hover 反转显示研究问题 | **组件内硬编码常量**（L41–81），href 指向 report-1～4 | hover 反转（Recognition → Orientation） | QUESTION |
| 2 | LIVE THESIS | 3 张纯信念状态卡（title + conviction% + polarity + window + 修正日） | `THESES.filter(active).slice(0,3)` + Ledger 派生 | 点击 → ThesisDetail | BELIEF |
| 3 | WHAT CHANGED MY MIND | 3 条账本行（命题名 + `previous → current` + delta + note + date） | `LEDGER.slice(0,3)` | 点击 → ThesisDetail；出口 READ JOURNAL | REVISION |
| 4 | POLARITY | 阴阳仪（`state="yang"` 初始，可点击推进三态）+ 「变化，不是线性的」文字注解 | 组件内状态，**未接数据** | Rotate（点击 / 横滑 / 键盘） | — |
| 5 | RESEARCH | 1 份 Featured（REPORT #1，硬编码 L88–93）+ ALL RESEARCH 出口 | 硬编码常量 | 点击 → Report1 | EVIDENCE |
| 6 | NOW | 5 条观察行（title + summary + date，thesisId 直链） | `OBSERVATIONS.slice(0,5)`（数据域共 35 条） | 点击 → Thesis / Map | OBSERVATION |
| 7 | WUWEI | 「有时，正确的仓位是空仓。」+ EXPLORE WUWEI 出口 | 固定文案 | 点击 → Wuwei 页 | — |
| 8 | END | HSN 印章 + 「反者道之动，弱者道之用。」 | 固定文案 | 无 | — |

### 3.2 重复投影检查（Semantic / Visual / Action 三维）

| 检查项 | 结果 |
|---|---|
| Semantic duplication | **通过**（V2-29 治理后）：FOCUS=问题 / THESIS=信念状态 / RESEARCH=证据入口 / NOW=事实 / CHANGED=修正，五层语义互不代写。算力主题出现 4 次但每处语义层不同，属「好重复」 |
| Visual duplication | **存在**：FOCUS 卡（网格卡片）、LIVE THESIS 卡（gap-px 卡片阵）、RESEARCH / NOW / CHANGED（同款 `ink-row` 列表行）——五种语义只用了三种视觉容器，且 RESEARCH / NOW / CHANGED 三处列表行视觉完全同构，「八个模块的 Section Stack」观感来源即此：全部章节 = `hairline-t` 分隔的等宽 `max-w-[1400px]` 矩形区块 |
| Action duplication | **存在**：全页阅读动作几乎只有「点击 → 跳转」一种；POLARITY 的 Rotate 是唯一例外，但它不接任何内容，是孤岛交互。V2-30 的「静→动→动→探索→静」节奏当前不成立 |

### 3.3 与 V2-30 的差距（首页侧）

| V2-30 要求 | 现状 | 差距 |
|---|---|---|
| ENTRY 极简第一屏（只建立气质） | 封面已有品牌气质但带 description 多行 + 符号 + motto | COMPRESS：压到 TRADINGLABB + 一句 + ENTER |
| NOW = Reading Cards + Flip，≤3 条 | 5 条 `ink-row` 列表行 | REBUILD：新 Flip 卡片组件 + 数量 5→3 + 背面「隐藏变量」文案（Human 定稿） |
| SEE = Polarity Filter + Map Preview | Polarity 孤岛 + Map 不在首页 | REBUILD：仪器状态外接 + 新 MapPreview 组件 |
| THINK = Selected Research + 唯一 Current Belief | Featured 行（合规）+ 3 张 Thesis 卡 + FOCUS 4 卡 | COMPRESS/MOVE：Thesis 3→1；FOCUS 撤出首页（HDG-1 已裁决）；Research 卡 Flip 化 |
| CHANGE = WHAT CHANGED? 对比卡（1 条） | 3 条账本行 | COMPRESS：3→1，行 → THEN/NOW/WHY 对比卡 |
| WUWEI 静默尾章（OQ-1） | 完整 Section（py-24/36 + 出口按钮） | COMPRESS：降为尾章体量 |

---

## 4. Research Audit

### 4.1 现状结构（ReportPage 渲染器 v4 + 4 份固定内容报告）

每份报告 = `meta` + `sections[]`（9～10 节），统一骨架：**导读 · 研究四格 → 01 观 → 02 常 → 03 核心矛盾 → 04 关键变量 → 05 格局 → 06 玄 → 07 与已有判断的关系 → 08 知止（证伪条件）→ 09 损 → 修订记录**。原生研究图形三种：`chain`（产业链咽喉图）/ `watch`（跟踪变量卡阵）/ `mind`（WHAT WOULD CHANGE MY MIND）。

### 4.2 三层阅读导航对照（V2-30 §9～§10）

| 层 | V2-30 要求 | 现状 | 判定 |
|---|---|---|---|
| **30 SEC** | THE QUESTION / THE FINDING / WHY IT MATTERS / WHAT COULD CHANGE THIS VIEW | 「导读 · 研究四格」= 研究问题 / 当前发现 / **对已有判断的影响** / **重新研究的触发** | **≈75% 存在**。两格对齐（问题/发现）；「对已有判断的影响」≈ Why it matters 但指向内部命题而非读者意义；「重新研究的触发」≈ What could change 但措辞面向作者。**REWRITE（四格措辞对齐）而非新建** |
| **5 MIN** | Key Findings，WHAT/WHY/SO WHAT/BUT 隐藏结构，可复述 | **不存在**。四格之后直接进入九段全文 | **缺口 = 本次 Research 改造的最大新增** |
| **DEEP DIVE** | 完整证据链保留 | 九段骨架完整：观（事实）/ 常（结构）/ 矛盾 / 变量 / 格局（含 chain/watch 图形）/ 玄（未知）/ 07 关系 / **08 知止（每份 5 条证伪条件，mind 组件）** / 09 损 | **KEEP，零削弱**。证据链、Counter Evidence（07 + thesis.counter 链接）、Invalidation（08）全部在位；不得因阅读友好删除（本报告确认无需删除任何内容） |

### 4.3 章节标题审计（V2-30 §10.4：分类 → 问题）

好消息：现有标题**不是**典型券商分类语言（无「产业链结构 / 供给 / 市场规模 / 企业分析」），且已有问题式雏形（「我看到了什么」「什么仍然未知」「什么会让我改变」）。待改写候选：

| 现标题（四份报告同构） | 判定 | 问题式改写候选（V2-B 定稿） |
|---|---|---|
| 导读 · 研究四格 | KEEP（内部叫法不暴露） | — |
| 01 观 · 我看到了什么 | KEEP | — |
| 02 常 · 什么东西相对稳定 | KEEP（已是问题式） | — |
| 03 核心矛盾 | **Candidate** | 例：真正的分歧在哪里？ |
| 04 关键变量 · 什么真正改变产业结构 | KEEP（已含问题） | — |
| 05 格局 · 产业状态读取 / 周期位置读取 / 度量框架设计 / 回测表 | **Candidate** | 例：现在处于什么位置？（按报告分化） |
| 06 玄 · 什么仍然未知 | KEEP | — |
| 07 与已有判断的关系 | **Candidate** | 例：这改变了我原来的判断吗？ |
| 08 知止 · 什么会让我改变 | KEEP | — |
| 09 损 · 删掉 80% 之后剩下什么 | KEEP | — |

### 4.4 Research 索引页（Research.tsx）

4 行列表 + PageHead。与 V2-30 无冲突；V2-B 可选将索引行补一句「研究问题」提升导航性（内容级改动，非必须）。

---

## 5. Interaction Audit

| Interaction | 当前是否存在 | 当前用途 | V2-30 是否保留 | 是否需要 DESIGN.md 修订 | 判定 |
|---|---|---|---|---|---|
| **Read** | ✅ 全站 | 全部阅读 | 保留 | 否 | Existing |
| **Flip**（点击翻面） | ❌ 不存在 | — | 新增（NOW 卡 / Research 卡） | **是（HDG-2 条件）** | **Candidate** |
| 类 Flip（hover 反转） | ✅ ResearchProductCard | FOCUS 卡 Recognition → Orientation | 模式可复用为 Flip 的视觉语言 | 随 Flip 一并 | Existing（可转化） |
| **Reveal** | ✅ `useReveal`（IntersectionObserver 入场浮现，一次性，有 reduced-motion 守卫） | 全站入场 | 保留 | 否 | Existing |
| **Rotate** | ✅ PolarityInstrument（±120° 单向推进、±15° 有界指针跟随、键盘 / 横滑 / reduced-motion 瞬时切态） | 首页 POLARITY 章（孤岛） | 保留并外接 Filter | 否（已存在） | Existing |
| **Explore** | ✅ IndustryMap（hover 关联高亮 + 点击节点详情） | Map 页 | 保留；Preview 复用同模式 | 否 | Existing |
| **Compare** | ✅ 弱形态（账本行 `previous → current` + delta 着色） | WHAT CHANGED MY MIND | 升级为对比卡（THEN/NOW/WHY） | 否（内容为既有数据） | Existing（需升级形态） |
| 第七种交互？ | InkTransition（路由墨转场）/ InkCursor（墨 cursor）/ SwipeBack（移动端手势返回） | 全局导航氛围 | 现状保留，**不属于阅读动作词汇表** | 否 | **Legacy（登记，不动）** |

**结论：无 Conflict 项；Flip 是唯一真正的 Candidate，被 HDG-2 条件（DESIGN.md 先行修订）门控。** 未发现需要新增第七种动作的需求。

---

## 6. Polarity Audit（OQ-2 裁决执行：Read-only）

| 检查项 | 结果 |
|---|---|
| YANG / YIN / TURN 数据绑定 | ✅ **15/15 Map 节点全部带 `state: 'yang'\|'yin'\|'turn'`**（map.ts L13；分布：yang ×7 / yin ×2 / turn ×6） |
| SSOT 纪律 | ✅ `polarity.ts` 声明 MapNode.state 为全站唯一事实源，禁止组件自推导；`derivePolarity / deriveThesisPolarity / formatPolarity` 齐备 |
| Missing field | **无** |
| Missing mapping | **无**（三态 → 三视图的映射是纯呈现层分组：`state === 'yang'/'yin'/'turn'`，无需新字段） |
| 作为 Map View Filter 的可行性 | ✅ 数据侧完全可行。**实现缺口在组件侧**：PolarityInstrument 的 `current` 是内部 `useState`（L61），作为 Filter 需把状态提升到父级（受控模式）并驱动 Map 节点的视觉响应（dim/highlight）。改动性质 = Component Refactor（受控化）+ Data Consumption（只读过滤），**零数据模型改动** |
| Implementation blocker | **无数据阻塞。** 唯一注意：仪器「点击 = 推进到下一态」的现有语义与 V2-30「点击某态 = 激活该态滤镜 + 再点取消」语义不同——V2-C 需裁决：首页仪器改受控三选，Map 页 / 其他展位保持推进式，或统一。登记为 V2-C 实施裁决点（非 Human Gate） |

---

## 7. World Map Audit

| 检查项 | 结果 |
|---|---|
| 数据来源 | `domains/map.ts`：`INDUSTRY_MAP`（15 节点）+ `MAP_EDGES`（21 边）+ `MAP_ERA`（佩雷斯标尺） |
| 节点结构 | 完整：id / name / en / stage / state / valuation / penetration / stageFocus / stateNote / observation / links / x,y / size(1–3) / essays / theses |
| 现有 UI | IndustryMap.tsx：SVG 画布（节点阴阳形态 + 估值描边 + hover 墨晕 + 关联高亮）+ NodeDetail 面板 + EraScale + 图例 + 使用说明。质量高，**V2-30 不触碰 Map 页本体** |
| 可复用 Preview | ❌ 不存在独立的 Preview 组件；但 NodeShape / 坐标系 / 边裁剪逻辑可直接复用（同文件提取或子集渲染） |
| ≤7 节点可行性（零新字段） | ✅ 两条合法路径：**A. 派生规则**：`size >= 2` → 6 节点（gpu/hbm/cowos/optical/power/cloud）——但 power、cloud 在该子集内无边相连（它们的边都连向 size-1 节点），子图断裂；**B. 人工圈选**：在 Home 组件内以常量列出 ≤7 节点 id（与 FOCUS / FEATURED 硬编码先例同构，属呈现层，零数据改动）——可保证子图连通且贴合当前叙事。**建议 B，名单属 Editorial Judgment，V2-B 由 Human 定稿** |
| 阻塞点 | 无数据 / 架构阻塞。Preview 的 Related Research / Related Thesis 计数可由节点 `theses` 字段 + 报告关联系有人工标注派生，无需新关系表 |

---

## 8. Language Leakage Audit

| 位置 | 现文案 | 判定 | 处理 |
|---|---|---|---|
| Home.tsx L92 | `INDUSTRY · 2026.08 · CANONICAL RESEARCH` | **REMOVE FROM UI**（「CANONICAL」= 工程术语泄漏，正中 V2-30 §11.2 黑名单） | V2-B REWRITE → 例：`行业研究 · 2026.08` |
| ReportPage.tsx L286 | `HUMAN REVIEW · PASS WITH REVISION · v1.1.1` | **REWRITE**（审核流程语言暴露给读者；版本号可保留为日期/版本小字） | V2-B 裁决呈现口径（如「最近修订 2026.08 · v1.1.1」） |
| Research.tsx / Home Featured | `REPORT #1` 编号标签 | **边界项**：编号本身接近 V2-30 禁止的 `REPORT-00` 形态，但作为系列名有一定品牌性 | V2-B 裁决（倾向：界面以报告标题为主，编号退为次级或不显示） |
| Research.tsx meta | `INDUSTRY · 2026.08 · RESEARCH` | KEEP（RESEARCH 属品牌词汇） | — |
| 导航（site.ts NAV） | 当下 NOW / 世界 WORLD / 命题 THESIS / 日志 JOURNAL / 无为 WUWEI | **KEEP**（全部命中品牌语言白名单） | — |
| 报告正文 | 中文自然语言为主，证据键已剥离（v4 注释确认） | KEEP | — |
| Thesis 页 | 「命题一」等编号 + `conviction` 等术语 | DEFER（Thesis 页不在 V2-30 首批范围；V2-B 语言清扫时统一过 §11 表） | — |
| 全站扫描 | 未发现 Entity / Schema / Derived View / Route / Component / 字段名出现在用户可见文案 | ✅ 通过 | — |

---

## 9. Mobile / Accessibility Audit

| 项 | 现状 | V2-30 差距 |
|---|---|---|
| 响应式 | 全站 `md:`/`lg:` 断点齐备；Layout 有移动端抽屉导航 | 新组件（Flip 卡 / MapPreview）需同级断点纪律 |
| Flip 依赖 Hover？ | 现 ResearchProductCard 是 hover 反转，移动端 hover 不存在（但卡片本身可点，信息在 `aria-label` 有冗余） | **V2-30 Flip = 点击翻面**，天然规避 hover 依赖；移动端与桌面同交互 |
| Map 降级 | Map 页 SVG 自适应；无移动端专属降级 | Preview 移动端按 V2-30 §14 允许垂直节点列，Polarity Filter 必须保留 |
| Polarity 可操作 | ✅ 触屏 tap / 横滑推进；不依赖 hover | Filter 化后保持按钮语义（三态互斥按钮组） |
| Reduced Motion | ✅ CSS 全局守卫（index.css L124–126）+ PolarityInstrument 瞬时切态 + useReveal 降级 + ResearchProductCard `motion-reduce:` 类 | Flip 必须遵守同款：reduced-motion 下瞬时切换且两面内容顺序可达 |
| 键盘 / Focus | ✅ 仪器 `role=button` + Enter/Space；FOCUS 卡 `focus-within` 同效；Thesis 手风琴有 aria | Flip 卡需 `button` 语义 + 两面内容均键盘可达 |
| 色彩独立表意 | ✅ 阴阳 = 形态（实/空/半）+ 文字标签，不只靠色 | 对比卡 THEN/NOW 数值不依赖颜色（沿用） |
| 触达目标 | 仪器 ≥150px；列表行整行可点 | 新组件 ≥44px 纪律写入验收 |

---

## 10. Home Mapping（V2-30 Scene → 现状）

| V2-30 Scene | 当前 Home 内容 | 当前组件 | 当前数据 | 处理 |
|---|---|---|---|---|
| **ENTRY** | 封面（宣言 + description + 符号 + motto） | 内联 section | site.ts | **COMPRESS**（压到一句 + ENTER；description 移到 MANIFESTO 或删除——V2-B 裁决） |
| **NOW** | NOW 章 5 条观察行 | 内联 `ink-row` | `OBSERVATIONS.slice(0,5)` | **REBUILD**（Flip ReadingCard ×≤3；背面文案 Human 定稿） |
| **SEE** | POLARITY 章（孤岛仪器 + 注解）；Map 不在首页 | PolarityInstrument；IndustryMap（页级） | map.ts（完备） | **REBUILD**（仪器受控化 + 新 MapPreview ≤7 节点 + Filter 连线） |
| **THINK** | FOCUS 4 卡 + LIVE THESIS 3 卡 + Featured 行 | ResearchProductCard / 内联卡片 / 内联行 | THESES + LEDGER + 硬编码 FOCUS/FEATURED | **MOVE + COMPRESS**：FOCUS 撤出首页（HDG-1）；Thesis 3→1 Current Belief（WHY/WHAT COULD CHANGE IT/HISTORY 三入口）；Featured 改 Flip 阅读卡 |
| **CHANGE** | WHAT CHANGED MY MIND 3 条账本行 | 内联 `ink-row` | `LEDGER.slice(0,3)` | **COMPRESS**（3→1 对比卡 THEN/NOW/WHY + SEE REVISION） |
| （尾章） | WUWEI 完整 Section + END 终幕 | 内联 | 固定文案 | **COMPRESS**（WUWEI 降为静默尾章，OQ-1；END 保留） |

> 纪律重申：Scene ≠ Section——不得实现为五个等宽 `max-w-[1400px]` + `hairline-t` 矩形块（V2-30 §4.4 / F-30-1）。阅读行为分化：ENTRY 静 / NOW Flip / SEE Rotate+Explore / THINK Reveal+Read / CHANGE Compare / 尾章静。

---

## 11. Research Translation Mapping

| 报告 | 30 SEC（四格对齐） | 5 MIN（新增层） | Deep Dive | 标题改写 |
|---|---|---|---|---|
| REPORT #1 中国 AI 算力基础设施 | 四格已有 → 措辞对齐 Q/F/Why/Risk | **新增**：收敛 §01–05 为 3～4 个 Key Findings（隐藏 WHAT/WHY/SO WHAT/BUT） | KEEP 九段 | §03/05/07 候选改写 |
| REPORT #2 存储周期 | 同上 | 同上 | KEEP | 同上 |
| REPORT #3 电力约束 | 同上 | 同上 | KEEP | 同上 |
| REPORT #4 商保支付端 | 同上（注意 05b 观察层的归层） | 同上 | KEEP | 同上 |

三层递进纪律（V2-30 §10.5）：30 SEC ≠ 摘要复制；5 MIN ≠ 30 SEC 扩写；Deep Dive ≠ 前两层重复。**5 MIN 层文案 = AI 起草 → Human 定稿（沿用 OQ-3 同款生产责任）。**

---

## 12. File-level Impact Map

| File / Component | 当前作用 | V2-30 变化 | Change Type | Risk | 需 Human Approval |
|---|---|---|---|---|---|
| `src/pages/Home.tsx` | 首页八章 | 五场景重组：删 FOCUS 展位、Thesis 3→1、NOW/WUWEI 压缩、接 MapPreview 与 Flip 卡 | Component Refactor + Content | 中（整页重构，但有 check-data 与既有数据兜底） | 是（V2-C 任务单） |
| 新增 `ReadingCard`（Flip）组件 | 不存在 | NOW / Featured Research 点击翻面 | Interaction | 中（受 HDG-2 门控） | 是 |
| `PolarityInstrument.tsx` | 自推进三态仪 | 受控化（state 提升），支持三选互斥 Filter 模式；保留现有推进模式供其他展位 | Component Refactor | 低（向后兼容式加 prop） | 是 |
| 新增 `MapPreview` 组件 | 不存在 | ≤7 节点子图 + hover/点击 + ENTER WORLD；复用 NodeShape 逻辑 | Component（新）+ Data Consumption | 中（子集圈选需 Human 定稿） | 是 |
| 新增 `BeliefCard` / `ChangeCard` | 现内联于 Home | Current Belief 单卡（三入口）/ THEN-NOW-WHY 对比卡 | Component（新）+ Data Consumption | 低 | 否（随 Home 任务单） |
| `ReportPage.tsx` | 报告渲染器 v4 | 增加 30 SEC 区（四格措辞对齐）+ 5 MIN Key Findings 区渲染支持 | Component Refactor + Content | 低（Block 类型可扩展，不动数据 schema） | 是 |
| `Report1–4.tsx` | 报告内容 | 四格措辞对齐 + 5 MIN 层内容 + §03/05/07 标题问题式改写 | Content Only | 低（证据链零删除） | 是（文案 Human 定稿） |
| `Research.tsx` | 研报索引 | 可选：行内补研究问题 | Content Only | 低 | 否 |
| `DESIGN.md` | 设计宪法 | 动效增补：Flip / 受控 Rotate Filter 入宪法（HDG-2 条件，**V2-C 第一步**） | 文档修订 | 低 | **是（HDG-2 明令）** |
| `00_PROJECT/V2/04_V2_HOME_SPEC.md` | HOME SPEC | 随 V2-B 重写以反映五场景（HDG-1 落定） | 文档修订 | 低 | 是 |
| `02_DESIGN_CONSTITUTION.md` | 设计宪法 | 增补 C-30-1～C-30-6 | 文档修订 | 低 | 是 |
| `data/domains/map.ts` / `now.ts` / `thesis.ts` / `ledger.ts` | 数据域 | **零改动**（本审计确认全部需求可由现有字段满足） | No Change | — | — |
| `App.tsx` / routes | 路由 | **零改动**（无新页面；MapPreview 是首页内组件） | No Change | — | — |
| `scripts/check-data.mjs` | 80 项断言 | 零改动；V2-C 验收继续全绿 | No Change | — | — |

---

## 13. Boundary Conflicts

**未发现 BOUNDARY CONFLICT。** 全部需求落在允许改变集合（Representation / Experience Layer / Reader-facing language / Home & Research presentation / Interaction implementation / Visual hierarchy）。特别登记两个「易误判为架构改动、实为呈现层」的点：

1. **Polarity Filter** = 仪器受控化 + 节点只读过滤，不改 MapNode、不改 polarity.ts SSOT 纪律 → Data Consumption，非架构。
2. **Map Preview ≤7 子集** = 组件内人工圈选常量（FOCUS/FEATURED 硬编码先例），不建 HomeMap 实体 / 数据文件 → 呈现层投影，符合 V2-29 F-6/F-10 与 V2-30 F-30-7。

---

## 14. Implementation Dependencies

```text
HDG-2 门控：DESIGN.md 动效增补 ──────────────┐
                                              ↓
OQ-3 / Human 输入：NOW 背面文案定稿      V2-C-1 文档先行（DESIGN.md + 02 宪法 + 04 HOME SPEC）
Map Preview 节点圈选定稿 ──→ V2-B 内容定稿 ──→ V2-C-2 Home 重构（ENTRY/NOW/SEE/THINK/CHANGE）
Featured / Current Belief 人工指定 ────┘         ↓
                                    V2-C-3 Research 阅读层（30 SEC 对齐 + 5 MIN + 标题）
                                              ↓
                                    V2-C-4 响应式 + Reduced Motion 复核
                                              ↓
                                    验收 AC-H1～H6 / AC-R1～R4 + npm run check 全绿
```

---

## 15. V2-B Content Worklist（待 Human 定稿项）

| # | 工作项 | 责任 | 依据 |
|---|---|---|---|
| B-1 | NOW 卡片 ×3：选哪三条观察 + 每条背面「隐藏变量」一句 | AI 起草 → **Human 定稿** | OQ-3 / V2-30 §5.2 |
| B-2 | Map Preview ≤7 节点圈选名单（保证子图连通 + 贴合当前叙事） | AI 建议 → **Human 定稿** | §7 / V2-30 §8 |
| B-3 | Current Belief：指定唯一命题（现 3 张 active 卡中取舍）+ 三个入口落点确认 | **Human 指定** | V2-30 §5.4.2（沿用 Featured 人工指定纪律） |
| B-4 | Featured Research Flip 卡：正面问题 + 背面核心发现一句 | AI 起草 → **Human 定稿** | V2-30 §5.4.1 |
| B-5 | CHANGE 对比卡：选最近且最有认知价值的 1 条 Revision | AI 建议 → **Human 定稿** | V2-30 §5.5 |
| B-6 | ENTRY 压缩文案：确认「TRADINGLABB + 一句 + ENTER」的最终字句（现 description 多行的去向） | **Human 定稿** | V2-30 §5.1 |
| B-7 | 四份报告：30 SEC 四格措辞对齐（影响 → Why it matters / 触发 → What could change） | AI 起草 → **Human 定稿** | §4.2 |
| B-8 | 四份报告：5 MIN Key Findings 层撰写（每份 3～4 个发现，隐藏四段式） | AI 起草 → **Human 定稿** | §11 |
| B-9 | 标题问题式改写：§03 核心矛盾 / §05 格局 / §07 与已有判断的关系（×4 份） | AI 候选 → **Human 定稿** | §4.3 |
| B-10 | 语言清扫：`CANONICAL RESEARCH` / `HUMAN REVIEW · PASS…` / `REPORT #n` 编号口径 | AI 候选 → **Human 裁决** | §8 |
| B-11 | 04_V2_HOME_SPEC 重写 + 02 宪法增补 C-30-1～6 + DESIGN.md 动效增补文案 | AI 起草 → **Human 批准** | HDG-1 / HDG-2 |

## 16. V2-C Implementation Worklist（授权后执行）

| 序 | 步骤 | Dependency | Input | Output | Risk | Rollback |
|---|---|---|---|---|---|---|
| C-1 | 文档先行：DESIGN.md 动效增补 + 02 宪法 + 04 HOME SPEC | B-11 批准 | V2-30 §2/§4/§6 | 三份文档修订 | 低 | git revert（文档） |
| C-2 | ReadingCard（Flip）组件 +  reduced-motion / 键盘 / 移动端点击翻面 | C-1（HDG-2 门控） | B-1/B-4 文案 | 新组件 + 单测式目测 | 中 | 组件独立，删文件即回滚 |
| C-3 | PolarityInstrument 受控化 + Filter 模式 | 无 | map.ts state | 升级组件（向后兼容） | 低 | prop 可选，默认旧行为 |
| C-4 | MapPreview 组件（≤7 节点 + 三态过滤视图 + ENTER WORLD） | B-2 名单、C-3 | map.ts 只读 | 新组件 | 中 | 组件独立 |
| C-5 | Home 五场景重组（ENTRY/NOW/SEE/THINK/CHANGE + WUWEI 尾章 + END） | C-2/C-3/C-4、B-1～B-6 | 全部定稿文案 | Home.tsx 重构 | 中 | git revert（单文件） |
| C-6 | ReportPage 30 SEC / 5 MIN 渲染支持 + 四份报告内容落稿 | B-7/B-8/B-9 | 定稿文案 | 渲染器扩展 + 4 内容文件 | 低 | git revert |
| C-7 | 语言清扫落地（B-10 裁决项） | B-10 | 裁决口径 | Home/ReportPage/Research 文案 | 低 | git revert |
| C-8 | 响应式 + Reduced Motion + 键盘全链路走查（桌面/平板/移动三端） | C-2～C-7 | — | 走查记录 | 低 | — |
| C-9 | 终验：AC-H1～H6 / AC-R1～R4 逐条 + `npm run check` 全绿 + 构建通过 | 全部 | — | 验收记录 | 低 | — |

---

## 17. Risks

| # | 风险 | 等级 | 缓解 |
|---|---|---|---|
| R-1 | **Scene 退化为 Section Stack**（五场景做成五个等宽矩形，换皮失败） | 高（产品性） | F-30-1 已 LOCK；C-5 验收以「阅读行为分化」为判据，不以视觉区块为准 |
| R-2 | Flip 语义丢失（变成纯动画） | 中 | F-30-4：背面必须是「隐藏变量」；文案 Human 定稿（B-1）前置 |
| R-3 | 5 MIN 层写成 30 SEC 扩写 / Deep Dive 摘要（层级复制） | 中 | §10.5 递进纪律 + B-8 Human 定稿 + AC-R2 可复述性抽查 |
| R-4 | Polarity 仪器双模式（推进式 vs 三选 Filter）语义不一致 | 低 | §6 已登记 V2-C 实施裁决点；默认保留旧行为，首页新行为受控 |
| R-5 | NOW ≤3 / CHANGE 1 条的选择引发「信息变少」担忧 | 低 | 数据域零删除（35 条观察 / 7 条账本全在）；首页 = Preview，完整列表在各自 Primary Home |
| R-6 | 施工顺序滑向「先改代码再补文档」 | 中 | C-1 文档先行是硬依赖；HDG-2 门控 Flip |

## 18. Rollback Plan

- **全部改动可回滚**：新增组件（ReadingCard / MapPreview / BeliefCard / ChangeCard）为独立文件，删除即回滚；Home.tsx / ReportPage.tsx / 报告内容为单文件 git revert；文档修订为单文件 revert。
- **数据零改动** = 不存在数据回滚问题；`npm run check` 80 项断言作为回归底线。
- 回滚决策点：C-5 之后若五场景不成立，可整页 revert 回当前 V2-29 形态（该形态本身合规且已上线）。

## 19. Human Decisions Required

| # | 决策 | 阻塞 |
|---|---|---|
| D-1 | **Human Implementation Authorization**（授权进入 V2-B / V2-C） | 一切实施 |
| D-2 | B-1～B-11 内容定稿（清单见 §15，多数为 AI 起草 → Human 定稿） | C-2 / C-4 / C-5 / C-6 |
| D-3 | HDG-2 条件执行确认：DESIGN.md 动效增补文本批准 | C-2（Flip） |
| D-4 | Polarity 仪器交互语义裁决：首页三选 Filter / 其他展位推进式，是否接受双模式 | C-3 细节（不阻塞授权） |

## 20. Final Readiness Verdict

### READY WITH BLOCKERS

**理由：**

- ✅ 数据 / 架构侧零阻塞：Map 三态数据完备（15/15），Ledger 对比数据完备，Polarity / Ledger 双 SSOT 派生层齐备，零实体 / 零 Schema / 零数据改动即可实施全部五个场景。
- ✅ 无 Boundary Conflict；全部需求落在 Experience / Representation Layer。
- ⛔ 阻塞项（全部为治理 / 内容项，非技术项）：
  1. **Human Implementation Authorization 未授予**（D-1）；
  2. **HDG-2 条件未执行**：DESIGN.md 动效增补必须先于 Flip 实现（D-3）；
  3. **V2-B 内容定稿未完成**：NOW 背面 / Map 子集 / Current Belief / Featured / 5 MIN 层等 11 项等待 Human 输入（D-2，§15 清单）。

**建议的下一步：** Human 授权后，先并行启动 §15 的 B-1～B-11（AI 起草 → Human 定稿）与 C-1 文档先行，内容定稿一项解锁对应实施一项。

---

**执行纪律声明：** 本轮完成 Audit → Mapping → Readiness Report 后立即 STOP。未修改任何源码 / 数据 / 文档（V2-30 LOCK 更新与 31 号文建档为 Human 指令的单独动作）；未 Commit、未 Push；未把 V2-30 LOCKED 当作 Implementation Authorized。
