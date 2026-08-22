# 10 · HANDOFF — 换对话/换模型从这里继续

> **最后更新：2026-08-22**（每次结束一段工作前更新本文件）
> 阅读顺序：本文件 → 01_PROJECT_SPEC → 02_DESIGN_CONSTITUTION → 对应 PAGE_SPEC → CURRENT_TASK。

---

## A. 项目摘要（500 字内）

trading-lab 是 HSN 的个人交易研究实验室网站（React+Vite+Tailwind 纯静态站，hash 路由）。
使命：把投资认知变成公开、可追溯、持续更新的档案——修正记录比正确预测更值得展示。
视觉：宣纸上的墨与印（Kanye 极简 × 道家阴阳 × 朱砂 #C0392B 克制使用）。
交互：墨入水转场（点击=展开、返回=收束镜像）、墨点光标、悬停墨晕，全部慢稳克制。
工程：内容与代码分离（src/data/domains/ 11 领域文件）、零依赖倾向（运行时仅 react）、
npm run check 事前校验（80 项）+ ErrorBoundary 事后兜底、website_version_manager 留版本。
11 栏目全部在线。朱砂规则、符号静止令、首屏无动效是不可谈判的禁令。
当前无活动任务；BACKLOG 最高优先级：读书子栏目、宣言页阿南认知五论。

## B. 状态快照 [FACT]

- 最新版本：**94be411**（依赖瘦身+a11y+错误边界+路由分包）；
  2026-08-22 未存版改动：首页封面标签与幕次重复英文删除 + 导航分层（6 项两组，TASK-001）；
- 构建基线：CSS 29.2KB / 首屏 JS 232KB(gzip 75KB) / 页面 chunk 2–16KB；
- 运行时依赖：react + react-dom（其余全部清除，2026-08-15）；
- 数据校验：`npm run check`（scripts/check-data.mjs，80 项断言全绿）；
- 工程手册：根目录 DESIGN.md（令牌/操作步骤/版本历史）；
- 项目宪法：00_PROJECT/（本目录）——唯一事实源；
- Notion 镜像：交易/「AI WEBSITE OS ｜ trading-lab」（https://app.notion.com/p/3c2caec2dc9d81d4b381c62d946ed3d8）——
  可读知识层，11 个子页镜像本目录；改动先落仓库、双绿后再同步 Notion。

## C. 不可更改 [DECISION]

1. 印章字形必须手稿（GLYPH_D）；2. 朱砂三类规则+一豁免；3. 符号彻底静止；
4. 首屏无动效；5. 网站只承载思想不承载操作；6. 内容只改 domains/；
7. 改数据必跑 check、改完必存版本；8. 全局 prefers-reduced-motion；
9. 导航过渡三通道统一；10. 不引入组件库/动画库。

## D. 已知问题 [OPEN]

命题无法单独链接（#/thesis 聚合页）；文章小节锚点不进 URL；
check 未接入构建强制；地图坐标手写；npm audit 本环境不可用；
iOS 边缘手势优先级由浏览器决定（有 reveal 兜底）。

## E. 待裁决 [OPEN]

幕次编号朱砂保留与否；规范第12条 Symbol 逆向动效是否永久关闭；
深水蓝在深层研究页的扩展场景；「镜头」栏目形态。

## F. 临时假设 [ASSUMPTION]

- 读者质量优先于数量，无获客指标；
- 品牌人格的反面是"专家人设"——展示过程而非扮演权威；
- 新栏目上线前须回答"沉淀为树的哪一枝"。

## G. 新对话启动 Prompt（复制即用）

```text
这是一个已经在持续开发中的项目：trading-lab（HSN 的个人交易研究实验室网站）。
项目文件在 /mnt/agents/output/app。

请先阅读以下项目上下文（按优先级）：
1. 00_PROJECT/10_HANDOFF.md（状态快照）
2. 00_PROJECT/01_PROJECT_SPEC.md（P0 项目宪法）
3. 00_PROJECT/02_DESIGN_CONSTITUTION.md（P1 设计宪法）
4. 00_PROJECT/08_TASKS/CURRENT_TASK.md（当前任务）
5. 涉及页面时读 00_PROJECT/06_PAGE_SPECS/ 对应文件
工程操作细节查根目录 DESIGN.md。

你的任务不是重新设计这个项目。你需要先：理解项目 → 区分确定事实与假设 →
理解现有设计原则 → 理解当前任务。

禁止：重新定义产品定位 / 擅自修改设计语言 / 擅自增加功能 / 推翻已记录的决策
（09_CHANGELOG.md 里每条决策都有 Why）。

开始前请用不超过 500 字总结："你认为这个项目是什么，以及下一步应该做什么。"
然后等待任务单。
```
