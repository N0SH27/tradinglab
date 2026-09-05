# DESIGN.md — trading-lab 工程操作手册

> **分工（2026-08-15 起）**：`00_PROJECT/` 管方向——为什么做、不可违背什么
> （项目宪法/设计宪法/信息架构/页面规范/任务单/变更史/交接）；
> 本文件管操作——令牌值、维护步骤、版本历史。冲突时以 00_PROJECT 为准。
> 最后更新：2026-08-15。

---

## 1. 项目速览

| 项 | 值 |
|---|---|
| 项目路径 | `/mnt/agents/output/app` |
| 技术栈 | React 18 + TypeScript + Vite + Tailwind 3.4.19 |
| 路由 | Hash 路由（`useHashRoute`），无后端 |
| 构建 | `npm run build` → `dist/` |
| 最新版本号 | 见文末「版本历史」 |
| 对应知识库 | trading-lab skill v0.88 / 世界观 v52（2026-08-09） |

一句话定位：HSN 的长期主义投资研究档案站。一半是产业与世界的长期观察，
一半是多年交易沉淀的系统、纪律与心法。所有内容都是活着的档案。

---

## 2. 设计令牌（不可随意更改）

| 令牌 | 值 | 用途 | 对比度（纸面上） |
|---|---|---|---|
| 朱砂 cinnabar | `#C0392B` | 唯一强调色，使用受下条「朱砂使用规则」约束 | — |
| 深水蓝 water | `#3D5A6C` | 次强调：阴面标记、辅助文字 | ~5.9:1 |
| 墨 ink | 近黑（CSS 变量 `--ink`） | 正文、底色块 | ~18:1 |
| 墨二 ink-2 | `#404040` | 次级正文、**承载信息的标签**（`.label-sm` 于 2026-08-15 升级至此） | 4.8:1 ✓ |
| 墨三 ink-3 | `#757573` | 仅装饰：编号、图表注脚、分隔——不承担信息 | 3.4:1（装饰豁免） |
| 纸 paper | 米白（CSS 变量 `--paper`） | 页面底色 | — |
| 字体 | 衬线（思源宋体类）为标题，无衬线为正文 | `font-serif-sc` | — |

美学锚点：Kanye 式极简 × 道家阴阳 × 克制。
参考系：电子杂志排版、瑞士国际主义网格。

### 朱砂使用规则（成文边界，2026-08-15 定）

朱砂只允许出现在三类场合，其余一律墨色（或按阴阳归深水蓝）：

1. **品牌与落款**：印章组件（页脚 30px、首页终幕 88px、文章落款 26px）、文章落款红线、光标点击火星。
2. **交互状态**：hover 亮点（目录行编号）、选中态（产业地图当前选中节点及其图例）、键盘焦点环（`:focus-visible` 朱砂描边）。
3. **每页至多一处「决断标记」**：一个朱砂句号。当前仅两处——首页主标题「而非预测未来。」、首页终幕「反者道之动，弱者道之用。」。其他页面（含日志页收尾句）一律不用朱砂标点。

**例外（数据警示编码，单列豁免）**：产业地图的「估值透支」外环与图例、`PolarityTag` 的「转换中」标记——此处朱砂是风险语义，不是装饰。

**不属于朱砂的场合**（历史漂移，已收敛）：数据标签（权重最高值→墨色加粗）、状态标签（退潮/观察点/估值透支标签→深水蓝或墨色）、装饰标记（幕次编号可保留；循环节点、但是标签、概率注记、关联命题标签→墨色/深水蓝）、非首页页面的标点。新页面开发时先查本表，不即兴决定。

### 明确禁止（用户否决过的方向，不要重提）

- ❌ 首屏任何开场动效（2026-08-14 用户明确否决："设计的一言难尽"）
- ❌ 「川·标点」符号的任何 hover 动效——呼吸、旋转、位移全部禁止，符号彻底静止（2026-08-15 用户明确否决："不要有任何动效"）
- ❌ 霓虹、粒子、辉光、3D、玻璃拟态
- ❌ K 线图、太极图（太极意象只可用抽象方块表达；**成文例外见下**）
- ❌ 炫技式 WebGL 背景
- ❌ 深色主题整页铺底（深色只用于局部块）

**成文例外：Polarity Instrument（2026-08-23 用户裁决，V2-04 生效）**——
阴阳仪是认知仪器而非太极装饰，与 `MapNode.state` 三态同源。硬约束：全站阴阳图形至多 2 个
（Cycle 页 Taiji 保留 + 首页 Polarity Instrument 至多 1 个，禁止第三个）；默认完全静止，
仅 hover/click 时运动；`prefers-reduced-motion` 下零运动；禁粒子/辉光/3D/纹理/WebGL；
状态色沿用 PolarityTag 语义（转换中=朱砂，风险语义豁免）。详见 00_PROJECT/02_DESIGN_CONSTITUTION.md §17 例外条。

---

## 3. 品牌资产规则

### 符号「川·标点」
- 一根弯曲竖线（`RIVER_D` 路径）+ 上下两个圆点，置于方形色块内
- 组件：`src/components/Brand.tsx` → `HSNSymbol`
- 首页首屏使用规格：`size={110}` + `opacity-90`，静态展示，无动效

### 印章「篆意 HSN」
- **必须使用用户提供的书法手稿（3911.PNG）描摹的字形**（`GLYPH_D`），
  不得用程序生成的篆字替代
- 朱砂底白字为首选色调；hover 时字形轻微回正（`ink-seal`）
- 组件：`Brand.tsx` → `HSNSeal`；页脚 30px，首页结尾 88px
- 素材库：`/mnt/agents/output/HSN品牌素材/`（符号/印章/组合标志，三色调 × 多尺寸）
- 规范文档：`/mnt/agents/output/HSN品牌图形规范.pdf`（5 页）

---

## 4. 交互系统（墨入水）

已实现并保留：

| 模块 | 文件 | 行为 |
|---|---|---|
| 页面转场（正向） | `src/ink/InkTransition.tsx` | 点击导航 = 墨入水扩散遮蔽 → 切换 → 退墨 |
| 返回转场（反向） | `InkTransition.tsx` + `engine.ts` 的 `recede`/`revealBack` | 带 `data-ink-back` 的链接与浏览器前进/后退：可视之窗向原点收束 → 满墨换页 → 自原点逆向展开。**进入=展开，返回=收束，互为镜像** |
| 返回按钮 | `src/ink/BackNav.tsx`（`.ink-back`） | 极细左向线性符号 + BACK 小字；hover 箭头左移+向左拖尾+浅墨晕；仅在 `nav.ts` 的 `parentOf()` 有定义的页面出现（当前：文章详情 → 文集）；一级页面不显示 |
| 滑动返回 | `src/ink/SwipeBack.tsx` | 移动端左缘 26px 起右滑：页面随指右移并减弱、上一层淡墨下渐显、左缘墨色流动线；未达阈值水面归平，达成则 recede。纵向滚动/非左缘起始让位；pointer:coarse only |
| 历史方向 | `src/ink/nav.ts` | history.state 序号标签识别浏览器前进/后退；`parentOf()` 定义页面层级 |
| 自定义光标 | `src/ink/InkCursor.tsx` | 墨点 + 空心环，按下时朱砂火星；仅 pointer:fine |
| 悬停墨韵 | `src/ink/ink.css` | `.ink-hv` / `.ink-card` / `.ink-row` / `.btn-line` 等 |
| 地图晕染 | `IndustryMap.tsx` | 节点 hover 水墨晕圈 |

原则：克制、DeepSeek 式反馈；静止时零计算；遵守 prefers-reduced-motion。

注意：规范第 12 条「返回时 Symbol 逆向阴阳运动」**有意未实现**——
与 2026-08-15 用户对符号动效的整体否决冲突，符号保持彻底静止。

已删除（勿恢复）：`DaoSymbol.tsx`（首屏阴阳生命体）、`WaterField.tsx`（水面波纹场）。

### 阅读动作动效（V2-30 HDG-2 增补 · 2026-09-04 Human Review PASS · 2026-09-05 C-1 落盘）

全站阅读层交互动作为封闭集合：Read / Flip / Reveal / Rotate / Explore / Compare。
新增第七种动作须先修订本节。

- Flip（点击翻面）：仅用于「表面现象 → 隐藏变量」语义（NOW 阅读卡、Featured Research 卡）。
  点击翻面，非 hover 依赖；两面内容键盘与读屏均可达；prefers-reduced-motion 下瞬时切换、
  两面顺序呈现。禁止缩放/弹跳/3D 翻转炫技——翻面是语义，不是表演。
- Reveal（渐进展开）：仅用于「摘要 → 论证」语义（Research 30 SEC → 5 MIN、入口 → 详情）。
  就地展开，不跳新页；展开内容键盘与读屏均可达；prefers-reduced-motion 下瞬时呈现、
  无高度动画。禁止「阅读更多」式营销截断——展开是层级，不是钩子。
- Rotate（受控三选）：Polarity Instrument 新增受控模式——作为 Map View Filter 时，
  点击某一态 = 激活该态滤镜，再点取消；三态互斥。仪器原有「点击推进」模式在既有展位保留。
- Compare（前后对照）：用于 Revision 对比卡（THEN / NOW / WHY）；数值不以颜色单独表意。

既有禁令全部保留：首屏零开场动效；「川·标点」符号彻底静止；禁粒子/辉光/3D/玻璃拟态/
炫技 WebGL。阴阳图形全站至多 2 个的限制不变。

门控状态：本节落盘即 V2-30 HDG-2 文档门控 Closure 完成（此前「未修订前不得实现
Flip / Reveal / Rotate 新动效」的前提已解除）。**但 LOCKED ≠ Implementation
Authorized——任何代码实现仍须等待 Human Implementation Authorization。**

---

## 5. 内容架构（内容与代码分离）

**所有内容数据都在 `src/data/domains/` 下，页面组件只负责渲染。**

| 文件 | 内容 | 对应页面 |
|---|---|---|
| `domains/site.ts` | 站点信息、导航、首页目录 INDEX_ITEMS、归档树 | 全局 |
| `domains/manifesto.ts` | 六条公理 + 结语 | `/manifesto` |
| `domains/system.ts` | 七层金字塔、状态机、赌场论、演进史 | `/system` |
| `domains/thesis.ts` | 九个产业大命题（阴阳两面结构，nodes 字段反链地图） | `/thesis` |
| `domains/map.ts` | AI 算力产业链节点（双层阴阳）、佩雷斯时代标尺 MAP_ERA | `/map` |
| `domains/cycle.ts` | 七阶段、题材生命周期、三层共振、四面权重 | `/cycle` |
| `domains/dimensions.ts` | 量价时空四象、逆时针曲线 | `/dimensions` |
| `domains/wuwei.ts` | 止损、情绪、生活即系统 | `/wuwei` |
| `domains/framework.ts` | 信号分层、If-Then、触发器库 | `/framework` |
| `domains/journal.ts` | 修正日志 | `/journal` |
| `domains/essays.ts` | 长文（六篇） | `/essays` |

`src/data/content.ts` 是 barrel 文件，只做再导出。**新增内容时不要动它。**

### 常见维护操作

**改完任何 domains/*.ts 之后**：跑 `npm run check`（`scripts/check-data.mjs`，
80 项断言：非空/必填字段/命题↔地图互链/坐标/文集结构/延伸链接），
通过后再构建。渲染层另有 ErrorBoundary 兜底——事前校验 + 事后兜底。

**发一篇新文章**：编辑 `domains/essays.ts`，在 `ESSAYS` 数组开头插入一篇
（id/no/date/category/title/subtitle/readTime/related/body），无需碰任何组件。
`body` 是结构节点数组（2026-08-15 起）：`{type:'p'}` 普通段落（自动 2em 缩进，
首段自动作衬线引子）、`{type:'h'}` 小节标题（自动编号 §01…、自动进文首锚点目录）、
`{type:'quote'}` 引文块（朱砂竖线+衬线，属「品牌与落款」类朱砂用法）。

**新增/更新一个命题**：编辑 `domains/thesis.ts` 的 `THESES` 数组；
若有概率修正，同时在该命题的 `revisions` 里加一条，并在
`domains/journal.ts` 补一条日志。命题与地图节点互链：命题加 `nodes` 字段，
节点加 `theses` 字段。

**改产业地图**：编辑 `domains/map.ts`。节点双层结构——
`state`（产业景气：yang/yin/turn）+ `valuation`（估值位置：stretched/fair/washed）+
`penetration`（渗透率坐标）+ `stageFocus`（该阶段分析重点）。
时代位置改 `MAP_ERA.current`（0–4 连续刻度）。

**记一条日志**：编辑 `domains/journal.ts` 的 `JOURNAL` 数组，最新的在最前。
type 只能是 `up` / `down` / `risk` / `new`。

**改首页目录或导航**：`domains/site.ts` 的 `INDEX_ITEMS` / `NAV`。

---

## 6. 决策日志

| 日期 | 决策 | 原因 |
|---|---|---|
| 2026-09-05 | C-1 Documentation Update：§4 增补「阅读动作动效」节——交互封闭集合 Read/Flip/Reveal/Rotate/Explore/Compare 成文，Flip（表面→隐藏变量）、Reveal（摘要→论证）、Rotate（Polarity 受控三选 Filter）、Compare（Revision 对照）四动作语义与门控（点击非 hover、键盘/读屏可达、reduced-motion 瞬时）落定；HDG-2 文档门控 Closure 完成，代码实现仍待 Human Implementation Authorization | V2-30 HDG-2 PASS 附条件 → V2-B FINAL（B-11 PASS）→ DELTA READINESS REPORT v1.1 §08 授权链；战略侧 C-1 指令（Reveal 一并覆盖） |
| 2026-08-15 | 工程债清理四件套：①依赖瘦身——删 53 个零引用 shadcn 组件 + 42 个死依赖（React Router/Radix 全家桶/recharts/zod 等），lockfile 重生成；②无障碍——ink-3 2.4:1→3.4:1、`.label-sm` 改用 ink-2(4.8:1)、Thesis 手风琴补 aria-expanded/aria-controls、scroll-behavior 加 reduced-motion 守卫；③错误边界 ErrorBoundary（印章+墨染兜底页）+ 事前校验 `scripts/check-data.mjs`（`npm run check`，80 项断言）+ Home/Map 两处非空断言改防御式；④按路由 React.lazy 分包——CSS 90→29KB、首屏 JS 387→232KB(gzip 125→75KB)，页面 chunk 2–16KB 按需加载 | 用户审计：依赖超重是最大工程债；a11y 欠账；数据文件零防御；单包过重 |
| 2026-08-15 | 新增「返回=收束」交互系统：引擎加 recede/revealBack 镜像模式、BackNav 极简返回钮（仅文章详情）、SwipeBack 移动端左缘手势（26px 触发区/横向主导判定/未达归平）、history.state 方向感知统一浏览器后退；顺手清理 Framework.tsx 的 md:py-18 死类 | 用户提供的完整返回交互规范（进入=展开，返回=收束）；规范中 Symbol 逆向动效一条与已否决方向冲突，有意不实现 |
| 2026-08-15 | 文集长文结构化：body 升级为 p/h/quote 节点数组，小节自动编号+文首锚点目录（平滑滚动）+朱砂竖线引文块+段首 2em 缩进；六篇文章全部重排 | 用户判断：长文缺行文结构，滚过开头即失去位置感 |
| 2026-08-15 | 朱砂使用规则成文（三类+一豁免）并全站审计收敛：阳/阴格逗号、但是标签×2、反面论证标签、概率注记、四面权重最高值、退潮、九宫格观察点、框架核心句、系统循环节点、地图关联命题标签+估值透支标签、日志修正标记、日志收尾句号——共 14 处去朱砂，改墨色或深水蓝 | 用户指出规则未成文、漂移已开始；克制必须可执行 |
| 2026-08-15 | 删除川·标点符号的全部 hover 动效（含刚加的呼吸）：符号彻底静止 | 用户明确否决："不要有任何动效"——符号动效方向（呼吸/旋转/微移）整体关闭，不再恢复 |
| 2026-08-14 | 川·标点符号 hover 改为「水流呼吸」：笔画 10→13px 变粗 + 两点对向微移 3px，移除原有的 14° 旋转 | 用户标注"悬停时图形无反应"；S 只允许活了，不允许动了——旋转会唤起被否决的动效方向 |
| 2026-08-14 | 修复 `@import` 位置 bug：`@import './ink/ink.css'` 原置于 `@tailwind` 之后，违反 CSS 规范被构建整条静默丢弃——墨系交互层（墨点光标/ink-hv 墨晕/ink-card/ink-row/btn-line 墨漫）上线以来从未真正生效，本次首次生效；同步落地 a11y：`:focus-visible` 朱砂描边 + 光标环 is-hover（34→44px + 墨色淡入） | 用户 a11y 走查：键盘导航对 focus 隐身、原生光标功能无替代品；朱砂=决策标记的语义延伸 |
| 2026-08-14 | 地图升级：15 节点（+光模块CPO/通用存储/国产设备材料/Token经济），产业阴阳×估值位置双层结构，渗透率与分析重点字段，佩雷斯时代标尺，命题↔节点双链，地图使用说明 | 吸收凌鹏/佩雷斯/肖璟三书 + MEMORY v15/v51 世界观 |
| 2026-08-14 | 撤除首屏动效（DaoSymbol + WaterField），还原静态「川·标点」 | 用户否决："设计的一言难尽" |
| 2026-08-14 | 内容层拆分为 `src/data/domains/` 领域文件 | 降低维护成本，新对话可只改数据 |
| 2026-08-14 | 命题库从 4 扩展到 8（光模块/存储/稀土/创新药） | 接入世界观 v51/v15 的研究成果 |
| 此前 | 印章先后三版：字标 → 程序生成小篆 → 用户手稿描摹（定稿） | 用户坚持用自己的设计稿 |
| 此前 | 建立墨入水交互系统（转场/光标/悬停） | 用户提供的完整交互规范 |
| 此前 | 品牌素材库 + 5 页图形规范 PDF | 围绕纯图形符号的整套设计物 |

---

## 7. 待办方向（已与用户讨论过，按优先级）

1. 🔴 文集冷启动：读书子栏目（trading-lab skill 的 books/ 有现成笔记素材）
2. 🔴 宣言页注入「阿南认知五论」（用户原创总结，比书摘更应成为核心）
3. 🟡 新增「镜头」栏目（35 个心智模型镜头，L0→宏观序列）
4. 🟡 周期页双层化：产业周期（慢）+ 情绪周期（快，闻少六段）
5. 🟢 日志模板加「决策质量分 / 结果质量分」双字段
6. 🟢 框架页加入 Taleb 五步决策序列作为总闸

注意：skill 中的操作类清单（败者模式预警、5P 选股等）**留在 Notion 当工具**，
网站只承载思想，不承载操作——除非用户明确要求。

---

## 8. 版本历史（website_version_manager）

| 版本 ID | 说明 |
|---|---|
| 2a263e6 | 字标印章与川流符号 |
| 4f46872 | 小篆朱砂印章 |
| 63a5486 | 篆意手稿印章（定稿字形） |
| fdc631a | 墨入水交互系统 |
| 0521bbe | 首页阴阳生命体（后被否决） |
| e253fb2 | 撤回首屏动效，还原原符号 |
| db79b9c | 数据层拆分 + DESIGN.md + 四新命题 |
| afd88da | 产业地图升级（三书框架落地） |
| 833f05f | 地图间距修复（节点拉开/画布加高/页脚换行） |
| 4fd0a22 | 地图重排：更高更瘦，电力/PCB 解遮挡 |
| 2eb89c5 | 通用存储右移，DRAM 英文行解遮挡 |
| f959846 | 液冷/IDC 下移，DRAM 行彻底释放 |
| 893ff9f | 修复 ink.css 被构建丢弃 + 朱砂焦点环 + 光标环悬停感知 |
| c9a0882 | 川·标点 hover 水流呼吸（后被否决） |
| b7aa446 | 删除符号全部 hover 动效，符号静止 |
| f761d21 | 朱砂使用规则成文 + 全站审计收敛（14 处去朱砂） |
| 7a040ae | 文集长文结构化（小节/目录/引文/缩进） |
| b3aecf2 | 返回=收束交互系统 + py-18 死类清理 |
| 94be411 | 依赖瘦身 + a11y + 错误边界/校验 + 路由分包 |

回滚方式：`website_version_manager` → `rollback` + 版本 ID。

---

## 9. 给下一个会话的话

- 先读本文件，再看 `src/data/domains/` 里对应栏目的数据文件。
- 附件不会跨对话保留：印章手稿（3911.PNG）等素材如需使用，请用户重新上传。
- 用户的审美反馈非常直接且坚决，被否决的方向不要变相重提。
- 改完必做：`npm run build` 通过后，用 `website_version_manager` 存版本。
