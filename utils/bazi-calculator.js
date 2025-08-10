/**
 * 八字排盘计算引擎
 * 实现完整的八字计算逻辑
 */

import CalendarConverter from './calendar.js';

class BaziCalculator {
  constructor() {
    // 天干
    this.tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    
    // 地支
    this.diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    // 天干五行属性
    this.ganWuXing = {
      '甲': '木', '乙': '木',
      '丙': '火', '丁': '火',
      '戊': '土', '己': '土',
      '庚': '金', '辛': '金',
      '壬': '水', '癸': '水'
    };
    
    // 地支五行属性
    this.zhiWuXing = {
      '子': '水', '亥': '水',
      '寅': '木', '卯': '木',
      '巳': '火', '午': '火',
      '申': '金', '酉': '金',
      '辰': '土', '戌': '土', '丑': '土', '未': '土'
    };
    
    // 地支藏干
    this.zhiCangGan = {
      '子': ['癸'],
      '丑': ['己', '癸', '辛'],
      '寅': ['甲', '丙', '戊'],
      '卯': ['乙'],
      '辰': ['戊', '乙', '癸'],
      '巳': ['丙', '庚', '戊'],
      '午': ['丁', '己'],
      '未': ['己', '丁', '乙'],
      '申': ['庚', '壬', '戊'],
      '酉': ['辛'],
      '戌': ['戊', '辛', '丁'],
      '亥': ['壬', '甲']
    };
    
    // 十神关系
    this.shiShen = {
      '同': '比肩',
      '劫': '劫财',
      '食': '食神',
      '伤': '伤官',
      '财': '正财',
      '才': '偏财',
      '官': '正官',
      '杀': '七杀',
      '印': '正印',
      '枭': '偏印'
    };
    
    // 纳音五行表
    this.naYin = {
      '甲子': '海中金', '乙丑': '海中金',
      '丙寅': '炉中火', '丁卯': '炉中火',
      '戊辰': '大林木', '己巳': '大林木',
      '庚午': '路旁土', '辛未': '路旁土',
      '壬申': '剑锋金', '癸酉': '剑锋金',
      '甲戌': '山头火', '乙亥': '山头火',
      // ... 更多纳音对应关系
    };
  }
  
  /**
   * 计算完整八字
   * @param {Date} birthDate 出生日期时间
   * @param {string} gender 性别 ('男'/'女')
   * @param {boolean} isLunar 是否农历
   * @returns {Object} 八字信息
   */
  calculateBazi(birthDate, gender = '男', isLunar = false) {
    let year, month, day, hour;
    
    if (isLunar) {
      // 农历转公历
      const solarDate = CalendarConverter.lunarToSolar(
        birthDate.getFullYear(),
        birthDate.getMonth() + 1,
        birthDate.getDate()
      );
      year = solarDate.year;
      month = solarDate.month;
      day = solarDate.day;
      hour = birthDate.getHours();
    } else {
      year = birthDate.getFullYear();
      month = birthDate.getMonth() + 1;
      day = birthDate.getDate();
      hour = birthDate.getHours();
    }
    
    // 获取农历信息
    const lunarInfo = CalendarConverter.solarToLunar(year, month, day);
    
    // 计算四柱
    const yearPillar = this.getYearPillar(year);
    const monthPillar = this.getMonthPillar(year, month, day);
    const dayPillar = this.getDayPillar(year, month, day);
    const hourPillar = this.getHourPillar(dayPillar.gan, hour);
    
    // 构建八字对象
    const bazi = {
      // 基本信息
      birthDate: {
        solar: { year, month, day, hour },
        lunar: lunarInfo
      },
      gender,
      
      // 四柱信息
      pillars: {
        year: yearPillar,
        month: monthPillar,
        day: dayPillar,
        hour: hourPillar
      },
      
      // 八字字符串
      baziString: [
        yearPillar.gan + yearPillar.zhi,
        monthPillar.gan + monthPillar.zhi,
        dayPillar.gan + dayPillar.zhi,
        hourPillar.gan + hourPillar.zhi
      ],
      
      // 分析结果
      analysis: {}
    };
    
    // 进行各种分析
    bazi.analysis = {
      wuXing: this.analyzeWuXing(bazi),
      shiShen: this.analyzeShiShen(bazi),
      qiangRuo: this.analyzeQiangRuo(bazi),
      yongShen: this.analyzeYongShen(bazi),
      geJu: this.analyzeGeJu(bazi),
      naYin: this.getNaYin(bazi)
    };
    
    return bazi;
  }
  
  /**
   * 获取年柱
   * @param {number} year 公历年份
   * @returns {Object} 年柱信息
   */
  getYearPillar(year) {
    // 立春作为年柱分界点，这里简化为公历年
    const ganIndex = (year - 4) % 10;
    const zhiIndex = (year - 4) % 12;
    
    return {
      gan: this.tianGan[ganIndex],
      zhi: this.diZhi[zhiIndex],
      ganWuXing: this.ganWuXing[this.tianGan[ganIndex]],
      zhiWuXing: this.zhiWuXing[this.diZhi[zhiIndex]],
      cangGan: this.zhiCangGan[this.diZhi[zhiIndex]]
    };
  }
  
  /**
   * 获取月柱
   * @param {number} year 年份
   * @param {number} month 月份
   * @param {number} day 日期
   * @returns {Object} 月柱信息
   */
  getMonthPillar(year, month, day) {
    // 根据节气确定月柱，这里简化处理
    const yearGanIndex = (year - 4) % 10;
    const monthZhiIndex = (month + 1) % 12;
    const monthGanIndex = (yearGanIndex * 2 + month) % 10;
    
    const gan = this.tianGan[monthGanIndex];
    const zhi = this.diZhi[monthZhiIndex];
    
    return {
      gan,
      zhi,
      ganWuXing: this.ganWuXing[gan],
      zhiWuXing: this.zhiWuXing[zhi],
      cangGan: this.zhiCangGan[zhi]
    };
  }
  
  /**
   * 获取日柱
   * @param {number} year 年份
   * @param {number} month 月份  
   * @param {number} day 日期
   * @returns {Object} 日柱信息
   */
  getDayPillar(year, month, day) {
    const ganZhi = CalendarConverter.getDayGanZhi(year, month, day);
    const gan = ganZhi.charAt(0);
    const zhi = ganZhi.charAt(1);
    
    return {
      gan,
      zhi,
      ganWuXing: this.ganWuXing[gan],
      zhiWuXing: this.zhiWuXing[zhi],
      cangGan: this.zhiCangGan[zhi]
    };
  }
  
  /**
   * 获取时柱
   * @param {string} dayGan 日干
   * @param {number} hour 小时
   * @returns {Object} 时柱信息
   */
  getHourPillar(dayGan, hour) {
    const ganZhi = CalendarConverter.getHourGanZhi(dayGan, hour);
    const gan = ganZhi.charAt(0);
    const zhi = ganZhi.charAt(1);
    
    return {
      gan,
      zhi,
      ganWuXing: this.ganWuXing[gan],
      zhiWuXing: this.zhiWuXing[zhi],
      cangGan: this.zhiCangGan[zhi]
    };
  }
  
  /**
   * 五行分析
   * @param {Object} bazi 八字对象
   * @returns {Object} 五行分析结果
   */
  analyzeWuXing(bazi) {
    const wuXingCount = {
      '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
    };
    
    const pillars = Object.values(bazi.pillars);
    
    // 统计天干五行
    pillars.forEach(pillar => {
      wuXingCount[pillar.ganWuXing] += 2; // 天干权重为2
    });
    
    // 统计地支五行
    pillars.forEach(pillar => {
      wuXingCount[pillar.zhiWuXing] += 1; // 地支权重为1
    });
    
    // 统计藏干五行
    pillars.forEach(pillar => {
      pillar.cangGan.forEach((gan, index) => {
        const weight = index === 0 ? 1 : 0.5; // 本气权重1，杂气权重0.5
        wuXingCount[this.ganWuXing[gan]] += weight;
      });
    });
    
    // 计算五行强弱
    const total = Object.values(wuXingCount).reduce((sum, count) => sum + count, 0);
    const wuXingPercent = {};
    const wuXingLevel = {};
    
    Object.keys(wuXingCount).forEach(wx => {
      wuXingPercent[wx] = ((wuXingCount[wx] / total) * 100).toFixed(1);
      
      if (wuXingCount[wx] >= total * 0.3) wuXingLevel[wx] = '旺';
      else if (wuXingCount[wx] >= total * 0.2) wuXingLevel[wx] = '强';
      else if (wuXingCount[wx] >= total * 0.1) wuXingLevel[wx] = '平';
      else if (wuXingCount[wx] > 0) wuXingLevel[wx] = '弱';
      else wuXingLevel[wx] = '无';
    });
    
    return {
      count: wuXingCount,
      percent: wuXingPercent,
      level: wuXingLevel,
      strongest: Object.keys(wuXingCount).reduce((a, b) => 
        wuXingCount[a] > wuXingCount[b] ? a : b
      ),
      weakest: Object.keys(wuXingCount).reduce((a, b) => 
        wuXingCount[a] < wuXingCount[b] ? a : b
      )
    };
  }
  
  /**
   * 十神分析
   * @param {Object} bazi 八字对象
   * @returns {Object} 十神分析结果
   */
  analyzeShiShen(bazi) {
    const dayGan = bazi.pillars.day.gan;
    const shiShenResult = {};
    
    // 分析各柱与日干的十神关系
    Object.keys(bazi.pillars).forEach(position => {
      const pillar = bazi.pillars[position];
      if (position === 'day') return;
      
      shiShenResult[position] = {
        gan: this.getShiShenRelation(dayGan, pillar.gan),
        zhi: this.getShiShenRelation(dayGan, pillar.cangGan[0])
      };
    });
    
    return shiShenResult;
  }
  
  /**
   * 获取十神关系
   * @param {string} dayGan 日干
   * @param {string} targetGan 目标干
   * @returns {string} 十神关系
   */
  getShiShenRelation(dayGan, targetGan) {
    const dayWX = this.ganWuXing[dayGan];
    const targetWX = this.ganWuXing[targetGan];
    const isSameYinYang = (this.tianGan.indexOf(dayGan) % 2) === 
                         (this.tianGan.indexOf(targetGan) % 2);
    
    // 根据五行关系和阴阳属性判断十神
    if (dayWX === targetWX) {
      return dayGan === targetGan ? '比肩' : (isSameYinYang ? '比肩' : '劫财');
    }
    
    // 其他十神关系逻辑
    const relations = this.getWuXingRelation(dayWX, targetWX);
    
    if (relations === '生我') {
      return isSameYinYang ? '正印' : '偏印';
    } else if (relations === '我生') {
      return isSameYinYang ? '伤官' : '食神';
    } else if (relations === '克我') {
      return isSameYinYang ? '正官' : '七杀';
    } else if (relations === '我克') {
      return isSameYinYang ? '正财' : '偏财';
    }
    
    return '未知';
  }
  
  /**
   * 获取五行生克关系
   * @param {string} wx1 五行1
   * @param {string} wx2 五行2
   * @returns {string} 关系
   */
  getWuXingRelation(wx1, wx2) {
    const shengRelation = {
      '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
    };
    const keRelation = {
      '木': '土', '土': '水', '水': '火', '火': '金', '金': '木'
    };
    
    if (shengRelation[wx2] === wx1) return '生我';
    if (shengRelation[wx1] === wx2) return '我生';
    if (keRelation[wx2] === wx1) return '克我';
    if (keRelation[wx1] === wx2) return '我克';
    
    return '无关';
  }
  
  /**
   * 分析日主强弱
   * @param {Object} bazi 八字对象
   * @returns {Object} 强弱分析
   */
  analyzeQiangRuo(bazi) {
    const dayGan = bazi.pillars.day.gan;
    const dayWX = this.ganWuXing[dayGan];
    const season = this.getSeason(bazi.birthDate.solar.month);
    
    let strength = 0;
    
    // 根据月令判断得令失令
    const seasonWX = this.getSeasonWuXing(season);
    if (seasonWX === dayWX) strength += 3;
    else if (this.getWuXingRelation(seasonWX, dayWX) === '生我') strength += 1;
    else if (this.getWuXingRelation(seasonWX, dayWX) === '克我') strength -= 2;
    
    // 根据其他三柱的帮扶情况
    ['year', 'month', 'hour'].forEach(pos => {
      const pillar = bazi.pillars[pos];
      if (this.ganWuXing[pillar.gan] === dayWX) strength += 2;
      if (pillar.zhiWuXing === dayWX) strength += 1;
    });
    
    let level;
    if (strength >= 5) level = '极旺';
    else if (strength >= 3) level = '偏旺';
    else if (strength >= 1) level = '中和';
    else if (strength >= -1) level = '偏弱';
    else level = '极弱';
    
    return {
      score: strength,
      level,
      analysis: `日主${dayGan}在${season}，强弱评分：${strength}，判断为${level}`
    };
  }
  
  /**
   * 分析用神
   * @param {Object} bazi 八字对象
   * @returns {Object} 用神分析
   */
  analyzeYongShen(bazi) {
    const qiangRuo = this.analyzeQiangRuo(bazi);
    const wuXing = this.analyzeWuXing(bazi);
    const dayWX = this.ganWuXing[bazi.pillars.day.gan];
    
    let yongShen, jiShen;
    
    if (qiangRuo.level.includes('旺')) {
      // 身旺用克泄耗
      yongShen = this.getKeLieHaoWX(dayWX);
      jiShen = [dayWX];
    } else if (qiangRuo.level.includes('弱')) {
      // 身弱用生扶
      yongShen = this.getShengFuWX(dayWX);
      jiShen = this.getKeLieHaoWX(dayWX);
    } else {
      // 中和根据五行平衡调节
      const weakest = wuXing.weakest;
      yongShen = [weakest];
      jiShen = [wuXing.strongest];
    }
    
    return {
      yongShen,
      jiShen,
      analysis: `日主${qiangRuo.level}，用神为${yongShen.join('、')}，忌神为${jiShen.join('、')}`
    };
  }
  
  /**
   * 格局分析
   * @param {Object} bazi 八字对象
   * @returns {Object} 格局分析
   */
  analyzeGeJu(bazi) {
    // 简化的格局判断
    const shiShen = this.analyzeShiShen(bazi);
    const monthSS = shiShen.month?.gan || '未知';
    
    const commonFormats = {
      '正官': '正官格',
      '七杀': '七杀格',
      '正财': '正财格',
      '偏财': '偏财格',
      '食神': '食神格',
      '伤官': '伤官格'
    };
    
    const geJu = commonFormats[monthSS] || '普通格局';
    
    return {
      name: geJu,
      description: `以月令${monthSS}为主的${geJu}`,
      level: '中等'
    };
  }
  
  /**
   * 纳音分析
   * @param {Object} bazi 八字对象
   * @returns {Object} 纳音信息
   */
  getNaYin(bazi) {
    const result = {};
    
    Object.keys(bazi.pillars).forEach(pos => {
      const pillar = bazi.pillars[pos];
      const ganZhi = pillar.gan + pillar.zhi;
      result[pos] = this.naYin[ganZhi] || '未知纳音';
    });
    
    return result;
  }
  
  // 辅助方法
  getSeason(month) {
    if ([3, 4, 5].includes(month)) return '春';
    if ([6, 7, 8].includes(month)) return '夏';
    if ([9, 10, 11].includes(month)) return '秋';
    return '冬';
  }
  
  getSeasonWuXing(season) {
    const seasonWX = { '春': '木', '夏': '火', '秋': '金', '冬': '水' };
    return seasonWX[season];
  }
  
  getKeLieHaoWX(wuXing) {
    const relations = {
      '木': ['金', '火', '土'],
      '火': ['水', '土', '金'],
      '土': ['木', '金', '水'],
      '金': ['火', '水', '木'],
      '水': ['土', '木', '火']
    };
    return relations[wuXing] || [];
  }
  
  getShengFuWX(wuXing) {
    const relations = {
      '木': ['水', '木'],
      '火': ['木', '火'],
      '土': ['火', '土'],
      '金': ['土', '金'],
      '水': ['金', '水']
    };
    return relations[wuXing] || [];
  }
}

// 导出单例
export default new BaziCalculator();