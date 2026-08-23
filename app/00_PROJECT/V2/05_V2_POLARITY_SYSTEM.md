# V2-05 · POLARITY SYSTEM — 阴阳仪系统设计

> **设计稿，未实施。C-01 / C-02 已于 2026-08-23 经用户裁决（见第七节）。**
> 本文件只记录设计原则，实施属于 V2-04 阶段，须先开任务单。

---

## 一、定位

**TradingLabb Yin-Yang Instrument（阴阳仪）**——TradingLabb 唯一保留的具象东方符号。

它不是装饰，不承担宗教或传统文化展示功能。它代表的是投资认知模型本身：

> 阴阳本身就是这个站的投资认知模型——
> 阳 = 看得见的增长与叙事；阴 = 看不见的约束与出清（P0 产品哲学第 2 条）。

与已被否决的 `DaoSymbol`（首屏阴阳生命体装饰）的本质区别：DaoSymbol 是"为了好看而动"，
阴阳仪是"为了表达三态认知模型而存在"，且与现有数据结构（MapNode.state）天然打通。

## 二、三种状态（不是两种）

| 状态 | 语义 |
|---|---|
| **YANG** | Growth / Adoption / Expansion |
| **TURN** | Transition / Reversal / Inflection（阴阳转换中的临界状态） |
| **YIN** | Constraint / Clearing / Contraction |

核心循环：

```text
YIN → TURN → YANG → TURN → YIN
```

投资世界真正重要的不是"阴 or 阳"，而是 **阴→阳、阳→阴 的 TURN**。
这与现有数据模型 `MapNode.state: yang | yin | turn`（P4 05_DATA_MODEL.md）完全一致——
哲学 → 产品 → 数据的闭环。

## 三、视觉规格

- 米白纸面背景；中央一个非常干净的 黑/白 阴阳结构；
- ❌ 粒子、发光、3D、阴影、WebGL、金属质感、纹理、复杂背景；
- 与 P1 视觉语言（纸、墨、深水蓝、朱砂克制）保持一致。

## 四、交互规则（C-02 裁决后：保守方案）

**默认完全静止。** 页面加载后阴阳仪不旋转、无入场动效——用户看到的是一枚静止的认知仪器。

| 触发 | 行为 |
|---|---|
| 默认 | 完全静止（区别于 Cycle 页现有 Taiji 的 90s 慢转——首页这枚更克制） |
| Hover | 开始缓慢旋转；旁边显示 YANG（Growth · Adoption · Expansion）或 YIN（Constraint · Clearing · Contraction） |
| 移出 | 旋转停止，回到静止 |
| Click | 阴阳翻转，下方内容切换（YANG 列表 ↔ YIN 列表） |
| 第三次交互 | 进入 TURN：不是 Yin，也不是 Yang，而是正在发生变化 |

- 任何运动都必须缓慢、克制、可暂停；
- `prefers-reduced-motion` 下**零运动**（hover/click 也不旋转，仅做内容切换）；
- 静止时零计算（沿用墨系引擎原则）。

## 五、全站联动（远期愿景，未实施）

阴阳仪可升级为 **TradingLabb Polarity Interface**——全站 Polarity Filter：

- 点击 **YANG**：Map 只显示 Expansion / Growth 的主题；
- 点击 **TURN**：显示正在转折的主题；
- 点击 **YIN**：显示约束、出清、衰退的主题。

节点级联动（World Map 点选产业后，角落小阴阳仪显示权重）：

```text
AI Compute      YANG 78 / YIN 22
Memory          YANG 45 / TURN 55
出清阶段行业     YIN 82
```

Journal 可成为"时间机器"：同一主题在不同日期的 polarity 变化轨迹（2026.03 YANG → 2026.08 YANG→TURN → 2027.02 TURN …）。

## 六、拟写入设计宪法的条款（V2-04 实施时随任务单落地）

> **TradingLabb Yin-Yang Instrument**
> 阴阳仪是 TradingLabb 唯一保留的具象东方符号。
> 它不是装饰，不承担宗教或传统文化展示功能。
> 它代表 Expansion/Contraction、Narrative/Constraint、Growth/Clearing。
> 第三状态为 TURN，表示阴阳转换中的临界状态。
> 全站阴阳图形至多 2 个（Cycle 页现有 1 个 + 首页 Polarity Instrument 1 个）。
> 首页阴阳仪默认完全静止，仅 hover/click 时运动；动画必须缓慢、克制、可暂停。
> 不使用粒子、辉光、3D、纹理、复杂背景。
> 与 Map / Thesis 的 polarity 数据联动。
> 阴阳仪可以响应交互，但不"炫技"。

## 七、用户裁决结果（2026-08-23，替代原冲突记录）

| 冲突 | 裁决 |
|---|---|
| **C-01 · 阴阳仪 vs 太极图禁令** | ✅ 批准成文例外：全站阴阳图形**至多 2 个**。现有 1 个（Cycle 页 `Taiji` 组件，`src/pages/Cycle.tsx`）**保留不动**；至多再新增 1 个（首页 POLARITY 章节的 Polarity Instrument）；**不得出现第三个**。 |
| **C-02 · 首页持续旋转 vs 首屏动效禁令** | ✅ 采用**保守方案**：新增阴阳仪默认完全静止，仅 hover/click 时才产生运动。不与"首屏无开场动效"禁令冲突（无入场动效、无自动播放）。 |

**遗留义务**：V2-04 实施前，需将第六节条款以"成文例外"形式写入 P1
（02_DESIGN_CONSTITUTION §17 与根 DESIGN.md 禁令表），由任务单明确授权后执行；
写入前 P1 原文照旧有效。

原冲突背景（存档）：P1 §17 曾禁止"太极图（阴阳意象只用抽象方块）"；
2026-08-14 首屏阴阳生命体（DaoSymbol）被否决。本次裁决的边界：
禁止的是"太极装饰"，允许的是受上述硬约束的 **Polarity Instrument**。
