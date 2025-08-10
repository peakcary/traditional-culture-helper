<template>
  <view class="container">
    <view class="header">
      <view class="title">输入出生信息</view>
      <view class="subtitle">请准确填写出生时间，以获得精确的分析结果</view>
    </view>
    
    <!-- 性别选择 -->
    <view class="form-section">
      <view class="section-title">性别</view>
      <view class="gender-selector">
        <view 
          class="gender-item" 
          :class="{ active: form.gender === '男' }"
          @tap="selectGender('男')"
        >
          <text class="gender-icon">👨</text>
          <text class="gender-text">男</text>
        </view>
        <view 
          class="gender-item" 
          :class="{ active: form.gender === '女' }"
          @tap="selectGender('女')"
        >
          <text class="gender-icon">👩</text>
          <text class="gender-text">女</text>
        </view>
      </view>
    </view>
    
    <!-- 历法选择 -->
    <view class="form-section">
      <view class="section-title">历法</view>
      <view class="calendar-selector">
        <view 
          class="calendar-item" 
          :class="{ active: !form.isLunar }"
          @tap="selectCalendar(false)"
        >
          <text class="calendar-text">公历</text>
          <text class="calendar-desc">阳历</text>
        </view>
        <view 
          class="calendar-item" 
          :class="{ active: form.isLunar }"
          @tap="selectCalendar(true)"
        >
          <text class="calendar-text">农历</text>
          <text class="calendar-desc">阴历</text>
        </view>
      </view>
    </view>
    
    <!-- 出生日期 -->
    <view class="form-section">
      <view class="section-title">出生日期</view>
      <view class="date-selector" @tap="showDatePicker">
        <view class="date-display">
          <text class="date-text">{{ dateDisplayText }}</text>
          <text class="date-arrow">📅</text>
        </view>
      </view>
    </view>
    
    <!-- 出生时间 -->
    <view class="form-section">
      <view class="section-title">出生时间</view>
      <view class="time-selector" @tap="showTimePicker">
        <view class="time-display">
          <text class="time-text">{{ timeDisplayText }}</text>
          <text class="time-arrow">🕐</text>
        </view>
      </view>
      <view class="time-note">
        <text class="note-text">💡 出生时间对结果影响很大，请尽量准确填写</text>
      </view>
    </view>
    
    <!-- 提交按钮 -->
    <view class="submit-section">
      <button class="submit-btn" @tap="calculateBazi" :disabled="!isFormValid">
        开始分析
      </button>
    </view>
    
    <!-- 日期选择器 -->
    <picker
      v-if="showDateModal"
      mode="date"
      :value="form.date"
      @change="onDateChange"
      @cancel="showDateModal = false"
    >
      <view></view>
    </picker>
    
    <!-- 时间选择器 -->
    <picker
      v-if="showTimeModal"
      mode="time"
      :value="form.time"
      @change="onTimeChange"
      @cancel="showTimeModal = false"
    >
      <view></view>
    </picker>
  </view>
</template>

<script>
import BaziCalculator from '@/utils/bazi-calculator.js';

export default {
  data() {
    return {
      form: {
        gender: '男',
        isLunar: false,
        date: '',
        time: '',
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        hour: 12,
        minute: 0
      },
      showDateModal: false,
      showTimeModal: false,
      loading: false
    };
  },
  
  computed: {
    dateDisplayText() {
      if (!this.form.date) {
        return '请选择出生日期';
      }
      const date = new Date(this.form.date);
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    },
    
    timeDisplayText() {
      if (!this.form.time) {
        return '请选择出生时间';
      }
      const [hour, minute] = this.form.time.split(':');
      return `${hour}时${minute}分 (${this.getShiChenName(parseInt(hour))})`;
    },
    
    isFormValid() {
      return this.form.gender && this.form.date && this.form.time;
    }
  },
  
  onLoad() {
    // 设置默认日期为今天
    const now = new Date();
    this.form.date = now.toISOString().split('T')[0];
    this.form.time = '12:00';
  },
  
  methods: {
    selectGender(gender) {
      this.form.gender = gender;
    },
    
    selectCalendar(isLunar) {
      this.form.isLunar = isLunar;
    },
    
    showDatePicker() {
      this.showDateModal = true;
    },
    
    showTimePicker() {
      this.showTimeModal = true;
    },
    
    onDateChange(e) {
      this.form.date = e.detail.value;
      this.showDateModal = false;
    },
    
    onTimeChange(e) {
      this.form.time = e.detail.value;
      this.showTimeModal = false;
    },
    
    getShiChenName(hour) {
      const shiChen = [
        '子时', '丑时', '寅时', '卯时', '辰时', '巳时',
        '午时', '未时', '申时', '酉时', '戌时', '亥时'
      ];
      const index = Math.floor((hour + 1) / 2) % 12;
      return shiChen[index];
    },
    
    async calculateBazi() {
      if (!this.isFormValid) {
        uni.showToast({
          title: '请完善信息',
          icon: 'none'
        });
        return;
      }
      
      this.loading = true;
      
      try {
        // 构建完整的出生日期时间
        const [hour, minute] = this.form.time.split(':');
        const birthDateTime = new Date(`${this.form.date}T${this.form.time}:00`);
        
        // 计算八字
        const baziResult = BaziCalculator.calculateBazi(
          birthDateTime,
          this.form.gender,
          this.form.isLunar
        );
        
        // 保存到本地存储
        this.saveBaziHistory(baziResult);
        
        // 跳转到结果页面
        uni.navigateTo({
          url: `/pages/result/result?data=${encodeURIComponent(JSON.stringify(baziResult))}`
        });
        
      } catch (error) {
        console.error('计算八字失败:', error);
        uni.showToast({
          title: '计算失败，请重试',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    saveBaziHistory(baziResult) {
      try {
        let history = uni.getStorageSync('bazi_history') || [];
        
        // 添加时间戳和ID
        const record = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          data: baziResult
        };
        
        history.unshift(record);
        
        // 最多保存20条记录
        if (history.length > 20) {
          history = history.slice(0, 20);
        }
        
        uni.setStorageSync('bazi_history', history);
      } catch (error) {
        console.error('保存历史记录失败:', error);
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
    line-height: 1.4;
  }
}

.form-section {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.1);
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 30rpx;
  }
}

.gender-selector {
  display: flex;
  gap: 30rpx;
  
  .gender-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30rpx;
    border: 2rpx solid #ecf0f1;
    border-radius: 15rpx;
    transition: all 0.3s ease;
    
    &.active {
      border-color: #3498db;
      background-color: rgba(52, 152, 219, 0.1);
    }
    
    .gender-icon {
      font-size: 40rpx;
      margin-bottom: 10rpx;
    }
    
    .gender-text {
      font-size: 28rpx;
      color: #2c3e50;
      font-weight: bold;
    }
  }
}

.calendar-selector {
  display: flex;
  gap: 30rpx;
  
  .calendar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30rpx;
    border: 2rpx solid #ecf0f1;
    border-radius: 15rpx;
    transition: all 0.3s ease;
    
    &.active {
      border-color: #e67e22;
      background-color: rgba(230, 126, 34, 0.1);
    }
    
    .calendar-text {
      font-size: 30rpx;
      color: #2c3e50;
      font-weight: bold;
      margin-bottom: 8rpx;
    }
    
    .calendar-desc {
      font-size: 24rpx;
      color: #7f8c8d;
    }
  }
}

.date-selector, .time-selector {
  .date-display, .time-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 25rpx 30rpx;
    background-color: #f8f9fa;
    border-radius: 15rpx;
    border: 2rpx solid #ecf0f1;
    
    .date-text, .time-text {
      font-size: 30rpx;
      color: #2c3e50;
      font-weight: 500;
    }
    
    .date-arrow, .time-arrow {
      font-size: 32rpx;
    }
  }
}

.time-note {
  margin-top: 20rpx;
  
  .note-text {
    font-size: 24rpx;
    color: #7f8c8d;
    line-height: 1.4;
  }
}

.submit-section {
  margin-top: 60rpx;
  
  .submit-btn {
    width: 100%;
    background: linear-gradient(45deg, #3498db, #2ecc71);
    color: white;
    font-size: 36rpx;
    font-weight: bold;
    padding: 30rpx;
    border-radius: 50rpx;
    border: none;
    box-shadow: 0 8rpx 25rpx rgba(52, 152, 219, 0.3);
    
    &:disabled {
      background: #bdc3c7;
      box-shadow: none;
    }
  }
}
</style>