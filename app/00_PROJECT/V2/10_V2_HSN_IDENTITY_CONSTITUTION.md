# V2-10 · HSN IDENTITY CONSTITUTION — 身份宪章

> **V2-07-01 产出（2026-08-24）。** Canonical Architecture Document，不写代码。
> **状态：CANONICAL · V2-07-01 · LOCKED**（PASS WITH LOCKS 裁决，2026-08-24；变更只走 versioned amendment，禁止 silent overwrite）。
> 上游契约：09 号文件（V2-07-00，已封板）十三/十四节；02 号文件 §3（HSN Role 冻结裁决）。
> 本文件回答一个问题：**Who is HSN?**
> 生效纪律：与 V2 已冻结文档冲突时以冻结文档为准并记入 06 日志；本文档自身变更需任务单授权。

---

## 一、Canonical Definition（唯一正式定义）

> **HSN = Founder · Observer · Researcher, since 1998.**

这是 HSN Identity 的唯一事实源定义。全站任何位置（页脚落款、Header lockup、
未来 Identity 呈现、站外分发署名）需要描述「HSN 是谁」时，必须回溯到本文件，
不得各自书写版本。

```text
Author
├── Founder      TradingLabb 的建造者——这个系统是我建的
├── Observer     变化的观察者——我持续记录现实如何变化
└── Researcher   认知的研究者——我把观察变成可检验的命题与修正
```

**since = 1998**（OD-B 终裁）：**Identity metadata 时间锚点**。
意义不在资历展示，而在**时间跨度声明**——Personal IP 公式（Identity × Method ×
Evidence × Time）中的 Time 因子由此起算。呈现纪律：只用「since 1998」形式，
禁止换算成「XX 年经验」的资历修辞（那会滑向 Biography，见三节）。
**语义锁（V2-07-01 Review）：`since` 是身份元数据，不是 `investment_start_year`——
任何 UI / 文案不得把它解释成「1998 年开始投资」或「1998 年开始研究市场」，
除非未来有明确证据支持并经任务单授权。**

---

## 二、Identity 四层结构

Identity 不是一句话标签，是四层结构（09 号文件 13.3 采纳）：

| 层 | 回答 | HSN 的内容 | 数据落点（未来） |
|---|---|---|---|
| **Role** | 我在系统里是什么角色 | Founder · Observer · Researcher | `Author.roles` |
| **Lens** | 我从什么角度看世界 | 公司背后的结构、变量、周期与变化——不盯公司本体，盯变化的条件 | 11 号文件（POV Constitution） |
| **Obsession** | 我持续在研究什么 | 现实如何变化，以及人应该如何在现实变化中更新认知 | `Author.oneLiner`（由 11 号文件 POV 陈述派生，不另写） |
| **Method** | 我用什么方法形成判断 | Observation → Thesis → Evidence → Revision（V2 已建成） | System / Framework / Thesis / Ledger 既有实体 |

四层中 Role 与 Obsession 由本文件锁定；Lens 由 11 号文件锁定；
Method 不由本文件定义——它已经有自己的产品实体，本文件只**引用**（防双源）。

---

## 三、Identity ≠ Biography（身份边界）

**Biography 回答「你做过什么」；Identity 回答「你持续在研究什么，以及你为什么会这样看世界」。**

| 属于 Biography（禁止进入产品） | 属于 Identity（本文件管辖） |
|---|---|
| 职业履历、任职经历、教育背景 | Role / Lens / Obsession / Method |
| 「XX 年经验」「前 XX 公司」式资历修辞 | since 1998（纯时间锚点） |
| 头衔与证书 | 可验证的研究行为记录（Ledger） |
| 联系方式、社交链接墙 | 分发署名（Distribution 层事务，不进核心数据） |

**为什么**：履历是静态自我声明，任何人都能写；Identity 是动态行为模式，
必须由 Body of Work 反向证明。一个读者应该能从 Ledger 与 Thesis 注册表**推导出**
HSN 的 Identity，而不是从一段自我介绍里读到它。

---

## 四、三组身份边界（Identity Boundary）

### 4.1 Author vs Investor

- HSN 不是 Investor / Trader / Analyst / Expert（02 号文件 §3 冻结裁决，不变）。
- 投资只是观察最终产生的一种**决策场景**，不是身份本身。
- 操作纪律：**判断公开，操作不公开**（09 号文件 6.1）。实盘持仓、资金曲线、
  交易截图永不进入产品——公开持仓会把 Observer 拖向 Stock Picker，并引来跟单噪音。
- 产品后果：全站禁止 BUY / SELL 语义、禁止收益展示、禁止「战绩」叙事
  （与 09 号文件 Performance Theatre 禁令一致）。

### 4.2 Author vs Research System

- **TradingLabb 是品牌，HSN 是人；品牌长期存在，个人才是 IP**（02 号文件 §3，不变）。
- Research System（Thesis / Ledger / Journal / Map）有自己的生命：
  它的权威来自**可验证性**，不来自 HSN 的名气。系统不为作者背书，作者由系统记录。
- HSN 对系统的关系是**操作者与被记录者**：作者写入观察与修正，
  系统保留全部历史——包括作者错的部分。系统不得为作者美化
  （不得删除 invalidated 命题、不得隐藏 down 修正）。
- 反向纪律：Research System 永不为了塑造作者形象而生产内容
  （防 R-9：IP 内容化）。

### 4.3 Author vs Distribution Persona

- 站外平台上的「HSN」是 **Distribution Persona**——Canonical Identity 在各界面的投影。
- 允许压缩（X 的短帖体、小红书的图文体），**不允许虚构**：
  分发人格不得说出站内不存在的判断、数字、资历或持仓暗示。
- 分发人格不反向定义 Canonical Identity：平台人设演化（例如某平台形成的绰号、
  栏目化形象）永不写回 `Author` 实体（09 号文件 7.2 铁律三：指标不回流的人格版）。
- 跨平台署名统一：`TradingLabb by HSN` / `HSN · TradingLabb`
  （02 号文件 §3 署名方向，克制、不变体）。

---

## 五、Identity 的时间维度

- **since 1998** 是唯一时间锚点；不设置「重要年份时间线」（那是 Biography）。
- Identity 本身是**慢变量**：Role 已冻结（OD-A），Lens 与 Obsession 的修订走
  Yearly Review 节奏（09 号文件 13.3 更新节奏框架），修订即版本化，
  不覆盖旧版本（Slowly Evolving 纪律）。
- Identity 的可信度不随声明增长，只随 Body of Work 增长：
  **Identity 的每一层都必须能被站内实体证明**（Proof 链见 12 号文件）。

---

## 六、与数据架构的关系（契约锚点，本阶段不实现）

本文件是未来 `domains/identity.ts` 的语义契约（实施属 V2-07-03 之后，
需单独任务单授权）：

```ts
Author {
  id: 'hsn'
  name: 'HSN'
  roles: ['Founder', 'Observer', 'Researcher']   // 本文件一节，OD-A 冻结
  signature: 'Observe change. Update beliefs.'   // 02 号文件 §9，不变
  since: '1998'                                  // 本文件一节，OD-B 终裁
  oneLiner: string   // 由 11 号文件 POV 陈述派生，本文件不锁定文本
}
```

实体**不含**：bio、avatar、社交链接、履历条目、任何指标字段
（09 号文件 R-6 防加料纪律保留）。

---

## 七、宪章自检（任何 Identity 相关提案的准入测试）

一项涉及「HSN 是谁」的提案进入产品前，必须全部回答「是」：

1. 它描述的是**持续行为模式**，而不是一次性履历？
2. 它能被 Ledger / Thesis / Essay 等站内实体**反向证明**？
3. 它不会因为 HSN 换了职业、城市、生活状态而失效？
4. 它在十年尺度上仍然成立？

任一回答「否」——该内容属于 Biography 或 Distribution Persona，不进 Canonical Identity。
