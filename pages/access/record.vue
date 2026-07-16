<template>
  <view class="page">
    <view v-if="list.length" class="list">
      <view class="rec" v-for="r in list" :key="r.id">
        <view class="rec-left">
          <view class="rec-point">{{ r.accessPointName || '门禁点' }}</view>
          <view class="rec-time">{{ short(r.passTime) }}</view>
        </view>
        <view class="rec-right">
          <text :class="['dir', r.direction]">{{ dirText(r.direction) }}</text>
          <text :class="['result', r.result]">{{ r.result === 'pass' ? '通过' : '拒绝' }}</text>
        </view>
      </view>
    </view>
    <view class="empty" v-else-if="loaded">暂无通行记录</view>

    <view class="loadmore" v-if="hasMore && list.length" @click="loadMore">加载更多</view>
  </view>
</template>

<script>
import { accessRecords } from '@/api/common'

export default {
  data() {
    return { list: [], current: 1, size: 10, total: 0, loaded: false, userId: null }
  },
  computed: {
    hasMore() {
      return this.list.length < this.total
    }
  },
  onLoad() {
    this.userId = uni.getStorageSync('userId') || null
    this.load()
  },
  methods: {
    async load() {
      const res = await accessRecords(this.userId, this.current, this.size)
      this.list = this.current === 1 ? res.records : this.list.concat(res.records)
      this.total = res.total
      this.loaded = true
    },
    loadMore() {
      this.current++
      this.load()
    },
    dirText(d) {
      return { in: '进', out: '出' }[d] || d
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
.rec { background: #fff; border-radius: 18rpx; padding: 28rpx 24rpx; margin-bottom: 16rpx; display: flex; justify-content: space-between; align-items: center; }
.rec-point { font-size: 30rpx; color: #1f2d3d; font-weight: 500; }
.rec-time { font-size: 24rpx; color: #909399; margin-top: 8rpx; }
.rec-right { text-align: right; }
.dir { display: inline-block; padding: 4rpx 16rpx; border-radius: 20rpx; font-size: 24rpx; background: #ecf5ff; color: #1b4b91; }
.dir.out { background: #fdf6ec; color: #e6a23c; }
.result { display: block; font-size: 24rpx; margin-top: 10rpx; }
.result.pass { color: #67c23a; }
.result.deny { color: #f56c6c; }
.empty { text-align: center; color: #909399; padding: 80rpx 0; font-size: 28rpx; }
.loadmore { text-align: center; padding: 24rpx; color: #909399; font-size: 26rpx; }
</style>
