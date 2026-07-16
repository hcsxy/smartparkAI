<template>
  <view class="page">
    <view class="banner">
      <text class="banner-title">园区服务</text>
      <text class="banner-sub">一站式便捷服务入口</text>
    </view>
    <view class="grid">
      <view class="grid-item" v-for="s in services" :key="s.code" @click="go(s)">
        <view class="ico">{{ iconEmoji(s.icon) }}</view>
        <text class="name">{{ s.name }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { portalServices } from '@/api/portal'

const ICONS = { calendar: '📅', wrench: '🔧', person: '🧑', car: '🚗', wallet: '💰', bell: '🔔', wifi: '📶', building: '🏢' }

export default {
  data() {
    return { services: [] }
  },
  onLoad() {
    this.load()
  },
  methods: {
    iconEmoji(i) {
      return ICONS[i] || '🔹'
    },
    async load() {
      this.services = (await portalServices()) || []
    },
    go(s) {
      if (!s.path) return
      const tabPages = ['/pages/index/index', '/pages/portal/services', '/pages/notify/list', '/pages/mine/mine']
      const path = s.path.split('?')[0]
      if (tabPages.includes(path)) {
        uni.switchTab({ url: path })
        return
      }
      // tabBar/未注册页面兜底
      uni.navigateTo({
        url: s.path,
        fail: () => uni.showToast({ title: '功能开发中', icon: 'none' })
      })
    }
  }
}
</script>

<style>
page { background: #f5f7fa; }
.page { padding: 0 0 40rpx; }
.banner { background: linear-gradient(135deg, #1b4b91, #2f7cd6); padding: 60rpx 40rpx; color: #fff; }
.banner-title { font-size: 40rpx; font-weight: bold; display: block; }
.banner-sub { font-size: 26rpx; opacity: .85; margin-top: 10rpx; }
.grid { display: flex; flex-wrap: wrap; padding: 30rpx 20rpx; }
.grid-item { width: 25%; display: flex; flex-direction: column; align-items: center; padding: 24rpx 0; }
.ico { width: 96rpx; height: 96rpx; line-height: 96rpx; text-align: center; font-size: 48rpx; background: #fff; border-radius: 24rpx; box-shadow: 0 6rpx 20rpx rgba(27,75,145,.08); }
.name { font-size: 24rpx; color: #303133; margin-top: 14rpx; }
</style>
