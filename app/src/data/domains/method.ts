// ── 方法 · How I Think ───────────────────────
// Method 是上位体系（13 号文 · CANONICAL · V2-07-02 · LOCKED）：
// 本文件只承载 Method 页的静态文本（与 framework.ts 同类的静态方法文本模块，
// 非实体、非 Data Layer——V2-26 契约 OQ-1 终裁），不重新定义 Method / Research Loop。
// 研究循环八步名序与 13 号文逐字一致：OBSERVE → CONTEXT → FRAME → THESIS
// → TEST → BELIEVE → REVISE → REFLECT。

export const METHOD_LOOP = {
  title: '研究循环',
  en: 'RESEARCH LOOP v1.0',
  note: '信念如何形成与修正的完整认知循环——它不是一个流程图，是一套纪律。',
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
    { k: 'NEW', zh: '新', desc: '是变化本身，不是已知状态的复读——本质是识别异常值。你的生活习惯，决定了你能观察到什么样的信号。' },
    { k: 'BIG', zh: '大', desc: '足以改变注意力分配的量级。' },
    { k: 'TRUE', zh: '真', desc: '可被外部验证的事实，不是措辞与情绪。' },
  ],
  discipline: '观察层 3–5 条人工维护。自动化可以帮助整理证据，但不能替我决定什么值得观察。',
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
