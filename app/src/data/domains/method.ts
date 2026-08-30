// ── 方法 · How I Think ───────────────────────
// Method 是上位体系（13 号文 · CANONICAL · V2-07-02 · LOCKED）：
// 本文件只承载 Method 页的静态文本（与 framework.ts 同类的静态方法文本模块，
// 非实体、非 Data Layer——V2-26 契约 OQ-1 终裁），不重新定义 Method / Research Loop。
// 研究循环八步名序与 13 号文逐字一致：OBSERVE → CONTEXT → FRAME → THESIS
// → TEST → BELIEVE → REVISE → REFLECT。

export const METHOD_LOOP = {
  title: '研究循环',
  en: 'RESEARCH LOOP v1.0',
  note: '信念如何形成与修正的完整认知循环——先观，后判；它不是一个流程图，是一套纪律。',
  steps: [
    { key: 'OBSERVE', zh: '观察', desc: '观察变化：正在发生、值得观察的变化——不是新闻，不是行情。', href: '#/', hrefLabel: '当下' },
    { key: 'CONTEXT', zh: '定位', desc: '地图、渗透率、周期、时代——四把尺子量完，一个观察才算有了上下文。', href: '#/map', hrefLabel: '地图' },
    { key: 'FRAME', zh: '框定', desc: '写出核心矛盾：主流叙事 → 反作用力 → 研究问题。写不出「虽然……但是……」，不许立题。' },
    { key: 'THESIS', zh: '立题', desc: '可证伪的命题：证据不超过三条、亲笔反方、概率、时间窗口、证伪条件预先登记。', href: '#/thesis', hrefLabel: '命题' },
    { key: 'TEST', zh: '对照', desc: '证据监测与证伪信号值守——让现实持续投票。' },
    { key: 'BELIEVE', zh: '信念', desc: '0–100 的诚实刻度。概率不是精确，是诚实。' },
    { key: 'REVISE', zh: '修正', desc: '入账修正：上调、下调、维持——维持也是判断。', href: '#/journal', hrefLabel: '日志' },
    { key: 'REFLECT', zh: '反思', desc: '复盘反哺方法本身：命题库因此进化，方法因此演化。' },
  ],
}

// NEW / BIG / TRUE = Research-side Signal Qualification（研究准入筛）。
// 不是 Signal Model，不是交易信号规格，永不直连行动。（V2-26 契约 G 节）
export const METHOD_GATE = {
  title: '观察的准入',
  en: 'NEW · BIG · TRUE',
  note: '研究侧的准入筛——回答「值不值得研究」，不回答「要不要行动」。',
  chain: '现实 → 有变化 → 新吗 → 大吗 → 真吗 → 才值得研究。',
  gates: [
    { k: 'NEW', zh: '新', desc: '是变化本身，不是已知状态的复读——本质是识别异常值。向最近三年赚到钱的方法学习，而不是向十年前的方法学习；你的生活习惯，决定了你能观察到什么样的信号。' },
    { k: 'BIG', zh: '大', desc: '足以改变注意力分配的量级——能否成为全民话题，决定了它值不值得动用研究循环。' },
    { k: 'TRUE', zh: '真', desc: '可被外部验证的事实，不是措辞与情绪。看原文，不看二手总结；一手信息交叉验证过，才配进入证据链。' },
  ],
  discipline: '观察层 3–5 条人工维护。自动化可以帮助整理证据，但不能替我决定什么值得观察。',
}

// 信号的时序 = 研究侧的时机尺（超级信号内化 · 2026-08-29）。
// 它回答「这个观察处在传播曲线的哪一段」，不回答「要不要行动」——
// 时机尺不改变准入，只校准研究价值与赔率；永不直连交易。（同 G 节边界）
export const METHOD_TIMING = {
  title: '信号的时序',
  en: 'PROPAGATION & FRESHNESS',
  note: '同一条信息，在传播曲线的不同位置，研究价值完全不同。',
  stages: [
    { name: '早期发酵', attitude: '怀疑、不认可', value: '非共识 = 价值洼地。最有价值的信号长这样：备受质疑，一路成长，势不可挡。' },
    { name: '扩散', attitude: '逐步验证', value: '一路验证一路加深研究——信念随证据上调，而不是随价格上涨。' },
    { name: '共识', attitude: '人人谈论', value: '预期已定价，赔率下降——共识阶段的研究，只能赚情绪的钱。' },
    { name: '泡沫', attitude: '疯狂追捧', value: '此时研究结论只服务一件事：离场纪律。' },
  ],
  freshness: [
    '信号有新鲜度：同一信号被市场重复定价三次以上，价值衰减——规律一旦被所有人知道，就开始失效。',
    '信息源要打权重：S 级罕见且信息量巨大，A 级重要但非决定，B 级常规关注，其余是噪音。',
  ],
}

export const METHOD_EVIDENCE = {
  title: '证据与证伪',
  en: 'EVIDENCE & INVALIDATION',
  points: [
    '证据只收可被外部验证的事实：出货、招标、产能、现金流——拒收研报措辞与圈内情绪。',
    '证据不超过三条：三条撑不住的命题，三十条也撑不住。',
    '每个命题必须亲笔写下让自己不舒服的反面论证。',
    '证伪条件事先登记：什么事实出现之后，我必须承认原来的逻辑不再成立。事后不认「我早就觉得不对」。',
    '研究侧的证伪与交易侧的止损是同一个原则：止损位必须是一个能证明「我看错了」的位置。',
  ],
}

export const METHOD_REVISION = {
  title: '修正纪律',
  en: 'REVISION DISCIPLINE',
  points: [
    '沉默地改观点，是研究的死亡——每一次修正公开留下日期、方向与原因。',
    '维持也是判断：复核后不变，同样入账。',
    '被证伪不是失败，是原则被遵守的证据。',
    '只有会改变未来判断状态的信息，才进账本。',
  ],
  href: '#/journal', hrefLabel: '修正记录在日志',
}

export const METHOD_CONSTRAINT = {
  title: '行为约束层',
  en: 'BEHAVIORAL CONSTRAINTS',
  desc: '无为不是研究循环里的一个步骤——它永远可以在任何一步介入，回答同一个问题：是否需要行动？纪律优先于行动：宁可什么都不做，不做系统外的动作。',
  href: '#/wuwei', hrefLabel: '无为',
}
