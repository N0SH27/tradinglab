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
    reason: 'C1 迁移：既有生产状态登记为初始版本（15 节点语义状态 + MAP_ERA + 5 条 Observation + CYCLE_INDUSTRIES stage）。此为 versioned system 的第一个可观察状态，此前演化历史已永久缺失，不倒填。',
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
            summary: '从"可用"到"必须用"的切换正在发生，智算项目推进速度快于预期。',
            date: '2026.08',
            mapNodeId: 'equip',
            thesisId: 'compute',
          },
          {
            id: 'memory-price-divergence',
            title: '存储价格与股价背离',
            summary: '价格上涨而股价不再跟随——周期股的顶部信号从来不是价格下跌，而是上涨失效。',
            date: '2026.08',
            mapNodeId: 'dram',
            thesisId: 'memory-cycle',
          },
          {
            id: 'robotics-crowding',
            title: '机器人交易拥挤',
            summary: '成交拥挤度创年内新高，估值透支速度超过产业兑现速度。',
            date: '2026.06',
            thesisId: 'robot',
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
]
