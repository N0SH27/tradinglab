# V2-07 · ENGINEERING READINESS — V2-05 前置工程契约

> **V2-04.5 产出（2026-08-23）。** 只审计 + 定义，未实现任何功能。
> 本文件是 V2-05 Homepage Implementation 的 Canonical Data Contract——
> 实施时数据从哪来、谁拥有、怎么推导，全部以本文件为准，禁止临时猜。

---

## 一、G-01 ~ G-07 审计结果

| Gap | 当前状态（实码） | 阻塞 V2-05？ | 最小解决方案 | Schema 变更 | Migration | Route 变更 |
|---|---|---|---|---|---|---|
| G-01 NOW 数据模型 | ❌ 不存在 | **是** | 新增 `domains/now.ts`（Observation[]） | 新增文件，不动旧 schema | 否 | 否 |
| G-02 `#/thesis/:id` | ❌ 不存在（`#/thesis` 为手风琴聚合页） | **是** | 按 `/essays/:id` 同款模式加路由分支 | 否 | 否 | **是**（新增 1 分支） |
| G-03 Thesis polarity | ❌ Thesis 无字段；MapNode.state 已存在 | **是** | **推导**（Derived Polarity，见三） | 否（不加字段） | 否 | 否 |
| G-04 Journal 结构化 Revision | ⚠️ delta 嵌在 note 自由文本，target 自由文本 | **部分是** | 增量加可选字段（见四） | 可选字段，向后兼容 | 否（旧条目不动） | 否 |
| G-05 Essay → Thesis | ⚠️ related[] 仅栏目级 | **否** | 延期 V2-06 | 待定 | — | — |
| G-06 Polarity Instrument | ✅ V2-04 已完成 | 否 | — | — | — | — |
| G-07 Navigation Option C | ⚠️ 现为「6 项两组」（V1 终态） | **是** | 仅改 `site.ts` NAV 配置（NavEntry 分组机制已存在） | 否 | 否 | 否 |

## 二、G-02 Route Contract（只定义，不实现）

现有路由：`App.tsx` 的 `route(path)` switch + `path.startsWith('/essays/')` 前缀分支。

新增契约（镜像 essays 模式）：

```text
#/thesis          → Thesis 聚合页（现有，不动）
#/thesis/:id      → 单命题页（新增，如 #/thesis/compute）
```

- 匹配规则：`path.startsWith('/thesis/')` → 取 id → 渲染单命题视图；id 不存在 → 回落 `#/thesis`；
- 单命题页是 V2 的第二个"天然层级"：`parentOf()` 需登记 单命题 → 命题聚合（BackNav/滑动手势落点）；
- 首页 LIVE THESIS 卡的 `READ THESIS →` 以此为落点；过渡态（路由未上线时）先链聚合页。

## 三、G-03 Polarity：Single Source of Truth 裁决

**问题**：Thesis 的 polarity 是 canonical field 还是从 MapNode.state 推导？

实码事实：一个 Thesis 可关联多个 MapNode（如 `compute → gpu(yang)/equip/cooling`），
节点各自有 `state: yang|yin|turn`。

### 方案比较

| 方案 | 判断 |
|---|---|
| A · `Thesis.polarity` 字段 | ❌ 否决——与 MapNode.state 形成双数据源，未来必然冲突（节点 turn 了命题字段忘了改） |
| B · 取单一关联节点 state | ❌ 否决——多节点时信息损失（哪个节点？） |
| C · **Derived Thesis Polarity** | ✅ **采用**——MapNode.state 是唯一事实源，命题极性为推导值 |

### 推导契约（deterministic derivation，V2-05 实施时实现为一个纯函数）

```text
deriveThesisPolarity(thesis, mapNodes) =
  states = thesis.nodes.map(id => mapNodes[id].state)   // 无关联节点 → null（不显示极性）

  全部相同          → 该状态（YANG / YIN / TURN）
  含 turn 且其余一致 → "X → TURN"（X = 非 turn 的多数态）
  混合（yang+yin）   → "MIXED"（显示为 阴·阳 并陈，不强行收敛）
```

- **Single Source of Truth：`MapNode.state`**。命题页/首页任何 polarity 显示都必须走推导函数，
  禁止在 Thesis 数据或组件里写死；
- 首页 LIVE THESIS 卡的 "YANG → TURN" 即此推导结果；卡面可选展示分布（如 2Y·1T）；
- 同一推导函数同时服务 G-01 Observation 的可选 polarity 显示（Observation 不持有 polarity 字段，
  由其 `mapNodeId` 指向的节点 state 推导）。

## 四、G-04 Revision：增量 Schema 演进（不重写 Journal）

现有：`JournalEntry { date, items: { type: 'up'|'down'|'risk'|'new', target: string, note: string }[] }`

**最小增量**（全部可选，向后兼容，旧条目不迁移）：

```ts
// items 元素追加可选字段：
{
  type: 'up' | 'down' | 'risk' | 'new'
  target: string            // 保留（显示名）
  note: string              // 保留（人读叙述）
  thesisId?: string         // 新增：结构化关联（对应 #/thesis/:id）
  prev?: number             // 新增：修正前概率
  current?: number          // 新增：修正后概率
}
```

- 首页 WHAT CHANGED MY MIND 只渲染**带 thesisId + prev + current** 的条目（自然过滤非概率类日志）；
- delta 永远 = `current - prev` 计算值，禁止从 note 正则提取；
- check-data 增量断言：若 prev/current 存在则 ∈ [0,100]；thesisId 存在则必须指向真实命题；
- JOURNAL 其余字段与渲染逻辑不动——incremental schema evolution，不是 rewrite。

## 五、G-01 Observation：Canonical Contract

```ts
// 未来 domains/now.ts
interface Observation {
  id: string
  title: string             // 变化主题（如 "AI inference economics"）
  summary: string           // 一句观察（不是判断）
  date: string
  mapNodeId?: string        // 可选 → 地图节点（polarity 由此推导）
  thesisId?: string         // 可选 → 命题
}
```

- NOW ≠ News / Dashboard / Ticker / Watchlist；Observation ≠ Thesis（观察 vs 判断，首页规格已定义）；
- **polarity 不作为字段**——需要显示时由 mapNodeId 推导（与 G-03 同一函数）；
- owner：`domains/now.ts`（新 domain，进 content.ts barrel 时按既有模式再导出）；
- check-data 新增断言：OBSERVATIONS 非空（上线后）、mapNodeId/thesisId 无悬空引用；
- 过渡态：V2-05 可先以 3–5 条人工维护的 Observation 上线，SIGNALS 完整形态仍挂 C-04（V2-07）。

## 六、G-07 Navigation：V2-05 配套最小改动

- Option C（V2-02 定稿）：`NOW / WORLD(MAP·CYCLE·DIMENSIONS) / THESIS(SYSTEM·FRAMEWORK) / JOURNAL(ESSAYS) / WUWEI / HSN`；
- 机制已存在（NavEntry 分组联合类型 + 桌面下拉 + 移动抽屉），**只改 `site.ts` 的 NAV 配置**；
- 过渡态：NOW 暂链 `#/`（首页 NOW 章锚点或顶部）、HSN 组暂只含 MANIFESTO（ABOUT 页 V2-07 才存在）；
- INDEX_ITEMS 与 ARCHIVE_TREE 归属随 NAV 同步调整。

## 七、Canonical Data Model（V2-05 唯一事实源）

```text
Observation ──optional──→ MapNode ←─────────────────┐
    │                       ↑  state (SSOT)         │
    └──optional──→ Thesis ←─┘ (nodes/theses 双向)   │
                      │                             │
                      ↓                             │
              Journal item (Revision) ──thesisId────┘
```

| 实体 | Owner（文件） | Source of Truth | 标识 | 关系 | 推导字段 |
|---|---|---|---|---|---|
| Observation | `domains/now.ts`（新） | 自身 | `id` | `mapNodeId?` `thesisId?` | polarity（经 mapNodeId 推导） |
| MapNode | `domains/map.ts` | 自身 | `id` | `theses?` `essays?` `links` | — |
| Thesis | `domains/theses.ts` | 自身 | `id` | `nodes?` ↔ MapNode.theses | **polarity（deriveThesisPolarity）** |
| Revision | `domains/journal.ts` | 自身（增量字段） | `date`+index | `thesisId?` → Thesis | delta = current − prev |
| Essay | `domains/essays.ts` | 自身 | `id` | `related[]`（栏目级；命题级延期 V2-06） | — |

**铁律**：polarity 全站只有一个事实源（`MapNode.state`）+ 一个推导函数；
概率变化只有一个事实源（Journal 结构化字段）；禁止组件内写死任何数据。

## 八、V2-05 Blocking / Non-blocking 结论

**BLOCKING（V2-05 前置，按推荐顺序）**：

1. **T-1 导航改组**（G-07）——纯 site.ts 配置，风险最低，先建立 V2 骨架；
2. **T-2 `domains/now.ts` + 3–5 条初始 Observation**（G-01 过渡态）；
3. **T-3 Journal 增量字段 + 首批结构化 Revision**（G-04）+ check-data 断言扩展；
4. **T-4 deriveThesisPolarity 纯函数**（G-03）；
5. **T-5 `#/thesis/:id` 路由 + 单命题页**（G-02，含 parentOf 登记）。

**NON-BLOCKING**：G-05（Essay→Thesis 命题级，延期 V2-06）；SIGNALS 完整形态（C-04，V2-07）。

## 九、Schema Migration 风险评估

**低。** 全部变更为：新增文件（now.ts）、新增可选字段（journal items）、新增路由分支、
新增纯函数、配置改组（NAV）。无旧字段改写、无数据迁移、无破坏性变更；
check-data 断言只做增量扩展。回滚 = revert 单个 commit。

## 十、V2-04 遗留观察项（转入 V2-05 验收）

**O-1（transform composition）**：PolarityInstrument 的 hover(30°) 与 click-flip(180°) 叠加
（hover+is-flipped=210°）在真实页面中需走查完整序列：
静态 → hover → click → mouse leave → keyboard focus → click → reduced motion；
重点验证"点击后移开鼠标，状态与角度是否保持正确"。

**O-2（Polarity 颜色语义守卫）**：TURN=朱砂是风险语义复用，不得外溢——
后续任何页面不得因"三色好看"而引入红蓝黑装饰性编码。
