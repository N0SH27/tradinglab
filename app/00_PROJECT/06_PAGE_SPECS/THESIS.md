# PAGE SPEC · 命题 THESIS（#/thesis）

**Purpose**：当前最重要的研究判断，以可证伪结构呈现。
**User Question**：他现在看好/警惕什么？凭什么？什么情况下他认错？
**Primary KPI**：读者展开并读完至少一个命题的阴阳两面。

## Content Hierarchy

1. PageHead（02 / 命题 / THESIS + 方法说明）
2. 命题手风琴 × 8（首项默认展开）：
   - 头部按钮：编号 + 更新日期 + 衬线标题 + 大数字概率 + probabilityNote + 展开/收起
   - 展开体：核心矛盾（虽然/但是双格）→ 阴阳两面（双栏清单）→
     证据链（一二三条目）+ 时间窗口/反面论证 → 修正记录表 → 关联节点（链回地图）

## Components

ThesisBlock（手风琴，`aria-expanded` + `aria-controls="thesis-body-{id}"`）、
YinYangColumns、Label、PageHead。

## Interaction

- 手风琴展开/收起（无动画，直接显隐）；
- 关联节点链接 → `#/map`（经墨入水正向转场）。

## Known Limitation

8 命题共用一个 hash 路由，**无法单独链接某个命题**——地图/首页的关联链接只能落到整页。
若命题继续增多，考虑 `/thesis/:id` 二级路由（届时返回系统自然获得新落点）。

## Data

THESES（全量）+ INDUSTRY_MAP.nodes（关联节点查名）。

## Forbidden

❌ 不给命题做"看涨/看跌"结论色；❌ 阴阳面不做成对立投票；概率不加进度条装饰。
