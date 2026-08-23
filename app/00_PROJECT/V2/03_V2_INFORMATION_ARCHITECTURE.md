# V2-03 · INFORMATION ARCHITECTURE — 信息架构（V2-02 Review 定稿）

> **2026-08-23 V2-02 Review 后定稿：采用 Option C（混合型）。**
> 设计层文档，未实施。本文件定义的导航与现有 Router / Navigation / site.ts 无关，
> 实施前须经任务单（CURRENT_TASK）批准。

---

## 一、核心原则：Semantic Clarity > Conceptual Purity

**品牌逻辑 ≠ 用户导航逻辑。**
导航首先要让用户知道"点进去能看到什么"，其次才是体现哲学。

哲学语言（THINK / REVISE / LIVE）不强迫用户先学习分类体系，
而是保留在**页面内部**（页面 Hero kicker）：

| 页面 | 导航名（用户语言） | 页面 Hero（品牌语言） |
|---|---|---|
| THESIS | THESIS | **THINK** — How I form and test beliefs. |
| JOURNAL | JOURNAL | **REVISE** — What changed my mind. |
| WUWEI | WUWEI | **LIVE** — When not acting is the right decision. |

由此同时得到：**导航清晰 + 哲学完整 + 品牌记忆**（用户会记住
TradingLabb = NOW → WORLD → THESIS → JOURNAL → WUWEI）。

## 二、V2 最终 IA（Option C）

```text
TRADINGLABB
│
├── NOW                现在发生了什么？（Signals / Current Observations）
│
├── WORLD              这些变化发生在哪里？
│   ├── MAP
│   ├── CYCLE
│   └── DIMENSIONS
│
├── THESIS             我现在相信什么？
│   ├── SYSTEM         （How I think）
│   └── FRAMEWORK      （Tools I think with）
│
├── JOURNAL            我什么时候改变过判断？
│   └── ESSAYS
│
├── WUWEI              什么时候应该什么都不做？
│
└── HSN
    ├── ABOUT
    └── MANIFESTO
```

只有 WORLD 是概念导航，其余全部使用用户已理解的内容名称。
System = How I Think，Framework = Tools I Think With，Thesis = What I Think——
三者同属一个认知域，故 SYSTEM / FRAMEWORK 挂在 THESIS 下，不再单设 THINK 层。

## 三、现有 11 页面 → V2 映射（全部保留，无删除）

| 现有页面 | 路由（不变） | V2 归属 | 需要的改动 |
|---|---|---|---|
| HOME | `#/` | — | Logo 回 Home；NOW 内容暂由首页 ACT I 承接 |
| MANIFESTO | `#/manifesto` | HSN 之下 | 导航入口改组；内容升级为 WORLDVIEW（后续阶段） |
| SYSTEM | `#/system` | THESIS 组 | 仅导航归属变化 |
| THESIS | `#/thesis` | 一级 | Hero 加 THINK kicker；升级为 LIVE THESIS 呈现（V2-06） |
| ESSAYS | `#/essays` | JOURNAL 组 | 仅导航归属变化 |
| MAP | `#/map` | WORLD 组 | 仅导航归属变化 |
| CYCLE | `#/cycle` | WORLD 组 | 仅导航归属变化 |
| DIMENSIONS | `#/dimensions` | WORLD 组 | 仅导航归属变化 |
| WUWEI | `#/wuwei` | 一级 | Hero 加 LIVE kicker |
| FRAMEWORK | `#/framework` | THESIS 组 | 仅导航归属变化 |
| JOURNAL | `#/journal` | 一级 | Hero 加 REVISE kicker；升级为 WHAT CHANGED MY MIND（V2-06） |

**路由零改动**——V2 IA 迁移只改导航分组与页面叙述层，不动任何路径。

## 四、用户路径（V2 核心四条）

1. **第一次访问**：HOME → NOW → THESIS → JOURNAL（3 分钟：关注什么 → 相信什么 → 怎么修正）；
2. **深度研究**：WORLD → MAP → NODE → THESIS → JOURNAL；
3. **方法学习**：THESIS 组 → SYSTEM → FRAMEWORK → THESIS；
4. **哲学**：WUWEI。

## 五、内容关系：现状与缺口（V2-02 实码核查结论）

核心产品原则（沿用 P2，升级为 V2 核心差异）：

```text
正向：NOW → WORLD → MAP → NODE → THESIS → EVIDENCE → REVISION → JOURNAL
反向：THESIS → WORLD MAP → RELATED NODES
```

实码核查结果：

| 关系 | 现状 | 缺口 |
|---|---|---|
| Map ↔ Thesis | ✅ 已结构化双向（`Thesis.nodes` / `MapNode.theses`） | — |
| Map → Essay | ✅ 已存在（`MapNode.essays`，如 `thesis-writing-os`） | — |
| Thesis ↔ Journal | ⚠️ 非结构化——JOURNAL `target` 是自由文本（'国产算力'/'存储'），非 thesis id；revisions 与日志条目无互链 | 需结构化 target |
| Essay ↔ Thesis | ⚠️ 弱单向——`related[]` 只指向栏目页（如 `/thesis`），不指向具体命题 | 需命题级链接 |
| 单命题页 | ❌ `#/thesis/:id` 不存在（P4 已知技术债） | LIVE THESIS 的 "READ THESIS →" 依赖它 |
| NOW 页面 | ❌ 不存在——NOW 目前只是首页第一幕 | 需 NOW 数据模型（SIGNALS 未裁决，C-04） |
| HSN / ABOUT 页 | ❌ 不存在 | V2-07 阶段新建 |

Essay 不做内容孤岛——远期形态：一篇 Essay 是一个长期研究主题的入口
（Essay → 3 Thesis → 8 Map Nodes → 12 Journal Entries），从 Blog 走向 Knowledge Graph。
当前数据模型部分支持（Map→Essay 已通），其余列入后续任务。

## 六、被否决的候选方案（存档）

- **Option A（纯概念型）** `NOW/WORLD/THINK/REVISE/LIVE/HSN`——品牌最强、UX 风险最高：
  THINK/REVISE 有理解成本，LIVE 会被误读为 Live Market/Live Data。否决。
- **Option B（内容型）** `NOW/MAP/THESIS/JOURNAL/WUWEI/HSN`——UX 最强但品牌差异化弱，
  且 MAP 直接升一级会弱化 CYCLE/DIMENSIONS 的归属逻辑。否决。

## 七、迁移风险（低）

- 现有导航数据结构已支持分组（`NavEntry = NavLink | {label, en, children[]}`，TASK-001 已实现）——
  V2 IA 只是**换一组分组配置**，机制零新增；
- 桌面下拉 / 移动抽屉 / 焦点环等交互均为现有能力，无新组件；
- 主要风险点不在技术而在内容：NOW 页与 HSN/ABOUT 页是**新页面**，
  其上线时间取决于 SIGNALS（C-04 未裁决）与 V2-07 排期；
- 过渡态允许：导航可先按 Option C 改组，NOW 暂链首页、HSN 组暂只含 MANIFESTO，
  新页面就绪后再点亮入口。

## 八、结构纪律（沿用 P2，不变）

- 一级页面不挂返回按钮；唯一天然层级仍是 文章详情 → 文集；
- 操作类内容不进站（留在 Notion）；
- 页脚知识归档树保留——"内容最终沉淀为一棵树，而非时间流"；
- 新栏目上线前必须回答"它沉淀为树的哪一枝"（SIGNALS / ABOUT 同样适用）。
