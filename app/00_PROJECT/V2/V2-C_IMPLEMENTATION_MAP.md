# V2-C · IMPLEMENTATION MAP（PHASE 1–2 产出 · 2026-09-05）

> **追加登记（2026-09-05）：C-CONFLICT-01 已由 Human 裁决 = Option A（7 节点 6 真边 gpu→hbm→cowos→optical→server→idc→power）；PHASE 3 · Home Cognitive Structure 已施工完成（改动：Home.tsx 重写、新 FlipCard / MapPreview、PolarityInstrument 受控化、Manifesto 接收 description），构建通过，STOP 待 Human Review 后放行 PHASE 4。**
> **状态：PHASE 1 Repository Audit ✅ · PHASE 2 Implementation Mapping ✅ · PHASE 3 未启动**
> 授权：Human Implementation Authorization = GRANTED（施工权）；决策权 / Commit 权 / Push 权仍属 Human。
> 本文性质：内部实施映射（Contract → Target File → Component → Expected Change → Data/Route Dependency → Acceptance）。不扩大 Scope。
> **含 1 项 STOP 冲突（C-CONFLICT-01），PHASE 4 Map Preview 施工挂起，等待 Human Decision。**

---

## 01 · Repository Audit 摘要（PHASE 1）

| 项 | 实测事实 |
|---|---|
| 分支 / 工作区 | `main`；M = DESIGN.md / 02_DESIGN_CONSTITUTION.md / 04_V2_HOME_SPEC.md（C-1）；?? = 7 份治理文档；**源码零改动** |
| 路由 | `App.tsx` hash 路由；`#/thesis/:id` 与 `#/research/report-1..4` 均已存在（ThesisDetail.tsx 在库） |
| 首页 | `Home.tsx`（339 行）：封面（宣言 + SITE.description 5 行 + HSNSymbol + motto）→ FOCUS 四卡（ResearchProductCard hover 反转）→ LIVE THESIS 三卡 → WHAT CHANGED MY MIND 三行 → POLARITY（仪器 + 注解段落）→ RESEARCH Featured 行（`CANONICAL RESEARCH` meta）→ NOW 五行列表 → WUWEI 完整章 → END。全部章带 ChapterMark 场景标签 |
| Polarity | `PolarityInstrument.tsx`（189 行）：`useState` 内部态、单向推进（+120°）、有界跟随 ±15°、reduced-motion 瞬时；**无受控模式**（Filter 需外接） |
| 卡片 | `ResearchProductCard.tsx`：hover/focus-within 反转，**非点击 Flip** |
| 报告 | `ReportPage.tsx` v4 渲染器：ReportSection[] + Block 类型系统 + 研究四格（summary 节）；页顶栏含 `HUMAN REVIEW · {review}`；`Research.tsx` 索引含 `REPORT #n` + review 列；Report1–4 为固定内容页（sections 数组） |
| Map 数据 | `map.ts`：15/15 节点带 `state`（yang×7 / turn×5 / yin×3）；**MAP_EDGES 无 `cowos→server` 直连边**（见 C-CONFLICT-01） |
| 其他数据 | `now.ts` 35 条观察（B-1 三源 id 均在）；`ledger.ts` 含 `rev-memory-cycle-20260830`（65→68）与 `rev-robot-20260904`（51→46）；`thesis.ts` compute：probability 72 / window / assumptions / revisions（65→72, 2026.07.31） |
| Manifesto | `src/pages/Manifesto.tsx` 存在（description 五行 MOVE 目的地） |

---

## 02 · ⚠️ STOP-CONFLICT-01（触发 §27 STOP 协议 · 等待 Human Decision）

**冲突描述：** V2-B B-2（Human Decision · PASS）登记的 Map Preview 推荐方案为
「6 节点单链 gpu→hbm→cowos→server→idc→power，MAP_EDGES 5 边全连通（已实码核实）」。
**该核验有误**：实测 `MAP_EDGES` 中 `cowos→server` 无直连边，封装到整机仅经
`cowos→pcb→server` 或 `cowos→optical→server` 中转。其余四边真实存在。
Master Execution Prompt §21-B 验收要求「节点关系来自真实 MAP_EDGES」——按原方案施工将必然 FAIL 或必须画出不存在的边。

**受影响 Contract：** V2-B B-2（Map Preview 6 节点名单）。

**最小选项（不自行决策，请 Human 拍板）：**

| 选项 | 内容 | 代价 / 风险 |
|---|---|---|
| **A · 7 节点补一环（AI 推荐）** | 单链改为 `gpu→hbm→cowos→optical→server→idc→power`（或经 `pcb`），7 节点 6 边**全部真实存在**，恰在 SEE ≤7 上限内；三态分布 yang×4 / turn×2 / yin×1 仍全部非空 | 偏离 Human 已定「6 节点」名单；光模块（或 PCB）上首页，叙事焦点略增——但光模块本身是「估值透支」最佳教材（FCC 死线），与 NOW 卡 02「瓶颈迁移」不冲突 |
| B · 6 节点序列化呈现 | 保 6 节点，但不画边语义——以纯序列（编号/箭头=阅读顺序，非 MAP_EDGES）呈现「瓶颈搬家路径」 | 箭头易被读作边；验收项「关系来自真实 MAP_EDGES」需改判为「序列≠边」，等于修改验收口径 |
| C · 6 节点画 4 真边 + 缺桥 | 保 6 节点，只画 4 条真实边，cowos→server 断开 | 链条在咽喉处断裂，「瓶颈搬家」叙事核心受损，不推荐 |

---

## 03 · Implementation Map（Contract → 实施映射）

> 数据依赖列「零」= 不触碰 `src/data/**`；文案常量沿用 FOCUS 先例置于组件内（presentation copy，非业务数据）。

### HOME（PHASE 3 / 4 / 5）

| # | Contract | Target File / Component | Expected Change | Data / Route 依赖 | Acceptance |
|---|---|---|---|---|---|
| IM-01 | B-6 ENTRY（宣言版） | `Home.tsx` 封面节 | 封面压缩为 品牌 + 宣言 + ENTER 语义；`SITE.description` 五行移除（MOVE → IM-12）；HSNSymbol / motto 按信息量上限取舍 | 数据零（site.ts 不动，仅删引用）；路由零 | ENTRY = 1 品牌 + 1 句 + 1 入口；整屏静态零开场动效 |
| IM-02 | C-01 Scene ≠ Section | `Home.tsx` 全局 | 删除/改造 ChapterMark——界面不得出现 FOCUS / NOW / SEE / THINK / CHANGE 式场景标签与幕间标题；五场景节奏/留白/网格必须不同 | 零 | 首屏至 END 无任何场景标题；反 Section Stack 判据通过 |
| IM-03 | B-1 NOW ×3 Flip 卡 | `Home.tsx` + 新 `FlipCard` 组件 | 三张点击 Flip 阅读卡（存储/算力链/商保，正背文案按 V2-B §04 定稿），CTA → 对应 Report；替代现 NOW 五行列表的首屏位（完整 NOW 列表命运 = 退回候选，见风险栏） | 数据零（卡文案为 presentation copy）；路由零（链既有 report 路由） | 点击翻面非 hover；键盘/读屏可达；reduced-motion 瞬时；正面 ≤2 行背面 ≤3 行 |
| IM-04 | C-03 Polarity = Lens + HDG-2 Rotate | `PolarityInstrument.tsx` + `Home.tsx` | 新增受控模式（value/onChange 三选互斥、再点取消）；原推进式保留于既有展位；首页注解段落压缩至至多一句或删除 | 数据零 | 三态点击驱动 Map 真实视觉变化；无解释器文案；keyboard/touch/reduced-motion 通过 |
| IM-05 | C-02 / DELTA-01 Map Preview | 新 `MapPreview.tsx` + `Home.tsx` SEE 区 | 首页切片（节点名单**挂起，待 C-CONFLICT-01 裁决**）；点击卡严格 = 名称 + State + EXPLORE WORLD →；Polarity Filter 驱动 dim/highlight | 数据零（只读 map.ts）；路由零（EXPLORE WORLD → `#/map`） | 点击卡恰 3 个语义元素；零 Related counts；边全部来自真实 MAP_EDGES |
| IM-06 | C-04 Current Belief（判断 > 数字） | `Home.tsx` THINK 区（替代 LIVE THESIS 三卡） | 单信念呈现：信念句（V2-B B-3 定稿）→ WHY / WHAT COULD CHANGE IT / HISTORY 三入口 → conviction 仅作辅助小字；链接 `#/thesis/compute` | 数据零（读 thesis.ts + ledger.ts 派生，不改字段） | 用户第一眼看到判断而非 72%；数字不大字号/不居中/无仪表盘 |
| IM-07 | B-4 Featured Research | `Home.tsx` THINK 区 | Featured 卡（报告一）正面问题式文案 + 背面核心发现一句；出口 READ 5 MIN（报告锚点）/ DEEP DIVE；`CANONICAL RESEARCH` meta 清除 → 「行业研究 · 2026.08」 | 数据零；路由零 | 系统语言零残留；Flip 语义合规 |
| IM-08 | B-5 CHANGE（Compare 卡） | `Home.tsx`（替代 WHAT CHANGED MY MIND 三行） | 单张 THEN/NOW/WHY 对比卡：存储周期 65→68 + WHY（买方降级硬件方案）；SEE REVISION → `#/thesis/memory-cycle` | 数据零（读 ledger.ts 该条）；路由零 | 数值不以颜色单独表意；无真实修正时整场景隐藏 |
| IM-09 | OQ-1 WUWEI 静默尾章 | `Home.tsx` WUWEI 节 | 完整章压缩为静默尾章（去 ChapterMark、去 CTA 墙化呈现；保留一句 + 入口） | 零 | 不再形成完整内容 Section |
| IM-10 | B-6 / T-02 description MOVE | `Manifesto.tsx` | 五行「我是谁」文案落进 Manifesto（HSN 域 Primary Home） | 数据零（site.ts 字段保留，仅引用点变化） | 首页零自我介绍；Manifesto 完整呈现 |
| IM-11 | FOCUS 撤出首页 | `Home.tsx` | 删除 FOCUS 四卡网格（问题语言由 Featured 卡正面 + Report 页吸收；FOCUS 转 Derived View 入口属 Research/World 页，非本轮施工） | 零 | 首页无 FOCUS 网格；ResearchProductCard 引用随之清理（组件保留备 Derived View 用，不删文件） |

### RESEARCH（PHASE 6）

| # | Contract | Target File / Component | Expected Change | Data / Route 依赖 | Acceptance |
|---|---|---|---|---|---|
| IM-12 | B-7 30 SEC ×4 语言翻译 | `Report1.tsx`–`Report4.tsx` summary 节 blocks | 四格文案按 V2-B §06 翻译稿替换（格 3 转读者视角、格 4 保留触发语义；格标签自然语言小标题） | 数据零（固定内容页文案）；路由零 | 事实零改动（对照 V2-B §06 溯源自检） |
| IM-13 | B-8 5 MIN ×4（核心产品层） | `Report1.tsx`–`Report4.tsx` 新增 5 MIN 节 + `ReportPage.tsx` 呈现支持 | 按 V2-B §06 的 15 条 Key Findings 落盘（R1×4 / R2×4 / R3×3 / R4×4）；呈现 = Reveal 就地展开语义（30 SEC → 5 MIN → DEEP DIVE 三层可辨） | 数据零；路由零（页内锚点） | **可复述性硬标准**：读完 5 MIN 不碰全文能复述核心论证；每条内部 WHAT/WHY/SO WHAT/BUT 完整、页面零结构词标题 |
| IM-14 | B-9 标题 ×4 | `Report1.tsx`–`Report4.tsx` section title | §03/§05/§07 共 12 个标题按 V2-B §06 候选替换（问题式不机械） | 零 | 标题像研究者真问题；其余节 KEEP |
| IM-15 | B-10 语言治理 | `ReportPage.tsx` 顶栏 + `Research.tsx` 索引 + `Home.tsx` Featured | ① `HUMAN REVIEW · PASS…` → 「最近修订 {date} · {版本}」（版本保留，裁决语隐去）；② `REPORT #n` 弱化——索引保留小号系列号，Featured 与报告页首屏以标题为唯一主标识 | 零 | 全站 grep 零 `CANONICAL` / `HUMAN REVIEW · PASS` 残留；品牌白名单词不动 |

### MOTION / A11Y / 一致性（PHASE 7 / 8）

| # | Contract | Target | Expected Change | Acceptance |
|---|---|---|---|---|
| IM-16 | HDG-2 六动作合规 | 新 `FlipCard` + Reveal 展开 + Rotate 受控 + Compare 卡 | 全部：点击可触发、非 hover-only、Enter/Space 可达、focus 可见、reduced-motion 功能保留；禁装饰动效 | DESIGN.md §4 逐条过；hover-only = FAIL |
| IM-17 | 跨页一致性 | 全站 grep + 走查 | 场景名/系统语言零泄漏；阴阳图形仍 ≤2；朱砂规则不新增用例 | grep 结果零命中 |

---

## 04 · 明确不动清单（Scope 反面）

`src/data/**`（含 map.ts / MAP_EDGES / thesis.ts / ledger.ts / now.ts / site.ts）、`App.tsx` 路由表、IndustryMap 完整页、ThesisDetail、导航 IA、CSS 令牌体系、Ink 引擎、ResearchProductCard 文件本身（保留备用）、任何 LOCKED 文档原文。

## 05 · 风险登记

| 风险 | 说明 | 处置 |
|---|---|---|
| R-01 | **C-CONFLICT-01**（见 §02）——PHASE 4 Map Preview 挂起 | 等 Human Decision |
| R-02 | 现 NOW 完整列表（35 条观察，首页取 5 条）在 NOW 三卡化后的呈现归宿——V2-B 口径为「其余归 NOW 完整列表/各自 Primary Home」，但独立 NOW 页不存在（C-04 挂起） | 实施时取最小口径：首页只留三卡，完整列表不做新页（不新增 Route）；如需归宿另报 |
| R-03 | 5 MIN 节在 v4 渲染器的呈现形态（Reveal 就地展开 vs 常显分节）——V2-B 未规定像素级形态 | 按 HDG-2 Reveal 语义实施，验收时走查，不构成决策变更 |

---

## 06 · 下一步闸门

```text
PHASE 1–2 ✅（本文件）
   ↓
Human 裁决 C-CONFLICT-01（选项 A / B / C）+ 确认本 Map 无 Scope 越界
   ↓
PHASE 3 Home Cognitive Structure → … → PHASE 11 STOP BEFORE COMMIT
```
