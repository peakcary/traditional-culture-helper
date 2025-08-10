<template>
	<view id="app">
		<!-- uni-app 页面内容会自动注入 -->
	</view>
</template>

<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useBaziStore, useUserStore } from '@/stores/index.js'

// 初始化 stores
const baziStore = useBaziStore()
const userStore = useUserStore()

onLaunch(() => {
	console.log('App Launch')
	
	// 初始化应用数据
	baziStore.init()
	userStore.init()
	
	console.log('Stores initialized')
})

onShow(() => {
	console.log('App Show')
})

onHide(() => {
	console.log('App Hide')
})
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/static/styles/common.scss';
	
	page {
		background-color: #f5f5f5;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
	}
</style>