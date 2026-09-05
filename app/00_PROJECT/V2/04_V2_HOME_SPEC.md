# V2-04 · HOME SPEC — TradingLabb V2 Homepage Final Product Specification

> **V2-03 终审定稿（2026-08-23）。** 本文件是 V2-05 首页实施的唯一规格源。
> 设计层文档，未实施。视觉与交互约束沿用 P1 设计宪法；阴阳仪规则以 05 号文件（已裁决）为准。

---

## 修订登记 · V2-29 / TASK-003（2026-09-01）

> 本登记只覆盖 V2-29（HOMEPAGE DEDUP & CONTENT ROUTING CONTRACT · v1.0 · LOCKED）
> 与 TASK-003 实施影响到的首页行为；其余章节维持原文。

1. **章序**：本文「章节总览（七章）」已被 2026-08-31 产品重排裁决取代，当前章序为
   `FOCUS → LIVE THESIS → WHAT CHANGED MY MIND → POLARITY → RESEARCH → NOW → WUWEI → END`；
   章数/章序纪律（不得新增）不变，见 V2-29 §5 / F-7。
2. **首页定位**：补充 V2-29 总规则——首页只承担 **Orientation + Preview + Routing**，
   不成为第二内容库；任何首页模块不得比其目标页面说得更多。
3. **FOCUS（新增章节行为）**：FOCUS = HSN 当前研究注意力的声明式视图（Derived View，
   永不实体化，V2-28 §4.1 LOCK）。路由（V2-29 §3.3）：直接回应该 Focus 问题的
   Research Report 优先 → 最相关 Thesis 兜底 → 两者皆无则不上首页。
4. **SECTION 04 — LIVE THESIS 修正**：首页卡片压缩为**纯信念状态**——
   保留 title / CONVICTION % / polarity / time horizon / Last revised；
   **移除 industry 描述与 conflict.but 摘要**（解释归 Thesis Detail 页，V2-29 OD-4）。
   命题内容结构（虽然但是/证据/反证/证伪/revisions）不改，本章只做投影——投影深度下调。
5. **RESEARCH（新增章节行为）**：首页只展示 **1 份 Featured Research + ALL RESEARCH 出口**，
   不承担 Research Index 职责；Featured 由现有 Canonical Content 状态中人工选择，
   不建字段 / 数据结构 / 算法（V2-29 OD-3 / TASK-003 Rule 5）。
6. **SECTION 01 — NOW 补充约束**：`thesisId` 直链保留（合法的 Observation → Judgment
   导航捷径），但 NOW 文案不得复述、总结或预判 Thesis 结论（V2-29 OD-5 / F-5）。
7. **Semantic Layering Rule**（V2-29 §4，项目级）：首页各章文案分属
   OBSERVATION / QUESTION / EVIDENCE / BELIEF / REVISION 语义层，禁止跨层代写。

---

## 修订登记 · V2-30 / C-1（2026-09-05）

> 本登记覆盖 V2-30（COGNITIVE EXPERIENCE DESIGN SPEC · v1.0 · LOCKED）与
> V2-B（HUMAN DECISION PACK · FINAL）对首页结构的裁决；授权链：
> V2-B B-11 PASS → DELTA READINESS REPORT v1.1 §08 → C-1 Documentation Update。
> 其余章节维持原文（V2-29 版结构为现行实施态；本节为 V2-C 目标结构，未实施）。
> **LOCKED ≠ Implementation Authorized：本节落盘不授权任何代码改动。**

1. **首页定位重申**：首页 = A Guided Entry Into HSN's Way of Seeing。
   职责维持 Orientation + Preview + Routing（V2-29 原则不变），不是第二内容库。

2. **五场景目标结构（V2-C 实施对象）**：

   ```text
   SCENE 01 · ENTRY   —— 品牌 + 一句宣言 + ENTER。整屏静态，零开场动效。
   SCENE 02 · NOW     —— ≤3 张 Reading Cards（Flip：表面 → 隐藏变量）。
                         Observation Language；背面 = Editorial Judgment（Human 定稿）。
   SCENE 03 · SEE     —— Polarity（Rotate，作为 Map View Filter）
                         + World at a Glance（≤7 节点 Preview，Explore）。
   SCENE 04 · THINK   —— 1 个 Current Belief（WHY / WHAT COULD CHANGE IT / HISTORY 三入口）
                         + 1 份 Featured Research（Flip 阅读卡，READ 5 MIN / DEEP DIVE 出口）。
                         FOCUS 撤出首页（转为 Research / World 的 Derived View 入口）。
   SCENE 05 · CHANGE  —— 1 张 Revision 对比卡（THEN / NOW / WHY + SEE REVISION）。
                         无真实修正时整场景隐藏。
   尾章 · WUWEI       —— 静默尾章（OQ-1），不再形成完整内容 Section。
   END                —— 终幕（保留）。
   ```

3. **形态纪律（V2-B 修正① · LOCK）**：Scene ≠ Section。五场景是设计师与 AI 的
   认知骨架，不是用户可见目录——**界面不得出现 ENTRY / NOW / SEE / THINK / CHANGE
   场景标签或幕间分隔标题**；场景靠阅读行为的切换区分。五场景的阅读行为、垂直节奏、
   留白与网格宽度必须不同；禁止实现为五个等宽等距矩形块（F-30-1）。
   验收硬条件：**用户不需要知道首页存在五个场景，但应能感受到阅读行为正在变化。**

4. **DELTA-01 · Map Preview Node Detail（Human Approved · Implementation Constraint）**：
   Home Map Preview 点击节点后只显示 **名称 + State + EXPLORE WORLD →**。
   禁止 Related Research count / Related Thesis count / Current State 明细 /
   Observation / StateNote / StageFocus。本条正式取代 V2-30 §8.3 点击卡的
   Related 计数字段；仅适用 Home Map Preview，不影响完整 IndustryMap 页、
   `map.ts`、MapNode schema、MAP_EDGES、Research、Thesis、路由与数据层。

5. **Polarity 不是解释器（V2-B 修正③ · LOCK）**：SEE 场景默认 = 完整切片；
   点击 YANG / YIN / TURN = 节点发生真实视觉变化；不写长段解释「什么是阳、什么是阴」
   ——Polarity 的语义由 Map 的变化来教，不由段落来讲。现有注解段落压缩至至多一句或删除。

6. **Current Belief 视觉层级（V2-B 修正④ · LOCK）**：判断 > 数字——
   视觉层级为 当前判断 → WHY / Evidence / Counter-evidence / History → conviction 数字
   （仅辅助信息）；72% 等数字不得做大字号 / 居中聚焦 / 仪表盘式视觉主角。

7. **场景信息量上限（V2-B §3.2 · LOCK）**：ENTRY = 1 品牌 + 1 句 + 1 入口；
   NOW = 3 卡 ×（正面 2 行 + 背面 3 行）；SEE ≤ 7 节点 + 3 态；
   THINK = 1 信念 + 1 研究卡；CHANGE = 1 张对比卡；WUWEI + END = 现状压缩保留。

---

## 〇、首页定位

**Brand + Orientation + Research Entry Point。** 不是 Dashboard，不是媒体首页，不是机构门面。

- 低信息密度、高方向感、高品牌辨识度；
- 首次访问者 30–60 秒内理解：①这个网站关注什么 ②HSN 当前在研究什么
  ③他如何形成判断 ④他如何修正判断 ⑤TradingLabb 与普通投资网站有什么不同；
- 信息密度分层：HOME（低密度/高方向感）→ MAP（高密度/高信息量）→
  THESIS（中密度/高逻辑）→ JOURNAL（中密度/高时间性）。

## 章节总览（七章，不得新增）

```text
01 NOW                  What is changing?        → Observation
02 POLARITY             YIN / TURN / YANG        → Core Worldview Instrument
03 HOW I THINK          TradingLabb Loop         → 方法论入口
04 LIVE THESIS          What do I believe?       → Interpretation
05 WHAT CHANGED MY MIND 观点修正高光              → Revision
06 WUWEI                When not to act          → 行为原则
07 END                  反者道之动，弱者道之用     → 终幕
```

数据关系主轴（首页即此链条的缩影）：

```text
NOW (Observation) → MAP (Context) → THESIS (Interpretation) → JOURNAL (Revision)
```

实体关系：`Observation optional→ MapNode / optional→ Thesis`；`MapNode ↔ Thesis`；
`Thesis → Journal/Revision`；`Essay → Thesis`。

---

## SECTION 01 — NOW

1. **Purpose**：3 秒回答"这个人现在在观察什么"。
2. **User Question**：What is changing?
3. **Content**：3–5 条 Current Observations。每条：`title` + 一句 concise observation +
   `date` + 可选 `polarity` + 可选 `linkedNode` + 可选 `linkedThesis`。
   **Observation ≠ Thesis**（例：Observation="AI inference cost continues to decline."；
   Thesis="Lower inference cost will expand application demand faster than expectations."）。
   严禁出现：股价、涨跌幅、新闻标题流、行情数字。
4. **Data Source**：❌ 当前不存在。未来 `domains/now.ts`（新 domain，SIGNALS 数据模型，
   依赖 C-04 裁决）。**过渡态**：由人工在 site.ts ACTS 层维护 3–5 条静态观察（内容与代码分离原则不变）。
5. **Primary CTA**：点击单条 Observation → 关联 Map Node（`#/map`）或 Thesis（`#/thesis`）。
6. **Secondary CTA**：无。
7. **Interaction**：沿用 `.ink-row` / `.ink-hv` 墨晕 hover；点击走墨入水转场。无新交互。
8. **Mobile behavior**：单列纵向，编号 + 一行标题 + 一句观察；移动端首屏优先保留此章。
9. **Empty state**：少于 3 条时不补齐，有几条显示几条；0 条时整章不渲染（不是"暂无内容"）。
10. **Error state**：数据缺失字段时该条降级为仅 title；由 check-data 事前断言拦截。
11. **Accessibility**：每条为语义化链接或按钮；编号用 ink-3（装饰豁免），标题与正文满足对比度。
12. **Performance**：纯文本渲染，零成本；无图片、无字体外请求。

## SECTION 02 — POLARITY

1. **Purpose**：品牌核心认知仪器——"我用什么方式理解变化"。首页唯一东方具象符号。
2. **User Question**：Change is not linear —— 增长与出清如何互为条件？
3. **Content**：Polarity Instrument（阴阳仪）+ 三态语义：
   YANG（Growth / Adoption / Expansion）、TURN（Transition / Reversal / Inflection）、
   YIN（Constraint / Clearing / Contraction）。标题建议 **CHANGE IS NOT LINEAR.**，
   副文案 "Growth contains the conditions of contraction. Contraction creates the conditions of growth."
4. **Data Source**：静态配置（首页仪器状态可手工设定，或与 `domains/map.ts` 的
   `MapNode.state: yang|yin|turn` 联动——联动属 V2-04 实施范围，远期 Polarity Filter 另议）。
5. **Primary CTA**：Click → 阴阳翻转，切换 YANG/YIN 语义列表；第三次交互进入 TURN。
6. **Secondary CTA**：无（不做导航入口）。
7. **Interaction**（C-01/C-02 已裁决，硬约束）：**默认完全静止，无开场自动旋转**；
   Hover 允许状态响应（缓慢旋转 + 语义显示）；Click 允许状态切换；
   `prefers-reduced-motion` 下**零运动**（仅内容切换）。禁止粒子/辉光/3D/复杂背景/WebGL。
   **全站阴阳图形至多 2 个**：Cycle 页现有 Taiji（保留不动）+ 本章 1 个；禁止第三个。
8. **Mobile behavior**：仪器居中，尺寸收缩；touch 下 tap 等效 click；无 hover 态时只显示当前状态语义。
9. **Empty state**：不适用（仪器即内容）。
10. **Error state**：SVG 渲染失败不阻塞页面（纯展示组件，ErrorBoundary 兜底）。
11. **Accessibility**：`aria-label` 标明当前状态（"Polarity: YANG — Growth, Adoption, Expansion"）；
    状态切换可用键盘触发（button 语义 + `:focus-visible` 朱砂焦点环）。
12. **Performance**：手写 SVG（参照现有 Taiji 组件规格），动画用 CSS transform；
    静止时零计算（沿用墨系引擎原则）。

## SECTION 03 — HOW I THINK

1. **Purpose**：展示研究方法论，回答"他到底怎么研究"。
2. **User Question**：How does he form beliefs?
3. **Content**：TradingLabb Loop 纵向流程：
   `OBSERVE → MAP → THINK → THESIS → ACT / DON'T ACT → REVISE → ARCHIVE`；
   核心文案：**"I don't predict the future. I update my beliefs as reality changes."**
   标题用 **HOW I THINK**，不用 SYSTEM。
4. **Data Source**：静态内容（site.ts 或新 domain 常量，实施时定）。
5. **Primary CTA**：`EXPLORE SYSTEM →` → `#/system`（现有路由，无需新建）。
6. **Secondary CTA**：流程节点可点击 → 对应栏目（OBSERVE→首页 NOW 锚点或 `#/map`、
   THESIS→`#/thesis`、REVISE→`#/journal`）；无合适锚点的节点不挂链接，记录为未来任务。
7. **Interaction**：纯排版 + 现有 hover 墨晕；无动画编排。
8. **Mobile behavior**：纵向流程天然适配；移动端可在 LIVE THESIS 之后展示（让位规则见十一节）。
9. **Empty state**：不适用（静态内容）。
10. **Error state**：不适用。
11. **Accessibility**：流程为有序列表语义；箭头用 CSS 绘制，不依赖图标字体的屏幕阅读器陷阱。
12. **Performance**：纯文本，零成本。

## SECTION 04 — LIVE THESIS

1. **Purpose**：首页第一次出现真正的投资判断——"他现在相信什么"。
2. **User Question**：What do I believe, with how much conviction, and when did I last update it?
3. **Content**：**至多 3 个**命题卡片。每张：
   `title` + `CONVICTION %`（墨色大数字，tabular-nums）+ `polarity`（如 YANG → TURN）+
   `time horizon` + `Last revised` 日期 + 一句 concise claim + CTA。
   命题内容结构（虽然但是/证据/反证/证伪/revisions）**绝对不改**，本章只做投影。
4. **Data Source**：✅ `domains/theses.ts`（`probability` / `window` / `revisions` / `conflict`）。
   ⚠️ 缺口：**Thesis 无 `polarity` 字段**——需从关联 `MapNode.state` 推导或新增字段（实施时裁决，记入未来任务）。
5. **Primary CTA**：`READ THESIS →`。⚠️ `#/thesis/:id` **不存在**（P4 技术债）——
   过渡态链接到 `#/thesis` 聚合页；二级路由列为 V2-06 前置任务。
6. **Secondary CTA**：卡片上关联 Map Node 标记 → `#/map`（现有双向链已支持）。
7. **Interaction**：沿用 `.ink-card`（不下沉、不浮起，hover 墨意轻变）；无新组件语言。
8. **Mobile behavior**：三卡纵列堆叠；移动端优先保留此章。
9. **Empty state**：命题库为空时不渲染本章（check-data 已强制 THESES 非空，实际不会触发）。
10. **Error state**：单卡字段缺失时跳过该卡；check-data 断言 probability ∈ [0,100]、revisions 为数组。
11. **Accessibility**：卡片为链接语义；概率数字配合文字标签 CONVICTION，不依赖纯颜色传达。
12. **Performance**：数据已随页面 chunk 加载；无额外请求。

## SECTION 05 — WHAT CHANGED MY MIND

1. **Purpose**：全站最强信任机制——公开展示认知修正，而非" Latest Journal "。
2. **User Question**：他上次改观点是什么时候？为什么？
3. **Content**：1–3 条 Revision 高光。每条：`subject` + `previous → current`（如 72 → 64）+
   `reason`（一两句）+ `date` + 可选 `linkedThesis`。
   **这是 Revision，不是普通 Journal entry。**
4. **Data Source**：⚠️ 部分存在。`domains/journal.ts` 的 `up`/`down` 条目含概率变化，
   但 delta 嵌在 `note` 自由文本里（"上调概率 65% → 72%"），`target` 是自由文本非 thesis id。
   **结构化缺口**：需为 Revision 增加 `prev` / `current` / `thesisId` 字段（V2-06 任务，本次不实现）；
   过渡态由人工从 journal 精选并在数据层维护展示字段。
5. **Primary CTA**：`READ JOURNAL →` → `#/journal`（现有路由）。
6. **Secondary CTA**：subject 链接 → 对应 Thesis（依赖 `#/thesis/:id`，未来任务）。
7. **Interaction**：沿用现有列表墨晕；无新交互。
8. **Mobile behavior**：单列；移动端优先保留此章。
9. **Empty state**：无 revision 条目时整章不渲染。
10. **Error state**：check-data 对 JOURNAL 结构断言；字段缺失降级为仅 subject + note。
11. **Accessibility**：概率变化同时以文字（"72 → 64"）呈现，不依赖箭头图形。
12. **Performance**：纯文本，零成本。

## SECTION 06 — WUWEI

1. **Purpose**：让用户理解 TradingLabb 不把"行动"当成投资的终点——Act / Don't Act 的行为原则。
2. **User Question**：When is not acting the right decision?
3. **Content**：克制，一段即可：**"Sometimes the correct position is no position."**
   不堆积哲学文字，首页只承担 orientation。
4. **Data Source**：✅ `domains/wuwei.ts`（可引用现有核心句）或静态文案。
5. **Primary CTA**：`EXPLORE WUWEI →` → `#/wuwei`（现有路由）。
6. **Secondary CTA**：无。
7. **Interaction**：无新交互。
8. **Mobile behavior**：移动端可最后展示（让位优先级最低）。
9. **Empty state**：不适用。
10. **Error state**：不适用。
11. **Accessibility**：常规文本与链接。
12. **Performance**：零成本。

## SECTION 07 — END

1. **Purpose**：终幕——品牌落款，极其克制。
2. **User Question**：（无，情绪收束）。
3. **Content**：
   ```text
   反者道之动
   弱者道之用

   HSN
   TRADINGLABB

   Observe change.
   Update beliefs.
   ```
   保留现有终幕朱砂句号（P1：本页唯一决断标记）。HSN 印章（HSNSeal 88px，现有规格）。
4. **Data Source**：静态 + 现有 Brand 组件。
5. **Primary CTA**：无。
6. **Secondary CTA**：无。
7. **Interaction**：无新交互；印章沿用现有 hover 微转（唯一保留的符号动效）。
8. **Mobile behavior**：居中收束。
9. **Empty state**：不适用。
10. **Error state**：不适用。
11. **Accessibility**：印章 img/SVG 有 aria-label。
12. **Performance**：零成本。

**END 禁止项**（全首页适用）：Newsletter 弹窗、社交墙、行情 ticker、CTA 墙、广告、
Portfolio、登录、AI Chat、热门文章、数据 Dashboard。

---

## 十一、移动端让位规则

移动端优先保证：**NOW → POLARITY → LIVE THESIS → WHAT CHANGED MY MIND**。
HOW I THINK 与 WUWEI 次序可后移。不允许为桌面布局破坏移动端阅读。

## 十二、与 ARK / 机构投资网站的边界

不复制：Fund homepage / Asset manager homepage / Financial media homepage / Trading terminal。
可借鉴：Research discipline、Thesis presentation、Data visualization、Long-term worldview、Research archive。
最终产品必须保持 **Personal Research Lab** 身份。
（内部理解：TradingLabb 底层是 Personal Investment OS，但品牌文案不使用该词。）

## 十三、当前实施缺口汇总（Future Implementation，本次不实现）

| # | 缺口 | 依赖阶段 |
|---|---|---|
| G-01 | NOW 数据模型（`domains/now.ts` / SIGNALS） | C-04 裁决 → V2-07 |
| G-02 | `#/thesis/:id` 二级路由 | V2-06 前置（P4 技术债） |
| G-03 | Thesis `polarity` 字段（或从 MapNode.state 推导的逻辑） | V2-05 实施时裁决 |
| G-04 | Journal Revision 结构化（`prev`/`current`/`thesisId`） | V2-06 |
| G-05 | Essay → Thesis 命题级链接 | V2-06 |
| G-06 | Polarity Instrument 组件（含 P1 成文例外写入） | V2-04 |
| G-07 | 导航按 Option C 改组（site.ts NAV） | V2-05 配套 |

## 十四、Acceptance Criteria（V2-05 验收标准）

| AC | 标准 | 现状标记 |
|---|---|---|
| AC-01 | 首次访问者 30 秒内理解 TradingLabb 是什么 | 实施后人工走查 |
| AC-02 | 首页可区分 Observation / Thesis / Revision 三种内容 | 依赖 G-01 过渡态 |
| AC-03 | 能从首页进入至少一个真实 Thesis | 过渡态进 `#/thesis` 聚合页；`#/thesis/:id` 为 Future |
| AC-04 | 能从 Thesis 进入 Map | ✅ 现有双向链已支持 |
| AC-05 | 能从 Thesis 看到 Revision History | ✅ 现有 revisions 已渲染；命题级锚点为 Future |
| AC-06 | 首页不承担实时行情 Dashboard 功能 | 设计已禁止 |
| AC-07 | Polarity Instrument 不自动运动 | C-02 已裁决，实施时验证 |
| AC-08 | Reduced Motion 下无运动 | 实施时验证（CSS 媒体查询） |
| AC-09 | 移动端可正常阅读 | 实施后 CDP 实测截图走查 |
| AC-10 | 首页不存在第三个阴阳图形 | C-01 已裁决，实施时验证（全站 grep Taiji/阴阳图形） |

## 十五、Open Decisions

无新增。G-03（Thesis polarity 字段 vs 推导）为实施期技术裁决，不构成产品冲突；
C-04（SIGNALS 形态）维持挂起，排期 V2-07。
