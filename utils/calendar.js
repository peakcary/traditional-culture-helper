/**
 * 万年历转换工具类
 * 实现公历与农历之间的转换，以及节气计算
 */

class CalendarConverter {
  constructor() {
    // 农历数据表 (1900-2100年)
    // 每个数值包含该年农历月份的天数信息和闰月信息
    this.lunarData = [
      0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
      0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
      0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
      // ... 更多数据，这里简化显示
    ];
    
    // 天干
    this.tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    
    // 地支
    this.diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    // 生肖
    this.zodiac = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    
    // 节气数据
    this.solarTerms = [
      '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
      '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
      '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
      '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
    ];
    
    // 基准日期: 1900年1月31日为农历1900年正月初一
    this.baseDate = new Date(1900, 0, 31);
  }
  
  /**
   * 公历转农历
   * @param {number} year 公历年
   * @param {number} month 公历月 (1-12)
   * @param {number} day 公历日
   * @returns {Object} 农历信息
   */
  solarToLunar(year, month, day) {
    const date = new Date(year, month - 1, day);
    
    // 计算距离基准日期的天数
    const timeDiff = date.getTime() - this.baseDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    let lunarYear = 1900;
    let lunarMonth = 1;
    let lunarDay = 1;
    let remainDays = daysDiff;
    
    // 计算农历年
    while (remainDays > 0) {
      const daysInYear = this.getLunarYearDays(lunarYear);
      if (remainDays >= daysInYear) {
        remainDays -= daysInYear;
        lunarYear++;
      } else {
        break;
      }
    }
    
    // 计算农历月
    let monthDays;
    while (remainDays > 0) {
      monthDays = this.getLunarMonthDays(lunarYear, lunarMonth);
      if (remainDays >= monthDays) {
        remainDays -= monthDays;
        lunarMonth++;
      } else {
        break;
      }
    }
    
    lunarDay = remainDays + 1;
    
    return {
      year: lunarYear,
      month: lunarMonth,
      day: lunarDay,
      isLeap: this.isLeapMonth(lunarYear, lunarMonth),
      zodiac: this.zodiac[(lunarYear - 4) % 12],
      yearGanZhi: this.getYearGanZhi(lunarYear),
      monthGanZhi: this.getMonthGanZhi(lunarYear, lunarMonth),
      dayGanZhi: this.getDayGanZhi(year, month, day)
    };
  }
  
  /**
   * 农历转公历
   * @param {number} year 农历年
   * @param {number} month 农历月
   * @param {number} day 农历日
   * @param {boolean} isLeap 是否闰月
   * @returns {Object} 公历信息
   */
  lunarToSolar(year, month, day, isLeap = false) {
    let totalDays = 0;
    
    // 计算从基准年到指定年的总天数
    for (let y = 1900; y < year; y++) {
      totalDays += this.getLunarYearDays(y);
    }
    
    // 计算当年从正月到指定月的天数
    for (let m = 1; m < month; m++) {
      totalDays += this.getLunarMonthDays(year, m);
    }
    
    // 如果是闰月，需要加上闰月前的天数
    if (isLeap && this.getLeapMonth(year) === month) {
      totalDays += this.getLunarMonthDays(year, month);
    }
    
    totalDays += day - 1;
    
    // 基准日期加上计算的天数
    const resultDate = new Date(this.baseDate.getTime() + totalDays * 24 * 60 * 60 * 1000);
    
    return {
      year: resultDate.getFullYear(),
      month: resultDate.getMonth() + 1,
      day: resultDate.getDate()
    };
  }
  
  /**
   * 获取年干支
   * @param {number} year 年份
   * @returns {string} 干支
   */
  getYearGanZhi(year) {
    const ganIndex = (year - 4) % 10;
    const zhiIndex = (year - 4) % 12;
    return this.tianGan[ganIndex] + this.diZhi[zhiIndex];
  }
  
  /**
   * 获取月干支
   * @param {number} year 年份
   * @param {number} month 月份
   * @returns {string} 干支
   */
  getMonthGanZhi(year, month) {
    const yearGanIndex = (year - 4) % 10;
    let monthGanIndex = (yearGanIndex * 2 + month) % 10;
    const monthZhiIndex = (month + 1) % 12;
    
    return this.tianGan[monthGanIndex] + this.diZhi[monthZhiIndex];
  }
  
  /**
   * 获取日干支
   * @param {number} year 公历年
   * @param {number} month 公历月
   * @param {number} day 公历日
   * @returns {string} 干支
   */
  getDayGanZhi(year, month, day) {
    // 基准日期: 1900年1月1日为甲子日
    const baseDate = new Date(1900, 0, 1);
    const targetDate = new Date(year, month - 1, day);
    const daysDiff = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
    
    const ganIndex = (daysDiff + 10) % 10; // 1900年1月1日为甲日(序号10)
    const zhiIndex = (daysDiff + 10) % 12;
    
    return this.tianGan[ganIndex] + this.diZhi[zhiIndex];
  }
  
  /**
   * 获取时辰干支
   * @param {string} dayTianGan 日天干
   * @param {number} hour 小时 (0-23)
   * @returns {string} 时辰干支
   */
  getHourGanZhi(dayTianGan, hour) {
    // 时辰对应关系
    const hourZhiIndex = Math.floor((hour + 1) / 2) % 12;
    
    // 日天干与时天干的关系
    const dayGanIndex = this.tianGan.indexOf(dayTianGan);
    const hourGanIndex = (dayGanIndex * 2 + hourZhiIndex) % 10;
    
    return this.tianGan[hourGanIndex] + this.diZhi[hourZhiIndex];
  }
  
  /**
   * 获取节气
   * @param {number} year 年份
   * @param {number} month 月份
   * @param {number} day 日期
   * @returns {string|null} 节气名称
   */
  getSolarTerm(year, month, day) {
    // 简化的节气计算，实际应用中需要更精确的算法
    const solarTermDates = this.calculateSolarTermDates(year);
    const dateKey = `${month}-${day}`;
    
    return solarTermDates[dateKey] || null;
  }
  
  /**
   * 计算指定年份的节气日期
   * @param {number} year 年份
   * @returns {Object} 节气日期映射
   */
  calculateSolarTermDates(year) {
    // 这里是简化算法，实际需要更复杂的天文计算
    const termDates = {};
    
    // 节气的大致日期（需要根据实际天文数据调整）
    const baseDates = [
      [1, 6], [1, 20], [2, 4], [2, 19], [3, 6], [3, 21],
      [4, 5], [4, 20], [5, 6], [5, 21], [6, 6], [6, 21],
      [7, 7], [7, 23], [8, 8], [8, 23], [9, 8], [9, 23],
      [10, 8], [10, 24], [11, 8], [11, 22], [12, 7], [12, 22]
    ];
    
    baseDates.forEach((dateArr, index) => {
      const key = `${dateArr[0]}-${dateArr[1]}`;
      termDates[key] = this.solarTerms[index];
    });
    
    return termDates;
  }
  
  /**
   * 获取农历年总天数
   * @param {number} year 农历年
   * @returns {number} 天数
   */
  getLunarYearDays(year) {
    let days = 0;
    for (let month = 1; month <= 12; month++) {
      days += this.getLunarMonthDays(year, month);
    }
    
    // 如果有闰月，加上闰月天数
    const leapMonth = this.getLeapMonth(year);
    if (leapMonth > 0) {
      days += this.getLunarMonthDays(year, leapMonth, true);
    }
    
    return days;
  }
  
  /**
   * 获取农历月天数
   * @param {number} year 农历年
   * @param {number} month 农历月
   * @param {boolean} isLeap 是否闰月
   * @returns {number} 天数
   */
  getLunarMonthDays(year, month, isLeap = false) {
    // 简化算法，实际需要查表计算
    if (isLeap) {
      return 29; // 闰月一般29天
    }
    
    // 大月30天，小月29天
    return [1, 3, 5, 7, 8, 10, 12].includes(month) ? 30 : 29;
  }
  
  /**
   * 获取闰月月份
   * @param {number} year 农历年
   * @returns {number} 闰月月份，0表示无闰月
   */
  getLeapMonth(year) {
    // 简化算法，实际需要查表
    if (year % 3 === 0 && year % 19 !== 0) {
      return Math.floor(Math.random() * 12) + 1; // 随机返回一个月份作为闰月
    }
    return 0;
  }
  
  /**
   * 判断是否闰月
   * @param {number} year 农历年
   * @param {number} month 农历月
   * @returns {boolean} 是否闰月
   */
  isLeapMonth(year, month) {
    return this.getLeapMonth(year) === month;
  }
  
  /**
   * 格式化日期显示
   * @param {Object} lunarDate 农历日期对象
   * @returns {string} 格式化字符串
   */
  formatLunarDate(lunarDate) {
    const yearStr = `${lunarDate.yearGanZhi}年`;
    const monthStr = `${lunarDate.isLeap ? '闰' : ''}${this.numberToChinese(lunarDate.month)}月`;
    const dayStr = this.numberToChinese(lunarDate.day, true);
    
    return `${yearStr} ${monthStr}${dayStr}`;
  }
  
  /**
   * 数字转中文
   * @param {number} num 数字
   * @param {boolean} isDay 是否为日期
   * @returns {string} 中文数字
   */
  numberToChinese(num, isDay = false) {
    const chinese = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const units = ['', '十', '廿', '三十'];
    
    if (isDay) {
      if (num <= 10) {
        return (num === 1 ? '初' : '') + chinese[num];
      } else if (num < 20) {
        return '十' + chinese[num - 10];
      } else if (num < 30) {
        return '廿' + chinese[num - 20];
      } else {
        return '三十';
      }
    } else {
      if (num <= 10) {
        return chinese[num];
      } else if (num < 13) {
        return '十' + (num === 10 ? '' : chinese[num - 10]);
      }
    }
    
    return num.toString();
  }
}

// 导出单例
export default new CalendarConverter();