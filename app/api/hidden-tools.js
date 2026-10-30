/* 从用户提供的《美国数据常用的 60 个网站》清单筛选；访问时以来源机构最新页面为准。 */
export const TOOL_GROUPS = [
  {
    id: 'macro',
    title: '宏观与流动性',
    description: '从原始机构核对增长、通胀、利率和流动性，先看发布日期与统计口径。',
    links: [
      { title: 'FRED', institution: '圣路易斯联储', url: 'https://fred.stlouisfed.org/', description: '美国经济时间序列数据库；下载前核对频率、单位与修订情况。' },
      { title: 'BLS · CPI', institution: '美国劳工统计局', url: 'https://www.bls.gov/cpi/', description: '消费者价格指数、分项数据与发布说明。' },
      { title: 'BEA · GDP', institution: '美国经济分析局', url: 'https://www.bea.gov/data/gdp/gross-domestic-product', description: '国内生产总值及细分项目，区分初值与后续修正。' },
      { title: 'GDPNow', institution: '亚特兰大联储', url: 'https://www.atlantafed.org/cqer/research/gdpnow', description: '基于已发布数据的季度实际 GDP 增长模型估计，不是官方预测。' },
      { title: 'CME FedWatch', institution: '芝商所', url: 'https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html', description: '由联邦基金期货价格推导会议利率概率，概率会随市场变化。' },
      { title: '收益率曲线与衰退概率', institution: '纽约联储', url: 'https://www.newyorkfed.org/research/capital_markets/ycfaq.html', description: '收益率曲线、期限利差和相关模型说明，模型结果不是确定预测。' },
      { title: 'G.17 工业生产', institution: '美联储', url: 'https://www.federalreserve.gov/releases/g17/current/', description: '工业生产和产能利用率的当前发布及历史数据入口。' },
    ],
  },
  {
    id: 'housing',
    title: '房地产与利率',
    description: '把需求、供应、建筑活动和融资成本分开观察，避免由单一房价指标推断全局。',
    links: [
      { title: 'MBA 研究与经济', institution: '美国抵押贷款银行家协会', url: 'https://www.mba.org/news-and-research/research-and-economics', description: '抵押贷款申请、行业预测与住房金融研究。' },
      { title: 'New Residential Construction', institution: '美国人口普查局', url: 'https://www.census.gov/construction/nrc/', description: '新屋开工、营建许可与竣工数据，注意季调口径和月度波动。' },
      { title: 'New Residential Sales', institution: '美国人口普查局', url: 'https://www.census.gov/construction/nrs/', description: '新屋销售与待售库存，核对抽样误差和修订。' },
      { title: 'NAHB Housing Economics', institution: '全美住宅建筑商协会', url: 'https://www.nahb.org/news-and-economics/housing-economics', description: '建筑商信心、住房市场指数与行业分析。' },
      { title: 'PMMS 抵押贷款利率', institution: 'Freddie Mac', url: 'https://www.freddiemac.com/pmms', description: '美国主要抵押贷款产品周度利率调查。' },
      { title: 'Zillow Research Data', institution: 'Zillow', url: 'https://www.zillow.com/research/data/', description: '房价、租金与库存研究数据，使用前阅读指标定义和覆盖范围。' },
      { title: 'NAR Research & Statistics', institution: '全美房地产经纪人协会', url: 'https://www.nar.realtor/research-and-statistics', description: '成屋销售、可负担性与住房市场统计。' },
    ],
  },
  {
    id: 'energy',
    title: '能源与商品',
    description: '库存、供需、产量与期货持仓分开记录，区分周度流量和期末存量。',
    links: [
      { title: 'U.S. EIA', institution: '美国能源信息署', url: 'https://www.eia.gov/', description: '能源生产、消费、库存、价格与短期展望的官方入口。' },
      { title: 'Weekly Petroleum Status', institution: '美国能源信息署', url: 'https://www.eia.gov/petroleum/supply/weekly/', description: '周度原油和成品油供需、库存与进出口数据。' },
      { title: 'API Statistics', institution: '美国石油学会', url: 'https://www.api.org/products-and-services/statistics', description: '行业统计与每周报告入口；与 EIA 的样本和发布时间不同。' },
      { title: 'OPEC Publications', institution: '石油输出国组织', url: 'https://www.opec.org/opec_web/en/publications/338.htm', description: '月度原油市场报告、年度统计与组织出版物。' },
      { title: 'Oil Market Report', institution: '国际能源署', url: 'https://www.iea.org/reports/oil-market-report', description: '全球石油供需、库存与炼厂观察，部分内容可能有访问限制。' },
      { title: 'Commitments of Traders', institution: '美国商品期货交易委员会', url: 'https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm', description: '期货与期权持仓分类报告；持仓方向不等于交易建议。' },
      { title: 'JODI Oil', institution: 'Joint Organisations Data Initiative', url: 'https://www.jodidata.org/oil/', description: '多国石油供需和库存数据，核对国家覆盖、缺失值和提交时间。' },
    ],
  },
]
