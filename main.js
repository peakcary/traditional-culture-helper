import { createSSRApp } from 'vue'
import App from './App.vue'
import pinia from './stores/index.js'

export function createApp() {
  const app = createSSRApp(App)
  
  // 使用 Pinia
  app.use(pinia)
  
  // 全局配置
  app.config.globalProperties.$store = pinia
  
  return {
    app
  }
}