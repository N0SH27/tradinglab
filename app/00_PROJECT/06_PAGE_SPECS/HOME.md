# PAGE SPEC · 索引 HOME（#/`/`）

**Purpose**：3 秒内回答"这是哪、这人怎么想、现在关注什么"。全站缩影。
**User Question**：这个实验室在观察什么？值得深读吗？
**Primary KPI**：读者进入目录中的任一栏目。

## Content Hierarchy

1. 封面：超大衬线主标题「观察变化，而非预测未来。」（朱砂句号 = 本页决断标记）+ SITE.description + 静态「川·标点」（size 110，无动效）+ motto
2. 第一幕 NOW：阳·所求 / 阴·所控 两句真话（阴阳格）
3. 第二幕 WHY：阴/阳阅读镜头定义
4. 第三幕 SYSTEM：当前大命题（THESES[0]，含概率与虽然/但是）
5. 第四幕 CAPITAL：8 命题概率刻度网格（ink-card）
6. 第五幕 NEXT：七阶段周期条
7. 目录：INDEX_ITEMS 十行（ink-row，hover 编号转朱砂+墨线推进）
8. 终幕：ivory 底 + 88px 朱砂印章 +「反者道之动，弱者道之用。」（朱砂句号）

## Components

ActMark（幕次编号，朱砂小字——品牌章法）、SectionHead、HSNSeal/HSNSymbol、
Label、ink-row、ink-card、btn-line。

## Interaction

- 全部标准墨系 hover；符号静止（禁令）；
- 无返回按钮（一级页面）；移动端无手势（无上一层）。

## Data

SITE / ACTS / THESES（[0] 为大命题）/ CYCLE_STAGES / CYCLE_INDUSTRIES / INDEX_ITEMS。

## Forbidden

❌ 任何开场动效（2026-08-14 否决）；❌ 符号动效；❌ 朱砂超出句号+幕次编号+印章范围。

## Dependencies

`useRevealRoot`（内容缓慢浮现，仅一次）；THESES 为空时整页不渲染（防御）。
