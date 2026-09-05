# V2-C.1 · IMPLEMENTATION REPORT

> 施工依据：`V2-C.1_IMPLEMENTATION_MAP.md` + 2026-09-05 Human 裁决表（D1=YES / THINK 撤出 / Journal=A / 创新药合并 / 51→46 保留 / 55→55 展示层删除）。
> Git 纪律：**Commit = NOT CREATED，Push = NOT EXECUTED。STOP BEFORE COMMIT。**

---

## 1. Changed Files（8 个，全部显式列出）

| 文件 | 改动 | 对应裁决 |
| --- | --- | --- |
| `src/pages/Home.tsx` | 重构：首屏宣言（2026-09-06 Human 修正②/③定稿：三段式左对齐——大标题「观察变化，而非预测未来。」；宣言前四行按现有断句左对齐；「玄之又玄，众妙之门。」单独居中、字号稍大作为总结并开启下文；黑色 HSNSymbol 位于该句正下方居中，不落入左上角标题栏邻近区；无 ENTER）→ ① Research 4 卡 → 阴阳 Lens（无下划线 + 极简语义行）→ ② World → ③ What Changed（LEDGER 派生 4 条）→ WUWEI（+WUWEI → 入口）→ END 不动；THINK 区（Current Belief / WHY / WHAT COULD CHANGE IT / Featured Research）整体移除 | HOME-01（修正②/③）/02/03/04/06/08/09/10/11 |
| `src/components/FlipCard.tsx` | 正面删去「FLIP」字母，仅留一个右箭头 `→` 于右下角（2026-09-06 00:07 Human）；背面整面 = 翻回按钮（删除「← 翻回」）；右下角唯一 CTA = `EXPLORE →`；整面翻回层与链接层结构分离，无冒泡冲突；键盘 / focus-visible / reduced-motion 保持 | HOME-05 / §6/§7 |
| `src/components/MapPreview.tsx` | 视觉增重（节点 14–22→22–34px、边 1px/25%→2px/40%、容器加高）；点亮节点 = `<a>` 一步直达 Primary Home；未点亮节点 = `<button>` 出 Node Detail（DELTA-01 不变）；Primary Home 分流 = `node.theses[0]` → 命题页，否则 `#/map`；退淡 0.20→0.45 | §9–§12 |
| `src/data/domains/thesis.ts` | 命题九并入命题八（conflict/yang/yin/evidence/counter/assumptions/invalidation 双向整合去重，updated→2026.09.05）；命题九置 `status:'closed'` 进 ARCHIVE，全部历史字段保留 | §17/§18 |
| `src/data/ledger.ts` | 新增纯派生 `latestChanges()`（delta≠0 → 按命题分组 → 每组最新 → 时间倒序 → limit） | §19–§22 |
| `src/pages/Journal.tsx` | 01 REVISION 区改经 `latestChanges` 投影；叙事流不动 | Journal = A |
| `src/data/domains/site.ts` | 宣言首行「研究」→「探索」（仅此一字） | §4 |
| `src/pages/Manifesto.tsx` | 撤下 description 重复段落（One Object One Primary Home） | D1 |

## 2. Data / Route / Schema Impact

- **Schema**：零改动（Thesis / MapNode / Revision 接口均未动）
- **路由 IA**：零改动（Explore 目的地全部为既有路由）
- **Ledger**：零改动（7 条记录全保留，含 55→55 / 46→46 confirm）
- **MAP_EDGES / map.ts**：零改动（真边校验仍通过）
- **Thesis 历史**：命题九条目与 `rev-innovative-drug-value-capture-20260904` 完整保留，互链无悬空

## 3. Acceptance（真实浏览器实测，InAppBrowser @ Vite dev）

| 验收项 | 结果 |
| --- | --- |
| 首屏：图形 Logo 恢复但居中（不邻近左上角标题栏）、大标题句恢复、无 ENTER、宣言五行完整（"探索"口径） | ✅ PASS（截图实测，2026-09-05 23:32 修正后复验） |
| Manifesto 无重复宣言段 | ✅ PASS（"玄之又玄"不再出现于该页） |
| Research 4 卡 = 真实 Report（含补位的电力 report-3） | ✅ PASS |
| FlipCard 点击翻面 → 背面仅 EXPLORE → 右下；整卡再点翻回；EXPLORE 直达 `#/research/report-2` 不触发翻面 | ✅ PASS |
| Polarity 无下划线（computed `text-decoration: none`）、三行语义整齐、三态互斥可取消 | ✅ PASS |
| Map 视觉增重 | ✅ PASS（截图实测） |
| 点亮节点一步直达（算力芯片 → `#/thesis/compute`） | ✅ PASS |
| 未点亮节点可点击出 Node Detail（YIN 滤镜下：6 个 button + 阴节点直链 `#/map`） | ✅ PASS |
| Node Detail = Name + State + EXPLORE（DELTA-01） | ✅ PASS |
| What Changed = 4 条真实变化（机器人 51→46 / 存储 65→68 / 国产算力 65→72 / 新能源 57→63），confirm 不投影 | ✅ PASS |
| WUWEI 静默收束 + 唯一极简入口，无营销 | ✅ PASS |
| Thesis：创新药 Active 唯一（合并标题）；命题九在 ARCHIVE | ✅ PASS |
| Journal：4 条 delta≠0；51→46 保留；55→55 不出现；`has55=false` | ✅ PASS |
| 合并命题详情页渲染完整（含价值捕获与证伪条件，62%） | ✅ PASS |
| reduced-motion 下翻面瞬时切换可用（`motion-reduce:transition-none` 生效） | ✅ PASS |
| 键盘可达：全部为原生 button/a + tabIndex 管理（a11y 树实测引用正确） | ✅ PASS |
| `npm run build`（tsc + vite） | ✅ PASS |
| `npm run check` | ⚠️ 290 过 / 2 败——**2 项失败在干净基线 `c4ace8c` 上 stash 复测同样存在**（CONTEXT_HISTORY fold ↔ now/cycle 漂移），属 V2-C 基线既有问题，非本轮引入，超出 V2-C.1 授权范围，登记为 P2 待 Human 决策 |
| No Data Loss / No Route Change / No Schema Change | ✅ PASS |

## 4. 最终问题的回答

> **现在的 TradingLabb 首页，陌生用户是否可以在最少操作下理解：HSN 在研究什么 → 世界发生在哪里 → HSN 的判断发生了什么变化？**

**YES。** 首屏宣言回答"这里是什么"；四张研究卡（翻面即隐藏变量，EXPLORE 一步进报告）回答"在研究什么"；阴阳 Lens + 增重后的产业地图（点亮节点一步直达研究本体）回答"世界发生在哪里"；四条真实判断变化（含数字与原因）回答"判断如何变化"；WUWEI 收束。全程无内部架构词暴露。

## 5. Git Reconciliation

```
 M app/src/components/FlipCard.tsx      M app/src/data/ledger.ts
 M app/src/components/MapPreview.tsx    M app/src/pages/Home.tsx
 M app/src/data/domains/site.ts         M app/src/pages/Journal.tsx
 M app/src/data/domains/thesis.ts       M app/src/pages/Manifesto.tsx
?? app/00_PROJECT/V2/V2-C.1_IMPLEMENTATION_MAP.md
?? app/00_PROJECT/V2/V2-C.1_IMPLEMENTATION_REPORT.md（本文件）
```

`git diff --check` = clean。**STOP BEFORE COMMIT —— 等待 Human Review 与 COMMIT GRANTED。**
