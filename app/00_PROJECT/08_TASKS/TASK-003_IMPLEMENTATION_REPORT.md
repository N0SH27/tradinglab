# TASK-003 Implementation Report

> **TASK-003 · Homepage Deduplication & Content Routing Implementation**
> Contract: V2-29 · v1.0 · LOCKED ｜ Implementation Authorization: GRANTED（2026-09-01）
> **Commit Authorization: NOT GRANTED —— 本报告提交后等待 Human Review。**
> 日期：2026-09-01

---

## 1. Modified Files

| 文件 | 性质 |
|---|---|
| `app/src/pages/Home.tsx` | 呈现层改动（FOCUS 路由 / LIVE THESIS 压缩 / RESEARCH Featured / 头部注释） |
| `app/00_PROJECT/V2/04_V2_HOME_SPEC.md` | 文档同步：文首新增「修订登记 · V2-29 / TASK-003」，仅覆盖受影响的首页行为 |
| `app/00_PROJECT/08_TASKS/CURRENT_TASK.md` | 闸门状态更新（TASK-003 IMPLEMENTED，待 Commit 授权） |

**仅 1 个代码文件**。Rule 7 要求的额外文件说明：04 号文同步属 TASK-003 §2.2 授权范围；CURRENT_TASK.md 属闸门状态登记。无其他文件改动。

## 2. Before / After Behavior

| 章节 | Before | After |
|---|---|---|
| FOCUS | 三卡片落点混用：算力→Thesis、存储→Thesis、电力→Report；type 标签混用 THESIS/REPORT | 三卡片全部落点 Research Report（直接回应该 Focus 问题者）；type 统一 `REPORT · 2026.08` |
| LIVE THESIS | 卡片含 industry + title + `conflict.but` + conviction + polarity + window + revised | 纯信念状态卡：no + title + conviction + polarity + window + revised；industry 与 `conflict.but` 移除 |
| RESEARCH | 完整列出 REPORT #1–#3（小型 Research Index） | 1 份 Featured Research + ALL RESEARCH 出口 |
| NOW | `OBSERVATIONS.slice(0,5)` + thesisId 直链 | 不变（链接保留，文案零改动，见 §6） |
| 章序 / POLARITY / WUWEI / END | — | 零变化（git diff 可证） |

## 3. FOCUS Routing

```text
Focus: 国产算力链「政策意志与产业能力的剪刀差，如何在出货数据里显形？」
Destination: #/research/report-1（中国 AI 算力基础设施产业链研究）
Reason: 报告 #1 直接回应该 Focus 问题（同一研究对象、同一问题域）——Report 优先命中

Focus: 存储周期「价格与基本面的背离，这一次走到哪里了？」
Destination: #/research/report-2（存储周期：价格上涨失效的周期解剖）
Reason: 报告 #2 直接回应该 Focus 问题——Report 优先命中

Focus: 电力约束「这个约束的硬度，用什么尺子量？」
Destination: #/research/report-3（电力约束：从判断到可跟踪结构）
Reason: 报告 #3 直接回应该 Focus 问题——维持既有落点
```

三条全部第一优先级命中（Report），未触发 Thesis 兜底，无悬空 Focus。证伪可见性保持：报告页骨架内嵌 THESIS LINK + INVALIDATION（V2-28 §5.2）。OQ-1 实施裁决：type 标签语义 = 「该注意力的当前主载体」。

## 4. Featured Research Logic

- **How selected**：人工指定 REPORT #1《中国 AI 算力基础设施产业链研究》——依据：V2-28 OD-4 的 Report #0 试点直系成果，三份报告中产业链覆盖最广
- **Why no new field/schema**：实现为 `Home.tsx` 内单个 `FEATURED` 常量引用（含纪律注释），替换 `REPORTS` 数组渲染；未新增 featured 字段 / 数据文件 / 排序逻辑 / 推荐算法；更换 Featured = 人工改此一处引用

## 5. LIVE THESIS Changes

- **Removed**：`industry`（label-sm water 行）、`conflict.but`（摘要行）
- **Kept**：Thesis title / conviction（deriveCurrentBelief 大数字）/ polarity（deriveThesisPolarity 推导，逻辑不动）/ time window / last revised
- 数据源 `theses.ts` 零改动——只在 Home.tsx 投影层忽略字段（Rule 4）

## 6. NOW Semantic Review

- 渲染逻辑零改动；`thesisId` 直链全部保留（Observation → Judgment 导航捷径）
- 未新增任何判断 / 结论 / 预测语言
- **发现的既有文案边界问题（OUT OF SCOPE，见 §9）**：首页前五条中两条 summary 的末句带框架性判断色彩。这些文案在 `domains/now.ts`（Canonical 数据域），TASK-003 Do Not Touch 明文禁止修改，故未动，留待 Human 裁决是否另开内容任务

## 7. Validation

```text
Commands:  npm run check   （scripts/check-data.mjs，既有）
           npm run build   （tsc -b && vite build，既有）
Result:    build ✓ 通过（1.28s）
           check 248 项通过 / 2 项失败
```

**2 项失败为 HEAD 既有问题，与本任务无关**（已用 `git stash` 在干净 HEAD 81f20ce 上复跑验证，同样 248/2）：

- [24] Current fold ↔ 生产当前态一致性漂移（context-history）
- [26] Initial Migration 快照 now/cycle/era 不完整

**浏览器实测**（临时 dev server :7100 + headless Chrome，实测后服务器已停止）：

- 桌面 1440px 与移动 390px 整页截图走查通过：章序不变；FOCUS 三卡 type 统一；LIVE THESIS 无 industry/conflict.but；RESEARCH 单条 Featured + ALL RESEARCH；NOW 五条正常
- 截图：`task003-preview/home-desktop.png` / `home-mobile.png`（工作区根目录）

## 8. Scope Check

```text
New entity:      无（FOCUS 仍为组件内常量 + Derived View，无 focus.ts / schema）
New schema:      无
New data layer:  无（FEATURED 为呈现层常量引用，非数据域）
New route:       无
New component:   无（ResearchProductCard 等组件零改动）
CMS / 推荐 / 排序 / 判重系统: 无
```

## 9. Remaining Issues

**OUT OF SCOPE items：**

1. **NOW 既有文案两条带判断色彩**（`now.ts` · 数据域，本任务禁改）：
   - `ai-inference-economics` 末句「需求结构比芯片性能更值得盯」——注意力导向语
   - `memory-price-divergence` 末句「顶部信号不是价格下跌，而是上涨失效」——与 memory-cycle 命题框架重叠（Belief Language 渗入 Observation Language）
   - 建议：若裁决修改，另开内容任务走 Canonical 数据修订程序，不走呈现层任务
2. **check-data 既有 2 项失败**（[24] fold 漂移 / [26] initial 快照不完整）——先于 TASK-003 存在，属 C1 数据域，建议另立任务排查

---

**等待 Human Review → Commit Authorization。本报告提交前后均未执行任何 Commit / Push。**
