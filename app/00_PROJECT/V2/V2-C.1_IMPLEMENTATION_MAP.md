# V2-C.1 · POST-IMPLEMENTATION EXPERIENCE REFINEMENT — IMPLEMENTATION MAP

> 任务身份：V2-C 已完成（Final Commit `c4ace8c`，PHASE 9 = 65/65 PASS，PHASE 11 = PASS）。
> 本文件是 V2-C.1 的 Audit + Design Mapping + Boundary Check 产物。
> 状态：**STOP — 等待 Human Authorization（PHASE 3 Review Gate）**。未修改任何代码 / 数据。

---

## 0. PHASE 1 · REPOSITORY AUDIT（事实层）

### 0.1 Git 状态

| 项 | 实测值 |
| --- | --- |
| Repo | `tradinglab/`（workspace 根不是 repo） |
| Branch | `main` |
| HEAD | `c4ace8c` feat(v2-c): complete cognitive presentation implementation ✅ 与文档一致 |
| Working tree | clean（无任何未提交改动） |

### 0.2 首页现状（`src/pages/Home.tsx`，314 行）

当前实际结构（自上而下）：

1. **ENTRY**：`HSNSymbol size=110` +「观察变化，而非预测未来。」+ `ENTER ↓` 按钮（scrollIntoView → `#home-now`）
2. **NOW**：3 张 FlipCard（`NOW_CARDS` 硬编码：存储 report-2 / 算力链 report-1 / 商保 report-4）
3. **SEE**：PolarityInstrument（受控展示）+ 三态 Filter 按钮 + MapPreview（7 节点 6 真边）
4. **THINK**：WHAT I BELIEVE NOW（compute 命题，三个 btn-line：WHY / WHAT COULD CHANGE IT / HISTORY）+ Featured Research FlipCard（report-1，与 NOW 卡重复）
5. **CHANGE**：WHAT CHANGED 一张卡（LEDGER `rev-memory-cycle-20260830`，65→68）
6. **WUWEI**：「有时，正确的仓位是空仓。」（无链接，已是静默尾章）
7. **END**：HSNSeal +「反者道之动，弱者道之用。」

### 0.3 组件现状

**FlipCard.tsx**（85 行）：正面整面 `<button>` 点击翻面；背面底部 = CTA 链接组 + `← 翻回` 按钮。
正面左下角有 `FLIP →` 提示。无 3D、reduced-motion 已处理、键盘可达已具备。

**PolarityInstrument.tsx**（199 行）：`META` 已携带批准的语义词汇——
yang = 增长/采纳/扩张，turn = 过渡/反转/拐点，yin = 约束/出清/收缩。
Home 内 `FILTER_META` 只有 zh/en 二字段；选中态样式 = `font-bold underline underline-offset-8`（下划线确认存在）。

**MapPreview.tsx**（165 行）：7 节点链式排布（百分比坐标属展示层），边 `strokeWidth=1 / opacity 0.25`，
节点圆点 14–22px。**审计发现：所有节点实际上都是可点击 `<button>`**——滤镜激活时未命中节点仅 `opacity-20` 退淡，
并无 `pointer-events-none`。「未点亮节点点击无效」在当前实现中不成立；真实问题是**退淡态在视觉上被读作"禁用"**（State 与 Interaction Permission 在感知层混淆）。
Node Detail = Name + State + `EXPLORE WORLD →`（固定 `#/map`）。

### 0.4 数据现状

**thesis.ts**：9 条命题。创新药确有两条——
- 命题八 `innovative-drug`（62%，2026.08.09 建，"零和游戏里先动者不需要等业绩验证"）
- 命题九 `innovative-drug-value-capture`（55%，2026.09.04 建，"产业趋势 ≠ 板块普遍估值扩张"）

**关键事实**：命题九的建命题记录明确写道「2026-09-04 裁决：创新药两套对立框架拆层——产业趋势层 vs 资本市场映射层」。
即二者是 **2026-09-04 Human 裁决主动拆出来的两个认知对象**，不是历史遗留重复。

**ledger.ts**：7 条 Revision，append-only。与本文档相关的两条：
- `rev-innovative-drug-value-capture-20260904`：**55 → 55（confirm）**，命题九初始值本人校准确认
- `rev-robot-20260904`：**51 → 46（down）**，**thesisId = `robot`（机器人），不是创新药**

**⚠️ 审计纠偏**：V2-C.1 指令文档 §20 称「Innovation Drug 当前 55→55 与 51→46 存在重复/过时」。
实测：51→46 属于机器人命题（宇树首日情绪定价崩溃核实），与创新药无关。
55→55 是命题九的校准确认记录（OD-3 裁决：confirm 是合法账本事件）。
**两条记录分属不同命题，不存在同一命题的重复条目。**
真实问题应重新表述为：Journal 页 01 REVISION 区把 delta=0 的 confirm 记录与真实变化混排展示，产生"55→55 这种没有信息量的行"。

**journal.ts**：叙事层，无 conviction 字段（V2-06-02 已迁出），无需改动。

**Journal.tsx**：01 REVISION 区直接 `LEDGER.map(...)` 全量渲染——confirm（delta=0）行原样显示，是"55→55"可见性的来源。

### 0.5 路由 / 锚点

- `#/research/report-N@锚点` 锚点机制存在（App.tsx，滚动由 ReportPage 承担）
- **ThesisDetail 无锚点机制**（WHY / WHAT COULD CHANGE IT 当前都链到 `#/thesis/compute` 页顶——这就是"两者相同"的实质：不是文案重复，是两个入口指向同一落点且无区分）
- `#/map` 不支持节点级锚点

### 0.6 研报清单

4 份：report-1 算力链 / report-2 存储 / report-3 电力约束 / report-4 商保支付端。
首页 NOW 卡目前 3 张（缺 report-3 电力）。

---

## 1. PHASE 2 · IMPACT MAP

| Area | Current Problem | Proposed Change | Files | Data Impact | Route Impact | Risk |
| --- | --- | --- | --- | --- | --- | --- |
| **HOME-01** Logo | 导航（HSNSymbol 22 + trading·lab by HSN）与 Hero（HSNSymbol 110）双品牌锚点 | Hero 删除完整图形 Logo，保留文字身份「HSN / 交易探索实验室」；导航不动 | `Home.tsx` | 无 | 无 | 低 |
| **HOME-02** ENTER | ENTER 按钮是伪入口，用户自然行为即下滑 | 删除 ENTER 按钮与 `enter()` 函数；不新增替代 CTA | `Home.tsx` | 无 | 无 | 低 |
| **HOME-03** 宣言回首页 | 「HSN 的交易研究实验室……玄之又玄，众妙之门。」（`SITE.description`，现仅在 Manifesto 页渲染） | 首页 Hero 恢复该段（"研究"→"探索"），短而有重量，不做巨型 Hero 文案 | `Home.tsx`、`site.ts`（文案改字）、`Manifesto.tsx`（是否保留待裁决，见 §3-D1） | 文案字段改一字（研究→探索） | 无 | 中（B-6 曾裁决迁至 Manifesto，本次为反向裁决） |
| **HOME-04** Research 卡数量 | 固定 3 卡，report-3（电力）缺位 | 卡数 = 当前值得探索的研究动态决定，4–6 上限；本轮补 report-3 至 4 卡 | `Home.tsx`（NOW_CARDS） | 无（卡文案为 presentation copy） | 无 | 低 |
| **HOME-05** FlipCard 交互 | 背面靠「← 翻回」按钮翻回，控制权交给专门按钮 | 背面整卡点击 = 翻回；删除「← 翻回」；右下角仅保留 `EXPLORE →`（删 RESEARCH 字样）；Explore 为独立 `<a>`，点击不触发翻回（stopPropagation）；键盘 Enter/Space 翻面、焦点可见、reduced-motion 瞬时 | `FlipCard.tsx`、`Home.tsx`（CTA 文案） | 无 | 无 | 低 |
| **HOME-06** Polarity | 选中态下划线 = 重复编码；三态缺少最小语义 | 删除 underline；在 Filter 按钮组下加一行极短语义（从 PolarityInstrument `META.words` 既有批准词汇提取：阳—增长·采纳·扩张 / 转换—过渡·反转·拐点 / 阴—约束·出清·收缩），不写新理论 | `Home.tsx` | 无（复用既有批准文案） | 无 | 低 |
| **HOME-07** Map Preview 视觉重量 | 边 1px/25% 透明、点 14–22px，与 Polarity 并置失衡 | 采 Option A+B 组合：节点圆点放大（约 22/28/34px）、边加粗加深（2px / 40%）、节点间距与容器高度增加；节点数、实体、数据层零改动 | `MapPreview.tsx` | 无 | 无 | 低 |
| **HOME-07b** 节点点击语义 | 退淡节点视觉读作"禁用"（实际可点） | 退淡态从 `opacity-20` 调整为仍可辨识可点的表达（如 opacity-40 + 标签保留）；aria 文案明确"可点击查看"；State ≠ Interaction Permission 写入组件注释 | `MapPreview.tsx` | 无 | 无 | 低 |
| **HOME-07c** Explore 目的地 | EXPLORE WORLD 一律跳 `#/map`，与完整地图形成重复操作链 | 按节点 Primary Home 分流：`hbm→#/thesis/memory-cycle`、`gpu→#/thesis/compute`、`optical→#/thesis/optical-module`；无命题节点（cowos/server/idc/power）回落 `#/map`；CTA 文案随目的地变化（EXPLORE THESIS → / EXPLORE WORLD →） | `MapPreview.tsx` | 无（读既有 `node.theses`） | 无（全部既有路由） | 低 |
| **HOME-08/09** Current Belief 模块 | WHY 与 WHAT COULD CHANGE IT 同落点（`#/thesis/compute`，ThesisDetail 无锚点）；THINK 区与 NOW / CHANGE 信息重叠；Featured Research 卡与 NOW 卡重复（同为 report-1） | **整个 THINK 区从首页移除**（Current Belief + Featured Research 一并撤出）。判断详情归 `#/thesis/compute` Primary Home；首页只留 Research / World / What Changed 三主体 | `Home.tsx` | 无 | 无 | 中（B-3/B-4 原为 Human PASS 项，本轮为体验减法，需 Human 确认接受该减法） |
| **HOME-10** What Changed | 仅 1 条（memory-cycle 65→68） | 从 LEDGER 派生：每命题取最新一条 **delta≠0** 的真实变化，按时间倒序取 3–5 条。当前候选恰好 4 条：robot 51→46（09.04）/ memory-cycle 65→68（08.30）/ compute 65→72（07.31）/ newenergy 57→63（07.05）。每条 = 题名 + THEN→NOW + reason 摘要 + 链接 | `Home.tsx`（可加派生 helper 于 `data/ledger.ts`） | 无（派生层读取，Ledger 不动） | 无 | 低 |
| **HOME-11** WUWEI | 已是静默尾章（一句话、无 CTA） | 保留现状；可选加 `WUWEI →` 极简链接（#/wuwei），不加亦可——倾向加，给"收"一个出口但不破坏静 | `Home.tsx` | 无 | 无 | 低 |
| **THESIS** 创新药双命题 | 命题八 / 命题九并存 | **建议不合并**（见 §2 Boundary Check）；若 Human 推翻 2026-09-04 拆层裁决再议 | （暂不改动） | — | — | **高：与既有裁决冲突** |
| **JOURNAL** 展示投影 | 01 REVISION 区全量渲染 LEDGER，confirm（55→55 / 46→46）行无信息量 | 展示层投影规则：REVISION 区默认只渲染 delta≠0 行；confirm 行折叠为弱化样式或收进"含校准记录"开关。**底层 LEDGER 数据零改动** | `Journal.tsx` | 无 | 无 | 中（Ledger 完整性 vs 可读性，见 §3-D2） |

---

## 2. BOUNDARY CHECK

| 边界 | 状态 |
| --- | --- |
| V2-30 LOCKED 架构 | ✅ 不动（五场景为内部名，首页本就不显示场景标签，本轮不引入任何场景名） |
| IA / 路由体系 | ✅ 不动（所有 Explore 目的地均为既有路由） |
| MapNode schema / MAP_EDGES | ✅ 不动（MapPreview 只读；布局坐标本来就是展示层） |
| Ledger 历史记录 | ✅ 不动（55→55 / 46→46 全部保留，仅改展示投影） |
| Thesis 历史 revision | ✅ 不动 |
| Research canonical content | ✅ 不动（首页卡文案为 presentation copy，不动报告正文） |
| 数据实体 | ✅ 零新增 |
| Commit / Push | ✅ 未执行，本轮 STOP BEFORE COMMIT |

### ⚠️ BOUNDARY CONFLICT（1 项）

**创新药双命题合并**与 **2026-09-04 Human 裁决**（两套对立框架拆层，命题九建命题记录原文）直接冲突。
审计结论：命题八（先动者卡位 / 零和游戏）与命题九（价值捕获路径分化）是**被故意拆开的两个认知对象**，
一个回答"要不要参与"，一个回答"价值归谁"——属于真正的认知分层，不是重复。
→ 按指令「如果存在真正不可合并的认知冲突，STOP 并上报 Human」执行：**不合并，上报**。

---

## 3. V2-C.1 DESIGN REVIEW

| 项 | 判定 | 说明 |
| --- | --- | --- |
| HOME-01 Logo 去重 | **A · Approved as-is** | 删 Hero 图形 Logo，保留导航 |
| HOME-02 删 ENTER | **A · Approved as-is** | 无替代 CTA |
| HOME-03 宣言回首页 | **B · Approved with modification** | "研究"→"探索"照办；**D1 待裁决**：Manifesto 页是否同时撤下该段（不撤 = 同一内容两个 Primary Home，违反 P2；撤 = 推翻 B-6 落点裁决。建议：撤，Manifesto 以六条正文为主体） |
| HOME-04 卡数 4–6 | **A · Approved as-is** | 本轮 4 卡（补 report-3 电力） |
| HOME-05 FlipCard | **A · Approved as-is** | 整卡翻回 + 唯一 EXPLORE → |
| HOME-06 Polarity | **A · Approved as-is** | 删下划线；语义取 META.words 既有批准词汇 |
| HOME-07 Map 视觉 | **A · Approved as-is** | Option A+B 组合（放大节点/边/空间），不加节点 |
| HOME-07b 点击语义 | **A · Approved as-is** | 审计确认底层已全部可点，修的是感知层 |
| HOME-07c Explore 分流 | **A · Approved as-is** | 有命题→命题页；无命题→#/map |
| HOME-08/09 删 THINK 区 | **B · Approved with modification** | 方向批准；因 B-3/B-4 曾是 Human PASS 项，请 Human 明确确认接受此减法 |
| HOME-10 What Changed 3–5 条 | **A · Approved as-is** | 每命题最新 delta≠0 一条，当前 = 4 条 |
| HOME-11 WUWEI | **A · Approved as-is** | 保留静默尾章，可选 WUWEI → 链接 |
| Thesis 合并 | **C · Boundary Conflict** | 与 2026-09-04 拆层裁决冲突，不执行，待 Human 明示 |
| Journal 投影 | **D · Needs Human Decision** | **D2 待裁决**：(a) REVISION 区只显示 delta≠0（推荐）；(b) confirm 行弱化保留；(c) 维持全量。底层数据任何方案都不动 |

### 审计纠偏（必须 Human 知悉）

指令 §20 的「创新药 51→46」实测属于**机器人**命题；创新药（命题九）只有 55→55 一条 confirm 校准记录。
因此不存在"创新药新旧两条重复"，实际问题是 confirm 行与真实变化混排。
若采用 D2-(a)，首页 What Changed 与 Journal REVISION 区都将不再显示 55→55 / 46→46，而 51→46 会正常出现在机器人条目下。

---

## 4. 待 Human 确认的五项最终结果

1. **Homepage final structure**：Hero（HSN + 交易探索实验室 + 宣言五行，无图形 Logo 无 ENTER）→ 01 Research（4 卡 Flip）→ Polarity Lens（含极简语义、无下划线）→ 02 World（Map Preview，全部节点可点，Explore 分流）→ 03 What Changed（4 条，LEDGER 派生）→ WUWEI（静默尾章）→ END（不动）
2. **Map Preview final interaction**：所有节点恒可点；点击 = Node Detail（Name + State + Explore，DELTA-01 纪律不变）；State 仅表达状态，不构成操作门槛
3. **Map Explore destination**：hbm→#/thesis/memory-cycle；gpu→#/thesis/compute；optical→#/thesis/optical-module；cowos/server/idc/power→#/map
4. **Thesis consolidation result**：**不合并**（Boundary Conflict，维持 2026-09-04 拆层裁决）
5. **Journal projection result**：待 D2 裁决（推荐 a：展示层只投影 delta≠0，底层 append-only 零改动）

---

## 5. HUMAN RULINGS（2026-09-05 · 覆盖旧边界，本表为最终施工口径）

| 项目 | 裁决 | 落点 |
| --- | --- | --- |
| D1 宣言段 | YES：回首页，Manifesto 删除重复段落 | site.ts 改字「研究→探索」；Manifesto.tsx 撤下 description 块 |
| THINK 区 | YES：整体撤出首页（含 Featured Research） | Home.tsx 删除 THINK section |
| Journal | A：展示层只投影 delta≠0 | Journal.tsx + Home What Changed 共用 `latestChanges()` 派生 |
| 创新药双命题 | **合并**（Human 新决策覆盖 2026-09-04 拆层旧裁决） | 九并入八；九 `status:'closed'` 进 ARCHIVE（Ledger 55→55 记录保留、不悬空） |
| 机器人 51→46 | 保留，作为机器人最新变化 | 投影自然呈现 |
| 创新药 55→55 | 展示层删除 | delta≠0 过滤；底层 Ledger 不动 |
| 已点亮节点 | 点击直接进入 Primary Home（一步直达） | 点亮=`<a>` 直链；未点亮=`<button>` 出 Node Detail + EXPLORE |
| WUWEI | Option A：保留一句 + 极简 WUWEI → 入口 | Home.tsx |
| Commit / Push | NOT GRANTED | STOP BEFORE COMMIT |

**check-data.mjs 约束吸收**（施工前已核）：
- [12][14] 命题九保留 probability=55（与 Ledger 末条一致），仅置 `closed`；
- [11] `rev-innovative-drug-value-capture-20260904` 的 thesisId 因命题九条目保留而不悬空；
- [20] Home.tsx 继续使用 `deriveCurrentBelief` / `lastRevisedOf`（落在 What Changed 行内），不触发断言回退；
- Thesis schema / MAP_EDGES / 路由 IA / Ledger 原始记录：零改动。

---

**STOP — 等待「V2-C.1 IMPLEMENTATION AUTHORIZATION = GRANTED」及 D1 / D2 / HOME-08 确认。**
（2026-09-05 更新：授权与全部裁决已随 Human 批复下达，本节仅作历史记录；施工口径以 §5 为准。）
