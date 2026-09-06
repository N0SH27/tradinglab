# V2 · SEE 场景 · POLARITY × XIAO 视觉重设计定稿

> ⚠️ **修订提示（2026-09-06 R1）**：本文 §06.2 音孔孔径分档、§07 中 `state→孔态` / `valuation→外环` / `size→孔径` 的视觉编码条款已被 `V2_SEE_POLARITY_XIAO_REVISION_R1.md` §G「DEPRECATED VISUAL ENCODING」正式废止（仅 Representation 层废止，数据字段保留）。以 R1 为准。

> 内部代号：`PolarityXiao`（仅设计文档与组件命名使用，用户界面不出现）。
> 状态：**设计定稿 · 待 Human Approval**。本轮 NO CODE / NO DATA CHANGE / NO COMMIT / NO PUSH。
> 依据：Human 设计简报（2026-09-06）+ 对当前实现的代码审计（`src/pages/Home.tsx`、`src/components/MapPreview.tsx`、`src/components/PolarityInstrument.tsx`、`src/data/domains/map.ts`、`src/data/polarity.ts`、`src/index.css`）。

---

## 01 · Design Judgment

### 1.1 当前实现审计结论

SEE 场景现状（`Home.tsx` 第 167–210 行）：

- 左侧（`md:col-span-4`）：`PolarityInstrument`（受控展示态，`interactive={false}`，`size=130`，无滤镜时 `opacity-40`）+「变化，不是线性的。」+ 三态滤镜按钮（阳 / 转换 / 阴，hint 取自 `META.words`）。
- 右侧（`md:col-span-8`）：`MapPreview`——7 节点（`gpu / hbm / cowos / optical / server / idc / power`）+ 6 条真实边（`CHAIN`，经 `MAP_EDGES` 校验，缺边不画），蛇形百分比坐标排布，节点带状态填充与估值外环。

**判断：Polarity 一侧已经是对的，不动。** 它已是认知仪器（三态、单向旋转、有界跟随），语义与 `MapNode.state` 同源。

**问题在右侧。** 蛇形折线 + 圆点，本质是「数据可视化图表」的语言：节点靠 `<line>` 连接、位置靠坐标表（`POS`）任意指定。它与左侧的东方认知仪器不在同一个视觉体系里——简报的判断准确：这是「哲学元素 + 数据可视化」，还不是「一个东方认知仪器」。

### 1.2 设计决策

用**一支 64° 斜置的墨线洞箫**整体替代右侧折线图：

- 洞箫本体 = 产业脉络（替代 6 条 `<line>`，**不是叠加**）；
- 音孔 = 7 个选题节点（替代 7 个圆点，语义编码全部沿用现有体系）；
- 点击音孔 = SELECT → REVEAL → EXPLORE（替代现有的直链 / Node Detail 双模式）。

这不是换一张图，是把 SEE 右侧从「图」改成「器物」。折线的认知功能（连续路径、上下游次序、节点状态）全部保留，载体从图表语言换成器物语言。

### 1.3 与 V2-C.1 裁决的关系（需 Human 确认的一点）

V2-C.1 §12 裁决：点亮节点 = `<a>` 一步直达 Primary Home。本设计将所有音孔统一为两段式（选中 → 出现选题与 EXPLORE），与「一步直达」存在张力。处理方案见 §08：**点亮音孔仍保持一步直达**（`<a>` 行为不变），两段式只应用于滤镜下未点亮音孔——即现有「State ≠ Interaction Permission」纪律原样保留，交互模型零回退。这是本设计与既有裁决的调和点，实施前请 Human 确认。

---

## 02 · Concept Definition

**POLARITY · THE XIAO（阴阳 · 洞箫）**

> 世界的变化如气流，选题如音孔，研究如声音。

四个角色，各司其职：

| 元素 | 角色 | 动态性 |
|---|---|---|
| POLARITY（阴阳仪） | Reality is changing. 世界持续变化 | **动**（旋转、有界跟随，现状保留） |
| XIAO（洞箫本体） | The observation framework remains coherent. 观察框架稳定 | **静**（不旋转、不漂浮、无任何自主动画） |
| HOLES（音孔） | Current topics / observations. 关注对象变化 | **状态变**（选中、滤镜命中、估值环） |
| TOPIC → RESEARCH | 按下音孔，发出的是研究 | **由用户触发** |

用户不是「播放音乐」，是「按下一个观察点」。整个组件禁止出现 ♪ ♫ ♬、声音、乐器拟物、演奏游戏感——「音符」的概念只通过 *音孔 → 点击 → 题目出现* 完成。

设计链：

```
POLARITY → XIAO → NOTE / HOLE → TOPIC → RESEARCH
```

---

## 03 · Visual Direction

### 3.1 洞箫视觉设计说明

一支「被现代设计重新抽象过的传统器物」：中国白描 / 工笔线描 × 现代极简制图。不是写实摄影、不是 3D 渲染、不是古风插画、不是 AI 常见的过度细节。

- **线条**：单一墨线（`--ink: 10 10 10`）为主，结构辅线用 `--ink-3: 117 117 115`；线宽两档（外轮廓 2px 等效 / 内部结构 1px 等效），无任何第三档。
- **背景**：纸面 `--paper: 250 250 249`，洞箫区域无衬底、无卡片、无投影。
- **色彩**：零新增。洞箫只用 黑 / 纸 / 灰；状态色沿用既有语义（朱砂 `--cinnabar: 192 57 43` = 转换 / 估值透支；深水蓝 `--water: 61 90 108` = 阴 / 估值出清）。
- **质感**：禁止木纹、金属、发光、粒子、渐变材质、戏剧光。允许的唯一「非线」元素是音孔的状态填充（既有语义）。

### 3.2 64° 构图说明

洞箫整体自**左下向右上**延伸，轴线与水平夹角约 **64°**。

- 64° 不是装饰角度，它承担 Change / Direction / Flow 的视觉意义：阴阳在左告诉你「世界如何转换」，洞箫在右告诉你「变化落在哪里」。
- Desktop 与 Mobile 均保持 64°，移动端不做水平化、不做垂直化（详见 §05）。
- 实现上以 CSS `rotate` 或 SVG `transform` 旋转一支「垂直绘制」的洞箫资产，**而不是**直接绘制斜的——保证音孔 overlay 坐标在旋转前后可用同一套参数计算。

### 3.3 视觉层级（硬性）

```
LEVEL 1  POLARITY          第一视觉锚点（现状保留）
LEVEL 2  XIAO              第二锚点，体量与对比度必须低于 Polarity
LEVEL 3  TOPIC HOLES       音孔
LEVEL 4  TOPIC LABEL       选题名（只在选中时出现）
LEVEL 5  RESEARCH ENTRY    EXPLORE 入口
```

洞箫墨色建议降至 `--ink` 的 80–90% 不透明度或线宽减档，确保第一眼仍是阴阳图。

---

## 04 · Desktop Composition

基于当前 `md:grid-cols-12` 骨架，**栅格不变**：

```
┌────────────────────────────────────────────────────────────────┐
│  col-span-4                              col-span-8            │
│                                                                │
│  [阴阳仪 size=130]                              ● 算力芯片      │
│                                                ╱               │
│  变化，不是线性的。                        ○ HBM 存储           │
│                                             ╱                  │
│  阳      转换      阴                    ● 先进封装             │
│  YANG    TURN     YIN                     ╱                    │
│  增长…   过渡…    约束…               ◐ 光模块 / CPO           │
│                                          ╱                     │
│                                     ○ 服务器整机                │
│                                        ╱                       │
│                                   ◐ IDC / 智算中心              │
│                                      ╱                         │
│                                 ● 电力                          │
│                                                                │
│            （洞箫本体即连线，节点间无任何附加线）                  │
│                                                                │
│                          按下一处音孔，进入它的研究。             │
└────────────────────────────────────────────────────────────────┘
```

- 左列完全不动（PolarityInstrument + 一句 + 三态滤镜）。
- 右列：`MapPreview` 的蛇形折线区域替换为 `PolarityXiao` 组件；容器高度沿用 `h-[520px] md:h-[600px]`。
- 洞箫自右列的左下（约 x=15%, y=92%）向右上（约 x=85%, y=8%）延伸，7 个音孔沿轴等参数分布，标签统一置于音孔**右侧**（轴的行进方向一侧），避免与洞箫本体叠字。
- 底部说明文案：**「按下一处音孔，进入它的研究。」**（不用「点击节点查看详情」类 Dashboard 文案。）

---

## 05 · Mobile Composition

窄屏不是 Desktop 的缩小，是空间重组：**上下构图**。

```
┌──────────────────────┐
│      [阴阳仪]         │
│                      │
│  变化，不是线性的。    │
│                      │
│  阳   转换   阴       │
│                      │
│              ● 算力芯片│
│             ╱        │
│          ○ HBM      │
│           ╱          │
│        ● 封装        │
│         ╱            │
│      ◐ 光模块        │
│       ╱              │
│    ○ 服务器          │
│     ╱                │
│  ◐ IDC              │
│   ╱                  │
│ ● 电力              │
│                      │
│ 按下一处音孔，        │
│ 进入它的研究。        │
└──────────────────────┘
```

- 顺序：Polarity → Xiao → （选中后的 Topic 卡）→ Research 入口。
- 洞箫保持约 64°，自左下向右上；容器高约 `min(78vh, 560px)`，确保首屏内可见全部 7 孔。
- 音孔热区 ≥ 44×44px（触达标准），视觉孔径可小于热区。
- 标签位置：孔右侧空间不足的标签（轴右侧近边缘者）切换到左侧，规则统一为「远离容器边缘一侧」。

---

## 06 · Xiao Asset Specification

### 6.1 结构（保留 / 删除清单）

保留且仅保留：

1. **主体长轴**——一根微锥形长管（吹口端略细），管身平直，无弯曲炫技；
2. **吹口**——顶端一个 U 形缺口的抽象线描（两笔）；
3. **竹节**——**2 道**，仅作结构节奏，位于管身上 1/3 与 2/3 附近，单线横弧；
4. **音孔**——7 个正圆，沿轴心等参数分布于管身中段至尾段（见 6.2）；孔不凹陷、无阴影；
5. **尾部**——底端平切 + 一道收束线。

删除：多余竹节、缠线、刻字、挂饰、云纹、书法、山水、任何背景元素。

### 6.2 音孔数量与位置方案

洞箫在「垂直未旋转」坐标系（宽 120 × 高 1000 的设计稿坐标）中定义，随后整体 rotate(-26°)（即与垂直成 26°，与水平成 64°）：

| 序 | 节点 | 音孔中心 y（设计稿坐标） | 说明 |
|---|---|---|---|
| 1 | gpu 算力芯片 | 300 | 最靠近吹口，产业链源头 |
| 2 | hbm HBM 存储 | 380 | |
| 3 | cowos 先进封装 | 460 | |
| 4 | optical 光模块 / CPO | 540 | |
| 5 | server 服务器整机 | 620 | |
| 6 | idc IDC / 智算中心 | 700 | |
| 7 | power 电力 | 780 | 靠近尾部，约束层收尾 |

- 孔序 = `MapPreview` 现有 `SLICE` 顺序 = 真实产业链上下游次序，与 `CHAIN` 的 6 条真边一一对应（边不再画出，由箫身承担）。
- 孔心均在轴线上（x=60），不做左右交错——交错是折线图的语言，不是器物的语言。
- 孔径三档沿用 `DOT` 权重映射（`size` 1/2/3 → 22/28/34px 等效），权力重信息零丢失。

### 6.3 资产形式（关键决策）

**首选：手工编写的内联 SVG 作为洞箫本体**，而非 AI 位图。理由：

- 音孔 overlay 要求孔位像素级对齐——SVG 坐标即 overlay 坐标，对齐零误差；AI 位图的孔位不可控，对齐必然返工；
- 墨线白描在 SVG 中可精确表达（单线、两档线宽），AI 生成反而带来简报禁止的「过度细节」风险；
- 全站已有 SVG 传统（`HSNSeal` / `HSNSymbol` / `PolarityInstrument` 均为代码绘制）。

AI 位图仅作为**备选质感层**（若 Human 审后认为纯 SVG 过于「制图感」，可用 §11 的 Prompt 生成透明 PNG 作为箫身衬底，孔位仍以 SVG overlay 为准）。Prompt 已按简报 §21 备妥，见 §11。

---

## 07 · Topic / Hole Mapping

**零新实体、零新数据模型。** 音孔直接消费 `MapPreview` 现有切片与 `map.ts` 字段：

| 音孔 | node id | name | state → 孔态 | valuation → 外环 | size → 孔径 | Primary Home |
|---|---|---|---|---|---|---|
| 1 | `gpu` | 算力芯片 | turn → ◐ 半实 | fair → 无 | 3 → 34px | `#/thesis/compute` |
| 2 | `hbm` | HBM 存储 | yang → ● 墨实 | stretched → 朱砂环 | 2 → 28px | `#/thesis/memory-cycle` |
| 3 | `cowos` | 先进封装 | yang → ● 墨实 | fair → 无 | 2 → 28px | `#/map` |
| 4 | `optical` | 光模块 / CPO | yang → ● 墨实 | stretched → 朱砂环 | 2 → 28px | `#/thesis/optical-module` |
| 5 | `server` | 服务器整机 | yin → ○ 白空墨边 | fair → 无 | 1 → 22px | `#/map` |
| 6 | `idc` | IDC / 智算中心 | turn → ◐ 半实 | fair → 无 | 1 → 22px | `#/map` |
| 7 | `power` | 电力 | yang → ● 墨实 | washed → 深水蓝环 | 2 → 28px | `#/map` |

字段复用映射：

- **选题名** = `node.name`（不变）；
- **一句观察** = `node.stateNote`（现成的短句，如 HBM：「产业阳 × 估值阴：量价齐升，但股价已开始不跟」）——不新写文案、不动 `observation` 长文；
- **状态语义** = `node.state`（SSOT，`polarity.ts` 唯一推导入口不变）；
- **估值外环** = `valuationRing()` 现有编码原样搬用；
- **路由** = `primaryHomeOf()` 现有分流逻辑原样搬用（`theses[0]` → 命题页，否则 → `#/map`）。

---

## 08 · Interaction State Machine

### 8.1 状态图

```
                 ┌─────────────────────────────────────────┐
                 │                DEFAULT                   │
                 │  7 孔全可见；无自动巡游；无弹跳；无自动播放 │
                 └───────┬─────────────────┬───────────────┘
              指针悬停   │                 │ 点击点亮孔（无滤镜=全部点亮）
                         ▼                 ▼
                 ┌──────────────┐   (点亮孔为 <a>，一步直达 Primary Home——
                 │    HOVER     │    V2-C.1 §12 裁决保留，见 §1.3)
                 │ 墨度轻微加深  │
                 └──────────────┘
              键盘 Tab │
                         ▼
                 ┌──────────────┐
                 │    FOCUS     │  朱砂 2px outline（沿用现有 focus-visible 规范）
                 └──────────────┘

   滤镜激活且孔未点亮时，点击 →
                 ┌──────────────────────────────────────────┐
                 │                SELECTED                   │
                 │ ① 孔由 ○→选中态（视觉加重，不改状态语义）   │
                 │ ② 其余孔 opacity 降至 0.45（沿用现有值）     │
                 │ ③ 选题名淡入（node.name）                  │
                 │ ④ 一句观察淡入（node.stateNote）           │
                 │ ⑤ EXPLORE → 出现（primaryHomeOf 路由）     │
                 └──────────────────────────────────────────┘
                         │ 再点同一孔 / 点他孔 / Esc
                         ▼
                     DEFAULT

   POLARITY FILTERED（滤镜激活）：
     命中孔 = lit（opacity 100%，一步直达）
     未命中孔 = 退淡（opacity 45%，仍可点击 → SELECTED）
     —— 与 MapPreview 现行行为逐条对应，零新增规则。

   REDUCED MOTION：见 §10。
```

### 8.2 反馈纪律

- 全部过渡 150–300ms，`opacity` / `outline` 两类属性为主；无位移、无缩放弹跳、无粒子、无声音。
- 交互语法只用既有的 **Select / Reveal**，不发明新动画语言（HDG 已通过语法之外零增补）。
- 「选中态」是独立的视觉通道（加重 + 标签出现），**不复用、不改变** state 填充语义——●/○/◐ 永远只表达 polarity。

---

## 09 · Polarity Filter Mapping

滤镜行为与 `MapPreview` 现行逻辑同构，仅载体替换：

| 滤镜 | 语义 | 洞箫表现 |
|---|---|---|
| `null`（默认） | 完整切片 | 7 孔全部点亮，均可一步直达 |
| `yang` | Expansion View：增长 · 采纳 · 扩张 | `state==='yang'` 孔点亮（hbm / cowos / optical / power）；其余退淡可点 |
| `yin` | Constraint / Clearing View：约束 · 出清 · 收缩 | `state==='yin'` 孔点亮（server）；其余退淡可点 |
| `turn` | Transition View：过渡 · 反转 · 拐点 | `state==='turn'` 孔点亮（gpu / idc）；其余退淡可点 |

- 滤镜只改变状态表达，从不剥夺操作权限（State ≠ Interaction Permission，不变）。
- 阴阳仪继续旋转（受控角度推导不变）；洞箫**不旋转、不跟随**——一动一静正是产品隐喻本身。
- 数据源只读 `MapNode.state`，经 `polarity.ts` 既有入口，零新推导逻辑。

---

## 10 · Accessibility / Reduced Motion

- 每个音孔是真实 `<a>` 或 `<button>`（沿用 MapPreview 的双模式分流），非 SVG 装饰：
  - `aria-label` 沿用现有句式：「算力芯片：转换中。进入它的研究本体。」/「……查看名称与状态。」；
  - 未点亮孔带 `aria-pressed`；
  - 可见焦点 = 朱砂 2px outline（现有 `focus-visible` 规范）。
- 键盘：Tab 遍历 7 孔，Enter 触发与点击一致；Esc 退出 SELECTED。
- 不依赖 hover 传递任何独占信息（hover 只是反馈）。
- `prefers-reduced-motion`：阴阳仪旋转与跟随关闭（现有行为）；洞箫本就无自主动画；孔态切换瞬时、选题展开瞬时；路由功能完整。

---

## 11 · AI Image Generation Prompt

仅用于 §6.3 的备选质感层（首选仍为手工 SVG）。Prompt 原样采用简报 §21：

```text
A minimalist contemporary Chinese xiao flute,
drawn as a refined monochrome ink-line illustration,
inspired by Chinese white-line drawing and modern editorial design,
precise architectural geometry,
long slender silhouette,
subtle bamboo joints,
minimal mouthpiece and tail structure,
clean circular finger holes,
black ink lines on transparent or warm off-white background,
restrained Chinese aesthetic,
quiet intellectual atmosphere,
contemporary oriental minimalism,
no ornamental patterns,
no calligraphy,
no landscape,
no mountains,
no clouds,
no fantasy,
no gold,
no red decoration,
no realistic photography,
no 3D rendering,
no wood texture emphasis,
no dramatic lighting,
no glow,
no particles,
no shadows,
no musical notes,
no text,
no logo.

The flute should be designed as a graphic object for an interactive research website,
not as an illustration poster.

The silhouette should work at approximately a 64-degree diagonal angle,
extending visually from lower-left toward upper-right,
with sufficient negative space around the body,
and with clearly separated circular holes suitable for interactive overlays.

The design should feel:
quiet, precise, minimal, intellectual, Chinese, timeless, editorial, architectural.
```

执行注记：生成后必须过 §14 验收清单第 4、14 条（64° 方向 / 无 AI 过度细节）；孔位不合格即弃用，回退手工 SVG，不在位图上修补孔位。

---

## 12 · React / SVG Implementation Plan

供实施轮使用（本轮不写码）：

1. **新组件** `src/components/PolarityXiao.tsx`，替换 `Home.tsx` 中的 `<MapPreview active={polarity} />` 挂载点；`MapPreview` 保留至验收后删除。
2. **三层架构**：
   - L1 箫身：内联 SVG（垂直绘制 120×1000 设计坐标，整体 `transform: rotate(-26deg)`，竹节 2 道、吹口、尾部，两档线宽）；
   - L2 音孔 overlay：同一 SVG 坐标系内的 `<g>` 或绝对定位 DOM 按钮，孔心 = §6.2 表，孔径 = `DOT` 映射，填充 = 现有 `nodeFill()`、外环 = 现有 `valuationRing()`；
   - L3 选题标签：HTML（`node.name` + `node.stateNote` + EXPLORE），定位于孔侧，规则见 §04/§05。
3. **复用而非重写**：`SLICE`、`primaryHomeOf()`、`nodeFill()`、`valuationRing()`、`STATE_ZH` 从 `MapPreview` 提取为共享（或就地 import），`map.ts` / `polarity.ts` / `MAP_EDGES` 零改动。
4. **真边校验保留**：`EDGE_OK` 检查逻辑搬入新组件——数据链断裂时不画洞箫、显式报错，绝不出现「假脉络」。
5. **布局**：Desktop 右列 `relative h-[520px] md:h-[600px]` 容器内绝对定位；Mobile 重组为块级流（§05）。
6. **删除项**（实施轮执行）：`POS` 蛇形坐标表、6 条 `<line>`、CHAIN 绘制。

---

## 13 · Risks / Failure Modes

| # | 风险 | 后果 | 对策 |
|---|---|---|---|
| R1 | **隐喻过强**：用户看不出音孔=选题 | 5 秒测试失败 | 底部常驻一句「按下一处音孔，进入它的研究。」；首个未选中孔预置 0.45 透明度的示例标签不做——保持克制，以文案兜底 |
| R2 | 洞箫抢视觉中心 | 违反层级纪律 §3.3 | 墨色降档 / 线宽减档；验收第 1、2 条把关 |
| R3 | 滑向「音乐网站」 | 品牌错位 | 禁 ♪♫♬、禁声音、禁乐器拟物；验收第 12 条 |
| R4 | AI 资产孔位不可控 | overlay 错位返工 | 首选手工 SVG（§6.3）；位图仅备选且孔位以 overlay 为准 |
| R5 | 两段式交互与 V2-C.1「一步直达」冲突 | 交互回退 | §1.3 调和方案：点亮孔保持 `<a>` 直达；待 Human 确认 |
| R6 | 移动端 64° 挤压可读性 | 标签溢出 | 标签「远离边缘一侧」规则 + 热区/视孔分离；mobile 构图单独验收（§14 第 16 条） |
| R7 | stateNote 长句破坏留白 | 层级 4 超抢 | 选题卡限两行，超出截断；全文在 Research 本体 |
| R8 | 滤镜下只剩 1 孔点亮（如 yin 仅 server） | 洞箫显空 | 属既有数据事实，不用视觉手段掩饰；退淡孔仍可见可点 |

---

## 14 · Acceptance Checklist

实施完成后逐项过检（对应简报 §22）：

1. 用户第一眼仍然看到 Polarity。
2. 洞箫不会抢走 Polarity 的视觉中心。
3. 洞箫真正替代原来的折线，而不是叠加（`POS`/`<line>` 已删除）。
4. 64° 视觉方向明确（Desktop 与 Mobile 同方向）。
5. 音孔自然成为 Topic（孔序 = 产业次序 = `SLICE`）。
6. 用户点击音孔后知道自己选择了什么（选题名 + stateNote 出现）。
7. 选题可以进入 Research（`primaryHomeOf` 路由全通）。
8. Polarity 可以改变 Topic 的观察视角（三态滤镜命中/退淡正确）。
9. 没有新增 Entity（仅 `SLICE` 7 节点）。
10. 没有新增数据模型（`map.ts` / `polarity.ts` 零改动）。
11. 没有 Dashboard 感。
12. 没有音乐网站感（无 ♪♫♬、无声音、无乐器拟物）。
13. 没有传统国风网站感（无金色、无书法、无山水云纹）。
14. 没有 AI 生成图片常见的「过度细节」。
15. 没有炫技动画（过渡 150–300ms，仅 opacity/outline）。
16. Mobile 不是简单缩小 Desktop（上下构图 + 标签侧规则生效）。
17. Reduced Motion 仍然完整可用（旋转关、切换瞬时、路由全通）。
18. 整个组件仍然符合：Deep Architecture, Simple Surface, Rich Exploration.

### 止损测试（实施验收时执行）

- **5 秒**：首入 SEE，用户能否知道这里是「当前正在观察的产业/主题」？
- **15 秒**：用户能否理解 音孔 = 选题？（不能 → 加极轻提示，不加重视觉）
- **30 秒**：用户能否完成 选音孔 → 看选题 → 进入 Research？

---

*本定稿等待 Human Approval；批准后进入 Implementation 轮（组件施工 + MapPreview 退役 + 真机验收）。*
