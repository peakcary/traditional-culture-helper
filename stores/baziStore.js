/**
 * 八字数据状态管理 - Pinia Store
 * 管理八字计算结果、历史记录等数据
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBaziStore = defineStore('bazi', () => {
  // 状态 (使用 ref)
  const currentBaziData = ref(null)
  const baziHistory = ref([])
  const isCalculating = ref(false)
  
  // 计算属性 (使用 computed)
  const hasCurrentData = computed(() => currentBaziData.value !== null)
  
  const historyCount = computed(() => baziHistory.value.length)
  
  const latestHistory = computed(() => {
    return baziHistory.value.slice(0, 5) // 最近5条记录
  })
  
  // 操作方法 (Actions)
  const setBaziData = (data) => {
    currentBaziData.value = data
    
    // 自动保存到历史记录
    if (data) {
      addToHistory(data)
    }
  }
  
  const addToHistory = (data) => {
    const historyItem = {
      id: Date.now(),
      data: { ...data },
      timestamp: new Date(),
      title: generateHistoryTitle(data)
    }
    
    // 检查是否已存在相同数据，避免重复
    const exists = baziHistory.value.some(item => 
      item.data.baziString?.join('') === data.baziString?.join('')
    )
    
    if (!exists) {
      baziHistory.value.unshift(historyItem)
      
      // 限制历史记录数量，保留最新50条
      if (baziHistory.value.length > 50) {
        baziHistory.value = baziHistory.value.slice(0, 50)
      }
      
      // 保存到本地存储
      saveHistoryToStorage()
    }
  }
  
  const removeFromHistory = (id) => {
    const index = baziHistory.value.findIndex(item => item.id === id)
    if (index !== -1) {
      baziHistory.value.splice(index, 1)
      saveHistoryToStorage()
    }
  }
  
  const clearHistory = () => {
    baziHistory.value = []
    uni.removeStorageSync('bazi_history')
  }
  
  const loadHistoryFromStorage = () => {
    try {
      const stored = uni.getStorageSync('bazi_history')
      if (stored) {
        baziHistory.value = JSON.parse(stored).map(item => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }))
      }
    } catch (error) {
      console.error('加载历史记录失败:', error)
    }
  }
  
  const saveHistoryToStorage = () => {
    try {
      uni.setStorageSync('bazi_history', JSON.stringify(baziHistory.value))
    } catch (error) {
      console.error('保存历史记录失败:', error)
    }
  }
  
  const generateHistoryTitle = (data) => {
    if (!data || !data.pillars) return '未知记录'
    
    const { year, month, day, hour } = data.pillars
    const baziStr = `${year.gan}${year.zhi} ${month.gan}${month.zhi} ${day.gan}${day.zhi} ${hour.gan}${hour.zhi}`
    const gender = data.gender || '未知'
    
    return `${gender}命 ${baziStr}`
  }
  
  const setCalculating = (status) => {
    isCalculating.value = status
  }
  
  // 初始化，从本地存储加载历史记录
  const init = () => {
    loadHistoryFromStorage()
  }
  
  // 返回响应式状态和方法
  return {
    // 状态
    currentBaziData,
    baziHistory,
    isCalculating,
    
    // 计算属性
    hasCurrentData,
    historyCount,
    latestHistory,
    
    // 方法
    setBaziData,
    addToHistory,
    removeFromHistory,
    clearHistory,
    setCalculating,
    init
  }
})