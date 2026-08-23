# 09 · CHANGELOG — 决策与变更史

> 回答："过去发生了什么变化？为什么当初这样设计？"
> 新条目加在最上方。格式：Decision / Why / Impact / Not Changed。

---

## 2026-08-23 · V2 首页实施（V2-05 T-1~T-7）

**Decision**：
- 导航改组为 Option C：当下 NOW → 世界 WORLD（地图/周期/四象）→ 命题 THESIS（命题/系统/框架）→ 日志 JOURNAL（日志/文集）→ 无为 WUWEI → HSN（宣言）；
- 新增 `data/domains/now.ts`（Observation 接口 + 5 条当下观察）；
- journal 条目增量可选字段 `thesisId?/previousConviction?/currentConviction?`，3 条旧条目补结构化数据（delta 由 current−previous 计算，不解析 note）；
- 新增 `data/polarity.ts`：`derivePolarity/deriveThesisPolarity/formatPolarity` 纯函数，MapNode.state 为 polarity 唯一事实源；
- 新增 `#/thesis/:id` 路由 + `pages/ThesisDetail.tsx` 单命题页，parentOf 登记层级；
- `pages/Home.tsx` 全量重写为七章：01 NOW → 02 POLARITY（挂载 PolarityInstrument）→ 03 HOW I THINK → 04 LIVE THESIS → 05 WHAT CHANGED MY MIND → 06 WUWEI → 07 END，V1 封面 hero 与终幕骨架保留；check-data 断言扩展至 92 项（[9] NOW、[10] 结构化 Revision）。

**Why**：V2-03 首页规格（04_V2_HOME_SPEC.md）+ V2-04.5 工程契约（07_V2_ENGINEERING_READINESS.md）的 Blocking 实施序列；首页定位 Brand + Orientation + Research Entry Point，禁止 Dashboard 化。

**Impact**：修改 7 个既有文件，新增 3 个文件。验证：check 92/92 ✓、build ✓（index gzip 74.82KB，Home chunk 5.03KB）、lint 无新增 error（原 Home.tsx hooks 规则 error 因重写顺带消除，属重写范围内；InkTransition.tsx 既有 error 未动）。真实 Chrome（CDP 无头）实测：1440/768/375 三档整页截图、O-1 交互序列（静态→hover→click YANG→TURN→键盘 Enter→YIN→reduced-motion 零运动 transitionDuration 0s）全部通过。其他页面路由零改动。

**Not Changed**：Cycle 页 Taiji 原样（全站阴阳图形仍 2 个：Cycle Taiji + 首页仪器）；InkTransition lint 既有债不动；SIGNALS、实时数据、G-05 留 V2-06；site.ts 中 ACTS/CYCLE_STAGES/CYCLE_INDUSTRIES/INDEX_ITEMS 数据保留未删（旧目录章节被七章取代，数据本身未移除）；未 push、不触发 Vercel。

## 2026-08-23 · Polarity Instrument 组件 + P1 成文例外（V2-04）

**Decision**：新增 `src/components/PolarityInstrument.tsx`（三态 YANG/TURN/YIN 阴阳仪，props：state/interactive/size/showLabel）+ index.css `.polarity-disc` 有界过渡（默认静止、hover 微转 30°、click 翻转 180°、reduced-motion 零运动）；02_DESIGN_CONSTITUTION §17 与根 DESIGN.md 禁令表写入「太极图禁令」的成文例外；07_COMPONENT_SYSTEM 组件表同步。
**Why**：V2-01 用户裁决（C-01/C-02）——全站阴阳图形至多 2 个、首页仪器默认静止仅 hover/click 运动；V2-04 任务要求先把仪器做成可复用组件，避免首页开发时临时写。
**Impact**：新增 1 个组件文件；index.css +18 行；P1 两份文档各 +1 例外段；组件表现阶段暂无页面引用（V2-05 首页 POLARITY 章节挂载，属计划内过渡态）。
**Not Changed**：Cycle 页 Taiji 原样；首页、导航、Router、数据模型、其他页面全部未动；朱砂规则、符号静止令、首屏无动效不变。

## 2026-08-22 · 接入 Google Analytics 4（TASK-002）

**Decision**：index.html 以 async 外链加载 gtag.js（G-CFRXCQLQMF），`send_page_view: false` 关闭自动上报；新增 src/analytics.ts 的 `trackPageView(path)`，App.tsx 监听 hash 路由变化手动上报 page_view（含 page_path/location/title）。
**Why**：用户要求接入访问统计。hash 路由 SPA 下 GA4 自动增强测量对页面切换的捕获不可靠，手动上报才准确；gtag 走外链脚本，不违反零依赖红线（运行时 npm 依赖仍仅 react+react-dom）。
**Impact**：index.html +2 个 script 标签；新增 analytics.ts；App.tsx +2 行。CDP 无头实测：路由切换逐条触发 page_view。注意：GA4 实时报表数秒可见，标准报表有 24–48h 延迟。
**Not Changed**：任何视觉、交互、数据文件；墨入水转场。

## 2026-08-22 · 导航分层：11 项平铺 → 6 项两组（TASK-001）

**Decision**：顶栏收拢为 索引/宣言/体系/观察/文集/日志。「体系」下辖 系统·四象·框架·无为，「观察」下辖 命题·地图·周期。桌面端父组悬停/键盘聚焦展开下拉（纯 CSS group-hover + focus-within，无 JS 无动效）；移动抽屉按组呈现，组名为非链接标签；子项激活时父组同步加粗。组英文名定为 体系=STRUCTURE、观察=OBSERVE。
**Why**：用户裁决——11 项平铺不符合极简风格（见上一条建议讨论，用户选择了分层方案并指定分组归属）。
**Impact**：site.ts NAV 改为一二级混合结构（NavEntry 联合类型）；Layout.tsx 桌面/移动两套渲染；SwipeBack 父级标签查找改为扁平化遍历。页面、路由、INDEX_ITEMS、ARCHIVE_TREE 全部未动。
**Not Changed**：11 个页面与路径；墨系 hover；朱砂规则；返回系统层级（文章详情→文集仍是唯一）。

**同日修正**：组触发器由 `<button>` 改为 `<span tabindex=0>`——button 的元素级渲染与 `<a>` 行盒不一致导致基线偏下、字重观感不一。二次修正（用户实测仍偏 2px）：nav 改 `items-stretch self-stretch`，六项统一等高并各自 `flex items-center` 居中，墨晕收到内层 span 保持紧凑——无头 Chrome 截图实测六项 top/bottom 完全一致。下拉面板去除内部发丝分隔线、改疏朗行距，柔化"表格感"。焦点环（朱砂 :focus-visible）保留。

**同日修正②**：下拉互斥——点击组名后焦点驻留使面板常开（focus-within），再悬停另一组时两面板重叠。新增 ink.css 规则：悬停任一组时其余组的驻留面板强制收起（`:has()` 实现，纯 CSS），键盘焦点展开能力保留。

**同日修正③（移动端抽屉）**：组名行字号与上下发丝线间距对齐普通行（text-sm + py-3.5 全行统一）；抽屉展开时加「纸面遮蔽层」（bg-paper/88 固定覆盖层，点击收起）区分抽屉与下方页面——不用模糊/玻璃拟态，保持纸墨语言。修正层级：遮蔽层 z-40、抽屉 z-50，避免抽屉被自身遮蔽层盖住（CDP 截图实测确认）。

## 2026-08-21 · 首页封面与幕次标记减重

**Decision**：①删除封面顶部两枚标签胶囊（「HSN · 交易研究档案 · 持续更新」与「持续演进中」）；②ActMark 删除朱砂幕次名后的黑色重复英文（NOW/WHY/SYSTEM/CAPITAL/NEXT 各一处），保留朱砂幕次名 + 右侧注记。
**Why**：用户截图圈选删除——封面标签与超大标题抢注意力；幕次名 no 与 en 同词渲染两遍，是冗余而非强调。
**Impact**：Home.tsx 两处；ACTS 数据的 en 字段保留未删（数据不动，组件不再渲染它）。
**Not Changed**：朱砂规则、幕次编号颜色、五幕内容、目录、终幕。

## 2026-08-15 · 六层上下文系统建立

**Decision**：项目记忆从聊天记录迁移到 `00_PROJECT/` 结构化文档（Spec → Task → Execute → Review → Log → Handoff 工作流）。
**Why**：用户提供的 AI 项目上下文管理方案；DESIGN.md 继续作为工程操作手册（怎么做），00_PROJECT 管方向（为什么）。
**Impact**：新增 00_PROJECT/ 13 个文件。
**Not Changed**：任何页面、组件、数据。

## 2026-08-15 · 工程债清理四件套（94be411）

**Decision**：①删 53 个零引用 shadcn 组件 + 42 个死依赖（React Router/Radix/recharts/zod 等）；②ink-3 加深至 3.4:1、label-sm 用 ink-2(4.8:1)、Thesis 手风琴补 aria、smooth-scroll 加 reduced-motion 守卫；③ErrorBoundary + scripts/check-data.mjs（80 项断言）+ 两处非空断言改防御式；④React.lazy 按路由分包。
**Why**：用户审计——依赖超重是最大工程债；a11y 欠账；数据文件零防御；单包过重。
**Impact**：CSS 90→29KB；首屏 JS 387→232KB（gzip 125→75KB）；运行时依赖仅剩 react+react-dom。
**Not Changed**：任何视觉设计与页面结构。

## 2026-08-15 · 返回=收束交互系统（b3aecf2）

**Decision**：引擎加 recede/revealBack 镜像模式；BackNav 极简返回钮（仅文章详情）；SwipeBack 移动端左缘手势；history.state 方向感知统一浏览器后退。规范中 Symbol 逆向动效一条与符号静止禁令冲突，**有意不实现**。
**Why**：用户提供的完整返回交互规范（进入=展开，返回=收束）。
**Impact**：新增 src/ink/{nav,inkBus,BackNav,SwipeBack}；engine 加双模式。顺手清理 Framework.tsx 的 md:py-18 死类。
**Not Changed**：正向转场、符号、印章。

## 2026-08-15 · 朱砂规则成文 + 全站收敛（f761d21）

**Decision**：朱砂三类使用规则 + 一豁免（估值透支/转换中）；审计收敛 14 处越界用法（阳/阴格逗号、但是标签、权重最高值、退潮、观察点、框架核心句、日志标记与收尾句号等）改墨色或深水蓝。
**Why**：用户指出规则未成文、漂移已开始；"克制必须可执行"。
**Impact**：7 个页面文件 + DESIGN.md 朱砂规则节。
**Not Changed**：印章、焦点环、地图选中态、首页两个句号。

## 2026-08-15 · 符号静止令（b7aa446）

**Decision**：删除「川·标点」全部 hover 动效（含当天上午刚加的"水流呼吸"）。
**Why**：用户明确否决："不要有任何动效。"呼吸/旋转/位移方向整体关闭，不再恢复。
**Impact**：ink.css；DESIGN.md 禁令清单。
**Not Changed**：印章 hover 微转（用户未否决，保留）。

## 2026-08-15 · 墨系交互层复活 + a11y（893ff9f）

**Decision**：修复 `@import './ink/ink.css'` 位于 @tailwind 之后被构建整条静默丢弃的 bug——墨系交互上线以来从未真正生效；同步落地 `:focus-visible` 朱砂焦点环与光标环悬停感知（is-hover）。
**Why**：用户 a11y 走查：键盘导航对焦点隐身、原生光标功能无替代品。
**Impact**：index.css 导入顺序、ink.css、InkCursor.tsx。全站悬停墨晕首次真正上线。
**Not Changed**：任何内容。

## 2026-08-14 · 产业地图升级 + 四轮版式修正（afd88da → f959846）

**Decision**：吸收凌鹏/佩雷斯/肖璟三书——15 节点（+光模块CPO/通用存储/国产设备材料/Token经济）、产业阴阳×估值位置双层编码、渗透率与 stageFocus 字段、佩雷斯时代标尺、命题↔节点双链；随后按用户截图标注做四轮间距/遮挡修正。
**Why**：用户上传三本书要求丰富地图。
**Not Changed**：地图"手写坐标"原则未动摇。

## 2026-08-14 · 数据层拆分 + 四新命题（db79b9c）

**Decision**：内容层拆为 src/data/domains/ 11 领域文件 + barrel；命题库 4→8。
**Why**：降低维护成本，新对话可只改数据。

## 2026-08-14 · 撤除首屏动效（e253fb2）

**Decision**：删除 DaoSymbol + WaterField，还原静态符号。
**Why**：用户否决："设计的一言难尽。"——首屏动效方向永久关闭。

## 更早（2a263e6 → fdc631a）

字标印章 → 小篆朱砂印章 → 篆意手稿印章（定稿，用户手稿描摹）→ 墨入水交互系统建立。
