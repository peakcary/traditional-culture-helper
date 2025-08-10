<template>
  <view class="container">
    <scroll-view scroll-y="true" class="scroll-container" :class="{'loaded': isLoaded}">
      <!-- 头部信息 -->
      <view class="header-card">
        <view class="person-info">
          <view class="person-title">
            <text class="gender-icon">{{ baziData.gender === '男' ? '👨' : '👩' }}</text>
            <text class="person-name">{{ baziData.gender }}命</text>
          </view>
          <view class="birth-info">
            <text class="birth-text">
              {{ formatBirthDate(baziData.birthDate) }}
            </text>
          </view>
        </view>
      </view>
      
      <!-- 八字排盘 -->
      <view class="bazi-card">
        <view class="card-title">八字排盘</view>
        <view class="bazi-grid">
          <view class="bazi-column">
            <view class="column-header">年柱</view>
            <view class="pillar-container">
              <view class="gan">{{ baziData.pillars.year.gan }}</view>
              <view class="zhi">{{ baziData.pillars.year.zhi }}</view>
            </view>
            <view class="wuxing">{{ baziData.pillars.year.ganWuXing }}{{ baziData.pillars.year.zhiWuXing }}</view>
          </view>
          
          <view class="bazi-column">
            <view class="column-header">月柱</view>
            <view class="pillar-container">
              <view class="gan">{{ baziData.pillars.month.gan }}</view>
              <view class="zhi">{{ baziData.pillars.month.zhi }}</view>
            </view>
            <view class="wuxing">{{ baziData.pillars.month.ganWuXing }}{{ baziData.pillars.month.zhiWuXing }}</view>
          </view>
          
          <view class="bazi-column highlight">
            <view class="column-header">日柱(本命)</view>
            <view class="pillar-container">
              <view class="gan">{{ baziData.pillars.day.gan }}</view>
              <view class="zhi">{{ baziData.pillars.day.zhi }}</view>
            </view>
            <view class="wuxing">{{ baziData.pillars.day.ganWuXing }}{{ baziData.pillars.day.zhiWuXing }}</view>
          </view>
          
          <view class="bazi-column">
            <view class="column-header">时柱</view>
            <view class="pillar-container">
              <view class="gan">{{ baziData.pillars.hour.gan }}</view>
              <view class="zhi">{{ baziData.pillars.hour.zhi }}</view>
            </view>
            <view class="wuxing">{{ baziData.pillars.hour.ganWuXing }}{{ baziData.pillars.hour.zhiWuXing }}</view>
          </view>
        </view>
      </view>
      
      <!-- 五行分析 -->
      <view class="analysis-card">
        <view class="card-title">五行分析</view>
        
        <!-- 五行雷达图 -->
        <WuxingRadar 
          :wuxingData="baziData.analysis.wuXing.count" 
          :size="280"
        />
        
        <view class="wuxing-stats">
          <view 
            v-for="(wx, key) in baziData.analysis.wuXing.count" 
            :key="key"
            class="wuxing-item"
            :class="getWuXingClass(key)"
          >
            <view class="wx-name">{{ key }}</view>
            <view class="wx-count">{{ wx.toFixed(1) }}</view>
            <view class="wx-level">{{ baziData.analysis.wuXing.level[key] }}</view>
          </view>
        </view>
        
        <view class="wuxing-summary">
          <view class="summary-item">
            <text class="summary-label">最强:</text>
            <text class="summary-value strong">{{ baziData.analysis.wuXing.strongest }}</text>
          </view>
          <view class="summary-item">
            <text class="summary-label">最弱:</text>
            <text class="summary-value weak">{{ baziData.analysis.wuXing.weakest }}</text>
          </view>
        </view>
      </view>
      
      <!-- 命理分析 -->
      <view class="analysis-card">
        <view class="card-title">命理分析</view>
        
        <view class="analysis-section">
          <view class="section-header">
            <text class="section-icon">💪</text>
            <text class="section-title">日主强弱</text>
          </view>
          <view class="analysis-content">
            <view class="strength-display">
              <text class="strength-text">{{ baziData.analysis.qiangRuo.level }}</text>
              <text class="strength-score">({{ baziData.analysis.qiangRuo.score }}分)</text>
            </view>
            <text class="analysis-desc">{{ baziData.analysis.qiangRuo.analysis }}</text>
          </view>
        </view>
        
        <view class="analysis-section">
          <view class="section-header">
            <text class="section-icon">🎯</text>
            <text class="section-title">用神忌神</text>
          </view>
          <view class="analysis-content">
            <view class="yongshen-display">
              <view class="ys-item">
                <text class="ys-label">用神:</text>
                <text class="ys-value useful">{{ baziData.analysis.yongShen.yongShen.join('、') }}</text>
              </view>
              <view class="ys-item">
                <text class="ys-label">忌神:</text>
                <text class="ys-value avoid">{{ baziData.analysis.yongShen.jiShen.join('、') }}</text>
              </view>
            </view>
            <text class="analysis-desc">{{ baziData.analysis.yongShen.analysis }}</text>
          </view>
        </view>
        
        <view class="analysis-section">
          <view class="section-header">
            <text class="section-icon">🏆</text>
            <text class="section-title">命局格局</text>
          </view>
          <view class="analysis-content">
            <view class="geju-display">
              <text class="geju-name">{{ baziData.analysis.geJu.name }}</text>
              <text class="geju-level">{{ baziData.analysis.geJu.level }}</text>
            </view>
            <text class="analysis-desc">{{ baziData.analysis.geJu.description }}</text>
          </view>
        </view>
      </view>
      
      <!-- 详细运势分析 -->
      <view v-if="fortuneData" class="fortune-card">
        <view class="card-title">详细运势分析</view>
        
        <!-- 综合运势 -->
        <view class="fortune-section">
          <view class="fortune-header">
            <text class="fortune-icon">🌟</text>
            <text class="fortune-title">综合运势</text>
            <view class="fortune-score" :class="getScoreClass(fortuneData.overall.score)">
              {{ fortuneData.overall.score }}分
            </view>
          </view>
          <view class="fortune-content">
            <view class="fortune-level">{{ fortuneData.overall.level }}</view>
            <text class="fortune-desc">{{ fortuneData.overall.description }}</text>
            <text class="fortune-analysis">{{ fortuneData.overall.analysis }}</text>
          </view>
        </view>
        
        <!-- 分类运势 -->
        <view class="category-fortune">
          <view class="category-grid">
            <view class="category-item">
              <view class="category-header">
                <text class="category-icon">💼</text>
                <text class="category-name">事业</text>
                <view class="category-score" :class="getScoreClass(fortuneData.career.score)">
                  {{ fortuneData.career.score }}分
                </view>
              </view>
              <view class="category-level">{{ fortuneData.career.level }}</view>
              <text class="category-desc">{{ fortuneData.career.description }}</text>
            </view>
            
            <view class="category-item">
              <view class="category-header">
                <text class="category-icon">💰</text>
                <text class="category-name">财运</text>
                <view class="category-score" :class="getScoreClass(fortuneData.wealth.score)">
                  {{ fortuneData.wealth.score }}分
                </view>
              </view>
              <view class="category-level">{{ fortuneData.wealth.level }}</view>
              <text class="category-desc">{{ fortuneData.wealth.description }}</text>
            </view>
            
            <view class="category-item">
              <view class="category-header">
                <text class="category-icon">❤️</text>
                <text class="category-name">感情</text>
                <view class="category-score" :class="getScoreClass(fortuneData.love.score)">
                  {{ fortuneData.love.score }}分
                </view>
              </view>
              <view class="category-level">{{ fortuneData.love.level }}</view>
              <text class="category-desc">{{ fortuneData.love.description }}</text>
            </view>
            
            <view class="category-item">
              <view class="category-header">
                <text class="category-icon">🏥</text>
                <text class="category-name">健康</text>
                <view class="category-score" :class="getScoreClass(fortuneData.health.score)">
                  {{ fortuneData.health.score }}分
                </view>
              </view>
              <view class="category-level">{{ fortuneData.health.level }}</view>
              <text class="category-desc">{{ fortuneData.health.description }}</text>
            </view>
          </view>
        </view>
        
        <!-- 改运建议 -->
        <view class="suggestions-section">
          <view class="suggestions-header">
            <text class="suggestions-icon">💡</text>
            <text class="suggestions-title">改运建议</text>
          </view>
          <view class="suggestions-list">
            <view 
              v-for="(suggestion, index) in fortuneData.overall.suggestions" 
              :key="index"
              class="suggestion-item"
            >
              <text class="suggestion-dot">•</text>
              <text class="suggestion-text">{{ suggestion }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 操作按钮 -->
      <view class="action-buttons">
        <button class="action-btn secondary" @tap="shareResult">
          <text class="btn-icon">📤</text>
          <text class="btn-text">分享</text>
        </button>
        
        <button class="action-btn primary" @tap="goBack">
          <text class="btn-icon">🔄</text>
          <text class="btn-text">重新测算</text>
        </button>
      </view>
      
      <!-- 免责声明 -->
      <view class="disclaimer">
        <text class="disclaimer-text">
          ⚠️ 以上分析基于传统命理学算法，结果仅供娱乐参考，请理性对待。
        </text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import WuxingRadar from '@/components/WuxingRadar.vue'
import FortuneEngine from '@/utils/fortune-engine.js'
import { useBaziStore } from '@/stores/baziStore.js'

// 响应式状态
const baziData = ref(null)
const fortuneData = ref(null)
const isLoaded = ref(false)

// 使用 Pinia Store
const baziStore = useBaziStore()

// 方法定义
const calculateDetailedFortune = () => {
  if (!baziData.value) return
  
  fortuneData.value = {
    overall: FortuneEngine.analyzeOverallFortune(baziData.value),
    career: FortuneEngine.analyzeCareerFortune(baziData.value),
    wealth: FortuneEngine.analyzeWealthFortune(baziData.value),
    love: FortuneEngine.analyzeLoveFortune(baziData.value),
    health: FortuneEngine.analyzeHealthFortune(baziData.value)
  }
  
  console.log('运势数据:', fortuneData.value)
}

const getScoreClass = (score) => {
  if (score >= 80) return 'score-excellent'
  if (score >= 65) return 'score-good'  
  if (score >= 40) return 'score-average'
  return 'score-poor'
}

const formatBirthDate = (birthDate) => {
  const solar = birthDate.solar
  const lunar = birthDate.lunar
  
  const solarStr = `公历${solar.year}年${solar.month}月${solar.day}日${solar.hour}时`
  const lunarStr = `农历${lunar.year}${lunar.zodiac}年`
  
  return `${solarStr}\n${lunarStr}`
}

const getWuXingClass = (wuxing) => {
  const classMap = {
    '木': 'wood',
    '火': 'fire',
    '土': 'earth',
    '金': 'metal',
    '水': 'water'
  }
  return classMap[wuxing] || ''
}

const shareResult = () => {
  const shareContent = generateShareContent()
  
  // #ifdef MP-WEIXIN
  wx.showShareMenu({
    withShareTicket: true
  })
  // #endif
  
  // #ifdef H5
  if (navigator.share) {
    navigator.share({
      title: '我的八字分析结果',
      text: shareContent,
      url: window.location.href
    })
  } else {
    // 复制到剪贴板
    uni.setClipboardData({
      data: shareContent,
      success: () => {
        uni.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        })
      }
    })
  }
  // #endif
}

const generateShareContent = () => {
  if (!baziData.value) return ''
  
  const pillars = baziData.value.pillars
  const baziStr = `${pillars.year.gan}${pillars.year.zhi} ${pillars.month.gan}${pillars.month.zhi} ${pillars.day.gan}${pillars.day.zhi} ${pillars.hour.gan}${pillars.hour.zhi}`
  
  return `我的八字：${baziStr}\n日主${baziData.value.analysis.qiangRuo.level}，${baziData.value.analysis.geJu.name}\n来太乙数衍测测你的八字吧！`
}

const goBack = () => {
  uni.navigateBack()
}

// 页面加载时处理参数  
onMounted(() => {
  // 在 uni-app Vue 3 中获取页面参数
  const instance = getCurrentInstance()
  const options = instance?.proxy?.$scope?.options || {}
  
  if (options.data) {
    try {
      baziData.value = JSON.parse(decodeURIComponent(options.data))
      console.log('八字数据:', baziData.value)
      
      // 保存到 store
      baziStore.setBaziData(baziData.value)
      
      // 计算详细运势分析
      calculateDetailedFortune()
      
      // 添加加载动画效果
      setTimeout(() => {
        isLoaded.value = true
      }, 300)
    } catch (error) {
      console.error('解析八字数据失败:', error)
      uni.showToast({
        title: '数据解析失败',
        icon: 'none'
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  } else {
    uni.showToast({
      title: '缺少数据', 
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.scroll-container {
  height: 100vh;
  padding: 40rpx 30rpx;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease-out;
  
  &.loaded {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-card {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  .person-info {
    text-align: center;
    
    .person-title {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20rpx;
      
      .gender-icon {
        font-size: 40rpx;
        margin-right: 15rpx;
      }
      
      .person-name {
        font-size: 36rpx;
        font-weight: bold;
        color: #2c3e50;
      }
    }
    
    .birth-info {
      .birth-text {
        font-size: 26rpx;
        color: #7f8c8d;
        line-height: 1.5;
        white-space: pre-line;
      }
    }
  }
}

.bazi-card, .analysis-card {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  .card-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 30rpx;
    text-align: center;
  }
}

.bazi-grid {
  display: flex;
  justify-content: space-between;
  gap: 10rpx;
  
  .bazi-column {
    flex: 1;
    text-align: center;
    
    &.highlight {
      background: linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(46, 204, 113, 0.1));
      border-radius: 15rpx;
      padding: 20rpx 10rpx;
    }
    
    .column-header {
      font-size: 24rpx;
      color: #7f8c8d;
      margin-bottom: 15rpx;
    }
    
    .pillar-container {
      margin-bottom: 15rpx;
      
      .gan, .zhi {
        display: inline-block;
        width: 60rpx;
        height: 60rpx;
        line-height: 60rpx;
        font-size: 32rpx;
        font-weight: bold;
        color: #2c3e50;
        border: 2rpx solid #3498db;
        border-radius: 10rpx;
        margin: 5rpx;
        background: rgba(52, 152, 219, 0.1);
      }
    }
    
    .wuxing {
      font-size: 22rpx;
      color: #e67e22;
      font-weight: 500;
    }
  }
}

.wuxing-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
  
  .wuxing-item {
    flex: 1;
    text-align: center;
    padding: 20rpx 10rpx;
    border-radius: 15rpx;
    margin: 0 5rpx;
    
    &.wood { background: rgba(46, 204, 113, 0.15); }
    &.fire { background: rgba(231, 76, 60, 0.15); }
    &.earth { background: rgba(230, 126, 34, 0.15); }
    &.metal { background: rgba(149, 165, 166, 0.15); }
    &.water { background: rgba(52, 152, 219, 0.15); }
    
    .wx-name {
      font-size: 28rpx;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 8rpx;
    }
    
    .wx-count {
      font-size: 32rpx;
      font-weight: bold;
      color: #3498db;
      margin-bottom: 8rpx;
    }
    
    .wx-level {
      font-size: 24rpx;
      color: #7f8c8d;
    }
  }
}

.wuxing-summary {
  display: flex;
  justify-content: center;
  gap: 60rpx;
  
  .summary-item {
    .summary-label {
      font-size: 26rpx;
      color: #7f8c8d;
      margin-right: 10rpx;
    }
    
    .summary-value {
      font-size: 26rpx;
      font-weight: bold;
      
      &.strong { color: #e74c3c; }
      &.weak { color: #3498db; }
    }
  }
}

.analysis-section {
  margin-bottom: 40rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    
    .section-icon {
      font-size: 32rpx;
      margin-right: 15rpx;
    }
    
    .section-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #2c3e50;
    }
  }
  
  .analysis-content {
    background: #f8f9fa;
    border-radius: 15rpx;
    padding: 25rpx;
    
    .analysis-desc {
      font-size: 26rpx;
      color: #7f8c8d;
      line-height: 1.5;
      margin-top: 15rpx;
    }
  }
}

.strength-display {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
  
  .strength-text {
    font-size: 32rpx;
    font-weight: bold;
    color: #e67e22;
    margin-right: 15rpx;
  }
  
  .strength-score {
    font-size: 26rpx;
    color: #7f8c8d;
  }
}

.yongshen-display {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
  margin-bottom: 15rpx;
  
  .ys-item {
    display: flex;
    align-items: center;
    
    .ys-label {
      font-size: 26rpx;
      color: #7f8c8d;
      margin-right: 15rpx;
      min-width: 80rpx;
    }
    
    .ys-value {
      font-size: 28rpx;
      font-weight: bold;
      
      &.useful { color: #27ae60; }
      &.avoid { color: #e74c3c; }
    }
  }
}

.geju-display {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
  
  .geju-name {
    font-size: 32rpx;
    font-weight: bold;
    color: #8e44ad;
    margin-right: 20rpx;
  }
  
  .geju-level {
    font-size: 24rpx;
    color: #7f8c8d;
    background: rgba(142, 68, 173, 0.1);
    padding: 8rpx 16rpx;
    border-radius: 20rpx;
  }
}

.action-buttons {
  display: flex;
  gap: 30rpx;
  margin: 40rpx 0;
  
  .action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 25rpx;
    border-radius: 50rpx;
    font-size: 28rpx;
    font-weight: bold;
    border: none;
    
    .btn-icon {
      font-size: 32rpx;
      margin-right: 10rpx;
    }
    
    &.primary {
      background: linear-gradient(45deg, #3498db, #2ecc71);
      color: white;
      box-shadow: 0 8rpx 25rpx rgba(52, 152, 219, 0.3);
    }
    
    &.secondary {
      background: rgba(255, 255, 255, 0.9);
      color: #2c3e50;
      box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.1);
    }
  }
}

.fortune-card {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  .fortune-section {
    margin-bottom: 40rpx;
    
    .fortune-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20rpx;
      
      .fortune-icon {
        font-size: 32rpx;
        margin-right: 15rpx;
      }
      
      .fortune-title {
        flex: 1;
        font-size: 28rpx;
        font-weight: bold;
        color: #2c3e50;
      }
      
      .fortune-score {
        padding: 8rpx 16rpx;
        border-radius: 20rpx;
        font-size: 24rpx;
        font-weight: bold;
        color: white;
        
        &.score-excellent { background: #27ae60; }
        &.score-good { background: #3498db; }
        &.score-average { background: #f39c12; }
        &.score-poor { background: #e74c3c; }
      }
    }
    
    .fortune-content {
      background: #f8f9fa;
      border-radius: 15rpx;
      padding: 25rpx;
      
      .fortune-level {
        font-size: 32rpx;
        font-weight: bold;
        color: #8e44ad;
        margin-bottom: 15rpx;
      }
      
      .fortune-desc {
        font-size: 26rpx;
        color: #2c3e50;
        line-height: 1.6;
        margin-bottom: 15rpx;
        display: block;
      }
      
      .fortune-analysis {
        font-size: 24rpx;
        color: #7f8c8d;
        line-height: 1.5;
        display: block;
      }
    }
  }
}

.category-fortune {
  .category-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    
    .category-item {
      flex: 1;
      min-width: 45%;
      background: #f8f9fa;
      border-radius: 15rpx;
      padding: 20rpx;
      
      .category-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15rpx;
        
        .category-icon {
          font-size: 24rpx;
          margin-right: 8rpx;
        }
        
        .category-name {
          flex: 1;
          font-size: 24rpx;
          font-weight: bold;
          color: #2c3e50;
        }
        
        .category-score {
          padding: 4rpx 12rpx;
          border-radius: 15rpx;
          font-size: 20rpx;
          font-weight: bold;
          color: white;
          
          &.score-excellent { background: #27ae60; }
          &.score-good { background: #3498db; }
          &.score-average { background: #f39c12; }
          &.score-poor { background: #e74c3c; }
        }
      }
      
      .category-level {
        font-size: 26rpx;
        font-weight: bold;
        color: #8e44ad;
        margin-bottom: 10rpx;
      }
      
      .category-desc {
        font-size: 22rpx;
        color: #7f8c8d;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
}

.suggestions-section {
  border-top: 2rpx solid #ecf0f1;
  padding-top: 30rpx;
  
  .suggestions-header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    
    .suggestions-icon {
      font-size: 32rpx;
      margin-right: 15rpx;
    }
    
    .suggestions-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #2c3e50;
    }
  }
  
  .suggestions-list {
    .suggestion-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 15rpx;
      
      .suggestion-dot {
        color: #3498db;
        font-size: 28rpx;
        margin-right: 15rpx;
        margin-top: 2rpx;
      }
      
      .suggestion-text {
        flex: 1;
        font-size: 26rpx;
        color: #2c3e50;
        line-height: 1.5;
      }
    }
  }
}

.disclaimer {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15rpx;
  padding: 25rpx;
  margin-bottom: 40rpx;
  
  .disclaimer-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 24rpx;
    text-align: center;
    line-height: 1.5;
  }
}
</style>