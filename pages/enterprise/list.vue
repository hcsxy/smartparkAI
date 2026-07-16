<template>
  <view class="page">
    <view class="search">
      <input class="search-input" v-model="keyword" placeholder="搜索企业名称" @confirm="load" />
      <text class="search-btn" @click="load">搜索</text>
    </view>

    <view class="list">
      <view class="ent" v-for="e in list" :key="e.id">
        <image v-if="e.logoUrl" :src="e.logoUrl" class="logo" mode="aspectFit" />
        <view v-else class="logo-ph">{{ e.name.substring(0, 1) }}</view>
        <view class="ent-info">
          <view class="ent-name">{{ e.name }}</view>
          <view class="ent-meta">{{ e.industry || '' }} · {{ e.floorDesc || '' }}</view>
          <view class="ent-intro" v-if="e.intro">{{ e.intro }}</view>
        </view>
      </view>
    </view>
    <view class="empty" v-if="loaded && !list.length">未找到相关企业</view>
  </view>
</template>

<script>
import { enterpriseList } from '@/api/common'

export default {
  data() {
    return { keyword: '', list: [], loaded: false }
  },
  onLoad() {
    this.load()
  },
  methods: {
    async load() {
      this.list = await enterpriseList(undefined, this.keyword || undefined)
      this.loaded = true
    }
  }
}
</script>

<style>
page { background: #f5f7fa; }
.page { padding: 24rpx; }
.search { display: flex; align-items: center; background: #fff; border-radius: 44rpx; padding: 8rpx 12rpx 8rpx 28rpx; margin-bottom: 24rpx; }
.search-input { flex: 1; height: 68rpx; font-size: 28rpx; }
.search-btn { padding: 0 28rpx; color: #1b4b91; font-size: 28rpx; }
.ent { background: #fff; border-radius: 18rpx; padding: 24rpx; margin-bottom: 16rpx; display: flex; gap: 20rpx; }
.logo, .logo-ph { width: 96rpx; height: 96rpx; border-radius: 14rpx; flex-shrink: 0; }
.logo-ph { background: linear-gradient(135deg,#1b4b91,#2f7cd6); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 40rpx; font-weight: bold; }
.ent-info { flex: 1; }
.ent-name { font-size: 30rpx; font-weight: bold; color: #1f2d3d; }
.ent-meta { font-size: 24rpx; color: #909399; margin-top: 8rpx; }
.ent-intro { font-size: 24rpx; color: #606266; margin-top: 10rpx; }
.empty { text-align: center; color: #909399; padding: 80rpx 0; font-size: 28rpx; }
</style>
