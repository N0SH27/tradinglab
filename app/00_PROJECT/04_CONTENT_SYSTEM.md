# 04 · CONTENT SYSTEM — trading-lab

> 内容怎么生产、怎么组织、怎么维护。

---

## 内容域（11 个领域文件，`src/data/domains/`）

| 文件 | 内容 | 更新频率 |
|---|---|---|
| site.ts | 站点信息、导航、首页目录、归档树、ACTS 幕次 | 低 |
| manifesto.ts | 宣言 | 低 |
| system.ts | 系统四层/三要素/赌场论 | 低 |
| theses.ts | 8 个命题（含 revisions） | **高**——概率随证据修正 |
| map.ts | 15 节点 + 连线 + MAP_ERA 时代标尺 | 中 |
| cycle.ts | 七阶段 + 行业分布 + 四面权重 | 中 |
| dimensions.ts | 四象/九宫格 | 低 |
| wuwei.ts | 无为 + LIFE_OS | 低 |
| framework.ts | 方法论框架 | 中 |
| journal.ts | 修正日志 | **高**——每次修正必记 |
| essays.ts | 6 篇长文（结构化 body） | 中 |

`src/data/content.ts` 是 barrel，只再导出，**新增内容不动它**。

## 内容的生产规则

1. **命题**：必须有「虽然……但是……」核心矛盾；证据 ≤3 条且可被外部验证；
   必须有反面论证、主观概率、时间窗口、证伪信号；每次修正进 revisions + 日志。
2. **长文**：body 是结构节点数组——`{type:'p'}` 段落（自动 2em 缩进，首段作衬线引子）、
   `{type:'h'}` 小节（自动编号进目录）、`{type:'quote'}` 引文块（朱砂竖线）。
3. **日志**：每次观点修正留下日期、方向、原因；沉默地改观点是研究的死亡。
4. **语调**：短句、断言式、不讨好；书卷气；避免互联网营销腔。

## 内容 → 呈现的管道

改 domains 数据 → `npm run check`（80 项断言）→ `npm run build` →
website_version_manager 存版本 → 09_CHANGELOG.md 记一条。

## 内容来源

- HSN 的 OpenClaw 知识库（MEMORY 世界观 / SKILL 交易体系）；
- 书籍消化（已完成：凌鹏《周期、估值与人性》、佩雷斯《技术革命与金融资本》、
  肖璟《如何快速了解一个行业》——落入地图与命题的数据结构）；
- 待消化：skill 的 books/ 笔记（读书子栏目素材）、"阿南认知五论"、35 个心智模型。
