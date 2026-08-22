# 05 · DATA MODEL — trading-lab

> 数据的真实形状。以 `src/data/domains/*.ts` 的 TypeScript 接口为准，本文件是语义说明。

---

## Thesis（命题）

```text
id, no, industry, title, updated
conflict: { although, but }     —— 核心矛盾，写不出这句=没想清楚
yang[] / yin[]                  —— 两面并陈，不作结论
evidence[]                      —— ≤3 条，可被外部验证
window                          —— 时间窗口（命题有保质期）
counter                         —— 反面论证（让自己不舒服的版本）
probability + probabilityNote   —— 主观概率是诚实的刻度
revisions[]: { date, note }     —— 修正留痕
nodes?: string[]                —— 关联地图节点 id（双向互链的一半）
```

## MapNode（地图节点）

```text
id, name, en, x, y              —— 手写坐标（viewBox 0 0 100 114）
size: 1|2|3                     —— 产业权重
state: yang | yin | turn        —— 产业阴阳（景气）
valuation: stretched | fair | washed —— 估值位置（外环：朱砂=透支，深水蓝=出清）
penetration                     —— 生命周期坐标（渗透率语言）
stageFocus                      —— 当前分析重点
theses?: string[]               —— 反向互链
stateNote / observation / stage
```

MAP_ERA：`{ stages: [爆发,狂热,转折点,协同,成熟], current: 0–4 连续刻度（现 1.8）, note }`
MAP_EDGES：节点间连线。

## Essay（长文）

```text
id, no, date, category, title, subtitle, readTime
related[]: { label, path }      —— 延伸栏目
body: EssayBlock[]
  { type: 'p', text }           —— 段落（自动 2em 缩进；首段自动作衬线引子）
  { type: 'h', text }           —— 小节（自动 § 编号 + 进文首锚点目录）
  { type: 'quote', text }       —— 引文（朱砂竖线，与落款同源）
```

## 其他

- JOURNAL：`{ date, items[]: { type, target, note } }`，type 经 TYPE_META 决定标记（修正=△ 等）；
- CYCLE：CYCLE_STAGES（七阶段）+ CYCLE_INDUSTRIES（行业×阶段×注记）+ FACE_WEIGHTS；
- SITE / NAV / ACTS / INDEX_ITEMS / ARCHIVE_TREE：站点常量。

## 不变量（check-data.mjs 强制，80 项断言）

- THESES / INDUSTRY_MAP.nodes / ESSAYS / ACTS 非空；
- 命题必填字段齐全，probability ∈ [0,100]，conflict 完整，revisions 为数组；
- 命题↔地图互链无悬空引用；地图连线两端存在；
- 节点 state/valuation 枚举合法、坐标齐全；
- 文集 body 节点类型 ∈ {p,h,quote}、无空 text；
- MAP_ERA.current 在刻度内；文集 related 路径是合法栏目。
