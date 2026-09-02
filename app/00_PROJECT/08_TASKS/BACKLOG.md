# BACKLOG — 已与用户讨论过的方向，按优先级

> 未经用户点名，不主动开工。每项开工前先写成 CURRENT_TASK.md 任务单。

## 🔴 高

1. **文集读书子栏目冷启动**——trading-lab skill 的 books/ 有现成笔记素材；
   形态待定（essays 加 category=读书？还是独立子栏目？开工前先裁决）。
2. **宣言页注入「阿南认知五论」**——用户原创总结，比书摘更应成为世界观核心。

## 🟡 中

3. **新增「镜头」栏目**——35 个心智模型，L0→宏观序列；版式与交互未定。
4. **周期页双层化**——产业周期（慢）+ 情绪周期（快，闻少六段）。

## 🟢 低

5. **日志双评分模板**——决策质量分 / 结果质量分。
6. **框架页 Taleb 五步决策序列**作为总闸。

## 技术债（无人认领但存在）

- 命题 `/thesis/:id` 二级路由（解决单命题无法链接）；
- 文章小节锚点进 URL（当前 preventDefault 绕行）；
- check-data 接入构建前置（当前手动）；
- 地图节点坐标自动布局的探索（当前手写是有意的，若探索须先过 Design Constitution）。

## 观察中的问题（Observed · No Immediate Action）

- **ISSUE · C1 Existing Validation Drift**（2026-09-01 登记）：check-data 既有 2 项失败——[24] fold 结果与生产当前态漂移、[26] initial 快照 now/cycle/era 不完整；经 stash 复跑确认为 HEAD（81f20ce）既有问题，与 TASK-003 无关。属 C1 数据域完整性，不开任务、不阻断，持续观察。
- **候选 · TASK-004 Observation Language Audit**（2026-09-01 登记，未开工）：TASK-003 实施中发现 `now.ts` 两条 summary 末句带判断色彩（`ai-inference-economics` 注意力导向语、`memory-price-divergence` 与 memory-cycle 命题框架重叠）——Observation 层混入 Belief 层，正对 V2-29 Semantic Layering Rule。若启动，目标是语言层审计而非观点修改；未经点名不动工。
