<template>
  <view class="container">
    <!-- 应用头部 -->
    <view class="header">
      <view class="title">太乙数衍</view>
      <view class="subtitle">传统八字命理分析</view>
    </view>
    
    <!-- 功能卡片 -->
    <view class="feature-card" @tap="goToInput">
      <view class="card-icon">🔮</view>
      <view class="card-content">
        <view class="card-title">开始八字分析</view>
        <view class="card-desc">输入出生信息，获取详细命理解读</view>
      </view>
      <view class="card-arrow">→</view>
    </view>
    
    <!-- 介绍说明 -->
    <view class="intro-section">
      <view class="section-title">功能介绍</view>
      <view class="intro-list">
        <view class="intro-item">
          <view class="intro-icon">⚡</view>
          <view class="intro-text">精准八字排盘</view>
        </view>
        <view class="intro-item">
          <view class="intro-icon">🌟</view>
          <view class="intro-text">五行强弱分析</view>
        </view>
        <view class="intro-item">
          <view class="intro-icon">📊</view>
          <view class="intro-text">运势预测分析</view>
        </view>
        <view class="intro-item">
          <view class="intro-icon">💎</view>
          <view class="intro-text">个性化解读</view>
        </view>
      </view>
    </view>
    
    <!-- 免责声明 -->
    <view class="disclaimer">
      <view class="disclaimer-text">
        ⚠️ 本应用基于传统文化算法，结果仅供娱乐参考，请理性对待。
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  methods: {
    goToInput() {
      uni.navigateTo({
        url: '/pages/input/input'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx 30rpx;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 60rpx;
  
  .title {
    font-size: 60rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }
  
  .subtitle {
    font-size: 28rpx;
    opacity: 0.8;
  }
}

.feature-card {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
  box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.15);
  
  .card-icon {
    font-size: 60rpx;
    margin-right: 30rpx;
  }
  
  .card-content {
    flex: 1;
    
    .card-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 10rpx;
    }
    
    .card-desc {
      font-size: 26rpx;
      color: #7f8c8d;
    }
  }
  
  .card-arrow {
    font-size: 40rpx;
    color: #3498db;
  }
}

.intro-section {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  margin-bottom: 40rpx;
  
  .section-title {
    color: white;
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 30rpx;
    text-align: center;
  }
  
  .intro-list {
    .intro-item {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;
      
      .intro-icon {
        font-size: 32rpx;
        margin-right: 20rpx;
      }
      
      .intro-text {
        color: white;
        font-size: 28rpx;
      }
    }
  }
}

.disclaimer {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15rpx;
  padding: 25rpx;
  
  .disclaimer-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 24rpx;
    text-align: center;
    line-height: 1.5;
  }
}
</style>