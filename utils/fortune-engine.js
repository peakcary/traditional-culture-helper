/**
 * 运势分析引擎
 * 提供综合运势、事业、财运、感情、健康等详细分析
 */

class FortuneEngine {
  constructor() {
    // 运势分析模板和规则库
    this.fortuneTemplates = {
      overall: {
        excellent: [
          "整体运势极佳，各方面发展顺利，是人生的重要机遇期",
          "命局配置优良，五行平衡，未来发展潜力巨大", 
          "天时地利人和，正是大展宏图的好时机"
        ],
        good: [
          "整体运势较好，虽有小波折但总体向上",
          "命局基础良好，把握机会可获得不错发展",
          "运势平稳上升，适合稳健发展"
        ],
        average: [
          "运势平平，需要自身努力才能有所突破",
          "命局中等，通过合理调节可以改善运势",
          "机会与挑战并存，需要谨慎把握"
        ],
        poor: [
          "运势较为低迷，需要多加注意，等待转机",
          "当前阶段阻力较大，建议低调行事",
          "暂时处于低谷期，需要积蓄力量等待时机"
        ]
      },
      
      career: {
        excellent: [
          "事业运势旺盛，有升职加薪或创业成功的机会",
          "工作中容易得到贵人相助，事半功倍",
          "适合开拓新领域，创新思维会带来丰厚回报"
        ],
        good: [
          "工作稳定发展，通过努力可以获得认可",
          "职场人际关系良好，团队协作顺利",
          "适合学习新技能，为未来发展打基础"
        ],
        average: [
          "工作按部就班，需要主动寻找突破机会",
          "保持现状的同时，可以考虑适度变化",
          "需要更多耐心和坚持，成功需要时间积累"
        ],
        poor: [
          "工作压力较大，需要调整心态应对挑战",
          "避免冲动决定，宜守不宜攻",
          "注意与同事领导的关系，低调处事为宜"
        ]
      },
      
      wealth: {
        excellent: [
          "财运亨通，正财偏财皆有收获，投资理财获利丰厚",
          "赚钱机会多，但也要注意合理规划和储蓄",
          "商业直觉敏锐，适合投资和创业"
        ],
        good: [
          "财运稳定，收入来源稳固，有小额增长",
          "理财能力不错，能够积累一定财富",
          "适合稳健投资，避免高风险项目"
        ],
        average: [
          "财运一般，收支平衡，需要开源节流",
          "投资需要谨慎，多做功课再决定",
          "可以考虑增加收入渠道"
        ],
        poor: [
          "财运较弱，支出大于收入，需要控制消费",
          "避免借贷和高风险投资",
          "理财保守为主，等待财运转好"
        ]
      },
      
      love: {
        excellent: [
          "感情运势极佳，单身者易遇良缘，有情人终成眷属",
          "夫妻感情和睦，家庭和谐美满",
          "桃花运旺盛，人际魅力增强"
        ],
        good: [
          "感情稳定发展，关系进一步加深",
          "情侣间理解包容，感情升温",
          "家庭关系和谐，长辈关爱有加"
        ],
        average: [
          "感情需要用心经营，多沟通多理解",
          "单身者需要主动一些，机会不等人",
          "家庭关系平稳，需要更多关心"
        ],
        poor: [
          "感情容易出现波折，需要冷静处理",
          "避免意气用事，多站在对方角度思考",
          "单身者不要太着急，缘分需要等待"
        ]
      },
      
      health: {
        excellent: [
          "身体健康状况良好，精力充沛，活力满满",
          "免疫力强，不容易生病，体质佳",
          "适合运动健身，增强体质效果显著"
        ],
        good: [
          "健康状况稳定，小毛病容易康复",
          "精神状态不错，工作学习有活力",
          "注意劳逸结合，保持良好作息"
        ],
        average: [
          "健康需要更多关注，预防胜于治疗",
          "适度运动，合理饮食，保持规律生活",
          "定期体检，及早发现问题"
        ],
        poor: [
          "需要特别注意身体健康，多休息少熬夜",
          "慢性疾病需要坚持治疗和调理",
          "心情放松，压力过大影响健康"
        ]
      }
    };

    // 五行对运势的影响权重
    this.wuxingInfluence = {
      career: { '木': 0.3, '火': 0.2, '土': 0.2, '金': 0.2, '水': 0.1 },
      wealth: { '金': 0.3, '土': 0.25, '水': 0.2, '木': 0.15, '火': 0.1 },
      love: { '火': 0.3, '水': 0.25, '木': 0.2, '土': 0.15, '金': 0.1 },
      health: { '土': 0.3, '木': 0.25, '金': 0.2, '水': 0.15, '火': 0.1 }
    };
  }
  
  /**
   * 分析综合运势
   * @param {Object} bazi 八字信息
   * @param {number} currentYear 当前年份
   * @returns {Object} 综合运势分析
   */
  analyzeOverallFortune(bazi, currentYear = new Date().getFullYear()) {
    const wuxingAnalysis = bazi.analysis.wuXing;
    const qiangRuoAnalysis = bazi.analysis.qiangRuo;
    const yongShenAnalysis = bazi.analysis.yongShen;
    
    // 计算综合运势评分 (0-100)
    let score = 60; // 基础分
    
    // 根据日主强弱调整
    if (qiangRuoAnalysis.level === '中和') score += 15;
    else if (qiangRuoAnalysis.level.includes('偏')) score += 5;
    else if (qiangRuoAnalysis.level.includes('极')) score -= 10;
    
    // 根据五行平衡度调整
    const wuxingBalance = this.calculateWuxingBalance(wuxingAnalysis);
    score += wuxingBalance * 20;
    
    // 根据用神得力情况调整
    const yongShenPower = this.calculateYongShenPower(bazi);
    score += yongShenPower * 15;
    
    // 确保分数在合理范围内
    score = Math.max(0, Math.min(100, score));
    
    const level = this.getFortuneLevel(score);
    const description = this.getRandomTemplate(this.fortuneTemplates.overall, level);
    
    return {
      score: Math.round(score),
      level: this.getLevelText(level),
      description,
      analysis: this.generateOverallAnalysis(bazi),
      suggestions: this.generateSuggestions(bazi)
    };
  }
  
  /**
   * 分析事业运势
   * @param {Object} bazi 八字信息
   * @returns {Object} 事业运分析
   */
  analyzeCareerFortune(bazi) {
    const score = this.calculateCategoryScore(bazi, 'career');
    const level = this.getFortuneLevel(score);
    const description = this.getRandomTemplate(this.fortuneTemplates.career, level);
    
    return {
      score: Math.round(score),
      level: this.getLevelText(level),
      description,
      strengths: this.getCareerStrengths(bazi),
      weaknesses: this.getCareerWeaknesses(bazi),
      suggestions: this.getCareerSuggestions(bazi)
    };
  }
  
  /**
   * 分析财运
   * @param {Object} bazi 八字信息
   * @returns {Object} 财运分析
   */
  analyzeWealthFortune(bazi) {
    const score = this.calculateCategoryScore(bazi, 'wealth');
    const level = this.getFortuneLevel(score);
    const description = this.getRandomTemplate(this.fortuneTemplates.wealth, level);
    
    return {
      score: Math.round(score),
      level: this.getLevelText(level),
      description,
      wealthType: this.getWealthType(bazi),
      investmentAdvice: this.getInvestmentAdvice(bazi),
      suggestions: this.getWealthSuggestions(bazi)
    };
  }
  
  /**
   * 分析感情运势
   * @param {Object} bazi 八字信息
   * @returns {Object} 感情运分析
   */
  analyzeLoveFortune(bazi) {
    const score = this.calculateCategoryScore(bazi, 'love');
    const level = this.getFortuneLevel(score);
    const description = this.getRandomTemplate(this.fortuneTemplates.love, level);
    
    return {
      score: Math.round(score),
      level: this.getLevelText(level),
      description,
      loveType: this.getLoveType(bazi),
      compatibility: this.getCompatibility(bazi),
      suggestions: this.getLoveSuggestions(bazi)
    };
  }
  
  /**
   * 分析健康运势
   * @param {Object} bazi 八字信息
   * @returns {Object} 健康运分析
   */
  analyzeHealthFortune(bazi) {
    const score = this.calculateCategoryScore(bazi, 'health');
    const level = this.getFortuneLevel(score);
    const description = this.getRandomTemplate(this.fortuneTemplates.health, level);
    
    return {
      score: Math.round(score),
      level: this.getLevelText(level),
      description,
      bodyParts: this.getHealthFocus(bazi),
      suggestions: this.getHealthSuggestions(bazi)
    };
  }
  
  /**
   * 计算五行平衡度
   * @param {Object} wuxingAnalysis 五行分析结果
   * @returns {number} 平衡度 (0-1)
   */
  calculateWuxingBalance(wuxingAnalysis) {
    const counts = Object.values(wuxingAnalysis.count);
    const total = counts.reduce((sum, count) => sum + count, 0);
    const ideal = total / 5; // 理想情况每个五行占20%
    
    let deviation = 0;
    counts.forEach(count => {
      deviation += Math.abs(count - ideal) / total;
    });
    
    return Math.max(0, 1 - deviation);
  }
  
  /**
   * 计算用神得力程度
   * @param {Object} bazi 八字信息
   * @returns {number} 得力程度 (0-1)
   */
  calculateYongShenPower(bazi) {
    const yongShen = bazi.analysis.yongShen.yongShen;
    const wuxingCount = bazi.analysis.wuXing.count;
    const total = Object.values(wuxingCount).reduce((sum, count) => sum + count, 0);
    
    let yongShenPower = 0;
    yongShen.forEach(ys => {
      yongShenPower += (wuxingCount[ys] || 0) / total;
    });
    
    return Math.min(1, yongShenPower);
  }
  
  /**
   * 计算各类运势分数
   * @param {Object} bazi 八字信息
   * @param {string} category 运势类别
   * @returns {number} 分数 (0-100)
   */
  calculateCategoryScore(bazi, category) {
    let score = 60; // 基础分
    
    const wuxingCount = bazi.analysis.wuXing.count;
    const total = Object.values(wuxingCount).reduce((sum, count) => sum + count, 0);
    const weights = this.wuxingInfluence[category];
    
    // 根据对应五行强度加权计算
    Object.keys(weights).forEach(wx => {
      const proportion = (wuxingCount[wx] || 0) / total;
      const influence = weights[wx];
      score += proportion * influence * 40; // 最大影响40分
    });
    
    // 根据日主强弱调整
    const qiangRuoLevel = bazi.analysis.qiangRuo.level;
    if (qiangRuoLevel === '中和') score += 10;
    else if (qiangRuoLevel.includes('偏')) score += 5;
    
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * 获取运势等级
   * @param {number} score 分数
   * @returns {string} 等级
   */
  getFortuneLevel(score) {
    if (score >= 80) return 'excellent';
    if (score >= 65) return 'good';
    if (score >= 40) return 'average';
    return 'poor';
  }
  
  /**
   * 获取等级文字描述
   * @param {string} level 等级
   * @returns {string} 文字描述
   */
  getLevelText(level) {
    const levelMap = {
      'excellent': '极佳',
      'good': '良好', 
      'average': '一般',
      'poor': '较差'
    };
    return levelMap[level] || '未知';
  }
  
  /**
   * 随机获取模板内容
   * @param {Object} templates 模板集合
   * @param {string} level 等级
   * @returns {string} 模板内容
   */
  getRandomTemplate(templates, level) {
    const levelTemplates = templates[level] || templates['average'];
    const randomIndex = Math.floor(Math.random() * levelTemplates.length);
    return levelTemplates[randomIndex];
  }
  
  /**
   * 生成综合分析
   * @param {Object} bazi 八字信息
   * @returns {string} 分析内容
   */
  generateOverallAnalysis(bazi) {
    const dayGan = bazi.pillars.day.gan;
    const dayWX = bazi.pillars.day.ganWuXing;
    const qiangRuo = bazi.analysis.qiangRuo.level;
    const geJu = bazi.analysis.geJu.name;
    
    return `您的日主为${dayGan}(${dayWX})，命局呈${qiangRuo}之势，格局为${geJu}。${this.getWuxingCharacteristics(dayWX)}`;
  }
  
  /**
   * 获取五行特性描述
   * @param {string} wuxing 五行
   * @returns {string} 特性描述
   */
  getWuxingCharacteristics(wuxing) {
    const characteristics = {
      '木': '性格仁慈包容，有上进心和创造力，适合教育、文化、健康等行业。',
      '火': '性格热情活泼，有领导力和表现欲，适合销售、娱乐、科技等行业。',
      '土': '性格诚实稳重，有责任心和耐心，适合管理、服务、房地产等行业。',
      '金': '性格果断坚强，有正义感和执行力，适合金融、法律、军警等行业。',
      '水': '性格聪明灵活，有智慧和适应力，适合贸易、物流、媒体等行业。'
    };
    return characteristics[wuxing] || '';
  }
  
  /**
   * 生成改运建议
   * @param {Object} bazi 八字信息
   * @returns {Array} 建议列表
   */
  generateSuggestions(bazi) {
    const suggestions = [];
    const yongShen = bazi.analysis.yongShen.yongShen;
    const jiShen = bazi.analysis.yongShen.jiShen;
    
    // 根据用神给出建议
    if (yongShen.includes('木')) {
      suggestions.push('多接触绿色植物，从事与木相关的行业有利');
      suggestions.push('适合居住在东方或东南方向');
    }
    if (yongShen.includes('火')) {
      suggestions.push('多穿红色服装，从事与火相关的行业有利');
      suggestions.push('适合居住在南方');
    }
    if (yongShen.includes('土')) {
      suggestions.push('多穿黄色服装，从事与土地相关的行业有利');
      suggestions.push('适合居住在中部或西南方向');
    }
    if (yongShen.includes('金')) {
      suggestions.push('多穿白色或银色服装，从事与金属相关的行业有利');
      suggestions.push('适合居住在西方或西北方向');
    }
    if (yongShen.includes('水')) {
      suggestions.push('多穿黑色或蓝色服装，从事与水相关的行业有利');
      suggestions.push('适合居住在北方');
    }
    
    return suggestions;
  }
  
  // 其他辅助方法...
  getCareerStrengths(bazi) {
    return ['工作认真负责', '有创新思维', '团队合作能力强'];
  }
  
  getCareerWeaknesses(bazi) {
    return ['容易急躁', '需要提升沟通技巧'];
  }
  
  getCareerSuggestions(bazi) {
    return ['保持学习态度', '多与前辈交流', '注重团队协作'];
  }
  
  getWealthType(bazi) {
    return '正财为主，收入稳定';
  }
  
  getInvestmentAdvice(bazi) {
    return '建议稳健投资，避免高风险项目';
  }
  
  getWealthSuggestions(bazi) {
    return ['制定理财计划', '控制不必要支出', '增加收入渠道'];
  }
  
  getLoveType(bazi) {
    return '感情专一，重视家庭';
  }
  
  getCompatibility(bazi) {
    return '与土、金属性的人相配';
  }
  
  getLoveSuggestions(bazi) {
    return ['多表达关心', '学会包容理解', '创造浪漫氛围'];
  }
  
  getHealthFocus(bazi) {
    return ['注意脾胃健康', '避免过度劳累'];
  }
  
  getHealthSuggestions(bazi) {
    return ['规律作息', '适量运动', '定期体检'];
  }
}

// 导出单例
export default new FortuneEngine();