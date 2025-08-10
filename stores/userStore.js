/**
 * 用户信息状态管理 - Pinia Store
 * 管理用户信息、设置、偏好等
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref(null)
  const settings = ref({
    theme: 'auto', // auto, light, dark
    defaultCalendar: 'solar', // solar, lunar
    enableNotifications: true,
    language: 'zh-CN'
  })
  
  const preferences = ref({
    showAnimations: true,
    autoSave: true,
    shareWithWatermark: true
  })
  
  // 计算属性
  const isLoggedIn = computed(() => userInfo.value !== null)
  
  const displayName = computed(() => {
    return userInfo.value?.nickname || userInfo.value?.name || '游客'
  })
  
  const avatar = computed(() => {
    return userInfo.value?.avatar || '/static/images/default-avatar.png'
  })
  
  // 操作方法
  const setUserInfo = (info) => {
    userInfo.value = info
    saveUserInfoToStorage()
  }
  
  const updateSettings = (newSettings) => {
    settings.value = { ...settings.value, ...newSettings }
    saveSettingsToStorage()
  }
  
  const updatePreferences = (newPreferences) => {
    preferences.value = { ...preferences.value, ...newPreferences }
    savePreferencesToStorage()
  }
  
  const logout = () => {
    userInfo.value = null
    uni.removeStorageSync('user_info')
    
    // 可选：清理其他用户相关数据
    // clearUserData()
  }
  
  // 存储操作
  const saveUserInfoToStorage = () => {
    try {
      if (userInfo.value) {
        uni.setStorageSync('user_info', JSON.stringify(userInfo.value))
      }
    } catch (error) {
      console.error('保存用户信息失败:', error)
    }
  }
  
  const loadUserInfoFromStorage = () => {
    try {
      const stored = uni.getStorageSync('user_info')
      if (stored) {
        userInfo.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('加载用户信息失败:', error)
    }
  }
  
  const saveSettingsToStorage = () => {
    try {
      uni.setStorageSync('user_settings', JSON.stringify(settings.value))
    } catch (error) {
      console.error('保存设置失败:', error)
    }
  }
  
  const loadSettingsFromStorage = () => {
    try {
      const stored = uni.getStorageSync('user_settings')
      if (stored) {
        settings.value = { ...settings.value, ...JSON.parse(stored) }
      }
    } catch (error) {
      console.error('加载设置失败:', error)
    }
  }
  
  const savePreferencesToStorage = () => {
    try {
      uni.setStorageSync('user_preferences', JSON.stringify(preferences.value))
    } catch (error) {
      console.error('保存偏好设置失败:', error)
    }
  }
  
  const loadPreferencesFromStorage = () => {
    try {
      const stored = uni.getStorageSync('user_preferences')
      if (stored) {
        preferences.value = { ...preferences.value, ...JSON.parse(stored) }
      }
    } catch (error) {
      console.error('加载偏好设置失败:', error)
    }
  }
  
  // 初始化
  const init = () => {
    loadUserInfoFromStorage()
    loadSettingsFromStorage()
    loadPreferencesFromStorage()
  }
  
  return {
    // 状态
    userInfo,
    settings,
    preferences,
    
    // 计算属性
    isLoggedIn,
    displayName,
    avatar,
    
    // 方法
    setUserInfo,
    updateSettings,
    updatePreferences,
    logout,
    init
  }
})