<template>
  <view class="page">
    <view class="list" v-if="list.length">
      <view class="item" v-for="w in list" :key="w.id">
        <view class="item-head">
          <text class="title">{{ w.title }}</text>
          <text class="status" :class="'st-' + w.status">{{ statusText(w.status) }}</text>
        </view>
        <view class="desc">{{ w.content || '无描述' }}</view>
        <view class="foot">
          <text class="no">{{ w.orderNo }}</text>
          <text class="time">{{ short(w.createTime) }}</text>
        </view>
      </view>
    </view>
    <view class="empty" v-else>暂无报修记录</view>
    <button class="btn-new" @click="goRepair">+ 新建报修</button>
  </view>
</template>

<script>
import { myRepairs } from '@/api/repair'

export default {
  data() {
    return { list: [] }
  },
  onShow() {
    this.load()
  },
  methods: {
    async load() {
      try {
        this.list = await myRepairs()
      } catch (e) {}
    },
    statusText(s) {
      return { pending: '待派单', assigned: '已派单', processing: '处理中', done: '已完成', verified: '已验收' }[s] || s
    },
    short(t) {
      return t ? t.replace('T', ' ').substring(0, 16) : ''
    },
    goRepair() {
      uni.navigateTo({ url: '/pages/repair/repair' })
    }
  }
}
</script>

<style>
page { background: #f5f7fa; }
.page { padding: 24rpx; }
.item { background: #fff; border-radius: 20rpx; padding: 28rpx; margin-bottom: 20rpx; box-shadow: 0 6rpx 20rpx rgba(27,75,145,.05); }
.item-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14rpx; }
.title { font-size: 30rpx; font-weight: bold; color: #1f2d3d; }
.status { font-size: 24rpx; padding: 4rpx 16rpx; border-radius: 20rpx; background: #eef0f3; color: #606266; }
.st-pending { background: #fdecea; color: #e53935; }
.st-processing { background: #fff4e5; color: #e67e22; }
.st-done, .st-verified { background: #e7f4ea; color: #2e7d32; }
.desc { font-size: 26rpx; color: #606266; margin-bottom: 14rpx; }
.foot { display: flex; justify-content: space-between; font-size: 22rpx; color: #909399; }
.empty { text-align: center; color: #c0c4cc; padding: 120rpx 0; font-size: 28rpx; }
.btn-new { position: fixed; bottom: 40rpx; left: 24rpx; right: 24rpx; background: linear-gradient(135deg,#2f7cd6,#1b4b91); color: #fff; border-radius: 44rpx; font-size: 30rpx; }
</style>
