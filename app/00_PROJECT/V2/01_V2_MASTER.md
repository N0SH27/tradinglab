# V2-01 · MASTER — TradingLabb V2 总纲

> **V2 是什么、为什么做、怎么推进。**
> 设计层文档。与 P0/P1/P2 冲突时，以 P0/P1/P2 为准，冲突记入 06_V2_IMPLEMENTATION_LOG.md。
> 建立日期：2026-08-23（V2-00 上下文层初始化）。

---

## 一、V2 定位

TradingLabb V2 不是重新设计一个投资网站，不是投资教育网站，也不是个人版 ARK。

**A personal investment intelligence lab for observing change, forming hypotheses, and revising beliefs.**

中文内部定义：

> **TradingLabb 是一个观察变化、形成命题、修正认知的个人投资研究实验室。**

V1 已完成的：思想密度、工程纪律、视觉系统。
V2 要解决的：**把已经存在的思想，变成更容易被理解、记住和传播的产品。**

一句话问题定义：

> 内部结构已经像一个研究机构，外部入口还像一个私人书房。
> 书房适合老读者；品牌需要让陌生人能够进门。

## 二、核心循环（THE TRADINGLABB LOOP，V2-01 定稿）

```text
OBSERVE
   ↓
MAP
   ↓
THINK
   ↓
THESIS
   ↓
ACT / DON'T ACT
   ↓
REVISE
   ↓
ARCHIVE
   ↓
OBSERVE AGAIN
```

不再单独使用 UNDERSTAND——**MAP 本身就是 Understand**；WUWEI 是 ACT / DON'T ACT 背后的行为原则。
完整定义见 02 号文件第 6 节。这不是新发明——它就是 P0 已有哲学的用户可理解版本，
V2 把它从散落的项目文档变成产品结构。

## 三、三层产品深度

| 层 | 对象 | 回答 |
|---|---|---|
| PUBLIC LAYER | 第一次来的用户 | 30 秒内知道"这是一个人在研究什么" |
| RESEARCH LAYER | 认真读的人 | 他到底怎么研究 |
| PHILOSOPHY LAYER | 长期读者 | 这一切背后是一套完整世界观 |

比例原则：**80% 易懂 + 20% 神秘。** 表层产品化，底层哲学不动。

## 四、V2 的总原则

1. **Preserve architecture → Reframe experience → Strengthen brand → Add high-value interactions.** 不是 Rewrite everything。
2. **叠加层，不是改写层。** V2 文档独立于 P0–P4 文档存在；P0 的上下文优先级（P0→P1→P2→P3→P4→聊天记录→AI 假设）不变。
3. **11 个现有栏目全部保留**，只增加更高的认知层级（详见 03）。
4. **先设计，再实施。** 每完成一个阶段，review 后再进入下一阶段；不让 AI 一次性"把整个网站改掉"。
5. **冲突明说。** V2 提案与 P0/P1/P2 冲突时，暂停该项，记入 06 日志，P0/P1/P2 优先，交用户裁决。

## 五、V2 路线图（V2-01 重排版）

> 顺序原则：**阴阳仪不第一个开发**——它是品牌核心符号，但必须建立在最终 IA 与首页结构定稿之后，
> 否则会变成"为了阴阳图而设计首页"，本末倒置。

| 阶段 | 目标 | 是否改代码 | 状态 |
|---|---|---|---|
| V2-00 | 冻结当前版本 + 建立 V2 上下文层（本目录） | 否 | ✅ 2026-08-23 |
| V2-01 | Brand Architecture 定稿（02 号文件，14 节最终版） | 否 | ✅ 2026-08-23 |
| V2-02 | Information Architecture Review（03 号文件定稿：Option C 混合型） | 否 | ✅ 2026-08-23 |
| V2-03 | Homepage Specification Final Review（04 号文件终审定稿：七章 + 12 项组件级属性 + AC） | 否 | ✅ 2026-08-23 |
| V2-04 | Polarity Instrument 实施（05 号文件；C-01/C-02 已裁决） | 是 | 待排期 |
| V2-05 | Homepage Implementation（首页六章节落地） | 是 | 待排期 |
| V2-06 | Thesis + Revision System 产品化 | 是 | 待排期 |
| V2-07 | HSN Personal IP 层（含 WHAT I BELIEVE NOW、内容增长与运营） | 部分 | 待排期 |

## 六、与 ARK 的关系（边界声明）

- ARK：Research → Investment Product，核心资产是 AUM。
- TradingLabb：Observation → Thesis → Revision → Knowledge，核心资产是 **Intellectual Capital**。
- 向 ARK 学的：top-down 观察世界变化、用指标（cost curve / 渗透率 / 采用率）筛选机会。
- 绝对不学的：把网站做成"个人版 ARK"、做成产品推介页、做成热点追踪媒体。

## 七、V2 目录说明

```text
app/00_PROJECT/V2/
├── 01_V2_MASTER.md                    本文件：总纲与路线图
├── 02_V2_BRAND_ARCHITECTURE.md        HSN / TradingLabb / 阴阳 / 世界观 的品牌关系
├── 03_V2_INFORMATION_ARCHITECTURE.md  11 栏目 → 5 认知层的重组设计
├── 04_V2_HOME_SPEC.md                 首页六章节的组件级规格（设计稿，未实施）
├── 05_V2_POLARITY_SYSTEM.md           阴阳仪的系统设计（C-01/C-02 已于 2026-08-23 裁决）
└── 06_V2_IMPLEMENTATION_LOG.md        执行记录 + 冲突台账 + 下一阶段建议
```
