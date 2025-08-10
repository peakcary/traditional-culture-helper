<template>
  <view class="radar-container">
    <canvas 
      id="wuxingRadar" 
      canvas-id="wuxingRadar"
      class="radar-canvas"
      :style="{width: size + 'px', height: size + 'px'}"
      @touchstart="handleTouch"
    ></canvas>
    
    <!-- 五行说明 -->
    <view class="radar-legend">
      <view 
        v-for="(item, key) in wuxingData" 
        :key="key"
        class="legend-item"
        :class="'legend-' + key"
      >
        <view class="legend-color" :style="{backgroundColor: getWuxingColor(key)}"></view>
        <text class="legend-name">{{ key }}</text>
        <text class="legend-value">{{ item.toFixed(1) }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, defineProps, defineEmits } from 'vue'

// Props 定义
const props = defineProps({
  wuxingData: {
    type: Object,
    default: () => ({
      '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
    })
  },
  size: {
    type: Number,
    default: 300
  }
})

// Emits 定义
const emit = defineEmits(['touch'])

// 响应式状态
const ctx = ref(null)
const centerX = ref(0)
const centerY = ref(0)
const radius = ref(0)

// 方法定义
const initCanvas = () => {
  const context = uni.createCanvasContext('wuxingRadar')
  ctx.value = context
  centerX.value = props.size / 2
  centerY.value = props.size / 2
  radius.value = (props.size * 0.8) / 2
}

const drawRadar = () => {
  if (!ctx.value) return
  
  // 清空画布
  ctx.value.clearRect(0, 0, props.size, props.size)
  
  // 绘制背景网格
  drawGrid()
  
  // 绘制五行数据
  drawWuxingData()
  
  // 绘制标签
  drawLabels()
  
  ctx.value.draw()
}

const drawGrid = () => {
  const context = ctx.value
  const steps = 5 // 5个层级
  
  context.setLineCap('round')
  context.setLineJoin('round')
  
  // 绘制同心多边形
  for (let i = 1; i <= steps; i++) {
    const r = (radius.value / steps) * i
    context.beginPath()
    context.setStrokeStyle('#e0e6ed')
    context.setLineWidth(1)
    
    for (let j = 0; j < 5; j++) {
      const angle = (j * 2 * Math.PI) / 5 - Math.PI / 2
      const x = centerX.value + r * Math.cos(angle)
      const y = centerY.value + r * Math.sin(angle)
      
      if (j === 0) {
        context.moveTo(x, y)
      } else {
        context.lineTo(x, y)
      }
    }
    
    context.closePath()
    context.stroke()
  }
  
  // 绘制从中心到顶点的线
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
    const x = centerX.value + radius.value * Math.cos(angle)
    const y = centerY.value + radius.value * Math.sin(angle)
    
    context.beginPath()
    context.moveTo(centerX.value, centerY.value)
    context.lineTo(x, y)
    context.setStrokeStyle('#e0e6ed')
    context.setLineWidth(1)
    context.stroke()
  }
}

const drawWuxingData = () => {
  const context = ctx.value
  const wuxingOrder = ['木', '火', '土', '金', '水']
  
  // 找到最大值用于标准化
  const maxValue = Math.max(...Object.values(props.wuxingData), 1)
  
  // 绘制填充区域
  context.beginPath()
  context.setFillStyle('rgba(52, 152, 219, 0.3)')
  context.setStrokeStyle('#3498db')
  context.setLineWidth(2)
  
  wuxingOrder.forEach((wx, index) => {
    const value = props.wuxingData[wx] || 0
    const normalizedValue = value / maxValue
    const r = radius.value * normalizedValue
    const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2
    const x = centerX.value + r * Math.cos(angle)
    const y = centerY.value + r * Math.sin(angle)
    
    if (index === 0) {
      context.moveTo(x, y)
    } else {
      context.lineTo(x, y)
    }
  })
  
  context.closePath()
  context.fill()
  context.stroke()
  
  // 绘制数据点
  wuxingOrder.forEach((wx, index) => {
    const value = props.wuxingData[wx] || 0
    const normalizedValue = value / maxValue
    const r = radius.value * normalizedValue
    const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2
    const x = centerX.value + r * Math.cos(angle)
    const y = centerY.value + r * Math.sin(angle)
    
    // 绘制数据点
    context.beginPath()
    context.arc(x, y, 4, 0, 2 * Math.PI)
    context.setFillStyle(getWuxingColor(wx))
    context.fill()
    
    // 绘制边框
    context.beginPath()
    context.arc(x, y, 4, 0, 2 * Math.PI)
    context.setStrokeStyle('#fff')
    context.setLineWidth(2)
    context.stroke()
  })
}

const drawLabels = () => {
  const context = ctx.value
  const wuxingOrder = ['木', '火', '土', '金', '水']
  
  context.setFontSize(14)
  context.setFillStyle('#2c3e50')
  context.setTextAlign('center')
  
  wuxingOrder.forEach((wx, index) => {
    const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2
    const labelRadius = radius.value + 20
    const x = centerX.value + labelRadius * Math.cos(angle)
    const y = centerY.value + labelRadius * Math.sin(angle)
    
    context.fillText(wx, x, y + 5)
  })
}

const getWuxingColor = (wuxing) => {
  const colors = {
    '木': '#2ecc71',  // 绿色
    '火': '#e74c3c',  // 红色
    '土': '#f39c12',  // 橙色
    '金': '#95a5a6',  // 灰色
    '水': '#3498db'   // 蓝色
  }
  return colors[wuxing] || '#95a5a6'
}

const handleTouch = (e) => {
  emit('touch', e)
  console.log('Radar touched:', e)
}

// 生命周期
onMounted(() => {
  nextTick(() => {
    initCanvas()
    drawRadar()
  })
})

// 监听器
watch(() => props.wuxingData, () => {
  nextTick(() => {
    drawRadar()
  })
}, { deep: true })
</script>

<style lang="scss" scoped>
.radar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
}

.radar-canvas {
  border-radius: 15rpx;
  background: #f8f9fa;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.radar-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20rpx;
  
  .legend-item {
    display: flex;
    align-items: center;
    padding: 8rpx 16rpx;
    background: white;
    border-radius: 20rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
    
    .legend-color {
      width: 20rpx;
      height: 20rpx;
      border-radius: 50%;
      margin-right: 10rpx;
    }
    
    .legend-name {
      font-size: 24rpx;
      color: #2c3e50;
      margin-right: 8rpx;
      font-weight: 500;
    }
    
    .legend-value {
      font-size: 22rpx;
      color: #7f8c8d;
      font-weight: bold;
    }
  }
}
</style>