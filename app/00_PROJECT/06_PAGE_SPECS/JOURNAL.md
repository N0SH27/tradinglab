# PAGE SPEC · 日志 JOURNAL（#/journal）

**Purpose**：修正留痕——"不是日记，而是研究的迭代史。每一次观点的修正都留下日期、
方向与原因——沉默地改观点，是研究的死亡。"
**User Question**：他上次改观点是什么时候？为什么？他的判断可追踪吗？
**Primary KPI**：信任的建立——修正记录的可见性本身就是目的。

## Content Hierarchy

1. PageHead（07 / 日志 / JOURNAL）
2. 条目流（时间倒序）：大日期 + items（类型标记 + 对象 + 说明）
   - TYPE_META 决定标记符号（如 △=修正）；标记符号墨色（2026-08-15 收敛：不再用朱砂，
     修正的严肃性由版式而非颜色承担）
3. 收尾句：「错误的修正记录，比正确的预测更值得展示。」（墨色——无朱砂句号，
   决断标记是首页特权）

## Components

Label、TYPE_META 标记。

## Interaction

纯静态阅读页。

## Data

JOURNAL（domains/journal.ts）。

## Discipline

- 命题每次概率修正**必须**同步在此加一条（与 theses.revisions 双写）；
- check-data 不校验双写一致性——目前靠维护纪律，未来可加断言。

## Evolution（待定）

🟢 日志模板加「决策质量分 / 结果质量分」双字段——在 BACKLOG。
