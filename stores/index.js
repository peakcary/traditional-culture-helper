/**
 * Pinia Store - Vue 3 推荐的状态管理
 * 替代 Vuex，提供更好的 TypeScript 支持和开发体验
 */

import { createPinia } from 'pinia'

// 创建 pinia 实例
const pinia = createPinia()

export default pinia

// 导出所有 store
export * from './baziStore.js'
export * from './userStore.js'