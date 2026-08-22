# PAGE SPEC · 文集 ESSAYS + 文章详情 ESSAY（#/essays、#/essays/:id）

**Purpose**：完整书写的长文——思想的最深形态。
**User Question**：（列表）哪篇值得花 10 分钟？（详情）我现在读到哪了？这句出处在哪一节？
**Primary KPI**：长文读完率；详情页的位置感。

## ESSAYS 列表

- PageHead（04 / 文集 / ESSAYS）+ 文章行（日期/编号/标题/副题/分类/阅读时长）；
- 点击进入详情（墨入水正向转场）。

## ESSAY 详情 —— Content Hierarchy

1. **BackNav**（← BACK · 文集，仅桌面；移动端由左缘右滑承担）——本页是返回系统的唯一落点
2. 文章头：日期 / 分类(water) / 阅读时长 / 编号 + 超大衬线标题 + 副题 + 作者
3. **锚点目录**：「本文小节 · CONTENTS」盒，§ 编号 + 两列小字，点击平滑滚动
   （`preventDefault` 不污染 hash；目标 `scroll-mt-24` 不被导航遮挡）
4. 正文 blocks：首段衬线引子（不缩进）→ p 段落（2em 缩进）→ h 小节（§编号+hairline）
   → quote 引文块（朱砂竖线+衬线，与落款同源）
5. 落款：朱砂红线 + 作者 + 日期 + 26px 印章 + № 编号
6. 延伸 · 本站相关板块（related 链接）
7. 继续阅读（其他两篇）

## Components

BackNav、Block（渲染分支）、HSNSeal、Label；固定 2px 朱砂阅读进度条（顶贴导航）。

## Interaction

- 目录平滑滚动受 `prefers-reduced-motion` 守卫（index.css 全局）；
- 移动端左缘右滑 = 收束回文集（SwipeBack）。

## Known Limitation

小节锚点用 `sec-N` + preventDefault，**与 hash 路由共存但不进 URL**——直接分享小节链接不可用。

## Data

ESSAYS（结构化 body，见 05_DATA_MODEL.md）。

## Forbidden

❌ 正文中出现朱砂段落/标签（引文竖线与落款是仅有的品牌类用法）；
❌ 目录做成侧边浮动栏（打断书卷气）。
