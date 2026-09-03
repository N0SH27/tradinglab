// ── 当下（NOW · Current Observations）────────────
// NOW ≠ 新闻 / 行情 / Ticker / Dashboard——只记录"正在发生、值得观察的变化"。
// Observation ≠ Thesis：观察回答"什么在变"，命题回答"我因此相信什么"。
// polarity 不持有字段——需要时经 mapNodeId 由 deriveThesisPolarity 同源推导（V2-04.5 契约）。
// 人工维护；W35（2026-08-31，+7 +1 注记）与 W36（2026-09-03，+16）证据入账后进入 Evidence Operating Phase；SIGNALS 完整形态挂 C-04（V2-07）。
// 日期纪律（2026-09-03 HSN 裁决）：只标注日期，不写"口径"等来源话语；日期精度对齐素材文件标题日期。
export interface Observation {
  id: string
  title: string
  summary: string
  date: string
  mapNodeId?: string   // 可选 → 地图节点（#\/map）
  thesisId?: string    // 可选 → 命题（#\/thesis/:id）
}

export const OBSERVATIONS: Observation[] = [
  {
    id: 'ai-inference-economics',
    title: 'AI 推理经济学',
    summary: '推理成本持续下降，单位智能的价格曲线仍在下移——需求结构比芯片性能更值得盯。（证据注记：训练/推理结构 6:4 → 2:8 翻转，2026.04.10）',
    date: '2026.08',
    mapNodeId: 'gpu',
    thesisId: 'compute',
  },
  {
    id: 'china-semiconductor-localization',
    title: '国产半导体本地化',
    summary: '从"可用"到"必须用"的切换正在发生：英伟达前瞻指引已不计入中国数据中心收入，海外管制未见放松；智算项目推进速度快于预期。',
    date: '2026.08',
    mapNodeId: 'equip',
    thesisId: 'compute',
  },
  {
    id: 'memory-price-divergence',
    title: '存储价格与股价背离',
    summary: '价格上涨开始遭遇买方抵制：Rubin Ultra 的 HBM 从 12 层降配至 8 层，存储约占整机 BoM 70%；英伟达以存储极端定价为由下调毛利率指引。顶部信号不是价格下跌，而是上涨失效。',
    date: '2026.08',
    mapNodeId: 'dram',
    thesisId: 'memory-cycle',
  },
  {
    id: 'supply-bottleneck-migration',
    title: '瓶颈向设备与厂房迁移',
    summary: '最紧的环节从算力芯片延伸到洁净室、先进封装设备与载板——CoW 设备交期长达 12 个月，亚洲封测厂资本开支创历史高位。订单之后，交付能力开始决定收入。',
    date: '2026.08',
    mapNodeId: 'cowos',
    thesisId: 'compute',
  },
  {
    id: 'power-as-constraint',
    title: '电力成为算力约束',
    summary: 'IDC 扩张之后，瓶颈正在向电力与散热环节迁移。',
    date: '2026.07',
    mapNodeId: 'power',
  },
  {
    id: 'nand-ssd-supercycle',
    title: 'NAND/SSD：存储涨价的第三极',
    summary: '本轮涨价最疯狂的品种是 NAND/SSD 而非 DRAM：服务器 SSD 需求爆发，NAND 卷 3D 堆叠层数（256 层为主）——存储内部结构的第三极，此前体系重心在 HBM/DRAM。（2026.02.06）',
    date: '2026.02.06',
    mapNodeId: 'dram',
    thesisId: 'memory-cycle',
  },
  {
    id: 'samsung-foundry-bypass',
    title: '国产 AI 芯片的三星流片旁路',
    summary: '因中芯先进制程产能来不及，国内 AI 芯片公司开始去三星流片（三星先进制程稼动率不足 50%）——国产算力供给的泄压阀。（2026.04.10）',
    date: '2026.04.10',
    mapNodeId: 'gpu',
    thesisId: 'compute',
  },
  {
    id: 'memory-price-signal-distortion',
    title: '存储价格信号开始失真',
    summary: '合约侧：存储大厂纷纷签 LTA 长协（含两长），大客户合约价占六七成，散单与现货仅占小头；现货侧：缺货时经销商捂盘，现货价被人为放大。价格变量的可读性下降——合约价与现货价的裂口需要分开盯。（2026.04.08–07.17）',
    date: '2026.07.17',
    mapNodeId: 'hbm',
    thesisId: 'memory-cycle',
  },
  {
    id: 'silicon-wafer-leading-indicator',
    title: '硅片价格：周期领先指标值守',
    summary: '已采纳硅片价格为存储周期最领先观察指标（"最不紧缺品种价格见顶"框架：电新轮的领先指标是电解液，本轮对应硅片）。当前读数：未见顶信号。（2026.08.09）',
    date: '2026.08.09',
    mapNodeId: 'dram',
    thesisId: 'memory-cycle',
  },
  {
    id: 'diamond-cooling-commercialization',
    title: '金刚石散热进入商用导入期',
    summary: '英伟达 Rubin 架构明确采用金刚石铜复合方案；海外首批钻石冷却 AI 服务器约 3 亿美金订单，实测 GPU 降温约 10 度、每瓦算力提升 20%+。散热是电力约束的直接承接环节——但板块已被炒过 2–4 倍后回调，真假靠产能/订单/需求放量三问验证。（2026.08.16）',
    date: '2026.08.16',
    mapNodeId: 'cooling',
  },
  {
    id: 'ai-storage-power-mechanism',
    title: 'AI 配储：电力约束的市场化解决层',
    summary: '同一电力约束两种解法：中国要更便宜的电，美国是缺电。容量电价时代开启（13 省出台）；风光发电量占比全部越过 10% 电网调度临界点（中国 21.8%、欧盟 24.6%、美国约 20%），储能从补充变刚需——电力约束度量框架的值守起点。（2026.07.31）',
    date: '2026.07.31',
    mapNodeId: 'power',
  },
  {
    id: 'innovative-drug-bd-curve',
    title: '创新药海外 BD 金额曲线',
    summary: '海外 BD 金额 500 亿 → 1300 亿 → 2026 有望 2000 亿美金；政策边界澄清：单个品种海外 BD 不受影响，技术平台出口或公司打包出售受严格审查。（2026.05.08）',
    date: '2026.05.08',
    thesisId: 'innovative-drug',
  },
  {
    id: 'wafer-capacity-math',
    title: '国产 AI 芯片的产能数学',
    summary: '稀缺产能时代，拿产能的能力=估值：wafer 数×良率×颗数×单价=收入上限。产业链跟踪的第一性指标不是订单，而是 wafer 分配与封装良率——中芯 n+2 良率爬坡与 CoWoS 产能是两大供给卡点。（2025.07.27）',
    date: '2025.07.27',
    mapNodeId: 'gpu',
    thesisId: 'compute',
  },
  {
    id: 'h20-always-one',
    title: '"始终有一颗 H20"模型',
    summary: '美方策略=长期放一颗"比中国好、比美国差"的卡压制国产生态——解禁/禁售都是情绪扰动，不改国产化进程。国产替代分层：推理先行、训练后补，缺口由"特供卡+灰色渠道+国产"三元填充。（2025.07.27）',
    date: '2025.07.27',
    mapNodeId: 'gpu',
    thesisId: 'compute',
  },
  {
    id: 'asic-share-erosion',
    title: 'ASIC 对 GPU 的份额侵蚀',
    summary: '定制芯片 0→1 与通用芯片 90→80 的对称运动：博通定制业务连续新增巨头客户，同期英伟达指引环比降。跟踪信号=博通每季新增客户数 vs 英伟达环比增速；国内映射=端侧定制链。（2025.03.07）',
    date: '2025.03.07',
    mapNodeId: 'gpu',
    thesisId: 'compute',
  },
  {
    id: 'storage-long-cycle-verdict',
    title: '存储：周期被 AI 加长的裁决',
    summary: '裁决（2026.09.02）：存储不再是简单的周期股——这轮周期伴随 AI 被大大加长，目前看不到衰败痕迹。需求侧三论据：AI 把生活数据全部转化为可利用数据（可穿戴/健康数据）、物理 AI 机器人（训练+实时推理）、无人驾驶；产业侧补第四论据：AI 推理对高吞吐存储的刚性需求（HDD→企业级 SSD 是长期替代而非短期缺货）。反方并置值守："价格一定是有周期的"（2026.07.26 实地调研存储厂后）——若扩产落地、价格雪崩信号出现，重审。',
    date: '2026.09.02',
    mapNodeId: 'dram',
    thesisId: 'memory-cycle',
  },
  {
    id: 'us-grid-fragility',
    title: '美国电网脆弱性=电新需求的共同源头',
    summary: '800GW 峰值负荷 vs 五年新增稳定电源仅约 70GW；变压器交期 3–4 年；数据中心用电占比 4.4%→12%。电网强弱是中美 AI 基建分水岭：中国强电网→算力就地扩张；美国弱电网→配电革命（SST）+离网电源（燃机/光伏配储），两条链都向中国产能要供给。（2025.10.17）',
    date: '2025.10.17',
    mapNodeId: 'power',
  },
  {
    id: 'storage-misjudgment-mismatch',
    title: '储能：供给侧"误判-错配"模型',
    summary: '需求侧集体误判（政策转向+补贴退坡预期）→供给零扩张→需求爆发→价格与盈利弹性爆炸。与存储的需求侧长逻辑互为镜像：一个是 AI 拉长需求，一个是误判制造错配——共同构成"能源/存力是 AI 基建第二波"。全球储能 3–5 年 50%+ 增速，板块估值约 20 倍。（2025.11.14）',
    date: '2025.11.14',
    mapNodeId: 'power',
    thesisId: 'newenergy',
  },
  {
    id: 'solid-state-sulfur-lithium',
    title: '固态电池：硫化锂=降本第一矛盾',
    summary: '路线收敛：全固态=硫化物（卤化物出局）。硫化锂 500 万/吨→20 万/吨=车端经济性临界点，其降本进度是跟踪整个固态产业化的单一参照指标。节奏：2027 补贴验收→中型消费（无人机/机器人）先行→2030 前后车端→储能最后。投资排序：硫化锂>干法/等静压设备>集流体。（2025.07.11）',
    date: '2025.07.11',
    thesisId: 'newenergy',
  },
  {
    id: 'aidc-dc-power',
    title: 'AIDC 电源直流化：HVDC 替 UPS',
    summary: '2025 年初国内招标已逆转：HVDC 与 UPS 互斥替代，电压升级 380→800V，PSU 功率密度 3kW→12kW 同尺寸（碳化硅上车）——单瓦价值量持续上行的"技术性通胀"链。逐瓦锚：柴发 0.2–0.3 元、UPS 0.5 元、HVDC 1 元、机柜内电源 2–3 元。（2025.03.14）',
    date: '2025.03.14',
    mapNodeId: 'power',
  },
  {
    id: 'commercial-insurance-reform',
    title: '商保支付端：医药基本盘变革',
    summary: '赔付率 30%→80% 的美国对标=约 8000 亿增量（医保年支出 2.5 万亿的 1/3）；丙类目录=商保报销的目录载体；配套=银行信用贷+商保净资产直投+数据要素赋能定价。2025 年医药最大的、可跟踪落地的政策主线——支付端正从单一医保走向"医保+商保"双层结构。（2025.01.19–03.26）',
    date: '2025.03.26',
    thesisId: 'innovative-drug',
  },
  {
    id: 'innovative-drug-go-global',
    title: '创新药：审批提速反成利空，出海是唯一活路',
    summary: '审批快→同类内卷→集采杀价更狠→唯一活路 license out：中国=生产者（研发占全球 26.7%）、欧美=消费者，价差红利=中国药价 1/3×汇率 7。好资产全在港股：恒生生物科技指数 +50% vs A 股 +15%（2025 年），创新药行情看港股做 A 股。（2025.03.21–07.09）',
    date: '2025.07.09',
    thesisId: 'innovative-drug',
  },
  {
    id: 'cell-therapy-zero-to-one',
    title: '细胞治疗 0→1：中美同月批首款',
    summary: '中美相隔半月各批首款 MSC 药物=商业化元年。产业链价值排序：上游存储（牌照稀缺但受出生率压制）→中游研发（三期管线）→下游渠道（医美无壁垒）。大行业 0→1 只有一次。（2025.01.19）',
    date: '2025.01.19',
    thesisId: 'innovative-drug',
  },
  {
    id: 'ai-consumer-revenue-test',
    title: 'AI+消费：收入端>成本端的报表检验',
    summary: '接大模型≠差异化。能拔估值并兑现的只有收入端扩张（引流/订单/客单），成本端降本不能。四成熟业态：AI 眼镜（150 万副→2030E 9000 万副）、AI 玩具（订阅制是利润率关键）、AI 教育、电商；概念期方向只跟踪订单验证。（2025.02.16）',
    date: '2025.02.16',
    thesisId: 'ai-app',
  },
  {
    id: 'agent-power-shift',
    title: 'Agent 的权力迁移推演',
    summary: '下一代 agent 取代的是 APP 的交互层而非 APP 本身；掌握用户触点后必然向后端服务商讨价还价或自营——渠道价值从 APP 入口迁移到 agent 入口。付费方式反过来定义产品性质：年卡赌低频，token 赌高频长时，"分润"才是长流水。（2025.02.20）',
    date: '2025.02.20',
    mapNodeId: 'app',
    thesisId: 'ai-app',
  },
  {
    id: 'new-consumption-framework',
    title: '新消费总框架：精神>功能',
    summary: '精神性消费取代功能性消费（城一代→城二代、获得感→存在感）；供给过剩时代不卷价格，造"四新"（新场景/新业态/新技术/新流量）。谷子经济 500 亿→3000 亿+；一人户占比 25.3% 的支撑下，IP 消费+情绪消费+陪伴经济是三大落点。约束条件：新消费资产几乎全在港股。（2025.01.12–03.30）',
    date: '2025.03.30',
  },
  {
    id: 'tmt-turnover-top-signal',
    title: 'TMT 成交占比>40%=见顶预警',
    summary: '历史信号：TMT 成交占比超 40% 后十几个交易日内见顶——2025.02.26 实测 46%。配套纪律：冲高减半留底仓、止盈保护 8%、连续顶背离分批跑；留 1/3 底仓吃泡沫=波段与大钱兼得。（2025.02.26）',
    date: '2025.02.26',
  },
  {
    id: 'pricing-power-four-actors',
    title: '市场定价权四主体模型',
    summary: '国家队（有定价权、有底）/公募（无增量→无定价权）/外资（对手盘）/游资（边际最活跃→电风扇之源）。判风格=判增量资金在谁手里；大票异动=动手信号，龙头调不下来=托底信号。（2025.01.04–08.01）',
    date: '2025.08.01',
  },
]
