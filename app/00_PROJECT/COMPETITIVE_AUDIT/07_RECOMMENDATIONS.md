# 07 · RECOMMENDATIONS（Roadmap）

> 审计日期：2026-09-24 ｜ 排序：P0（不做则复利不成立）→ P1（显著增强）→ P2（有余力再做）→ DEFER。
> 每条含 Problem / Evidence / Why it matters / Recommended action / Affected pages / Affected architecture / Expected outcome / Risk。
> **重要边界**：本轮为 AUDIT ONLY。以下为建议，未实施任何改动；所有动作须经 Human Review 后另行立项。

---

## P0-1 · 建立「变化通告」Return Loop（BUILD-1）

- **Problem**：修正史资产增长，但读者无通道感知；每次 Ledger 入账对站外世界不可见。
- **Evidence**：04 矩阵 Return Loop 行——全部 7 个竞品至少具备邮件/推送之一，TradingLabb 为明显缺口；05 反向审计判定「不做则复利不成立」。
- **Why it matters**：可审计性只有在被持续阅读时才产生信任复利；分发是 moat 成立的第三前提（机制✅ 时间⏳ 触达❌）。
- **Recommended action**：建立极简「变化通告」——触发源 = Ledger 新入账 / 新研报发布 / 裁决书公开；形式 = 邮件列表 或 RSS（二选一先跑通；内容=每条变化的一句话+链接，附「为什么改」的 100 字内摘要）；节奏 = 事件驱动、每周封顶；语气 = 零营销（沿用 WUWEI 收束的品牌纪律）。**明确不做**：营销话术、定期总结流、付费墙。
- **Affected pages**：无现有页面改动；新增落地页（订阅确认/存档页）。
- **Affected architecture**：新增一个订阅数据载体（邮件服务商或静态 RSS 生成）；**不触碰**命题/账本/日志/地图数据层。
- **Expected outcome**：回访率与账本曝光度的可测提升；修正史从「被动可见」变「主动送达」。
- **Risk**：承诺一旦建立必须持续维护（每次入账要发）——需要在研究流程中加入「入账即通告」的 5 分钟动作；若断更会损害品牌。

## P0-2 · 极简作者身份层 + 激励/立场声明（BUILD-2 + FIX-2）

- **Problem**：「HSN 是谁」无答案；零利益冲突是默认状态而非承诺。
- **Evidence**：01 文件陌生用户测试 Q2=不能；04 矩阵 Author IP/Trust 两行=明显缺口；Stratechery Ethics Policy 为领先样本（03 文件 §1）。
- **Why it matters**：分发（P0-1）建立后，新访客第一落点问题即身份问题；转化漏斗的第一漏点。
- **Recommended action**：不建传统 About 页。在 HSN 栏目（导航现有组）下增加一页或一段：① 履历锚点（全职交易年限、研究范围，三至五行）；② 激励声明（无资管业务/不靠本站盈利/不推荐个股/判断全部可经账本检验——一段）；③ 与宣言页的互链。**篇幅纪律**：全页不超过一屏。
- **Affected pages**：HSN 栏目（宣言 + 新身份页/段）。
- **Affected architecture**：无数据层改动；SITE.description 可能微调。
- **Expected outcome**：陌生用户测试 Q2 从「不能」变为「能」；信任结构可引用、可转发。
- **Risk**：过度自我陈述会稀释「无为」气质——克制是硬要求；履历若无机构背书，宁可写少。

---

## P1-1 · NOW 聚合页（BUILD-3）

- **Problem**：回访用户没有「最近变了什么」的第一落点。
- **Evidence**：01 文件 §E Q6=弱；导航 NOW 现为占位（site.ts 注释 `独立 NOW 页待 C-04`——**本审计与既有路线图 C-04 一致，非新增方向**）。
- **Why it matters**：Return Loop 的链接需要落点；NOW 是变化通告的归档视图。
- **Recommended action**：NOW 页 = 近 30 天变化聚合：账本新条目 + 日志新条目 + 新研报/裁决，倒序时间线，每条一句话+深入链接。**边界纪律**：观察层（变化/修正/证据），不放行情报价、不做数据面板（反面边界=TradingView）。
- **Affected pages**：新页 `/now`（路由已预留：NOW 目前指向首页）。
- **Affected architecture**：纯派生视图——数据源即现有 LEDGER/JOURNAL/研报列表，不新增数据实体。
- **Expected outcome**：回访用户首屏即得变化；导航第一项从占位变实。
- **Risk**：与首页 What Changed 区重叠——处理方式：首页保持「门面」角色（5 条精选），NOW 是完整时间线。

## P1-2 · 单命题页坐标化（BUILD-4）

- **Problem**：世界模型（地图）只覆盖 8 命题中的算力相关 3–4 个，模型与命题库不同构。
- **Evidence**：01 文件 §F-A/D；04 矩阵 World Model 行=部分具备。
- **Why it matters**：地图承载不了全部命题时，命题页必须自带坐标，否则「坐标」能力只服务于 1/8 的判断。
- **Recommended action**：在单命题页增加两行纯文本坐标：「周期位置」（出清期/成长期/狂热期…，引用 Cycle 页七阶段语言）与「估值位置」（透支/合理/出清，复用地图节点的 valuation 三档）。**不做**：不扩地图节点、不加导航、不加图表。
- **Affected pages**：ThesisDetail 模板页。
- **Affected architecture**：Thesis 数据接口增加两个可选字段（或复用现有 status/probabilityNote 的展示位——实现层决策）。
- **Expected outcome**：8 命题全部具备坐标读数；地图哲学（不是名单）保持完整。
- **Risk**：坐标判断本身是判断——需要与账本同等的事实纪律（写明依据日期）。

## P1-3 · System 页「参数→配方」降险标注（REDUCE-1）

- **Problem**：仓位百分比/触发器/If-Then 的公开暴露，可能被照搬或误读为收益承诺，与免责声明存在张力。
- **Evidence**：01 文件 §F-G；03 文件 §8 TradingView（指标通胀的反面教训）。
- **Why it matters**：一次误读导致的跟单损失，对「判断档案」品牌的伤害大于参数公开的诚实收益。
- **Recommended action**：不重写内容，只加结构标注：在 System 页关键参数处加「示例参数，随账户性质而变——配方无高下，期望为正即可」的锚注（该句已在 SYSTEM_THREE 文本中，前置/复用即可），并在 If-Then 表头加「个人预案实例」字样。
- **Affected pages**：System 页。
- **Affected architecture**：无。
- **Expected outcome**：保留诚实性、消除收益承诺误读空间。
- **Risk**：过度免责会削弱「多年全职交易沉淀」的份量——标注密度需克制（只标两处）。

---

## P2-1 · 年度「判断复盘」公开页（机会三）

- **Problem**：回测/裁决数据已大量积累（19 条回测、28 项裁决书），但未面向读者公开为年度叙事。
- **Evidence**：research/ 目录 W35–W37 裁决书与回测表；Oaktree《The Best of》35 周年精选为机制样本（03 文件 §3）。
- **Why it matters**：Revision 资产的最强放大器——「我今年错在哪」是任何竞品无法复制的年度内容。
- **Recommended action**：2026 年末将既有回测表+账本导出为一页年度复盘（错/对/未决三栏，每条链回原始命题）；此后每年一次。**复用现有产物**，研究侧只需决定公开粒度。
- **Affected pages**：新页（JOURNAL 组下，或年度特辑形式）。
- **Affected architecture**：纯展示层，源数据已有。
- **Expected outcome**：年度回访理由+转发动机；时间复利的可见化。
- **Risk**：公开错误的勇气是品牌资产也是脆弱点——粒度由 HSN 本人裁决（已有「待裁决由本人裁决」的传统）。

## P2-2 · 研报/命题的概念检索（Stratechery Explore 式）

- **Problem**：归档树是静态展示，读者无法按概念（如「证伪」「估值锚」「拥挤度」）检索 6 份研报+10 篇文集。
- **Evidence**：03 文件 §1 Stratechery Concepts/Companies/Topics 三维检索。
- **Recommended action**：DEFER 到内容量更大时（当前 16 篇内容，导航可覆盖）；届时做概念索引页（纯静态标签页即可）。
- **Risk**：低优先——当前 IA 网状互链已部分承担。

---

## DEFER 清单（明确不做及触发条件）

| 项 | 触发条件 |
| --- | --- |
| 英语层 | 中文 Return Loop 跑通 ≥6 个月且有余力 |
| 音频化（研报/命题配读） | P0 全部落地后评估 |
| 商业化（任何形式） | 有真实受众后另行评审；现阶段零冲突=信任资产 |
| 地图多链扩张 | 找到不违背「地图不是名单」哲学的表达前，不做 |
| 实时数据/AI 问答 | 不做（方法论宣言冲突，非资源问题） |
| 社区/评论 | 不做（共识噪声与观察立场冲突） |

---

*本文件为 AUDIT ONLY：以上建议未实施，等待 Human Review。*
