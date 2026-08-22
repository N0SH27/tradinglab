# 07 · COMPONENT SYSTEM — trading-lab

> 组件的真实清单与职责。源文件即真相，本文件管"什么场景用哪个"。
> 注：2026-08-15 已删除 53 个零引用 shadcn 组件——**现存组件就是全部，不许再养死组件。**

---

## 品牌（src/components/Brand.tsx）

| 组件 | 用途 | 硬规则 |
|---|---|---|
| HSNSeal | 印章（页脚 30px / 首页终幕 88px / 文章落款 26px / ErrorBoundary 64px） | 字形必须用手稿 GLYPH_D；朱砂底白字首选；hover 字形 -6° 微转（唯一保留的符号动效） |
| HSNSymbol | 川·标点（导航 22px / 首页 110px） | **彻底静止，禁止任何 hover 动效** |

## 排版件（src/components/Bits.tsx）

| 组件 | 用途 |
|---|---|
| Label | `.label-sm` 小标签（ink-2，承载信息） |
| PageHead | 页头（编号 + 大标题 + 英文 + intro） |
| SectionHead | 节头（符号 + 中文 + 英文 + 注记） |
| PolarityTag | 阴阳/转换中标签（转换中 = 朱砂方块，风险语义豁免） |

## 布局（src/components/Layout.tsx）

Header（固定 14 高，hairline 底；lg 以下"目录"抽屉）+ Footer（知识归档树 + 印章落款）。
`#page-root` 容器：SwipeBack 手势的位移/减弱目标。

## 防御（src/components/ErrorBoundary.tsx）

整树崩溃 → 印章 +「此页墨染」+ 错误信息 + 返回目录；console 留 error。
与 scripts/check-data.mjs 构成"事前校验 + 事后兜底"。

## 墨系（src/ink/）

| 模块 | 职责 |
|---|---|
| engine.ts | Canvas 转场引擎：drop（正向扩散）/ recede（收束）/ revealBack（浏览器后退开窗）；静止零计算 |
| InkTransition.tsx | 全局点击拦截（站内 hash 链接 → drop；`data-ink-back` → recede）+ popstate → revealBack |
| InkCursor.tsx | 墨点 + 空心环（hover 可交互元素放大 34→44px + 墨色淡入）+ 点击朱砂火星；pointer:fine only |
| SwipeBack.tsx | 移动端左缘 26px 右滑手势：页面随指右移减弱、上一层淡墨渐显、左缘墨色线；未达阈值水面归平 |
| BackNav.tsx | `.ink-back` 极简返回钮；仅 parentOf() 有定义的页面（当前：文章详情） |
| nav.ts | history.state 序号标签（方向感知）+ parentOf()（页面层级） |
| inkBus.ts | InkTransition ↔ SwipeBack 的引擎句柄桥 |
| ink.css | 全部 CSS 层交互：焦点环/光标/ink-hv/ink-card/ink-row/btn-line/symbol(静止)/seal/map-halo/ink-back |

## 禁用

- ❌ 引入组件库/动画库（零依赖倾向）；
- ❌ 新建组件不进本表（本表与代码同步是维护义务）；
- ❌ 复活已删组件（components/ui 53 件、DaoSymbol、WaterField——均为否决资产）。
