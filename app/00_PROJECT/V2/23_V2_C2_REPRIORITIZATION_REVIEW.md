# V2-23 · C2 RE-PRIORITIZATION REVIEW — C2 重新排序评审

> **CANONICAL · V2 · C2 RE-PRIORITIZATION REVIEW · LOCKED**
> 第二轮 Prioritization Review **PASS**（2026-08-25），正式封板；裁决记录见十节。
> 本文档是 C2 的**独立重新 Prioritization Review**，不是 C1/C4 的自动续集，
> 不是 C2 Implementation，不是 C2 Authorization。
> 依据：22 号文五节「Re-open C2 Prioritization（带回评审，不自动晋升）」。
> 执行边界（全程已遵守）：**零代码、零 UI、零 Implementation、零 Commit、零 Push**。
> 方法纪律（全程已遵守）：**先 Code Audit，再排序**——不预设 C2-A/B 必须 P1，不预设 C2 必须实施。
>
> **v1.0 LOCKED ≠ C2-B Implementation Authorization。**
> 本文档锁定的只是排序结果与 Q6 治理结论；真正的下一条链路仍是：
> 23 LOCKED → C2-A Implementation Contract（24 号文）→ Contract Review → Authorization → Implementation。

---

## 一、目的与边界

17 号文第一轮裁决（七节）把 C2 留在 `P1 Candidate · Deferred`，理由是（7.4）：

> Architecture 已经成立，不代表 Data Model 现在必须实现。
> 等 C1/C4 完成后，按实际 Work / Essay / Theme 使用量重新评估。

22 号文 Closure 确认：「等 C1/C4 完成」这一前提条件已满足，C2 可以重新评估；
同时登记了 C2 的评审拆分（C2-A/B/C/D），并明确**该登记不构成排序预判**。

战略侧 Code Audit 给出的审计目标定位（本文档原样承接）：

> **Code Audit 的目标不是证明「C2 应该做」，而是确认：如果不做 C2，现有系统是否已经出现结构性缺口；
> 如果做 C2，缺口究竟发生在哪一层。**

本文档的任务：

> **在 C1/C4 已成为稳定基础设施的当下，对 C2 四个子项重新过一遍完整的五维评估，
> 输出候选排序与授权建议，交给战略侧裁决。**

本文档**不是**：C2 的设计文档、Contract、实现方案、排期计划。
本文档**是**：双层 Code Audit → 八问压测 → 五维矩阵 → 为什么现在/不现在 → 依赖与爆炸半径 → 候选排序提案 → Review Questions。

---

## 二、Code Audit（2026-08-25 · HEAD = 1180eab · workspace clean）

> 2.1～2.5 = **实施侧 repository-level audit**（全部结论可由文件路径与命令复核）；
> 2.6 = **战略侧十条 Audit Findings 的仓库级逐条复核**；2.7 = 双层合并结论。

### 2.1 数据层实体盘点（`app/src/data/`）

| 数据域 | 文件 | 规模（当前实码） | 层位 |
|---|---|---|---|
| THESES | `domains/theses.ts` | 8 个命题（active 为主，status/assumptions/invalidation 全覆盖） | Research Canonical |
| LEDGER | `domains/ledger.ts` | 3 条 Revision（最近 2026.07.05） | Research Canonical（Proof 基础设施） |
| OBSERVATIONS | `domains/now.ts` | 5 条（带 thesisId / mapNodeId 结构化关联） | Research Canonical |
| INDUSTRY_MAP | `domains/map.ts` | 15 节点 + MAP_EDGES + MAP_ERA + MAP_ESSAY | Research Canonical（Context） |
| JOURNAL | `domains/journal.ts` | 7 日期组（conviction 字段已迁出，仅叙事） | Research Canonical（叙事记录） |
| ESSAYS | `domains/essays.ts` | 6 篇（body = 结构节点数组） | **Current Canonical Work Source** |
| CONTEXT_HISTORY | `domains/context-history.ts` | **1 条（仅 initial snapshot，2026.08.25 迁移登记）** | Research Memory（C1） |
| ESSAY_VERSIONS | `domains/essay-versions.ts` | **6 条（每篇仅 v1，2026.08.25 迁移登记）** | Historical Work Memory（C4） |
| 派生层 | `context.ts` / `essay.ts` / `ledger.ts` / `polarity.ts` | 纯函数，零独立状态 | Read / Derivation Boundary |
| 静态 Method 内容 | `system/framework/wuwei/dimensions/manifesto/cycle` 等 | 成文方法、坐标系、宣言 | Method / Presentation |
| **WORKS** | — | **不存在** | — |
| **THEMES** | — | **不存在** | — |

### 2.2 C1/C4 基础设施的真实运行状态

- 验证护栏：**`npm run check` = 32 组 / 222 项断言，当前全部通过**（2026-08-25 复跑实证）。
- UI 消费方：**零**。`currentContext / foldContext / essayHistory / versionsOf` 在 `src/pages`、`src/components`
  中无任何引用；check [32] 以断言形式锁定「ESSAY_VERSIONS 未改变任何 consumer 的数据来源」。
- 增量记录：**零**。CONTEXT_HISTORY 自迁移登记后无新 Revision；ESSAY_VERSIONS 自迁移登记后无新 Version；
  LEDGER 最近一条停留在 2026.07.05。即：**两套历史基础设施已就绪，但尚未承接过任何一次真实演化事件。**

**审计含义（登记，不做结论）**：C1/C4 证明了「纯数据层 + 断言护栏 + 零 UI」模式可控（22 号文已确认），
但「按实际使用量重新评估 C2」中的**使用量证据目前为零**——这不是否定 C2，而是排序时必须诚实登记的事实。

### 2.3 已存在的引用图（Research System 内部）

以下引用关系**已经以实码存在**，无需 Work/Theme 实体即可工作：

| 既有引用 | 形态 | 方向 |
|---|---|---|
| Observation → Thesis / MapNode | `thesisId` / `mapNodeId` | 观察挂命题/节点 |
| Thesis → MapNode | `nodes[]` | 命题挂产业地图 |
| MapNode → Essay / Thesis | `essays[]` / `theses[]` | 节点反向挂作品/命题 |
| Map → Essay | `MAP_ESSAY`（单值） | 地图挂方法定义文 |
| Essay → 栏目页 | `related[]`（页面级 path，非命题级） | 栏目级导航（G-05 挂起） |
| Journal → Thesis | `thesisId`（叙事关联，不载事实） | 日志挂命题 |

**审计含义**：Research System 的引用图已具雏形但**方向不统一、粒度不统一**（有双向、有单向、有页面级）。
14 号文设定的 Work 引用层本质是给这张图加一个**统一的归属与索引视图**——它索引的对象已经存在；
反过来说，**Work 实体若以嵌套聚合形态落地，复制的就是这张图**（对应战略侧 Finding #3，见 2.6）。

### 2.4 命名空间冲突扫描（为 C2-A 契约登记的事实）

| 标识符 | 位置 | 与 Canonical Theme 的关系 |
|---|---|---|
| `theme: string`（展示字段） | `domains/system.ts`（SYSTEM_EVOLUTION 条目） | **无关**，交易系统演化条目的小标题 |
| `THEME_LIFECYCLE` / `THEME_LEVELS` | `domains/cycle.ts` | **无关**，「题材」生命周期（交易侧术语，taxonomy 性质） |
| `essayId // Work Identity` 注释 | `domains/essay-versions.ts:25` | **潜在术语碰撞**：C4 把 essayId 注释为 Work Identity；若未来 Work 成为实体，「Work Identity」一词需重新划界（Work.id ≠ Essay.id，Work.refId → Essay.id） |
| `Theme`（实体名） | 不存在 | 可被占用，但须防与上述两处展示层术语混读 |

### 2.5 与 14 号文 Canonical 定义的对账

| 14 号文设定 | 代码现状 |
|---|---|
| Work `{ id, type, refId, themeIds[], span, status }`，纯引用层 | 未实现；无对应文件 |
| Theme `{ id, title, question, workIds[] }`，≤6，Canonical Themes v1.0 = 4 个（九节 LOCKED） | 未实现；4 个 Theme 仅存于文档 |
| Proof = 派生关系，不建实体 | 现状合规（Ledger 派生层在位：`deltaOf / directionOf / deriveCurrentBelief`） |
| OD-5 顺序：Architecture → **Data Contract** → Implementation Task → Implementation → Validation | Architecture 已 LOCKED；**Data Contract 尚未存在——这正是 C2-A 的位置** |

### 2.6 战略侧十条 Audit Findings 的仓库级复核

> 战略侧审计基于架构材料（无 repo 快照）；本节用实码逐条复核。
> 结论分三档：**确认**（仓库证据支持）/ **确认 + 补充**（支持且有新增实码事实）/ **修正**（仓库证据要求调整措辞）。

| # | 战略侧 Finding | 仓库级证据 | 复核结论 |
|---|---|---|---|
| AF-1 | Work 目前更像「概念」而非系统事实源；真正问题是「Work 是否已到必须拥有独立数据身份的程度」 | 全仓无任何 `Work` 标识符；「Work」仅以语义注释出现在 `essay-versions.ts:25`（Work Identity）与 C4 契约文本中；2.1 盘点表 WORKS 行 = 不存在 | **确认**。且仓库证据把问题进一步收紧：Work 的「独立数据身份」当前连一个 id 占位都没有，其必要性论证必须全部来自 14 号文的架构推演，而非代码债 |
| AF-2 | Theme 比 Work 更接近 Canonical Entity（四问长期容器已成文，压缩至 4 个） | 4 个 Canonical Theme 已 LOCKED 于 14 号文九节（含 Admission Test + 增一退一纪律）；但代码中 `theme`（system.ts）与 `THEME_LIFECYCLE/THEME_LEVELS`（cycle.ts）是**展示层题材语义**，与 Canonical Theme 无关 | **确认 + 补充**。成熟度判断成立；同时命名碰撞（2.4）是 Theme 实体化的真实术语成本，契约必须处理 |
| AF-3 | 当前最大重复风险 = Work 吞并 Research Objects → Universal Content Relationship Layer | 2.3 节：Research 引用图已存在且方向/粒度不统一；若 Work 以嵌套聚合（thesisIds/essayIds/journalIds/mapIds…）落地，即为该图的第二份拷贝 | **确认 + 补充**。该风险可用 check-data 断言锁死（禁多类型 id 数组字段），C4 的「禁挂 thesisId/themeId」注释纪律（essay-versions.ts:14）已是先例 |
| AF-4 | Work 不应成为新的 Canonical Content Source（Research Object = canonical research truth；Work = canonical authorship organization） | AI-08 已锁同原则；C4 已实施同纪律（ESSAY_VERSIONS 复制的是 Essay 自身内容快照，而非他实体内容；且禁挂任何关联 id） | **确认**。「引用而不拥有」在 C4 已有可执行先例，C2-A 可直接引用该纪律模板 |
| AF-5 | Theme 不能退化成第二套 Taxonomy（行业/标签/板块） | `cycle.ts` 的 `THEME_LIFECYCLE`（题材生命周期）恰好就是 taxonomy 性质的既有结构——退化路径在代码里有现成模板 | **确认 + 补充**。风险比战略侧估计更具体：退化不必新造，误读既有「题材」语义即可发生；命名空间划界因此从「建议」升级为「契约必答」 |
| AF-6 | C1/C4 不应成为 C2 的实现模板（禁 WorkHistory / ThemeVersion / fold） | C1 = `sparse → fold`（State Reconstruction），C4 = `whole-work snapshot → latest`（Content Versioning），两套机制实码异构、零共享（check [32] 机制泄漏扫描锁定）；C2 = Longitudinal Organization，**无历史语义** | **确认 + 补充**。可反向复用 check [32] 的扫描模式：在 C2-B（若实施）的断言组中加入「Work/Theme 层不得出现 fold/sparse/snapshot/version 机制标识符」 |
| AF-7 | C2-A 价值明显高于 C2-C/C2-D（资格判断，非排序） | 与五节矩阵独立评估结果一致 | **确认**。双层审计在此收敛 |
| AF-8 | C2-B 的真正价值 = 稳定身份（Work identity / Theme identity / stable references），不是「做一个 Work 表」 | 既有 id 纪律已有稳定先例：Thesis/Essay 用 slug、Ledger 用 `rev-<thesisId>-<yyyymmdd>`、C1 用 `ctx-<yyyymmdd>[-N]`；Work/Theme identity 设计有同构纪律可仿 | **确认 + 补充**。身份纪律的先例密度高，C2-B 若实施，identity 方案几乎无自由发挥空间（好事） |
| AF-9 | Proof 不应成为 C2 的第三套实体 | 14 号文已锁（Proof = Ledger + 引用派生）；`data/ledger.ts` 派生层（deltaOf/directionOf/deriveCurrentBelief）实证派生模式在位；check [14]–[18] 锁定派生正确性 | **确认**。Proof 实体化在现有护栏下甚至会触发既有断言失败，防线已在 |
| AF-10 | 当前没有证据证明需要 C2-C（长期索引能力 ≠ UI） | 2.2 节实证：C1/C4 基础设施零 UI 消费，页面全部由 Research Canonical 直接驱动；22 号文对 G-BoW 的措辞修正（数据缺口闭合 ≠ 展示能力授权）已登记同原则 | **确认**。「数据有了 → 顺势做 UI」在当前代码结构中没有自然通道（barrel 消费模式要求显式接线），UI 只能是独立授权的产物 |

### 2.7 双层合并 Audit 结论（仅登记）

1. **战略侧声明的证据缺口已闭合**：其审计基于架构材料，本节 2.1～2.5 提供逐文件仓库级证据；
   十条 Findings 复核结果 = 5 条确认 + 5 条确认并补充 + 0 条修正。双层审计无冲突。
2. C2 的两个实体在代码中**完全不存在**；不存在「先补代码再补契约」的既成事实，契约先行（C2-A）的物理通道是干净的。
3. C2 若做错，其主要爆炸半径是**语义性的**（Semantic Blast Radius，见七节），不是工程性的——
   这解释了为什么契约（C2-A）在逻辑上必须先于数据层（C2-B）。
4. C1/C4 基础设施已就绪但**零增量、零 UI 消费**——「使用量」证据尚未产生，排序时不得假装它存在。
5. **Work 与 Theme 的成熟度不对称**（AF-1 / AF-2）：Theme 的长期问题定义已在 14 号文九节 LOCKED，
   更接近 Canonical Entity；Work 的独立数据身份必要性更弱。该不对称性必须在五维矩阵与排序提案中显式体现，
   不得用「C2 整体」的均分掩盖。

---

## 三、评审对象确认（22 号文拆分，原样承接）

| 子项 | 内容 | 性质 | 战略侧 Audit Verdict |
|---|---|---|---|
| **C2-A** | Work / Theme canonical data contract（契约文档，零代码） | 文档任务 | PASS — Candidate Eligible（≠ P1，≠ Authorization） |
| **C2-B** | Work / Theme runtime data layer（纯引用层数据实现，零 UI） | 数据层任务 | CONDITIONAL PASS — Candidate Eligible（前提：A 成立；A 不成立则 B 不应实施） |
| **C2-C** | Work / Theme UI exposure | 继续 Deferred（本轮仍评一次，不默认豁免） | DEFER |
| **C2-D** | Work / Theme management / editing capability | 继续 Deferred（同上） | DEFER |

22 号文初步判断与战略侧 Verdicts 均**仅作登记**；本节之后一切结论以本文档矩阵为准。

---

## 四、八问架构压测（Work/Theme 是否真需成为 Canonical Entity）

> 逐问回答，答案分「Work」「Theme」两侧（AF-1/AF-2 不对称性的直接落实），
> 证据取自二节双层 Audit 与 14 号文 LOCKED 文本。

| # | 问题 | Work 侧 | Theme 侧 |
|---|---|---|---|
| 1 | 是否产生**独立认知价值**？ | **边际**。Work 不生产新认知，它登记归属；独立价值 = 「这个东西为什么属于 Body of Work」的**准入判断本身**（3-Year Test 的执行位）。其「独立数据身份」的必要性目前只有架构推演支持，无代码债/使用量证据（AF-1） | **有，且已成文**。四个 Theme 的长期问题定义已 LOCKED（14 号文九节），认知价值独立于任何单个 Thesis；但这份价值**已在文档层成立**，实体化不是其前提 |
| 2 | 是否服务 Body of Work 的**长期索引**？ | **是，且是唯一候选载体**。2030 Reader Test 要求「按问题组织，不按日期」，没有 Work/Theme 索引层则该场景无解 | 同左；且 Theme 是索引的天然轴心 |
| 3 | 是否连接多个 Research Objects **而不复制 Canonical Content**？ | 设计上可强制（AI-08 + 纯引用 + 断言）；2.3 节证明被引用对象全部已存在；AF-3 的嵌套聚合形态必须明令禁止 | 同左；`workIds[]` 与 `Work.themeIds[]` 的**双向持有 = 双源隐患**，契约必须裁掉一侧 |
| 4 | 是否**不依赖 UI 也成立**？ | **是**。14 号文六节已压测：Body of Work 首先是资产结构；2.2 节实证零 UI 数据层的存在方式 | 同左 |
| 5 | 是否不会演化成 **Publication Archive**？ | 风险真实但已被 AI-07 + 3-Year Test 准入拦截；最大实操风险是「为了让表不空而塞内容」——准入判断必须挂在契约里，不靠自觉 | 同左 |
| 6 | 是否不会成为 **CMS**？ | 防线 = C2-D 继续 Deferred + append 纪律；数据层本身无编辑面 | 同左 |
| 7 | 是否不会引入新的 **Universal Entity / Relationship System**？ | **最大风险位**（AF-3）。契约必须封死：`type` 枚举封闭、禁多类型 id 数组、禁挂 Distribution 字段、禁 generic metadata bag、禁任意实体互挂 | 风险次位（AF-5）：防退化成 Taxonomy，靠 Admission Test + 增一退一（已在 14 号文）+ 命名划界（2.4） |
| 8 | 是否与 C1/C4 **语义分离**？ | **正交**：C1 = Context 演化史（State Reconstruction）；C4 = Work 内容版本史（Content Versioning）；C2 = 归属/索引（Longitudinal Organization）。三者回答三个不同问题，**禁止复制 history/version machinery**（AF-6）。需处理 `Work Identity` 注释碰撞（2.4） | 同左；Theme 清单属 Slowly Evolving 档，其变更走 versioned amendment（文档层），不进 CONTEXT_HISTORY / ESSAY_VERSIONS 任一机制 |

**压测结论（登记）**：八问没有否决 Work/Theme 的 Canonical Entity 资格；但确认了三件事——

1. 价值重心在**准入判断与索引**而非认知生产（第 1 问）；
2. 主要风险是**双源、泛化与 taxonomy 退化**（第 3/7 问），全部是契约问题——契约必须先于数据层；
3. **Theme 的实体化资格强于 Work**（AF-2 不对称性成立），这为「Theme 先行、Work 缓行」的
   分裂式 Contract 结论预留了合法通道（是否启用由战略侧裁决，见九节 Q6）。

---

## 五、五维评估矩阵

```text
Cognitive Value      认知收益：是否提升研究/思考质量本身
Research Integrity   研究完整性：是否保护 Ledger/Revision 证据链的诚实性
Author IP Value      IP 价值：是否构成 Body of Work 的长期证据
Engineering Cost     工程成本：实现 + 验证 + 维护的综合成本
Architecture Risk    架构风险：做错时违反 AI-01～12 的可能性
```

### 5.1 主矩阵（按 22 号文拆分的四个子项）

| 候选 | Cognitive Value | Research Integrity | Author IP Value | Engineering Cost | Architecture Risk |
|---|---|---|---|---|---|
| **C2-A** Contract（契约文档） | **H**（八问压测 + 准入判断成文 = 认知工作本体） | **H**（把 AI-07/08 落成可执行断言定义，防未来双源） | M（契约非资产，但定义资产边界） | **L**（单文档，零代码） | **L**（文档不产生实体，风险锁在 Contract Review 内） |
| **C2-B** Data Layer（数据层） | M（索引层认知增量边际；真实收益要等消费场景） | M（不直接护证据链；防 UI 层捏合数据是间接收益） | **H**（Body of Work 地基，14 号文四节 LOCKED 模型） | **L–M**（与 C1/C4 同构：2～3 新文件 + 断言组，模式已验证） | **M–H**（实体化即开启 Semantic Blast Radius：双源/泛化/taxonomy 退化；风险可压至 M 的前提是 C2-A 先锁定全部边界） |
| **C2-C** UI exposure | M（2030 Reader 场景的呈现层收益真实存在） | L | M | **H**（页面/交互/路由/验证全套） | **H**（16 号文明示风险：Architecture Asset 过早变 Product Feature；且当前无 Work/Theme 数据可展示，做了必返工） |
| **C2-D** Management capability | L（当前内容规模 6 Essay / 8 Thesis，手工维护成本极低） | L（管理能力反而制造绕过 append-only 的入口风险） | L | **H** | **H**（编辑面 = CMS 化的第一步，直接撞八问压测第 6 条） |

### 5.2 辅助矩阵：Work / Theme 实体化资格的不对称评估（AF-1/AF-2 落实）

> 仅供 C2-A 契约起草与战略侧裁决参考；不改变 5.1 的子项排序。

| 维度 | Work 实体化 | Theme 实体化 |
|---|---|---|
| 定义成熟度 | 14 号文四节最小模型（候选形态） | 14 号文九节 v1.0 LOCKED（4 个，含 Admission Test） |
| 独立认知价值 | 边际（准入判断执行位） | 已成文（长期问题容器） |
| 独立数据身份必要性证据 | **无**（无代码债、无使用量） | 弱（索引轴心价值真实，但文档层已承载） |
| 主要退化方向 | Universal Content Relationship Layer（AF-3） | 第二套 Taxonomy（AF-5） |
| 结论 | 契约必须回答「是否现在需要独立身份」——允许得出**缓行**结论 | 契约必须回答「引用维度还是实体」——允许得出**先行**结论 |

---

## 六、Why Now / Why Not Now

> 每一项 Deferred / 降级都必须写明不做的理由，而不是「以后再说」。

| 候选 | 处置提案 | Why Now | Why Not Now |
|---|---|---|---|
| **C2-A** | **P1 候选，建议本轮授权** | ① 17 号文暂缓理由之三（「等 C1/C4 完成」）已满足；② OD-5 锁定的顺序 Architecture → Data Contract → Implementation 中，Data Contract 是唯一的空缺位，且是 C2-B 的前置闸门；③ 契约是纯文档，零代码零风险，恰好符合「第一轮最多授权 1～2 个」的保守纪律；④ 2.4 节的命名/术语碰撞与 AF-3/AF-5/AF-6 的禁令只有契约阶段能干净处理；⑤ 战略侧 Audit Verdict：PASS — Candidate Eligible | 无实质性反对理由。唯一成本是文档工时。注意：Candidate Eligible ≠ P1 ≠ Authorization，本提案的「建议授权」最终由战略侧裁决 |
| **C2-B** | **P1 Candidate，建议本轮不授权** | 契约通过后实现路径已标准化（C1/C4 模式 + AF-8 身份纪律先例） | ① **使用量证据为零**（2.2）：C1/C4 上线至今零增量事件，Work/Theme 索引层的真实消费场景尚无实据——这正是 17 号文 7.4 的核心顾虑，它并未因 C1/C4 完成而消失；② 硬依赖 C2-A（战略侧 Verdict：A 不成立则 B 不应实施），契约未 Review 前授权实现 = 跳过 Gate；③ AF-1：Work 独立数据身份的必要性证据不足，数据层若在契约前落地将固化错误语义 |
| **C2-C** | **继续 Deferred（P2）** | —— | 16 号文明示的过早产品化风险位；AF-10：无 UI 需求证据，「数据有了 → 顺势做 UI」在当前 barrel 消费模式下没有自然通道；C2-B 未落地，无数据可展示 |
| **C2-D** | **继续 Deferred（不建议设优先级）** | —— | 内容规模（6 Essay / 8 Thesis / 15 节点）下手工维护成本趋近于零，管理能力是纯负资产：制造绕过 append-only 纪律的编辑入口，是 CMS 化的第一步。除非内容规模越过手工维护阈值（建议以「单域 > 30 条目且月增 > 2」为再评估触发线），否则不进入任何排序 |

---

## 七、Dependency / Blast Radius

### 7.1 依赖方向（合并战略侧 Dependency Graph）

```text
             V2-07 Body of Work Architecture（14 号文 · LOCKED）
                         │
                         ↓
                  C2-A Contract ←—— 本轮提案的唯一授权对象
                         │
                ┌────────┴────────┐
                ↓                 ↓
           Work Semantics    Theme Semantics
           （允许缓行结论）   （允许先行结论）
                └────────┬────────┘
                         ↓
                  C2-B Data Layer（下一轮 Prioritization 重新评估）
                         │
                         ↓
                 Stable References
                         │
              ┌──────────┴──────────┐
              ↓                     ↓
        Research Objects       Existing Ledger
              └──────────┬──────────┘
                         ↓
                    Derived Proof（派生，永不实体化）

┌─ Deferred Zone ─────────────────────┐
│  C2-C UI          C2-D Management   │
└─────────────────────────────────────┘
```

- C2-A 无代码依赖，可随时开始。
- C2-B **硬依赖** C2-A（断言定义、命名划界、双向引用裁决、AF-3/5/6 禁令都在契约里）。
- C2-C 硬依赖 C2-B；C2-D 无正当依赖链（当前不建议建立）。
- Proof 不在依赖链上——它已由 Ledger + 引用派生（AF-9），C2 任何子项都不得触碰。

### 7.2 爆炸半径：Semantic Blast Radius 优先于 Engineering Blast Radius

工程半径（实码推定，非承诺）：

| 子项 | 新建 | 修改 | 触碰 Research Canonical | UI |
|---|---|---|---|---|
| C2-A | 1 个契约文档（00_PROJECT/V2/24 号位） | 无 | 否 | 否 |
| C2-B（若未来授权） | `domains/works.ts` + `domains/themes.ts` + 派生层（疑似 `data/work.ts`）+ check-data 断言组 | barrel（content.ts）一行 | **否**（纯引用，THESES/ESSAYS/MAP/NOW/LEDGER/JOURNAL 零改写） | 否 |

按 C1/C4 实证模式（两次 commit 均 5 files / 纯增量 / 0 deletions），C2-B 的预期工程半径同级、可控。

**但真正需要控制的是语义半径**（战略侧 Finding，本文档确认）——C2 做错影响的不是一个页面：

| 受影响层 | 失败形态 | 对应防线 |
|---|---|---|
| Architecture | Work/Theme 错误定义成为后续系统基础，迁移成本高 | C2-A 契约先行 + Review |
| Data Model | Entity Identity 建错，后续迁移成本高 | AF-8 身份纪律先例（slug / rev- / ctx-） |
| Research | 污染 Thesis / Journal / Essay 的 ownership | AI-08 + 禁嵌套聚合断言（AF-3） |
| Ledger | 产生第二套 Proof / Revision 关系 | AF-9 + 既有 check [14]–[18] |
| Distribution | Work 被当成 Publication Archive | AI-07 + 准入判断成文 |
| CMS | Work Manager / Theme Manager | C2-D 继续 Deferred |

语义半径不可由工程半径的小而推导出安全——**这是 C2-B 即使成本 L–M 也不能在契约前授权的根本原因**。

---

## 八、Priority Matrix 与候选排序提案

```text
                         高认知收益
                             ↑
                             │
                C2-A Contract│
              （本轮提案 P1） │
                             │
 ────────────────────────────┼────────────────────→
                             │         Engineering Cost / Semantic Risk
                C2-B Data    │        C2-C UI
                （P1 Candidate│       C2-D Management
                 暂缓授权）    │       （Deferred Zone）
                             ↓
                         低认知收益
```

### 候选排序提案（最终由战略侧裁决）

| 档 | 候选 | 一句话理由 |
|---|---|---|
| **P1（建议本轮授权 1 个）** | **C2-A Work/Theme Contract** | 唯一同时命中 Cognitive Value + Research Integrity 双高、成本与风险双低的项；补上 OD-5 顺序中唯一的空缺位；为 C2-B 建立闸门而不是跳过闸门；双层审计在此收敛 |
| **P1 Candidate · 暂缓授权** | C2-B Data Layer | 价值真实（Author IP = H），但使用量证据为零 + 硬依赖未通过的契约 + Work 独立身份必要性未证；下一轮 Prioritization 的第一顺位候选 |
| **P2 / Deferred** | C2-C UI | 无数据可展示 + 无 UI 需求证据（AF-10）+ 过早产品化风险，维持 17 号文原判 |
| **Deferred（不设优先级）** | C2-D Management | 当前规模下的纯负资产；设再评估触发线（六节） |

**提案纪律声明**：

1. 本轮**最多授权 1 个 Task（C2-A）**，不授权 C2-B——宁可少授权，不制造并发架构风险（17 号文五节纪律沿用）。
2. 本提案**不假设 C2 最终必须实施**：Code Audit 证明的是「如果继续建设 Body of Work，C2-A 是值得认真评估的架构候选」，
   而不是「C2 必须做」；若 C2-A 契约起草过程中八问压测的任何一问翻转为否定，
   正确动作是把 C2 整体退回 Architecture Review，而不是勉强推进。
3. C2-A 契约允许得出**分裂结论**（Theme 先行 / Work 缓行，或双双缓行）——
   契约的使命是回答真问题，不是为 C2-B 开路（AF-1/AF-2 不对称性，5.2 节）。
4. C5 / C6 / C9 / C10 / C11 状态**不变**，不在本轮评审对象内（22 号文只重新打开了 C2）。

---

## 九、Review Questions（交战略侧裁决）

1. **C2-A 是否确认为本轮唯一授权 Task？**（若否，本轮是否授权任何 Task？）
2. **C2-B 维持「P1 Candidate · 暂缓」是否成立？** 若战略侧认为「使用量证据为零」不构成继续暂缓的理由，请明确替代判据。
3. **C2-D 的再评估触发线**（单域 > 30 条目且月增 > 2）是否接受？还是直接降级为 No-Go？
4. **C2-A 契约起草的八个必答问题**（建议清单，见下）是否有增删：
   - Work 的 identity 是什么（与 Essay/Thesis slug 的关系，含 `Work Identity` 注释划界）？
   - `themeIds[]`（Work 侧）与 `workIds[]`（Theme 侧）只保留哪一侧？（双向 = 双源）
   - `type` 封闭枚举的最终清单（thesis / essay / map / method-note 是否增删）？是否明令禁止多类型 id 数组（AF-3）？
   - `span` / `status` 的语义与合法取值？
   - 准入判断（3-Year Test 执行位）落在数据、断言还是文档？
   - 展示层 `theme` / `THEME_*` 术语的命名空间划界（AF-5）？
   - 断言护栏清单（比照 C1 [21]–[26] / C4 [27]–[32] 粒度；含 AF-6 的 machinery 泄漏反向扫描）？
   - 什么情况下本契约判定 C2-B 不应实施（退出条件）？
5. 六节 Why Not Now 栏是否有任何一项裁决不成立？
6. **（v0.95 新增，源自 AF-1/AF-2 不对称性）** C2-A 契约是否被允许得出「Theme 先行、Work 缓行」的分裂结论？
   若允许，C2-B 的下一轮回评估是否也应按 Work / Theme 分别进行？

---

## 十、第二轮战略裁决记录（2026-08-25）

> **Re-Prioritization Review ACCEPTED。**
> 战略侧复核结论：v0.95-candidate 结构已成熟——双层 Audit 闭合，十条战略 Findings 全部得到仓库级支持，
> 最终提案收敛为「本轮最多授权 1 个 Task，即 C2-A；C2-B 暂缓；C2-C/D Deferred」。
> **23 号文已完成「分析」，现在只差战略裁决，不应再继续扩展 Audit。**
> **裁决纪律：不因 Q6 裁决修改第五节排序——当前排序保持不变。**

### 10.1 裁决总表

| # | 问题 | 裁决 |
|---|---|---|
| Q1 | C2-A 是否确认为本轮唯一授权 Task？ | **YES。** 本轮授权 1 个 Task = **C2-A（Work / Theme Canonical Data Contract 起草，24 号文）**；授权范围仅限契约文档，零代码 |
| Q2 | C2-B 维持「P1 Candidate · 暂缓」是否成立？ | **YES，成立。** C2-B 暂缓；为下一轮 Prioritization 第一顺位候选；本轮不授权 |
| Q3 | C2-D 再评估触发线（单域 > 30 条目且月增 > 2）是否接受？ | **未单独裁决触发线数值。** 战略侧确认 C2-C / C2-D 维持 Deferred 不变；触发线数值保留为提案建议，留待未来评审 |
| Q4 | C2-A 契约起草的八个必答问题是否有增删？ | **未提出增删。** 九节八问清单原样转入 C2-A 契约起草输入 |
| Q5 | 六节 Why Not Now 栏是否有裁决不成立？ | **无修正，全部维持原判** |
| Q6 | C2-A 契约是否被允许得出「Theme 先行、Work 缓行」的分裂结论？ | **YES。允许。**（10.2 节） |

### 10.2 Q6 裁决（YES）—— 治理结论，正式入档

> **Strategic Decision：Q6 = YES。**
>
> C2-A Contract is authorized to produce asymmetric conclusions:
>
> **Theme**：Canonical Entity qualification = sufficient for contract definition.
>
> **Work**：Canonical Entity qualification = not yet sufficient for implementation;
> independent identity remains subject to further evidence.
>
> Therefore：
>
> **Theme-first ≠ Work-first**
> **C2-A ≠ automatic C2-B authorization**

**裁决理由（战略侧原文入档）：**

1. **Theme 已经有独立的 Canonical 认知定义**，四个 Theme 已在 14 号文 LOCKED。
2. **Work 的独立身份必要性目前没有代码债，也没有真实使用量证据**；仓库审计确认全仓不存在 `Work` 实体。
3. 如果为了「结构对称」强行让 Work 与 Theme 一起实体化，实际上是在**用架构美观掩盖证据不足**。
4. C2-A 的使命是回答真实的 Canonical Entity 问题，而不是给 C2-B 铺路。
5. 分裂结论反而更符合第一性原理：

```text
Theme
→ 已经证明「为什么存在」

Work
→ 尚未证明「为什么必须有独立身份」
```

### 10.3 关键区分：两道 Gate，不得合并

```text
Q6 Strategic Decision
        ↓
允许 Contract 得出非对称结论
        ↓
C2-A（分别定义 Theme / Work Contract）
        ↓
新的 Evidence / Review
        ↓
C2-B 是否授权？（下一轮 Prioritization）
```

> **允许 Theme 先行，是允许契约不对称；不是提前授权 Theme Data Layer。**
> 本区分防止 23 号文自身绕过 Authorization Gate。

### 10.4 裁决边界声明

- **23 号文 v1.0 LOCKED ≠ C2-B Implementation Authorization**，也不等于任何代码/UI 授权。
- 本轮唯一授权 = C2-A 契约起草（24 号文）。C2-A 自身仍须走完整 Gate：

```text
23 Re-Prioritization Review（本文档 · LOCKED）
        ↓
C2-A Implementation Contract（24 号文起草）
        ↓
Contract Review
        ↓
Authorization
        ↓
Implementation
```

  与 14 号文 OD-5 Gate 完全一致；Data Contract 尚不存在，这正是 C2-A 的位置。
- C5 / C6 / C9 / C10 / C11 状态不变，不在本轮评审对象内。
- Commit / Push 仍由用户手动控制；本文档封板后**不自动 Commit**。

---

**修订记录**

| 版本 | 日期 | 内容 |
|---|---|---|
| v0.9-candidate | 2026.08.25 | C2 Re-Prioritization Review 候选稿：实施侧 repository-level Code Audit（实体盘点 / C1C4 运行状态 / 既有引用图 / 命名碰撞扫描）→ 八问压测 → 五维矩阵 → Why Now/Not Now → Dependency / Blast Radius → 候选排序提案（建议仅授权 C2-A）→ Review Questions；待战略侧裁决，零代码 / 零 Commit / 零 Push |
| v0.95-candidate | 2026.08.25 | 合并战略侧 Architecture-Level Code Audit（AF-1～AF-10 + 四项 Verdicts）：新增 2.6 逐条仓库级复核（5 确认 + 5 确认补充 + 0 修正，战略侧证据缺口闭合）；八问压测落实 Work/Theme 不对称性；五维矩阵新增 5.2 实体化资格辅助矩阵（C2-B 架构风险 M → M–H，标注契约前置可压缩）；七节升级为 Semantic Blast Radius 框架（六层影响面 + 防线表）；八节提案纪律新增「允许分裂结论」；九节新增 Q6；仍未 LOCKED，零代码 / 零 Commit / 零 Push |
| **v1.0 · LOCKED** | **2026.08.25** | **第二轮 Review PASS：追加十节战略裁决记录——Q1 YES（C2-A 本轮唯一授权，范围限契约文档）、Q2 YES（C2-B 暂缓成立）、Q3/Q4/Q5 未单独裁决维持提案原文、Q6 YES（允许 Theme 先行 / Work 缓行的分裂结论，治理文本入档）；10.3 两道 Gate 区分（允许契约不对称 ≠ 提前授权 Theme Data Layer）；10.4 裁决边界（v1.0 LOCKED ≠ C2-B Authorization；C2-A 仍须走完整 Gate）；第五节排序未因 Q6 改动；头部标记 CANONICAL · LOCKED；零代码 / 零 Commit / 零 Push，Commit 由用户手动控制** |
