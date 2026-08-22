# PAGE SPEC · 产业地图 MAP（#/map）

**Purpose**：产业之间的关系与时代位置——"一条产业链不是一张名单，而是一组相互等待的 S 曲线"。
**User Question**：这个环节处在产业阴阳与估值的哪个位置？它和谁相连？现在分析它该看什么？
**Primary KPI**：点击节点查看观察档案；理解双层编码。

## Content Hierarchy

1. PageHead（05 / 产业地图 / INDUSTRY MAP）+ 双层编码说明
2. **时代坐标 · 佩雷斯标尺**（MAP_ERA：爆发→狂热→转折点→协同→成熟，current=1.8，朱砂刻度）
3. 地图画布（SVG viewBox 0 0 100 114，15 节点手写坐标 + MAP_EDGES 连线）：
   - 节点双层编码：填充/描边 = 产业阴阳（墨=阳、纸+水蓝=阴、半实=转换中）；
     外环 = 估值位置（朱砂=透支、水蓝=出清、无=合理）
   - hover：水墨晕圈（map-halo）+ 关联节点提亮；点击：选中（朱砂 = 交互状态类）
4. NodeDetail：阶段/估值/阴阳标签 + 名称 + 生命周期/当前分析重点卡 + 阴阳状态 +
   当前观察 + 关联环节 + 关联命题（链回 #/thesis）
5. 图例（产业阴阳三态 + 估值外环两态 + 当前选中）
6. 使用说明（"这个世界没有永恒的赛道，只有永恒的周期思维。"）

## Components

EraScale、NodeShape、NodeDetail、PolarityTag（Bits）；valu­ation ring / 选中虚线环。

## Interaction

- hover/选中过渡 200ms fill 过渡；
- 移动端可横向滚动浏览；横向滚动容器不触发返回手势（SwipeBack 让位逻辑）。

## Known Limitation

**坐标手写**——15 节点靠人工微调（2026-08-14 历经四轮标注修正）；节点再增加时维护成本陡升。
节点超出画布/遮挡是历史高发问题，改动后必须截图复核四边。

## Data

INDUSTRY_MAP + MAP_EDGES + MAP_ERA + MAP_ESSAY + THESES（关联命题查概率）。

## Forbidden

❌ 改成力导图/自动布局（手写坐标是有意的版式控制）；
❌ 估值透支改用其他色（朱砂在此是豁免的风险语义）；
❌ 加行情数字、涨跌幅。
