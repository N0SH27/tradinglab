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
  /** 可选：public/hidden/books 下已经存在的 PDF 所对应的站内路径。 */
  pdf?: string
}

export type HiddenBookDownload = {
  href: string
  fileName: string
}

const HIDDEN_BOOK_PDF_PATH = /^\/hidden\/books\/([\p{L}\p{N}][\p{L}\p{N} ._·()（）《》—–-]*\.pdf)$/u

/** 未配置或不是安全的站内 PDF 路径时，不生成下载入口。 */
export function getHiddenBookDownload(book: Pick<HiddenBook, 'pdf'>): HiddenBookDownload | null {
  const href = book.pdf?.trim()
  if (!href) return null
  const match = HIDDEN_BOOK_PDF_PATH.exec(href)
  if (!match || match[1].includes('..')) return null
  return { href, fileName: match[1] }
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
      '这是一份以「顶级游资的思考」为题的淘股吧资料合集。封面标注“内部资料 非卖品”，站内仅作为你已有材料的阅读索引，不提供公开下载。',
      '不同人物、不同时期的经验可能互相矛盾。整理时应先标明出处、日期和讨论背景，再比较它们对选股、节奏、风险与执行的不同回答，避免把语录拼成看似一致的交易系统。',
    ],
    prompts: [
      '这段内容对应哪个人物 ID、哪段时间和哪种市场环境？',
      '观点之间的矛盾来自定义不同、周期不同，还是方法本身不同？',
      '哪些说法能够用历史样本检验，哪些只能作为个人经验保留？',
    ],
    sourceNote: '封面来自你提供的资料合集，原始汇编者与具体篇目出处需在阅读时继续核对。本页仅作索引，不提供文件分发。',
    tone: 'silver',
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
    pdf: '/hidden/books/zhou-jintao-cycle-collection.pdf',
  },
]
