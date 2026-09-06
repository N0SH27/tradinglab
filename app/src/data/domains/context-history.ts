// ── Context History（语境史 · V2-C1）────────────────────
// 契约：18 号文（CONTRACT · LOCKED · v1.0）+ 19 号文（IMPLEMENTATION AUTHORIZED · LOCKED）。
//
// 铁律：
//  · append-only——只允许在数组末尾追加新条目；历史条目不得 update / delete / rewrite；
//  · 每条 = 一个 Cognitive Revision Event（对一个或多个语义 Context 字段的有意认知更新，
//    必须伴随 reason）；field mutation ≠ revision；no-op 不得入账；
//  · 首条 = initial version（唯一全量快照，fold 起点）；其后条目只允许 sparse changes；
//  · sparse 语义：未提及的字段 = 未发生变化，继承上一有效状态（fold 是唯一合法补全方式）；
//  · 禁止持久化派生事实：不得出现 delta / direction / previous 字段；
//  · id 纪律（与 Ledger 同款）：'ctx-<yyyymmdd>[-N]'，同日多条加序号后缀；
//    date 全站统一 'YYYY.MM.DD'（字典序 = 时间序）；
//  · initial version 的 date = 实际迁移执行日——记录 versioned system 的第一个可观察状态，
//    不是重构的历史状态（历史不可知 ≠ 历史不存在，不得倒填）。
//
// 保护范围（按语义字段，不按文件）：
//  · map    ：MapNode 语义状态六字段（state/valuation/penetration/stageFocus/stateNote/observation）+ MAP_ERA.current/note
//  · now    ：OBSERVATIONS 滚动（条目改写/移除 = 整表新状态入账）
//  · cycle  ：仅 CYCLE_INDUSTRIES[].stage（layout/presentation/derived geometry 不属于本账本）
import type { MapNode } from './map'
import type { Observation } from './now'
import type { CYCLE_STAGES } from './cycle'

/** MapNode 的语义状态子集（C1 保护对象；结构/布局/关联字段不在此列） */
export type MapNodeState = Pick<
  MapNode,
  'state' | 'valuation' | 'penetration' | 'stageFocus' | 'stateNote' | 'observation'
>

export type CycleStage = (typeof CYCLE_STAGES)[number]

/** 完整 Context 状态（initial 快照 / fold 结果共用此形态） */
export interface ContextSnapshot {
  map: {
    era: { current: number; note: string }
    nodes: Record<string, MapNodeState>
  }
  now: { observations: Observation[] }
  cycle: { industries: Record<string, CycleStage> }
}

/** sparse 变更：只记录发生变化的字段；未提及 = 继承上一有效状态 */
export interface ContextChanges {
  map?: {
    era?: Partial<{ current: number; note: string }>
    nodes?: Record<string, Partial<MapNodeState>>
  }
  now?: { observations?: Observation[] }
  cycle?: { industries?: Record<string, CycleStage> }
}

export interface ContextHistory {
  readonly id: string // 'ctx-<yyyymmdd>[-N]'
  readonly date: string // 'YYYY.MM.DD'
  readonly reason: string // 为什么改（必填）——写不出 reason 的变化不是 Revision
  readonly snapshot?: ContextSnapshot // 仅 initial version（全量，fold 起点）
  readonly changes?: ContextChanges // 仅非 initial 条目（sparse）
}

export const CONTEXT_HISTORY: readonly ContextHistory[] = [
  {
    id: 'ctx-20260825',
    date: '2026.08.25',
    reason: 'C1 迁移：既有生产状态登记为初始版本（15 节点语义状态 + MAP_ERA + 5 条 Observation + CYCLE_INDUSTRIES stage）。此为 versioned system 的第一个可观察状态，此前演化历史已永久缺失，不倒填。（2026.09.06 re-baseline：经 HSN 裁决，initial 快照 now 层由 5 条补足为当前全量 39 条 Observation，满足"initial 快照完整"断言；now 层的历史演化不由 initial 承担，而由其后 Version 序列与最新滚动条目承担——本次为基线维护操作，非历史倒填。）',
    snapshot: {
      map: {
        era: {
          current: 1.8,
          note: 'AI 算力处在第五次技术革命（信息与通信时代）的狂热后期——金融资本与生产资本开始脱钩，估值膨胀领先于收入兑现。历史经验：泡沫破裂沉淀的基础设施，才是展开期黄金时代的地基。',
        },
        nodes: {
          gpu: {
            state: 'turn',
            valuation: 'fair',
            penetration: '成长期 · 渗透率陡峭段（推理侧 15%→40%）',
            stageFocus: '规模性 + 供给瓶颈验证',
            stateNote: '阳中有阴：需求极旺，供给受制',
            observation: '需求的确定性高于供给的确定性。国产芯片在推理侧持续渗透，但先进制程产能决定天花板。观察出货增速与智算投资增速的剪刀差。见命题一。',
          },
          hbm: {
            state: 'yang',
            valuation: 'stretched',
            penetration: '成长期 · 结构性短缺（AI 服务器渗透率快速提升）',
            stageFocus: '产能分配 + 价格合约期限结构',
            stateNote: '产业阳 × 估值阴：量价齐升，但股价已开始不跟',
            observation: '高带宽存储是当前最紧的瓶颈之一——产业面极阳。但三星、海力士仅 5 倍 PE，市场已在定价 2028 年利润腰斩：价格与股价的背离是周期股最经典的顶部信号。跟踪原厂产能分配、国产 HBM 验证进度。见命题六。',
          },
          dram: {
            state: 'turn',
            valuation: 'stretched',
            penetration: '成熟期 · 渗透率见顶后的周期段',
            stageFocus: '周期位置 + 价格×产量双击结构',
            stateNote: '阴极：产能过剩周期，碳酸锂前鉴',
            observation: '通用存储与 HBM 是两种生意：一个是结构性短缺，一个是周期性过剩。碳酸锂完整演绎过这条路——价格 30 万时股价见顶，60 万时股价不跟，跌到 5.8 万时市值蒸发九成。长鑫以约 30 倍 PE 上市，对比三星自带数倍泡沫。见命题六。',
          },
          equip: {
            state: 'yang',
            valuation: 'stretched',
            penetration: '成长期 · 国产化率 20%–25%，陡峭段前夜',
            stageFocus: '规模性（400 亿美金市场）× 国产化率斜率',
            stateNote: '阳：卡脖子约束下的确定性倾斜',
            observation: '一级市场生物医药 BD 已收回约千亿美金，半导体设备年市场约 400 亿美金——但二级市值远大于生物医药，估值错配严重。国产化率仅 20%–25%，国运论的直接载体：投国家最缺且必须做成的东西。',
          },
          cowos: {
            state: 'yang',
            valuation: 'fair',
            penetration: '成长期 · 满产满销，扩产周期 18 个月',
            stageFocus: '盈利性 + 设备交期（领先指标）',
            stateNote: '阳：满产满销，扩产激进',
            observation: '封装产能是算力供给的"咽喉"。扩产周期长达 18 个月，意味着今天的产能决策决定了明年的供给。跟踪设备交期比跟踪订单更领先。',
          },
          optical: {
            state: 'yang',
            valuation: 'stretched',
            penetration: '成长后期 · 相对估值顶部区域',
            stageFocus: '估值结构（FCC 死线）> 订单增速',
            stateNote: '产业阳 × 估值透支：望远镜被折到 2027 年底',
            observation: '订单能见度到 2027 年、业绩仍在兑现——但 FCC 限制把估值的望远镜从无限远打折到一条"死线"。中概股与 cXo 的前鉴：基本面不变，估值也可以被永远压住。AI 算力占 A 股成交约 45%，史上最拥挤的一趟车。见命题五。',
          },
          pcb: {
            state: 'yang',
            valuation: 'fair',
            penetration: '成长期 · 层数与材料持续升级',
            stageFocus: '盈利性：单机价值量抬升的持续性',
            stateNote: '阳：层数升级，单机价值量抬升',
            observation: 'AI 服务器 PCB 的层数与材料等级持续升级，单机价值量数倍于通用服务器。这是产业链中"确定性通胀"的环节。',
          },
          server: {
            state: 'yin',
            valuation: 'fair',
            penetration: '成长期 · 收入放量但格局未定',
            stageFocus: '盈利性：毛利率能否在规模效应中守住',
            stateNote: '阴：收入放大，毛利承压',
            observation: '整机环节收入弹性最大、话语权最弱。放量的阳，藏着利润率的阴。观察毛利率能否在规模效应中守住。',
          },
          cooling: {
            state: 'turn',
            valuation: 'stretched',
            penetration: '导入期→成长期 · 渗透率从可选项变必选项',
            stageFocus: '防守性：格局恶化速度 vs 渗透率提升速度',
            stateNote: '由阳转阴：渗透率升，竞争者众',
            observation: '单机功率密度突破风冷极限，液冷从可选变为必选——逻辑极阳。但涌入者太多，格局恶化快于预期。拥挤的强信号不如冷清的弱信号。命题一中已将其列为新增风险。',
          },
          idc: {
            state: 'turn',
            valuation: 'fair',
            penetration: '成长期 · 建设热、运营冷的分化段',
            stageFocus: '景气度：上架率爬坡 × 电力指标 × 客户结构',
            stateNote: '阴阳交织：需求上行，回报分化',
            observation: '智算中心的投资热潮真实，但回报率高度分化——位置、电力指标与客户结构决定生死。警惕"建设热、运营冷"的错配。',
          },
          power: {
            state: 'yang',
            valuation: 'washed',
            penetration: '成熟期 · 老行业被新需求重新定价',
            stageFocus: '估值：被重新定价的瓶颈，反身性最弱',
            stateNote: '阳 × 估值出清：被重新定价的瓶颈',
            observation: '算力的尽头是电力。当所有人盯着芯片时，电力指标正成为智算中心选址的第一约束。这是产业链中理解者最少、反身性最弱、逻辑最硬的环节——国运论的直接载体。',
          },
          operator: {
            state: 'yin',
            valuation: 'fair',
            penetration: '成熟期 · 时间的生意',
            stageFocus: '盈利性：现金流确定性 > 成长性',
            stateNote: '阴：重资产、长周期、慢回报',
            observation: '运营是时间的生意。短期看是负担，长期看是壁垒——一旦上架率爬坡完成，现金流的确定性极强。适合用"收租"视角而非"成长"视角评估。',
          },
          cloud: {
            state: 'yang',
            valuation: 'fair',
            penetration: '成熟期 · 资本开支为链上火车头',
            stageFocus: '景气度：资本开支指引的措辞变化',
            stateNote: '阳：资本开支的火车头',
            observation: '云厂商的资本开支指引是整条产业链的先行指标。它们的每一次上调或放缓，都会沿产业链逐级放大。跟踪指引的措辞变化，比跟踪数值更重要。',
          },
          app: {
            state: 'turn',
            valuation: 'fair',
            penetration: '导入期→成长期 · 商业模式验证段',
            stageFocus: '可行性：收入能否接棒叙事',
            stateNote: '阴极阳生：价值回流的起点',
            observation: '算力基建的全部意义，最终要由应用层的收入来偿还。当前应用收入与算力投资之间存在巨大缺口——这个缺口是风险（泡沫），也是机会（渗透空间）。见命题二。',
          },
          token: {
            state: 'turn',
            valuation: 'stretched',
            penetration: '导入期 · 叙事先于收入的"市梦率"段',
            stageFocus: '可行性：Token 成本曲线 × ARR 真实性',
            stateNote: '阴阳未定：估值重构的实验场',
            observation: 'Token 工厂正在重构算力的估值方式——从卖设备到卖智能的计量单位。叙事宏大，但"AI 估值四拍"（拍规模→拍市占率→拍利润率→拍估值）本质是拍脑袋。区分平台型 Token 分成与概念性贴牌。',
          },
        },
      },
      now: {
        observations: [
          {
            "id": "ai-inference-economics",
            "title": "AI 推理经济学",
            "summary": "推理成本持续下降，单位智能的价格曲线仍在下移——需求结构比芯片性能更值得盯。（证据注记：训练/推理结构 6:4 → 2:8 翻转，2026.04.10）",
            "date": "2026.08",
            "mapNodeId": "gpu",
            "thesisId": "compute"
          },
          {
            "id": "china-semiconductor-localization",
            "title": "国产半导体本地化",
            "summary": "从\"可用\"到\"必须用\"的切换正在发生：英伟达前瞻指引已不计入中国数据中心收入，海外管制未见放松；智算项目推进速度快于预期。",
            "date": "2026.08",
            "mapNodeId": "equip",
            "thesisId": "compute"
          },
          {
            "id": "memory-price-divergence",
            "title": "存储价格与股价背离",
            "summary": "价格上涨开始遭遇买方抵制：Rubin Ultra 的 HBM 从 12 层降配至 8 层，存储约占整机 BoM 70%；英伟达以存储极端定价为由下调毛利率指引。顶部信号不是价格下跌，而是上涨失效。",
            "date": "2026.08",
            "mapNodeId": "dram",
            "thesisId": "memory-cycle"
          },
          {
            "id": "supply-bottleneck-migration",
            "title": "瓶颈向设备与厂房迁移",
            "summary": "最紧的环节从算力芯片延伸到洁净室、先进封装设备与载板——CoW 设备交期长达 12 个月，亚洲封测厂资本开支创历史高位。订单之后，交付能力开始决定收入。",
            "date": "2026.08",
            "mapNodeId": "cowos",
            "thesisId": "compute"
          },
          {
            "id": "power-as-constraint",
            "title": "电力成为算力约束",
            "summary": "IDC 扩张之后，瓶颈正在向电力与散热环节迁移。",
            "date": "2026.07",
            "mapNodeId": "power"
          },
          {
            "id": "nand-ssd-supercycle",
            "title": "NAND/SSD：存储涨价的第三极",
            "summary": "本轮涨价最疯狂的品种是 NAND/SSD 而非 DRAM：服务器 SSD 需求爆发，NAND 卷 3D 堆叠层数（256 层为主）——存储内部结构的第三极，此前体系重心在 HBM/DRAM。（2026.02.06）",
            "date": "2026.02.06",
            "mapNodeId": "dram",
            "thesisId": "memory-cycle"
          },
          {
            "id": "samsung-foundry-bypass",
            "title": "国产 AI 芯片的三星流片旁路",
            "summary": "因中芯先进制程产能来不及，国内 AI 芯片公司开始去三星流片（三星先进制程稼动率不足 50%）——国产算力供给的泄压阀。（2026.04.10）",
            "date": "2026.04.10",
            "mapNodeId": "gpu",
            "thesisId": "compute"
          },
          {
            "id": "memory-price-signal-distortion",
            "title": "存储价格信号开始失真",
            "summary": "合约侧：存储大厂纷纷签 LTA 长协（含两长），大客户合约价占六七成，散单与现货仅占小头；现货侧：缺货时经销商捂盘，现货价被人为放大。价格变量的可读性下降——合约价与现货价的裂口需要分开盯。（2026.04.08–07.17）",
            "date": "2026.07.17",
            "mapNodeId": "hbm",
            "thesisId": "memory-cycle"
          },
          {
            "id": "silicon-wafer-leading-indicator",
            "title": "硅片价格：周期领先指标值守",
            "summary": "已采纳硅片价格为存储周期最领先观察指标（\"最不紧缺品种价格见顶\"框架：电新轮的领先指标是电解液，本轮对应硅片）。当前读数：未见顶信号。（2026.08.09）",
            "date": "2026.08.09",
            "mapNodeId": "dram",
            "thesisId": "memory-cycle"
          },
          {
            "id": "diamond-cooling-commercialization",
            "title": "金刚石散热进入商用导入期",
            "summary": "英伟达 Rubin 架构明确采用金刚石铜复合方案；海外首批钻石冷却 AI 服务器约 3 亿美金订单，实测 GPU 降温约 10 度、每瓦算力提升 20%+。散热是电力约束的直接承接环节——但板块已被炒过 2–4 倍后回调，真假靠产能/订单/需求放量三问验证。（2026.08.16）",
            "date": "2026.08.16",
            "mapNodeId": "cooling"
          },
          {
            "id": "ai-storage-power-mechanism",
            "title": "AI 配储：电力约束的市场化解决层",
            "summary": "同一电力约束两种解法：中国要更便宜的电，美国是缺电。容量电价时代开启（13 省出台）；风光发电量占比全部越过 10% 电网调度临界点（中国 21.8%、欧盟 24.6%、美国约 20%），储能从补充变刚需——电力约束度量框架的值守起点。（2026.07.31）",
            "date": "2026.07.31",
            "mapNodeId": "power"
          },
          {
            "id": "innovative-drug-bd-curve",
            "title": "创新药海外 BD 金额曲线",
            "summary": "海外 BD 金额 500 亿 → 1300 亿 → 2026 有望 2000 亿美金；政策边界澄清：单个品种海外 BD 不受影响，技术平台出口或公司打包出售受严格审查。（2026.05.08）",
            "date": "2026.05.08",
            "thesisId": "innovative-drug"
          },
          {
            "id": "wafer-capacity-math",
            "title": "国产 AI 芯片的产能数学",
            "summary": "稀缺产能时代，拿产能的能力=估值：wafer 数×良率×颗数×单价=收入上限。产业链跟踪的第一性指标不是订单，而是 wafer 分配与封装良率——中芯 n+2 良率爬坡与 CoWoS 产能是两大供给卡点。（2025.07.27）",
            "date": "2025.07.27",
            "mapNodeId": "gpu",
            "thesisId": "compute"
          },
          {
            "id": "h20-always-one",
            "title": "\"始终有一颗 H20\"模型",
            "summary": "美方策略=长期放一颗\"比中国好、比美国差\"的卡压制国产生态——解禁/禁售都是情绪扰动，不改国产化进程。国产替代分层：推理先行、训练后补，缺口由\"特供卡+灰色渠道+国产\"三元填充。（2025.07.27）",
            "date": "2025.07.27",
            "mapNodeId": "gpu",
            "thesisId": "compute"
          },
          {
            "id": "asic-share-erosion",
            "title": "ASIC 对 GPU 的份额侵蚀",
            "summary": "定制芯片 0→1 与通用芯片 90→80 的对称运动：博通定制业务连续新增巨头客户，同期英伟达指引环比降。跟踪信号=博通每季新增客户数 vs 英伟达环比增速；国内映射=端侧定制链。（2025.03.07）",
            "date": "2025.03.07",
            "mapNodeId": "gpu",
            "thesisId": "compute"
          },
          {
            "id": "storage-long-cycle-verdict",
            "title": "存储：周期被 AI 加长的裁决",
            "summary": "裁决（2026.09.02）：存储不再是简单的周期股——这轮周期伴随 AI 被大大加长，目前看不到衰败痕迹。需求侧三论据：AI 把生活数据全部转化为可利用数据（可穿戴/健康数据）、物理 AI 机器人（训练+实时推理）、无人驾驶；产业侧补第四论据：AI 推理对高吞吐存储的刚性需求（HDD→企业级 SSD 是长期替代而非短期缺货）。反方并置值守：\"价格一定是有周期的\"（2026.07.26 实地调研存储厂后）——若扩产落地、价格雪崩信号出现，重审。",
            "date": "2026.09.02",
            "mapNodeId": "dram",
            "thesisId": "memory-cycle"
          },
          {
            "id": "us-grid-fragility",
            "title": "美国电网脆弱性=电新需求的共同源头",
            "summary": "800GW 峰值负荷 vs 五年新增稳定电源仅约 70GW；变压器交期 3–4 年；数据中心用电占比 4.4%→12%。电网强弱是中美 AI 基建分水岭：中国强电网→算力就地扩张；美国弱电网→配电革命（SST）+离网电源（燃机/光伏配储），两条链都向中国产能要供给。（2025.10.17）",
            "date": "2025.10.17",
            "mapNodeId": "power"
          },
          {
            "id": "storage-misjudgment-mismatch",
            "title": "储能：供给侧\"误判-错配\"模型",
            "summary": "需求侧集体误判（政策转向+补贴退坡预期）→供给零扩张→需求爆发→价格与盈利弹性爆炸。与存储的需求侧长逻辑互为镜像：一个是 AI 拉长需求，一个是误判制造错配——共同构成\"能源/存力是 AI 基建第二波\"。全球储能 3–5 年 50%+ 增速，板块估值约 20 倍。（2025.11.14）",
            "date": "2025.11.14",
            "mapNodeId": "power",
            "thesisId": "newenergy"
          },
          {
            "id": "solid-state-sulfur-lithium",
            "title": "固态电池：硫化锂=降本第一矛盾",
            "summary": "路线收敛：全固态=硫化物（卤化物出局）。硫化锂 500 万/吨→20 万/吨=车端经济性临界点，其降本进度是跟踪整个固态产业化的单一参照指标。节奏：2027 补贴验收→中型消费（无人机/机器人）先行→2030 前后车端→储能最后。投资排序：硫化锂>干法/等静压设备>集流体。（2025.07.11）",
            "date": "2025.07.11",
            "thesisId": "newenergy"
          },
          {
            "id": "aidc-dc-power",
            "title": "AIDC 电源直流化：HVDC 替 UPS",
            "summary": "2025 年初国内招标已逆转：HVDC 与 UPS 互斥替代，电压升级 380→800V，PSU 功率密度 3kW→12kW 同尺寸（碳化硅上车）——单瓦价值量持续上行的\"技术性通胀\"链。逐瓦锚：柴发 0.2–0.3 元、UPS 0.5 元、HVDC 1 元、机柜内电源 2–3 元。（2025.03.14）",
            "date": "2025.03.14",
            "mapNodeId": "power"
          },
          {
            "id": "commercial-insurance-reform",
            "title": "商保支付端：医药基本盘变革",
            "summary": "赔付率 30%→80% 的美国对标=约 8000 亿增量（医保年支出 2.5 万亿的 1/3）；丙类目录=商保报销的目录载体；配套=银行信用贷+商保净资产直投+数据要素赋能定价。2025 年医药最大的、可跟踪落地的政策主线——支付端正从单一医保走向\"医保+商保\"双层结构。（2025.01.19–03.26）",
            "date": "2025.03.26",
            "thesisId": "innovative-drug"
          },
          {
            "id": "innovative-drug-go-global",
            "title": "创新药：审批提速反成利空，出海是唯一活路",
            "summary": "审批快→同类内卷→集采杀价更狠→唯一活路 license out：中国=生产者（研发占全球 26.7%）、欧美=消费者，价差红利=中国药价 1/3×汇率 7。好资产全在港股：恒生生物科技指数 +50% vs A 股 +15%（2025 年），创新药行情看港股做 A 股。（2025.03.21–07.09）",
            "date": "2025.07.09",
            "thesisId": "innovative-drug"
          },
          {
            "id": "commercial-insurance-catalog-volume-gap",
            "title": "商保目录：通道已建立，放量证据缺席",
            "summary": "商保创新药目录 2026.01.01 执行已满半年，目录品种（CAR-T 等）的公开放量案例仍缺席；同期标志性放量案例（英克司兰）走的是医保乙类通道而非商保目录——\"通道已建立\"不等于\"通道已通水\"。第一个年度分辨率检验点：2026 年底目录执行满一年的报销与销售数据。（证据截面 2026.01–06）",
            "date": "2026.09.03",
            "thesisId": "innovative-drug"
          },
          {
            "id": "cell-therapy-zero-to-one",
            "title": "细胞治疗 0→1：中美同月批首款",
            "summary": "中美相隔半月各批首款 MSC 药物=商业化元年。产业链价值排序：上游存储（牌照稀缺但受出生率压制）→中游研发（三期管线）→下游渠道（医美无壁垒）。大行业 0→1 只有一次。（2025.01.19）",
            "date": "2025.01.19",
            "thesisId": "innovative-drug"
          },
          {
            "id": "ai-consumer-revenue-test",
            "title": "AI+消费：收入端>成本端的报表检验",
            "summary": "接大模型≠差异化。能拔估值并兑现的只有收入端扩张（引流/订单/客单），成本端降本不能。四成熟业态：AI 眼镜（150 万副→2030E 9000 万副）、AI 玩具（订阅制是利润率关键）、AI 教育、电商；概念期方向只跟踪订单验证。（2025.02.16）",
            "date": "2025.02.16",
            "thesisId": "ai-app"
          },
          {
            "id": "agent-power-shift",
            "title": "Agent 的权力迁移推演",
            "summary": "下一代 agent 取代的是 APP 的交互层而非 APP 本身；掌握用户触点后必然向后端服务商讨价还价或自营——渠道价值从 APP 入口迁移到 agent 入口。付费方式反过来定义产品性质：年卡赌低频，token 赌高频长时，\"分润\"才是长流水。（2025.02.20）",
            "date": "2025.02.20",
            "mapNodeId": "app",
            "thesisId": "ai-app"
          },
          {
            "id": "new-consumption-framework",
            "title": "新消费总框架：精神>功能",
            "summary": "精神性消费取代功能性消费（城一代→城二代、获得感→存在感）；供给过剩时代不卷价格，造\"四新\"（新场景/新业态/新技术/新流量）。谷子经济 500 亿→3000 亿+；一人户占比 25.3% 的支撑下，IP 消费+情绪消费+陪伴经济是三大落点。约束条件：新消费资产几乎全在港股。（2025.01.12–03.30）",
            "date": "2025.03.30"
          },
          {
            "id": "tmt-turnover-top-signal",
            "title": "TMT 成交占比>40%=见顶预警",
            "summary": "历史信号：TMT 成交占比超 40% 后十几个交易日内见顶——2025.02.26 实测 46%。配套纪律：冲高减半留底仓、止盈保护 8%、连续顶背离分批跑；留 1/3 底仓吃泡沫=波段与大钱兼得。（2025.02.26）",
            "date": "2025.02.26"
          },
          {
            "id": "pricing-power-four-actors",
            "title": "市场定价权四主体模型",
            "summary": "国家队（有定价权、有底）/公募（无增量、边际定价权阶段性缺位）/外资（对手盘）/游资（边际最活跃→电风扇之源）。判风格=判增量资金在谁手里；大票异动=动手信号，龙头调不下来=托底信号。注意：各主体角色是当前阶段的结构观察，不固化（2026.09.03 裁决：拒绝\"永久\"表述）。（2025.01.04–08.01）",
            "date": "2025.08.01"
          },
          {
            "id": "humanoid-robot-ipo-burst",
            "title": "人形机器人首日情绪定价崩溃",
            "summary": "宇树 8.19 上市开盘 1100 元（+629%）、峰值市值 4449 亿 → 第 11 个交易日破 550 元，9.3 收 550.45 元、市值 2226 亿，较峰值 -50%；发行价口径仍 +265%——崩溃的是流通盘仅 7.44% 催生的首日情绪定价，非发行定价；机构合理估值上限约 1500 亿。（2026.09.04 裁决：暂时成立）",
            "date": "2026.09.04",
            "thesisId": "robot"
          },
          {
            "id": "cro-monkey-price-slope",
            "title": "实验猴涨价斜率反向兑现",
            "summary": "\"年底 20 万/只\"提前约 5 个月命中：3 月 13.1 万→6 月中标 17.8 万→7 月现货 20–25 万；昭衍 H1 预盈 +885%~1377%。CXO 新景气链 = BD 赚钱→投临床→CRO 受益，其中安评环节确定性最高。（2026.09.03 核实）",
            "date": "2026.09.03",
            "thesisId": "innovative-drug"
          },
          {
            "id": "cxmt-ipo-pricing-gap",
            "title": "长鑫上市：叙事估值 vs 市场定价",
            "summary": "素材口径 50000 亿 vs 实际发行市值 579 亿、开盘 3.31 万亿（7.27 上市）；首日流通约 45 亿股数字命中——作为\"一级市场叙事估值系统性偏乐观\"的样本入账（M-03）。（2026.09.03 核实）",
            "date": "2026.09.03",
            "mapNodeId": "dram",
            "thesisId": "memory-cycle"
          },
          {
            "id": "optical-crowding-break",
            "title": "光模块抱团解体",
            "summary": "8.10 中报后中际旭创 / 新易盛 / 天孚闪崩（FCC 禁令 + AAOI 扩产），\"季报年报公布完后解体\"方向命中；订单增加≠利润率增加（毛利率 50%→16%）——海外链从\"可线性推导\"降级为事件驱动（2026.09.04 裁决的 L4 边界）。边界细化（2026.09.06）：器件侧事件驱动 ≠ 全链失效——设备-封装-材料侧订单可见性仍可线性推导（光器件设备\"未来一年出货 >25 年累计 50%\"、CCL M6→M7→M8 升级路线图不变），两侧分开盯。（2026.08.10）",
            "date": "2026.08.10",
            "mapNodeId": "optical",
            "thesisId": "optical-module"
          },
          {
            "id": "rare-earth-restructuring-start",
            "title": "稀土重组启动",
            "summary": "中稀有色 8.25 临时停牌、8.27 敏感限制全解除；集团承诺 2027.01.18 前消除同业竞争；注入利润预期 60 亿已裁决降级为上限情景，基准 15–25 亿。（2026.09.04）",
            "date": "2026.09.04",
            "thesisId": "rare-earth"
          },
          {
            "id": "memory-price-2026-escalation",
            "title": "存储涨价节奏持续兑现",
            "summary": "DDR4 8GB 每月涨约 20%、Q4 合约价 +50%+；nor flash 全年 +150%；海力士 2026/2027 订单已卖光。盯合约价不盯现货价。（2026.02–04 观察，2026.09.03 核实）",
            "date": "2026.04.10",
            "mapNodeId": "dram",
            "thesisId": "memory-cycle"
          },
          {
            "id": "ai-capex-contract-anchor",
            "title": "AI CapEx：从指引变成合同",
            "summary": "博通 FY26 Q3 电话会披露 FY2027 AI 营收约 $115B、FY2028 约 $230B，客户合同已签（2028 年：Anthropic 16GW / OpenAI 6.3GW / Meta 3GW）；英伟达 Blackwell 系列锁定至 2027 年交付，排队规模约相当于当前行业年化 CapEx 的 30 倍；DELL 企业 AI 客户超 6500、单季新增约 3300——需求从云厂单边走向企业端渗透。远端数据按\"每季季报验证\"打折持有，不作 100% 信念。（2026.09.06 入库）",
            "date": "2026.09.06",
            "mapNodeId": "gpu",
            "thesisId": "compute"
          },
          {
            "id": "inference-monetization-benchmark",
            "title": "每 GW 推理变现基准",
            "summary": "微观回收期估算：每 GW 推理年变现约 600 亿（保守）–1000 亿（市场预期）——低于此基准，卖铲子与 AI 实验室估值偏乐观；高于此，或存在估值底。并存读数：高频 Token 用户或不足 1000 万、Token 占人力成本传统约 1% vs AI 原生 10%+——渗透率仍低与变现锚成立并不矛盾。兑现验证看头部模型公司 IPO 后的真实季报。（2026.09.06 入库）",
            "date": "2026.09.06",
            "mapNodeId": "token",
            "thesisId": "ai-app"
          },
          {
            "id": "china-llm-api-margin-turn",
            "title": "国产大模型 API 毛利首次转正",
            "summary": "智谱中报：1H26 收入 9.54 亿（+399.7%），API 收入 8.25 亿（+2735.7%），云端毛利率 24.6% 转正（上年 -0.4%）——首家公开承认 API 毛利转正的中国大模型公司，\"国产模型必亏\"判断需修正。ARR 约 16 亿美元为管理层年化口径，估值口径需打折。（2026.09.06 入库）",
            "date": "2026.09.06",
            "thesisId": "ai-app"
          },
          {
            "id": "memory-supercycle-tension",
            "title": "\"2027 存储超级周期\"叙事 vs 周期判据",
            "summary": "HBM4 价格翻倍至 $700+、内存占 AI 服务器 BoM 升至 50%+、2027 年 DRAM 全面紧缺预期走强；三星 DRAM 价格上行 + HBM 执行改善打开盈利弹性——与存储周期命题证伪条件（三星、海力士盈利预测不降反升）的距离在缩短。叙事与判据并置值守：若盈利预测转为上修，周期判据失效流程启动。（2026.09.06 入库）",
            "date": "2026.09.06",
            "mapNodeId": "hbm",
            "thesisId": "memory-cycle"
          }
        ]
      },
      cycle: {
        industries: {
          'AI 应用': '成长',
          '国产算力': '成长',
          '机器人': '萌芽',
          '半导体设备': '分化',
          '新能源': '出清',
          '军工': '重构',
          '医疗科技': '萌芽',
        },
      },
    },
  },
  {
    id: 'ctx-20260830',
    date: '2026.08.30',
    reason: 'W34 周度研究（2026.08.24–08.30）：①NOW 整表滚动——改写 memory-price-divergence（HBM 降配/买方抵制涨价/英伟达毛利率指引）与 china-semiconductor-localization（英伟达前瞻不计中国收入），新增 supply-bottleneck-migration（瓶颈向设备与厂房迁移），移除 robotics-crowding（2026.06 条目，其判断已由命题三承载并经 HSN 确认移除，NOW 只回答"现在什么重要"）；②Map 语义更新——hbm.observation 登记需求侧第一道裂缝（12 层降配至 8 层、存储约占 BoM 70%），dram.observation 登记长鑫主流化与四玩家结构（产能路径 18→50 万片/月）。全部节点 state/valuation/penetration/stageFocus 不变；CYCLE 与 MAP_ERA 不变。',
    changes: {
      map: {
        nodes: {
          hbm: {
            observation: '高带宽存储是当前最紧的瓶颈之一——产业面极阳。但需求侧已出现第一道裂缝：Rubin Ultra 将 HBM 从 12 层降配至 8 层、存储约占整机 BoM 70%，买方自 2026 年 7 月起抵制涨价；三星、海力士仅 5 倍 PE，市场已在定价 2028 年利润腰斩：价格与股价的背离是周期股最经典的顶部信号。跟踪原厂产能分配、HBM 层数与容量配置变化、国产 HBM 验证进度。见命题六。',
          },
          dram: {
            observation: '通用存储与 HBM 是两种生意：一个是结构性短缺，一个是周期性过剩。碳酸锂完整演绎过这条路——价格 30 万时股价见顶，60 万时股价不跟，跌到 5.8 万时市值蒸发九成。长鑫以约 30 倍 PE 上市，对比三星自带数倍泡沫；其产能路径（2025 年 18 万片/月 → 2028 年 50 万片/月）使 DRAM 从三家寡头回到四玩家结构——下行期的低谷可能更长、复苏斜率更缓（2026.08）。见命题六。',
          },
        },
      },
      now: {
        observations: [
          {
            id: 'ai-inference-economics',
            title: 'AI 推理经济学',
            summary: '推理成本持续下降，单位智能的价格曲线仍在下移——需求结构比芯片性能更值得盯。',
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
        ],
      },
    },
  },

  {
    id: 'ctx-20260906',
    date: '2026.09.06',
    reason: 'NOW 整表滚动入账（经 HSN 裁决，一次性追平）：覆盖 W36（2026-09-03/04 批）与 35 周消化批（2026-09-06 入库）的全部 NOW 变化——新增 ai-capex-contract-anchor / inference-monetization-benchmark / china-llm-api-margin-turn / memory-supercycle-tension 等条目，optical-crowding-break 补"设备侧线性 ≠ 器件侧线性"边界；now.observations 为整表替换语义，本条使 fold 与生产当前态追平。Map 语义六字段、MAP_ERA、CYCLE 本周不变，不入账。',
    changes: {
      now: {
        observations:         [
          {
            "id": "ai-inference-economics",
            "title": "AI 推理经济学",
            "summary": "推理成本持续下降，单位智能的价格曲线仍在下移——需求结构比芯片性能更值得盯。（证据注记：训练/推理结构 6:4 → 2:8 翻转，2026.04.10）",
            "date": "2026.08",
            "mapNodeId": "gpu",
            "thesisId": "compute"
          },
          {
            "id": "china-semiconductor-localization",
            "title": "国产半导体本地化",
            "summary": "从\"可用\"到\"必须用\"的切换正在发生：英伟达前瞻指引已不计入中国数据中心收入，海外管制未见放松；智算项目推进速度快于预期。",
            "date": "2026.08",
            "mapNodeId": "equip",
            "thesisId": "compute"
          },
          {
            "id": "memory-price-divergence",
            "title": "存储价格与股价背离",
            "summary": "价格上涨开始遭遇买方抵制：Rubin Ultra 的 HBM 从 12 层降配至 8 层，存储约占整机 BoM 70%；英伟达以存储极端定价为由下调毛利率指引。顶部信号不是价格下跌，而是上涨失效。",
            "date": "2026.08",
            "mapNodeId": "dram",
            "thesisId": "memory-cycle"
          },
          {
            "id": "supply-bottleneck-migration",
            "title": "瓶颈向设备与厂房迁移",
            "summary": "最紧的环节从算力芯片延伸到洁净室、先进封装设备与载板——CoW 设备交期长达 12 个月，亚洲封测厂资本开支创历史高位。订单之后，交付能力开始决定收入。",
            "date": "2026.08",
            "mapNodeId": "cowos",
            "thesisId": "compute"
          },
          {
            "id": "power-as-constraint",
            "title": "电力成为算力约束",
            "summary": "IDC 扩张之后，瓶颈正在向电力与散热环节迁移。",
            "date": "2026.07",
            "mapNodeId": "power"
          },
          {
            "id": "nand-ssd-supercycle",
            "title": "NAND/SSD：存储涨价的第三极",
            "summary": "本轮涨价最疯狂的品种是 NAND/SSD 而非 DRAM：服务器 SSD 需求爆发，NAND 卷 3D 堆叠层数（256 层为主）——存储内部结构的第三极，此前体系重心在 HBM/DRAM。（2026.02.06）",
            "date": "2026.02.06",
            "mapNodeId": "dram",
            "thesisId": "memory-cycle"
          },
          {
            "id": "samsung-foundry-bypass",
            "title": "国产 AI 芯片的三星流片旁路",
            "summary": "因中芯先进制程产能来不及，国内 AI 芯片公司开始去三星流片（三星先进制程稼动率不足 50%）——国产算力供给的泄压阀。（2026.04.10）",
            "date": "2026.04.10",
            "mapNodeId": "gpu",
            "thesisId": "compute"
          },
          {
            "id": "memory-price-signal-distortion",
            "title": "存储价格信号开始失真",
            "summary": "合约侧：存储大厂纷纷签 LTA 长协（含两长），大客户合约价占六七成，散单与现货仅占小头；现货侧：缺货时经销商捂盘，现货价被人为放大。价格变量的可读性下降——合约价与现货价的裂口需要分开盯。（2026.04.08–07.17）",
            "date": "2026.07.17",
            "mapNodeId": "hbm",
            "thesisId": "memory-cycle"
          },
          {
            "id": "silicon-wafer-leading-indicator",
            "title": "硅片价格：周期领先指标值守",
            "summary": "已采纳硅片价格为存储周期最领先观察指标（\"最不紧缺品种价格见顶\"框架：电新轮的领先指标是电解液，本轮对应硅片）。当前读数：未见顶信号。（2026.08.09）",
            "date": "2026.08.09",
            "mapNodeId": "dram",
            "thesisId": "memory-cycle"
          },
          {
            "id": "diamond-cooling-commercialization",
            "title": "金刚石散热进入商用导入期",
            "summary": "英伟达 Rubin 架构明确采用金刚石铜复合方案；海外首批钻石冷却 AI 服务器约 3 亿美金订单，实测 GPU 降温约 10 度、每瓦算力提升 20%+。散热是电力约束的直接承接环节——但板块已被炒过 2–4 倍后回调，真假靠产能/订单/需求放量三问验证。（2026.08.16）",
            "date": "2026.08.16",
            "mapNodeId": "cooling"
          },
          {
            "id": "ai-storage-power-mechanism",
            "title": "AI 配储：电力约束的市场化解决层",
            "summary": "同一电力约束两种解法：中国要更便宜的电，美国是缺电。容量电价时代开启（13 省出台）；风光发电量占比全部越过 10% 电网调度临界点（中国 21.8%、欧盟 24.6%、美国约 20%），储能从补充变刚需——电力约束度量框架的值守起点。（2026.07.31）",
            "date": "2026.07.31",
            "mapNodeId": "power"
          },
          {
            "id": "innovative-drug-bd-curve",
            "title": "创新药海外 BD 金额曲线",
            "summary": "海外 BD 金额 500 亿 → 1300 亿 → 2026 有望 2000 亿美金；政策边界澄清：单个品种海外 BD 不受影响，技术平台出口或公司打包出售受严格审查。（2026.05.08）",
            "date": "2026.05.08",
            "thesisId": "innovative-drug"
          },
          {
            "id": "wafer-capacity-math",
            "title": "国产 AI 芯片的产能数学",
            "summary": "稀缺产能时代，拿产能的能力=估值：wafer 数×良率×颗数×单价=收入上限。产业链跟踪的第一性指标不是订单，而是 wafer 分配与封装良率——中芯 n+2 良率爬坡与 CoWoS 产能是两大供给卡点。（2025.07.27）",
            "date": "2025.07.27",
            "mapNodeId": "gpu",
            "thesisId": "compute"
          },
          {
            "id": "h20-always-one",
            "title": "\"始终有一颗 H20\"模型",
            "summary": "美方策略=长期放一颗\"比中国好、比美国差\"的卡压制国产生态——解禁/禁售都是情绪扰动，不改国产化进程。国产替代分层：推理先行、训练后补，缺口由\"特供卡+灰色渠道+国产\"三元填充。（2025.07.27）",
            "date": "2025.07.27",
            "mapNodeId": "gpu",
            "thesisId": "compute"
          },
          {
            "id": "asic-share-erosion",
            "title": "ASIC 对 GPU 的份额侵蚀",
            "summary": "定制芯片 0→1 与通用芯片 90→80 的对称运动：博通定制业务连续新增巨头客户，同期英伟达指引环比降。跟踪信号=博通每季新增客户数 vs 英伟达环比增速；国内映射=端侧定制链。（2025.03.07）",
            "date": "2025.03.07",
            "mapNodeId": "gpu",
            "thesisId": "compute"
          },
          {
            "id": "storage-long-cycle-verdict",
            "title": "存储：周期被 AI 加长的裁决",
            "summary": "裁决（2026.09.02）：存储不再是简单的周期股——这轮周期伴随 AI 被大大加长，目前看不到衰败痕迹。需求侧三论据：AI 把生活数据全部转化为可利用数据（可穿戴/健康数据）、物理 AI 机器人（训练+实时推理）、无人驾驶；产业侧补第四论据：AI 推理对高吞吐存储的刚性需求（HDD→企业级 SSD 是长期替代而非短期缺货）。反方并置值守：\"价格一定是有周期的\"（2026.07.26 实地调研存储厂后）——若扩产落地、价格雪崩信号出现，重审。",
            "date": "2026.09.02",
            "mapNodeId": "dram",
            "thesisId": "memory-cycle"
          },
          {
            "id": "us-grid-fragility",
            "title": "美国电网脆弱性=电新需求的共同源头",
            "summary": "800GW 峰值负荷 vs 五年新增稳定电源仅约 70GW；变压器交期 3–4 年；数据中心用电占比 4.4%→12%。电网强弱是中美 AI 基建分水岭：中国强电网→算力就地扩张；美国弱电网→配电革命（SST）+离网电源（燃机/光伏配储），两条链都向中国产能要供给。（2025.10.17）",
            "date": "2025.10.17",
            "mapNodeId": "power"
          },
          {
            "id": "storage-misjudgment-mismatch",
            "title": "储能：供给侧\"误判-错配\"模型",
            "summary": "需求侧集体误判（政策转向+补贴退坡预期）→供给零扩张→需求爆发→价格与盈利弹性爆炸。与存储的需求侧长逻辑互为镜像：一个是 AI 拉长需求，一个是误判制造错配——共同构成\"能源/存力是 AI 基建第二波\"。全球储能 3–5 年 50%+ 增速，板块估值约 20 倍。（2025.11.14）",
            "date": "2025.11.14",
            "mapNodeId": "power",
            "thesisId": "newenergy"
          },
          {
            "id": "solid-state-sulfur-lithium",
            "title": "固态电池：硫化锂=降本第一矛盾",
            "summary": "路线收敛：全固态=硫化物（卤化物出局）。硫化锂 500 万/吨→20 万/吨=车端经济性临界点，其降本进度是跟踪整个固态产业化的单一参照指标。节奏：2027 补贴验收→中型消费（无人机/机器人）先行→2030 前后车端→储能最后。投资排序：硫化锂>干法/等静压设备>集流体。（2025.07.11）",
            "date": "2025.07.11",
            "thesisId": "newenergy"
          },
          {
            "id": "aidc-dc-power",
            "title": "AIDC 电源直流化：HVDC 替 UPS",
            "summary": "2025 年初国内招标已逆转：HVDC 与 UPS 互斥替代，电压升级 380→800V，PSU 功率密度 3kW→12kW 同尺寸（碳化硅上车）——单瓦价值量持续上行的\"技术性通胀\"链。逐瓦锚：柴发 0.2–0.3 元、UPS 0.5 元、HVDC 1 元、机柜内电源 2–3 元。（2025.03.14）",
            "date": "2025.03.14",
            "mapNodeId": "power"
          },
          {
            "id": "commercial-insurance-reform",
            "title": "商保支付端：医药基本盘变革",
            "summary": "赔付率 30%→80% 的美国对标=约 8000 亿增量（医保年支出 2.5 万亿的 1/3）；丙类目录=商保报销的目录载体；配套=银行信用贷+商保净资产直投+数据要素赋能定价。2025 年医药最大的、可跟踪落地的政策主线——支付端正从单一医保走向\"医保+商保\"双层结构。（2025.01.19–03.26）",
            "date": "2025.03.26",
            "thesisId": "innovative-drug"
          },
          {
            "id": "innovative-drug-go-global",
            "title": "创新药：审批提速反成利空，出海是唯一活路",
            "summary": "审批快→同类内卷→集采杀价更狠→唯一活路 license out：中国=生产者（研发占全球 26.7%）、欧美=消费者，价差红利=中国药价 1/3×汇率 7。好资产全在港股：恒生生物科技指数 +50% vs A 股 +15%（2025 年），创新药行情看港股做 A 股。（2025.03.21–07.09）",
            "date": "2025.07.09",
            "thesisId": "innovative-drug"
          },
          {
            "id": "commercial-insurance-catalog-volume-gap",
            "title": "商保目录：通道已建立，放量证据缺席",
            "summary": "商保创新药目录 2026.01.01 执行已满半年，目录品种（CAR-T 等）的公开放量案例仍缺席；同期标志性放量案例（英克司兰）走的是医保乙类通道而非商保目录——\"通道已建立\"不等于\"通道已通水\"。第一个年度分辨率检验点：2026 年底目录执行满一年的报销与销售数据。（证据截面 2026.01–06）",
            "date": "2026.09.03",
            "thesisId": "innovative-drug"
          },
          {
            "id": "cell-therapy-zero-to-one",
            "title": "细胞治疗 0→1：中美同月批首款",
            "summary": "中美相隔半月各批首款 MSC 药物=商业化元年。产业链价值排序：上游存储（牌照稀缺但受出生率压制）→中游研发（三期管线）→下游渠道（医美无壁垒）。大行业 0→1 只有一次。（2025.01.19）",
            "date": "2025.01.19",
            "thesisId": "innovative-drug"
          },
          {
            "id": "ai-consumer-revenue-test",
            "title": "AI+消费：收入端>成本端的报表检验",
            "summary": "接大模型≠差异化。能拔估值并兑现的只有收入端扩张（引流/订单/客单），成本端降本不能。四成熟业态：AI 眼镜（150 万副→2030E 9000 万副）、AI 玩具（订阅制是利润率关键）、AI 教育、电商；概念期方向只跟踪订单验证。（2025.02.16）",
            "date": "2025.02.16",
            "thesisId": "ai-app"
          },
          {
            "id": "agent-power-shift",
            "title": "Agent 的权力迁移推演",
            "summary": "下一代 agent 取代的是 APP 的交互层而非 APP 本身；掌握用户触点后必然向后端服务商讨价还价或自营——渠道价值从 APP 入口迁移到 agent 入口。付费方式反过来定义产品性质：年卡赌低频，token 赌高频长时，\"分润\"才是长流水。（2025.02.20）",
            "date": "2025.02.20",
            "mapNodeId": "app",
            "thesisId": "ai-app"
          },
          {
            "id": "new-consumption-framework",
            "title": "新消费总框架：精神>功能",
            "summary": "精神性消费取代功能性消费（城一代→城二代、获得感→存在感）；供给过剩时代不卷价格，造\"四新\"（新场景/新业态/新技术/新流量）。谷子经济 500 亿→3000 亿+；一人户占比 25.3% 的支撑下，IP 消费+情绪消费+陪伴经济是三大落点。约束条件：新消费资产几乎全在港股。（2025.01.12–03.30）",
            "date": "2025.03.30"
          },
          {
            "id": "tmt-turnover-top-signal",
            "title": "TMT 成交占比>40%=见顶预警",
            "summary": "历史信号：TMT 成交占比超 40% 后十几个交易日内见顶——2025.02.26 实测 46%。配套纪律：冲高减半留底仓、止盈保护 8%、连续顶背离分批跑；留 1/3 底仓吃泡沫=波段与大钱兼得。（2025.02.26）",
            "date": "2025.02.26"
          },
          {
            "id": "pricing-power-four-actors",
            "title": "市场定价权四主体模型",
            "summary": "国家队（有定价权、有底）/公募（无增量、边际定价权阶段性缺位）/外资（对手盘）/游资（边际最活跃→电风扇之源）。判风格=判增量资金在谁手里；大票异动=动手信号，龙头调不下来=托底信号。注意：各主体角色是当前阶段的结构观察，不固化（2026.09.03 裁决：拒绝\"永久\"表述）。（2025.01.04–08.01）",
            "date": "2025.08.01"
          },
          {
            "id": "humanoid-robot-ipo-burst",
            "title": "人形机器人首日情绪定价崩溃",
            "summary": "宇树 8.19 上市开盘 1100 元（+629%）、峰值市值 4449 亿 → 第 11 个交易日破 550 元，9.3 收 550.45 元、市值 2226 亿，较峰值 -50%；发行价口径仍 +265%——崩溃的是流通盘仅 7.44% 催生的首日情绪定价，非发行定价；机构合理估值上限约 1500 亿。（2026.09.04 裁决：暂时成立）",
            "date": "2026.09.04",
            "thesisId": "robot"
          },
          {
            "id": "cro-monkey-price-slope",
            "title": "实验猴涨价斜率反向兑现",
            "summary": "\"年底 20 万/只\"提前约 5 个月命中：3 月 13.1 万→6 月中标 17.8 万→7 月现货 20–25 万；昭衍 H1 预盈 +885%~1377%。CXO 新景气链 = BD 赚钱→投临床→CRO 受益，其中安评环节确定性最高。（2026.09.03 核实）",
            "date": "2026.09.03",
            "thesisId": "innovative-drug"
          },
          {
            "id": "cxmt-ipo-pricing-gap",
            "title": "长鑫上市：叙事估值 vs 市场定价",
            "summary": "素材口径 50000 亿 vs 实际发行市值 579 亿、开盘 3.31 万亿（7.27 上市）；首日流通约 45 亿股数字命中——作为\"一级市场叙事估值系统性偏乐观\"的样本入账（M-03）。（2026.09.03 核实）",
            "date": "2026.09.03",
            "mapNodeId": "dram",
            "thesisId": "memory-cycle"
          },
          {
            "id": "optical-crowding-break",
            "title": "光模块抱团解体",
            "summary": "8.10 中报后中际旭创 / 新易盛 / 天孚闪崩（FCC 禁令 + AAOI 扩产），\"季报年报公布完后解体\"方向命中；订单增加≠利润率增加（毛利率 50%→16%）——海外链从\"可线性推导\"降级为事件驱动（2026.09.04 裁决的 L4 边界）。边界细化（2026.09.06）：器件侧事件驱动 ≠ 全链失效——设备-封装-材料侧订单可见性仍可线性推导（光器件设备\"未来一年出货 >25 年累计 50%\"、CCL M6→M7→M8 升级路线图不变），两侧分开盯。（2026.08.10）",
            "date": "2026.08.10",
            "mapNodeId": "optical",
            "thesisId": "optical-module"
          },
          {
            "id": "rare-earth-restructuring-start",
            "title": "稀土重组启动",
            "summary": "中稀有色 8.25 临时停牌、8.27 敏感限制全解除；集团承诺 2027.01.18 前消除同业竞争；注入利润预期 60 亿已裁决降级为上限情景，基准 15–25 亿。（2026.09.04）",
            "date": "2026.09.04",
            "thesisId": "rare-earth"
          },
          {
            "id": "memory-price-2026-escalation",
            "title": "存储涨价节奏持续兑现",
            "summary": "DDR4 8GB 每月涨约 20%、Q4 合约价 +50%+；nor flash 全年 +150%；海力士 2026/2027 订单已卖光。盯合约价不盯现货价。（2026.02–04 观察，2026.09.03 核实）",
            "date": "2026.04.10",
            "mapNodeId": "dram",
            "thesisId": "memory-cycle"
          },
          {
            "id": "ai-capex-contract-anchor",
            "title": "AI CapEx：从指引变成合同",
            "summary": "博通 FY26 Q3 电话会披露 FY2027 AI 营收约 $115B、FY2028 约 $230B，客户合同已签（2028 年：Anthropic 16GW / OpenAI 6.3GW / Meta 3GW）；英伟达 Blackwell 系列锁定至 2027 年交付，排队规模约相当于当前行业年化 CapEx 的 30 倍；DELL 企业 AI 客户超 6500、单季新增约 3300——需求从云厂单边走向企业端渗透。远端数据按\"每季季报验证\"打折持有，不作 100% 信念。（2026.09.06 入库）",
            "date": "2026.09.06",
            "mapNodeId": "gpu",
            "thesisId": "compute"
          },
          {
            "id": "inference-monetization-benchmark",
            "title": "每 GW 推理变现基准",
            "summary": "微观回收期估算：每 GW 推理年变现约 600 亿（保守）–1000 亿（市场预期）——低于此基准，卖铲子与 AI 实验室估值偏乐观；高于此，或存在估值底。并存读数：高频 Token 用户或不足 1000 万、Token 占人力成本传统约 1% vs AI 原生 10%+——渗透率仍低与变现锚成立并不矛盾。兑现验证看头部模型公司 IPO 后的真实季报。（2026.09.06 入库）",
            "date": "2026.09.06",
            "mapNodeId": "token",
            "thesisId": "ai-app"
          },
          {
            "id": "china-llm-api-margin-turn",
            "title": "国产大模型 API 毛利首次转正",
            "summary": "智谱中报：1H26 收入 9.54 亿（+399.7%），API 收入 8.25 亿（+2735.7%），云端毛利率 24.6% 转正（上年 -0.4%）——首家公开承认 API 毛利转正的中国大模型公司，\"国产模型必亏\"判断需修正。ARR 约 16 亿美元为管理层年化口径，估值口径需打折。（2026.09.06 入库）",
            "date": "2026.09.06",
            "thesisId": "ai-app"
          },
          {
            "id": "memory-supercycle-tension",
            "title": "\"2027 存储超级周期\"叙事 vs 周期判据",
            "summary": "HBM4 价格翻倍至 $700+、内存占 AI 服务器 BoM 升至 50%+、2027 年 DRAM 全面紧缺预期走强；三星 DRAM 价格上行 + HBM 执行改善打开盈利弹性——与存储周期命题证伪条件（三星、海力士盈利预测不降反升）的距离在缩短。叙事与判据并置值守：若盈利预测转为上修，周期判据失效流程启动。（2026.09.06 入库）",
            "date": "2026.09.06",
            "mapNodeId": "hbm",
            "thesisId": "memory-cycle"
          }
        ],
      },
    },
  },
]
