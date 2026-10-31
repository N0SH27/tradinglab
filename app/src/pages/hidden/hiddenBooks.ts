export type HiddenBook = {
  id: string
  index: string
  title: string
  spineTitle: string
  creator: string
  creatorRole: string
  category: string
  cover: string
  summary: string
  paragraphs: string[]
  prompts: string[]
  sourceNote: string
  tone: 'paper' | 'ink' | 'silver'
  /** 可选：本仓库 GitHub Releases 的 books-v1 附件地址；本地原文件不进入 Git。 */
  pdf?: string
}

export type HiddenBookDownload = {
  href: string
  fileName: string
}

export const HIDDEN_BOOK_RELEASE_PATH = 'https://github.com/N0SH27/tradinglab/releases/download/books-v1/'
const HIDDEN_BOOK_PDF_NAME = /^[\p{L}\p{N}][\p{L}\p{N} ._·()（）《》—–-]*\.pdf$/u

/** 只接受本仓库 books-v1 的 PDF 附件，拒绝其他站点、标签、查询串与路径穿越。 */
export function getHiddenBookDownload(book: Pick<HiddenBook, 'pdf'>): HiddenBookDownload | null {
  const href = book.pdf?.trim()
  if (!href?.startsWith(HIDDEN_BOOK_RELEASE_PATH)) return null
  const fileName = href.slice(HIDDEN_BOOK_RELEASE_PATH.length)
  if (!HIDDEN_BOOK_PDF_NAME.test(fileName) || fileName.includes('..')) return null
  return { href, fileName }
}

export const HIDDEN_BOOKS: HiddenBook[] = [
  {
    id: 'xie-guozhong-advice',
    index: '01',
    title: '谢国忠的忠告',
    spineTitle: '谢国忠的忠告',
    creator: '谢国忠 / 曾瀞漪',
    creatorRole: '作者 / 对话',
    category: '宏观经济 · 对谈',
    cover: '/hidden/books/xie.webp',
    summary: '以对话为入口观察中国经济，把宏观判断还原为假设、传导路径与可跟踪的问题。',
    paragraphs: [
      '本书以曾瀞漪对话谢国忠的形式讨论中国经济。站内将它放在宏观阅读入口，用来对照观点、事实与后来的实际演进。',
      '阅读时不只记录结论，也记录结论成立所依赖的环境。涉及资产、通胀、房地产或增长的判断，应回到原文语境，并与当时和后续的数据分开核对。',
    ],
    prompts: [
      '这段判断讨论的是长期结构，还是特定时间窗口？',
      '观点依赖哪些宏观变量，变量之间如何传导？',
      '哪些后续证据可以支持或反驳原来的判断？',
    ],
    sourceNote: '封面来自你提供的 PDF。以上为站内阅读导航，不代替原文；历史观点不构成当前投资建议。',
    tone: 'paper',
    pdf: 'https://github.com/N0SH27/tradinglab/releases/download/books-v1/xie-guozhong-advice.pdf',
  },
  {
    id: 'me-and-xiaoming',
    index: '02',
    title: '我和小明',
    spineTitle: '我和小明',
    creator: '退学炒股 / 作手注解',
    creatorRole: '淘股吧 ID / 注解',
    category: '交易心理 · 自我反省',
    cover: '/hidden/books/xiaoming.webp',
    summary: '从计划外交易、踏空心理与自我对话中，辨认交易执行为什么偏离原来的计划。',
    paragraphs: [
      '这份材料源自淘股吧 ID「退学炒股」的《我和小明》，当前版本含作手注解，且文件名明确标注并非全集。文本以交易记录和自我对话呈现计划外的冲动、踏空焦虑与模式摇摆。',
      '适合与自己的交易日志并读：把“市场让我这么做”改写成可观察的触发、情绪和动作，再检查原有计划究竟在哪一步被替代。原文与注解应分开阅读，不把后来的解释当作当时已知的信息。',
    ],
    prompts: [
      '这次操作原本有计划吗，计划在哪一步被临时决定替代？',
      '触发交易的是模型信号，还是踏空、急躁或害怕错过？',
      '哪些语句来自原帖，哪些来自后来的作手注解？',
    ],
    sourceNote: '封面取自你提供的非全集注解版 PDF。论坛 ID 不等同已核实的真实身份；以上为阅读导航，不复述未核实业绩。',
    tone: 'ink',
    pdf: 'https://github.com/N0SH27/tradinglab/releases/download/books-v1/me-and-xiaoming.pdf',
  },
  {
    id: 'chaogu-yangjia',
    index: '03',
    title: '淘县大师传之炒股养家',
    spineTitle: '炒股养家',
    creator: '淘股吧 ID：炒股养家',
    creatorRole: '原帖作者 / 论坛 ID',
    category: '论坛文集 · 短线博弈',
    cover: '/hidden/books/yangjia.webp',
    summary: '从原帖与问答中观察市场阶段、热点、超跌和交易心态，区分原话与整理者叙述。',
    paragraphs: [
      '这份 PDF 以「炒股养家」的淘股吧帖子与问答为主体，由第三方整理制作。材料涉及市场阶段、热点、超跌、仓位感受与交易心态，也包含整理者撰写的人物简介。',
      '阅读重点是保留每个判断的市场背景：强势、弱势与平衡阶段所对应的讨论并不相同。论坛中的经验需要回到当时日期、原帖语境和可复核样本中理解，不宜直接转成机械买卖规则。',
    ],
    prompts: [
      '这段发言对应哪种市场阶段，原文是否写明了前提？',
      '哪些是原帖或问答，哪些是整理者的简介、评论与推荐？',
      '如何把经验描述转成可记录、可复盘的观察项，而不是口号？',
    ],
    sourceNote: '封面取自你提供的第三方整理 PDF。人物简介与历史业绩叙述未在站内独立核实；论坛 ID 不作为真实身份认证。',
    tone: 'paper',
    pdf: 'https://github.com/N0SH27/tradinglab/releases/download/books-v1/chaogu-yangjia.pdf',
  },
  {
    id: 'top-hot-money-thoughts',
    index: '04',
    title: '顶级游资的思考',
    spineTitle: '顶级游资的思考',
    creator: '淘股吧资料合集',
    creatorRole: '资料来源 / 汇编',
    category: '交易经验 · 观点索引',
    cover: '/hidden/books/youzi.webp',
    summary: '作为游资观点的历史资料入口，按人物、时间与市场语境建立索引，而非寻找统一答案。',
    paragraphs: [
      '这是一份以「顶级游资的思考」为题的淘股吧资料合集，封面标注“内部资料 非卖品”。站内将其作为历史资料入口，原文通过 GitHub Releases 提供下载。',
      '不同人物、不同时期的经验可能互相矛盾。整理时应先标明出处、日期和讨论背景，再比较它们对选股、节奏、风险与执行的不同回答，避免把语录拼成看似一致的交易系统。',
    ],
    prompts: [
      '这段内容对应哪个人物 ID、哪段时间和哪种市场环境？',
      '观点之间的矛盾来自定义不同、周期不同，还是方法本身不同？',
      '哪些说法能够用历史样本检验，哪些只能作为个人经验保留？',
    ],
    sourceNote: '封面来自你提供的资料合集，原始汇编者与具体篇目出处需在阅读时继续核对；原文通过本仓库 GitHub Releases 分发。',
    tone: 'silver',
    pdf: 'https://github.com/N0SH27/tradinglab/releases/download/books-v1/top-hot-money-thoughts.pdf',
  },
  {
    id: 'true-meaning-of-cycles',
    index: '05',
    title: '周期真实义 1：涛动周期录',
    spineTitle: '周期真实义 · 涛动周期录',
    creator: '周金涛',
    creatorRole: '作者',
    category: '宏观研究 · 周期',
    cover: '/hidden/books/cycle.webp',
    summary: '从周期层级、产业结构与历史比较出发，理解宏观研究如何连接资产配置与行业观察。',
    paragraphs: [
      '当前藏书为周金涛《周期真实义》四本合集，封面入口从第一册《涛动周期录：繁荣的起点》开始。书中的研究将经济、技术、产业与社会系统放在周期框架下讨论。',
      '阅读时可将不同时间尺度的周期分开做笔记，记录作者使用的历史比较、结构变量与推理过程。更重要的是回到文章形成时点，区分当时可得的证据与事后结果，而不是只摘取被广泛传播的判断。',
    ],
    prompts: [
      '这篇文章讨论的是哪个层级的周期，时间尺度是否被混淆？',
      '作者用哪些历史案例和结构变量支持推理？',
      '在当时的信息条件下，哪些判断可以被后续事实检验？',
    ],
    sourceNote: '封面与书目信息来自你提供的 PDF。站内按四本合集的第一册建立入口；介绍为阅读导航，具体论证以原书为准。下载文件为四本合集，共 1372 页，约 95 MB。',
    tone: 'ink',
    pdf: 'https://github.com/N0SH27/tradinglab/releases/download/books-v1/zhou-jintao-cycle-collection.pdf',
  },
  {
    id: 'hive-mind',
    index: '06',
    title: '蜂巢思维：群体意识如何影响你',
    spineTitle: '蜂巢思维',
    creator: '萨拉·罗斯·卡瓦纳 / 蒋宗强',
    creatorRole: '作者 / 译者',
    category: '社会心理 · 群体行为',
    cover: '/hidden/books/hive-mind.webp',
    summary: '从群体同步、情绪传染与社交技术出发，观察个人判断如何被身处的关系网络塑造。',
    paragraphs: [
      '本书结合心理学、神经科学、历史学与访谈讨论“蜂巢思维”：人的思想、情绪与大脑活动会在群体中相互影响，而智能手机和社交媒体进一步改变了这种同步的速度与范围。',
      '对交易阅读而言，可以把它当作检视信息环境的入口：记录一个判断来自亲身验证、所处圈层，还是反复转述，同时区分群体共识与事实本身。这里提供的是阅读视角，不把心理学研究直接等同于市场规律。',
    ],
    prompts: [
      '这个判断来自直接证据，还是来自我所在群体的重复强化？',
      '社交技术在这里加强了真实联系，还是替代了独立核验？',
      '什么证据能够让我修正与圈层一致的看法？',
    ],
    sourceNote: '封面、版权信息与前言来自你提供的 PDF；以上为阅读导航。下载文件共 258 页，约 3 MB。',
    tone: 'paper',
    pdf: 'https://github.com/N0SH27/tradinglab/releases/download/books-v1/hive-mind.pdf',
  },
  {
    id: 'poor-economics',
    index: '07',
    title: '贫穷的本质：我们为什么摆脱不了贫穷',
    spineTitle: '贫穷的本质',
    creator: '阿比吉特·班纳吉 / 埃斯特·迪弗洛',
    creatorRole: '作者',
    category: '发展经济学 · 决策约束',
    cover: '/hidden/books/poor-economics.webp',
    summary: '从饥饿、健康、教育、家庭与金融约束等具体问题，理解贫困中的选择与政策障碍。',
    paragraphs: [
      '本书从穷人的真实生活与选择出发，结合长期调查、数据和实验，讨论健康、教育、生育、储蓄、信贷、创业与公共政策。作者试图把宏大的贫困争论拆成能够被具体研究的问题。',
      '阅读时可重点记录小额成本、信息缺口与制度摩擦如何共同限制选择，避免用单一性格标签解释复杂处境。书中的证据也应回到具体地区、时间和研究条件中理解，而不是直接外推成普遍政策答案。',
    ],
    prompts: [
      '这个选择受到的是收入、信息、制度，还是多种约束的共同影响？',
      '研究证据来自什么地区与样本，能够外推到多大范围？',
      '看似微小的障碍为什么会持续改变长期结果？',
    ],
    sourceNote: '封面、书名页、目录与前言来自你提供的修订版 PDF；以上为阅读导航。下载文件共 249 页，约 2.4 MB。',
    tone: 'ink',
    pdf: 'https://github.com/N0SH27/tradinglab/releases/download/books-v1/poor-economics.pdf',
  },
  {
    id: 'tech-revolutions-finance',
    index: '08',
    title: '技术革命与金融资本',
    spineTitle: '技术革命与金融资本',
    creator: '卡洛塔·佩雷斯',
    creatorRole: '作者',
    category: '技术变迁 · 金融资本',
    cover: '/hidden/books/tech-revolutions-finance.webp',
    summary: '以技术—经济范式及金融资本、生产资本的互动，梳理技术革命从爆发到成熟的阶段性框架。',
    paragraphs: [
      '本书以工业革命以来的技术变迁为历史参照，讨论创新集群、金融资本与生产资本如何相互作用。版本前言将相关过程概括为爆发、狂热、协调与成熟四个阶段，并呈现技术扩散与制度变化之间的关系。',
      '适合把它作为历史比较模型，而不是预测当前市场的固定时钟。阅读时可同时保留书中框架与本版推荐序提出的批评，检查平台经济、开源创新和当代金融结构是否改变了模型原来的前提。',
    ],
    prompts: [
      '当前讨论的是技术创新、资本扩张，还是制度适应的哪个阶段？',
      '金融资本与生产资本在这段历史中的动机和约束分别是什么？',
      '哪些当代条件已经不同于模型所依据的历史经验？',
    ],
    sourceNote: '封面、前言与推荐序信息来自你提供的 PDF；以上为阅读导航，不将历史模型直接视为当前预测。下载文件共 217 页，约 12 MB。',
    tone: 'paper',
    pdf: 'https://github.com/N0SH27/tradinglab/releases/download/books-v1/tech-revolutions-finance.pdf',
  },
  {
    id: 'trading-for-a-living',
    index: '09',
    title: '以交易为生',
    spineTitle: '以交易为生',
    creator: '亚历山大·埃尔德 / 符彩霞',
    creatorRole: '作者 / 译者',
    category: '交易心理 · 策略与风控',
    cover: '/hidden/books/trading-for-a-living.webp',
    summary: '围绕交易心理、交易战术与资金管理，把方法选择、执行纪律与风险约束放在同一张阅读地图上。',
    paragraphs: [
      '本书封面将内容分为心理学、交易战术与资金管理三个维度。站内把它放在交易方法与实践的交叉口，用来同时检视人的行为、所使用的策略，以及账户能够承受的风险。',
      '阅读时可将三类笔记分开记录，再用一份交易计划把它们连接起来：什么情况下行动、什么情况下失效、单次与连续错误会造成多大影响。具体指标或战术仍需独立回测，不能把书中示例直接当成当前买卖信号。',
    ],
    prompts: [
      '这个交易想法有明确的前提、失效条件和风险预算吗？',
      '执行偏差来自策略本身，还是来自情绪与临场决策？',
      '连续失误时，资金管理规则能否让账户继续保留选择空间？',
    ],
    sourceNote: '封面与书名页来自你提供的扫描版 PDF；以上为阅读导航，不构成交易建议。下载文件共 230 页，约 43.4 MB。',
    tone: 'silver',
    pdf: 'https://github.com/N0SH27/tradinglab/releases/download/books-v1/trading-for-a-living.pdf',
  },
  {
    id: 'too-big-to-fail',
    index: '10',
    title: '大而不倒',
    spineTitle: '大而不倒',
    creator: '安德鲁·罗斯·索尔金 / 巴曙松、陈剑等',
    creatorRole: '作者 / 译者',
    category: '金融危机 · 纪实',
    cover: '/hidden/books/too-big-to-fail.webp',
    summary: '沿华尔街与华盛顿应对金融危机的叙事，观察机构、关键人物与系统性风险如何相互作用。',
    paragraphs: [
      '本书封面将内容概括为华尔街与华盛顿如何拯救金融体系及自身的内幕故事。它适合作为金融危机的叙事阅读入口，把抽象的机构名称还原到具体事件、决策者与约束条件之中。',
      '阅读时可按时间线整理关键节点，区分当时能够获得的信息与事后才知道的结果，并记录政府、金融机构和市场之间的行动如何相互影响。叙事中的事后访谈也应与公开时间和同期材料相互核对。',
    ],
    prompts: [
      '这个决策发生时，参与者已经知道什么，又无法知道什么？',
      '机构目标、个人激励与系统性风险在哪里发生了冲突？',
      '哪些安排暂时阻止了危机，又可能把风险转移到未来？',
    ],
    sourceNote: '封面与书名页来自你提供的扫描版 PDF；以上为阅读导航。下载文件共 635 页，约 29.1 MB。',
    tone: 'ink',
    pdf: 'https://github.com/N0SH27/tradinglab/releases/download/books-v1/too-big-to-fail.pdf',
  },
  {
    id: 'psychology-of-money',
    index: '11',
    title: '金钱心理学：财富、人性和幸福的永恒真相',
    spineTitle: '金钱心理学',
    creator: '摩根·豪泽尔 / 李青宗',
    creatorRole: '作者 / 译者',
    category: '行为金融 · 财富观',
    cover: '/hidden/books/psychology-of-money.webp',
    summary: '从行为而非单一智商或公式出发，理解财富、风险、复利与幸福之间的关系。',
    paragraphs: [
      '本书用人物故事讨论财务结果与行为习惯之间的关系。序言将金钱心理学称为一种软技能：知道公式和规则，并不等于人在贪婪、恐惧与压力中仍能按规则行动。',
      '全书由二十个可独立阅读的主题章节组成。适合做短篇对照阅读：把知识上的“应该怎么做”与现实中的“实际上怎么做”分开，再检查自己的时间尺度、风险承受能力和对幸福的定义是否一致。',
    ],
    prompts: [
      '这个财务决定是在回应长期目标，还是短期情绪与他人比较？',
      '同样的结果中，哪些来自行为，哪些可能来自运气与所处时代？',
      '我定义的“足够”是什么，它如何影响风险与选择？',
    ],
    sourceNote: '封面、版权信息与序言来自你提供的 PDF；以上为阅读导航。下载文件共 246 页，约 10.3 MB。',
    tone: 'paper',
    pdf: 'https://github.com/N0SH27/tradinglab/releases/download/books-v1/psychology-of-money.pdf',
  },
  {
    id: 'fogg-behavior-model',
    index: '12',
    title: '福格行为模型',
    spineTitle: '福格行为模型',
    creator: 'B.J.福格 / 徐毅',
    creatorRole: '作者 / 译者',
    category: '行为设计 · 微习惯',
    cover: '/hidden/books/fogg-behavior-model.webp',
    summary: '用动机、能力与提示理解行为，把模糊愿望拆成容易开始、能够重复的小行动。',
    paragraphs: [
      '本书以 B=MAP 为核心：行为在动机、能力和提示同时出现时发生。目录沿三个要素展开，并继续讨论微习惯、锚点时刻、积极情绪与庆祝，将行为改变整理为可以逐步练习的设计过程。',
      '阅读时可把一个想改变的行为写成具体实验：明确愿望，列出可能行动，缩小到容易完成的版本，再为它安排已有日程中的提示。它是行为设计工具，不应被直接解释成消除交易偏差或获得投资结果的保证。',
    ],
    prompts: [
      '我想改变的是模糊愿望，还是一个能被清楚描述的具体行为？',
      '行动没有发生时，缺少的是动机、能力，还是有效提示？',
      '怎样把下一步缩小到足够容易，并用什么锚点触发它？',
    ],
    sourceNote: '封面、目录与前言来自你提供的 PDF；以上为阅读导航。下载文件共 360 页，约 10.3 MB。',
    tone: 'ink',
    pdf: 'https://github.com/N0SH27/tradinglab/releases/download/books-v1/fogg-behavior-model.pdf',
  },
  {
    id: 'behavioral-finance',
    index: '13',
    title: '行为金融学：投资者、企业和市场',
    spineTitle: '行为金融学',
    creator: 'H.肯特·贝克 / 约翰·R.诺夫辛格',
    creatorRole: '编著',
    category: '行为金融 · 综合研究',
    cover: '/hidden/books/behavioral-finance.webp',
    summary: '从心理偏向到资产定价、公司金融与社会影响，建立一张跨主体的行为金融阅读地图。',
    paragraphs: [
      '这本编著以六篇、三十六章组织内容：基础与关键概念，心理学概念和行为偏向，资产定价的行为因素，行为公司金融，投资者行为，以及社会影响。直觉推断、过度自信、熟悉偏向、市场无效、融资决策和机构投资者等主题被放在同一框架中。',
      '适合按问题而不是只按页序阅读：先区分研究讨论的是个人决策、企业决策还是市场结果，再记录各章的证据和适用边界。心理偏向的存在并不自动推出可利用的交易策略，也不意味着市场价格可以被简单预测。',
    ],
    prompts: [
      '这一章分析的是投资者、企业、市场，还是更广泛的社会环境？',
      '从个体心理偏向推导到群体或价格结果时，中间还需要哪些条件？',
      '章节的证据支持什么结论，又有哪些结论不能直接外推？',
    ],
    sourceNote: '封面与目录来自你提供的扫描版 PDF；贺京同、高林、贺坤、李宝伟等译，贺京同校。以上为阅读导航。下载文件共 877 页，约 167.9 MB。',
    tone: 'silver',
    pdf: 'https://github.com/N0SH27/tradinglab/releases/download/books-v1/behavioral-finance.pdf',
  },
  {
    id: 'investment-psychology',
    index: '14',
    title: '行为金融与投资心理学（原书第6版）',
    spineTitle: '行为金融与投资心理学',
    creator: '约翰 R. 诺夫辛格 / 郑磊、郑扬洋',
    creatorRole: '作者 / 译者',
    category: '行为金融 · 投资心理',
    cover: '/hidden/books/investment-psychology.webp',
    summary: '沿过度自信、处置效应、风险感知与情绪等主题，观察心理偏差如何进入投资决策。',
    paragraphs: [
      '本书从心理学与金融的关系出发，依次讨论过度自信、自豪与懊悔、风险感知、决策框架、心理会计、投资组合、代表性与熟悉程度、社交互动、情绪、自我控制和投资生理学。第 6 版新增投资生理学章节。',
      '前言说明，各章通常先以日常行为描述心理偏差，再分析其对投资决策的影响，最后引用学术研究。作者将了解心理偏差定位为对传统金融工具的补充，而非替代；阅读时也应区分偏差识别、策略有效性与实际执行。',
    ],
    prompts: [
      '这次判断可能受到哪种心理偏差影响，有什么可观察的迹象？',
      '我是在评价决策过程，还是只根据一次盈亏结果反推原因？',
      '传统金融工具与行为观察应如何互补，而不是互相替代？',
    ],
    sourceNote: '封面取自你提供的 PDF 第 2 页，目录与前言来自原书；以上为阅读导航，不构成收益承诺。下载文件共 330 页，约 4.6 MB。',
    tone: 'paper',
    pdf: 'https://github.com/N0SH27/tradinglab/releases/download/books-v1/investment-psychology.pdf',
  },
  {
    id: 'behavioral-investing-principles',
    index: '15',
    title: '行为投资原则',
    spineTitle: '行为投资原则',
    creator: '丹尼尔·克罗斯比 / 张昊',
    creatorRole: '作者 / 译者',
    category: '行为投资 · 决策流程',
    cover: '/hidden/books/behavioral-investing-principles.webp',
    summary: '把行为自我管理原则转化为投资流程，检视知识、规则与临场执行之间的距离。',
    paragraphs: [
      '本书第一部分列出十条行为自我管理原则，涉及行为控制、顾问、情绪、个人需求、预测、多样化与风险。第二部分进入基于原则的行为投资，讨论行为风险、4C 框架及 5P 选股法。',
      '4C 指一致性、清晰性、勇气和信念。阅读重点可以放在原则如何形成流程：哪些规则需要事先写清，哪些条件会削弱执行，如何用记录检查偏离。书中方法有各自前提，不能被视为保证收益或避免损失的机械答案。',
    ],
    prompts: [
      '我已经把原则写成可执行规则，还是只记住了正确口号？',
      '流程在哪种市场或情绪状态下最容易被临时放弃？',
      '一致性、清晰性、勇气和信念中，当前最薄弱的是哪一项？',
    ],
    sourceNote: '封面、目录与译者序来自你提供的 PDF；以上为阅读导航，不构成投资建议。下载文件共 284 页，约 13.1 MB。',
    tone: 'ink',
    pdf: 'https://github.com/N0SH27/tradinglab/releases/download/books-v1/behavioral-investing-principles.pdf',
  },
]
