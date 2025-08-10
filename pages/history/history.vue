<template>
  <view class="container">
    <view class="header">
      <view class="title">历史记录</view>
      <view class="subtitle">查看之前的分析结果</view>
    </view>
    
    <view v-if="historyList.length === 0" class="empty-state">
      <view class="empty-icon">📚</view>
      <view class="empty-text">暂无历史记录</view>
      <view class="empty-desc">去测算一下八字吧</view>
      <button class="empty-btn" @tap="goToInput">开始测算</button>
    </view>
    
    <view v-else class="history-list">
      <view 
        v-for="(item, index) in historyList" 
        :key="item.id"
        class="history-item"
        @tap="viewResult(item)"
      >
        <view class="item-header">
          <view class="person-info">
            <text class="gender-icon">{{ item.data.gender === '男' ? '👨' : '👩' }}</text>
            <text class="gender-text">{{ item.data.gender }}命</text>
          </view>
          <view class="delete-btn" @tap.stop="deleteItem(index)">
            <text class="delete-icon">🗑️</text>
          </view>
        </view>
        
        <view class="bazi-preview">
          <view class="bazi-text">
            <text v-for="(pillar, pos) in item.data.baziString" :key="pos" class="pillar">
              {{ pillar }}
            </text>
          </view>
        </view>
        
        <view class="item-details">
          <view class="detail-row">
            <text class="detail-label">出生:</text>
            <text class="detail-value">{{ formatBirthDate(item.data.birthDate.solar) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">强弱:</text>
            <text class="detail-value strength">{{ item.data.analysis.qiangRuo.level }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">格局:</text>
            <text class="detail-value format">{{ item.data.analysis.geJu.name }}</text>
          </view>
        </view>
        
        <view class="item-footer">
          <text class="timestamp">{{ formatTimestamp(item.timestamp) }}</text>
          <text class="view-arrow">查看详情 →</text>
        </view>
      </view>
    </view>
    
    <view v-if="historyList.length > 0" class="clear-section">
      <button class="clear-btn" @tap="clearAllHistory">清空所有记录</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      historyList: []
    };
  },
  
  onShow() {
    this.loadHistory();
  },
  
  methods: {
    loadHistory() {
      try {
        const history = uni.getStorageSync('bazi_history') || [];
        this.historyList = history;
      } catch (error) {
        console.error('加载历史记录失败:', error);
        this.historyList = [];
      }
    },
    
    viewResult(item) {
      uni.navigateTo({
        url: `/pages/result/result?data=${encodeURIComponent(JSON.stringify(item.data))}`
      });
    },
    
    deleteItem(index) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这条记录吗？',
        success: (res) => {
          if (res.confirm) {
            this.historyList.splice(index, 1);
            this.saveHistory();
            
            uni.showToast({
              title: '已删除',
              icon: 'success'
            });
          }
        }
      });
    },
    
    clearAllHistory() {
      uni.showModal({
        title: '确认清空',
        content: '确定要清空所有历史记录吗？此操作不可恢复。',
        success: (res) => {
          if (res.confirm) {
            this.historyList = [];
            this.saveHistory();
            
            uni.showToast({
              title: '已清空',
              icon: 'success'
            });
          }
        }
      });
    },
    
    saveHistory() {
      try {
        uni.setStorageSync('bazi_history', this.historyList);
      } catch (error) {
        console.error('保存历史记录失败:', error);
      }
    },
    
    goToInput() {
      uni.navigateTo({
        url: '/pages/input/input'
      });
    },
    
    formatBirthDate(solarDate) {
      return `${solarDate.year}年${solarDate.month}月${solarDate.day}日`;
    },
    
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diffTime = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return '今天';
      } else if (diffDays === 1) {
        return '昨天';
      } else if (diffDays < 7) {
        return `${diffDays}天前`;
      } else {
        return `${date.getMonth() + 1}月${date.getDate()}日`;
      }
    }
  }
};
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
    font-size: 48rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }
  
  .subtitle {
    font-size: 26rpx;
    opacity: 0.8;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 40rpx;
  
  .empty-icon {
    font-size: 80rpx;
    margin-bottom: 30rpx;
  }
  
  .empty-text {
    font-size: 32rpx;
    color: white;
    font-weight: bold;
    margin-bottom: 15rpx;
  }
  
  .empty-desc {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 50rpx;
  }
  
  .empty-btn {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2rpx solid rgba(255, 255, 255, 0.3);
    border-radius: 50rpx;
    padding: 25rpx 50rpx;
    font-size: 28rpx;
    font-weight: bold;
  }
}

.history-list {
  .history-item {
    background: white;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.1);
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25rpx;
      
      .person-info {
        display: flex;
        align-items: center;
        
        .gender-icon {
          font-size: 32rpx;
          margin-right: 10rpx;
        }
        
        .gender-text {
          font-size: 28rpx;
          font-weight: bold;
          color: #2c3e50;
        }
      }
      
      .delete-btn {
        padding: 10rpx;
        
        .delete-icon {
          font-size: 28rpx;
          opacity: 0.6;
        }
      }
    }
    
    .bazi-preview {
      text-align: center;
      margin-bottom: 25rpx;
      
      .bazi-text {
        .pillar {
          display: inline-block;
          font-size: 32rpx;
          font-weight: bold;
          color: #3498db;
          margin: 0 15rpx;
          padding: 10rpx 15rpx;
          background: rgba(52, 152, 219, 0.1);
          border-radius: 10rpx;
        }
      }
    }
    
    .item-details {
      .detail-row {
        display: flex;
        align-items: center;
        margin-bottom: 12rpx;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .detail-label {
          font-size: 24rpx;
          color: #7f8c8d;
          min-width: 80rpx;
          margin-right: 20rpx;
        }
        
        .detail-value {
          font-size: 26rpx;
          color: #2c3e50;
          font-weight: 500;
          
          &.strength {
            color: #e67e22;
            font-weight: bold;
          }
          
          &.format {
            color: #8e44ad;
            font-weight: bold;
          }
        }
      }
    }
    
    .item-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 25rpx;
      padding-top: 20rpx;
      border-top: 1rpx solid #ecf0f1;
      
      .timestamp {
        font-size: 22rpx;
        color: #bdc3c7;
      }
      
      .view-arrow {
        font-size: 24rpx;
        color: #3498db;
        font-weight: 500;
      }
    }
  }
}

.clear-section {
  margin-top: 40rpx;
  text-align: center;
  
  .clear-btn {
    background: rgba(231, 76, 60, 0.2);
    color: #e74c3c;
    border: 2rpx solid rgba(231, 76, 60, 0.3);
    border-radius: 50rpx;
    padding: 20rpx 40rpx;
    font-size: 26rpx;
  }
}
</style>