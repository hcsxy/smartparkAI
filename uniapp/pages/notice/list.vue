<template>
  <view class="page">
    <view class="tabs">
      <view v-for="t in tabs" :key="t.v" :class="['tab',{active:category===t.v}]" @click="switchTab(t.v)">{{ t.t }}</view>
    </view>
    <view class="list">
      <view class="notice" v-for="n in list" :key="n.id" @click="go(n.id)">
        <view class="n-top">
          <text v-if="n.top === 1" class="top-tag">置顶</text>
          <text class="n-title">{{ n.title }}</text>
        </view>
        <view class="n-summary" v-if="n.summary">{{ n.summary }}</view>
        <view class="n-meta">
          <text>{{ catText(n.category) }}</text>
          <text>{{ short(n.publishTime) }}</text>
        </view>
      </view>
    </view>
    <view class="empty" v-if="loaded && !list.length">暂无公告</view>
  </view>
</template>

<script>
import { noticeList } from '@/api/common'

export default {
  data() {
    return {
      category: '',
      tabs: [{ v: '', t: '全部' }, { v: 'notice', t: '通知' }, { v: 'activity', t: '活动' }, { v: 'warning', t: '预警' }],
      list: [],
      loaded: false
    }
  },
  onLoad() {
    this.load()
  },
  methods: {
    async load() {
      const res = await noticeList(1, 20, this.category || undefined)
      this.list = res.records
      this.loaded = true
    },
    switchTab(v) {
      this.category = v
      this.load()
    },
    go(id) {
      uni.navigateTo({ url: '/pages/notice/detail?id=' + id })
    },
    catText(c) {
      return { notice: '通知', activity: '活动', warning: '预警' }[c] || c
    },
    short(t) {
      return t ? t.replace('T', ' ').substring(0, 16) : ''
    }
  }
}
</script>

<style>
page { background: #f5f7fa; }
.page { padding: 24rpx; }
.tabs { display: flex; gap: 12rpx; margin-bottom: 20rpx; }
.tab { padding: 12rpx 32rpx; background: #fff; border-radius: 30rpx; font-size: 26rpx; color: #606266; }
.tab.active { background: #1b4b91; color: #fff; }
.notice { background: #fff; border-radius: 18rpx; padding: 26rpx 24rpx; margin-bottom: 16rpx; }
.n-top { display: flex; align-items: center; gap: 12rpx; }
.top-tag { background: #f56c6c; color: #fff; font-size: 20rpx; padding: 2rpx 12rpx; border-radius: 8rpx; }
.n-title { font-size: 30rpx; font-weight: 500; color: #1f2d3d; }
.n-summary { font-size: 26rpx; color: #909399; margin-top: 12rpx; }
.n-meta { display: flex; justify-content: space-between; font-size: 24rpx; color: #c0c4cc; margin-top: 14rpx; }
.empty { text-align: center; color: #909399; padding: 80rpx 0; font-size: 28rpx; }
</style>
