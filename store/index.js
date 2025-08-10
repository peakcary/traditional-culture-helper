import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    currentBazi: null,
    historyList: [],
    userSettings: {
      theme: 'default',
      notifications: true
    }
  },
  
  mutations: {
    SET_CURRENT_BAZI(state, bazi) {
      state.currentBazi = bazi
    },
    
    ADD_HISTORY_ITEM(state, item) {
      state.historyList.unshift(item)
      // 限制历史记录最多20条
      if (state.historyList.length > 20) {
        state.historyList = state.historyList.slice(0, 20)
      }
    },
    
    REMOVE_HISTORY_ITEM(state, index) {
      state.historyList.splice(index, 1)
    },
    
    CLEAR_HISTORY(state) {
      state.historyList = []
    },
    
    SET_HISTORY_LIST(state, list) {
      state.historyList = list
    },
    
    UPDATE_USER_SETTINGS(state, settings) {
      state.userSettings = { ...state.userSettings, ...settings }
    }
  },
  
  actions: {
    setCurrentBazi({ commit }, bazi) {
      commit('SET_CURRENT_BAZI', bazi)
    },
    
    addHistoryItem({ commit, state }, baziData) {
      const item = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        data: baziData
      }
      
      commit('ADD_HISTORY_ITEM', item)
      
      // 同步到本地存储
      try {
        uni.setStorageSync('bazi_history', state.historyList)
      } catch (error) {
        console.error('保存历史记录失败:', error)
      }
    },
    
    removeHistoryItem({ commit, state }, index) {
      commit('REMOVE_HISTORY_ITEM', index)
      
      // 同步到本地存储
      try {
        uni.setStorageSync('bazi_history', state.historyList)
      } catch (error) {
        console.error('保存历史记录失败:', error)
      }
    },
    
    clearHistory({ commit }) {
      commit('CLEAR_HISTORY')
      
      // 清除本地存储
      try {
        uni.removeStorageSync('bazi_history')
      } catch (error) {
        console.error('清除历史记录失败:', error)
      }
    },
    
    loadHistoryFromStorage({ commit }) {
      try {
        const history = uni.getStorageSync('bazi_history') || []
        commit('SET_HISTORY_LIST', history)
      } catch (error) {
        console.error('加载历史记录失败:', error)
      }
    },
    
    updateUserSettings({ commit, state }, settings) {
      commit('UPDATE_USER_SETTINGS', settings)
      
      // 同步到本地存储
      try {
        uni.setStorageSync('user_settings', state.userSettings)
      } catch (error) {
        console.error('保存设置失败:', error)
      }
    },
    
    loadUserSettings({ commit }) {
      try {
        const settings = uni.getStorageSync('user_settings')
        if (settings) {
          commit('UPDATE_USER_SETTINGS', settings)
        }
      } catch (error) {
        console.error('加载设置失败:', error)
      }
    }
  },
  
  getters: {
    currentBazi: state => state.currentBazi,
    historyList: state => state.historyList,
    historyCount: state => state.historyList.length,
    userSettings: state => state.userSettings,
    
    // 获取最近的记录
    recentHistory: state => state.historyList.slice(0, 5),
    
    // 按时间分组的历史记录
    groupedHistory: state => {
      const grouped = {}
      
      state.historyList.forEach(item => {
        const date = new Date(item.timestamp)
        const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        
        if (!grouped[dateKey]) {
          grouped[dateKey] = []
        }
        grouped[dateKey].push(item)
      })
      
      return grouped
    }
  }
})

export default store