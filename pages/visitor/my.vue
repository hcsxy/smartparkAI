<template>
  <view class="page">
    <view class="list" v-if="list.length">
      <view class="item" v-for="v in list" :key="v.id">
        <view class="item-head">
          <text class="name">{{ v.name }}</text>
          <text class="status" :class="'st-' + v.status">{{ statusText(v.status) }}</text>
        </view>
        <view class="row"><text class="label">手机号</text><text>{{ v.mobile }}</text></view>
        <view class="row"><text class="label">有效期</text><text>{{ short(v.appointStart) }} ~ {{ short(v.appointEnd) }}</text></view>
        <view class="row"><text class="label">通行码</text><text class="qr">{{ v.qrCode }}</text></view>
      </view>
    </view>
    <view class="empty" v-else>暂无邀请记录</view>

    <button class="btn-new" @click="goInvite">+ 邀请新访客</button>
  </view>
</template>

<script>
import { myVisitors } from '@/api/visitor'

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
        this.list = await myVisitors()
      } catch (e) {}
    },
    statusText(s) {
      return { approved: '已通过', checkedin: '已签到', left: '已离场', rejected: '已拒绝', expired: '已过期' }[s] || s
    },
    short(t) {
      return t ? t.replace('T', ' ').substring(5, 16) : ''
    },
    goInvite() {
      uni.navigateTo({ url: '/pages/visitor/invite' })
    }
  }
}
</script>

<style>
page { background: #f5f7fa; }
.page { padding: 24rpx; }
.item {
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 6rpx 20rpx rgba(27, 75, 145, 0.05);
}
.item-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; }
.name { font-size: 32rpx; font-weight: bold; color: #1f2d3d; }
.status { font-size: 24rpx; padding: 4rpx 16rpx; border-radius: 20rpx; }
.st-approved { background: #e7f4ea; color: #2e7d32; }
.st-checkedin { background: #fff4e5; color: #e67e22; }
.st-left { background: #eef0f3; color: #909399; }
.st-rejected { background: #fdecea; color: #e53935; }
.row { display: flex; justify-content: space-between; font-size: 26rpx; color: #606266; padding: 8rpx 0; }
.label { color: #909399; }
.qr { color: #1b4b91; }
.empty { text-align: center; color: #c0c4cc; padding: 120rpx 0; font-size: 28rpx; }
.btn-new {
  position: fixed;
  bottom: 40rpx;
  left: 24rpx;
  right: 24rpx;
  background: linear-gradient(135deg, #2f7cd6, #1b4b91);
  color: #fff;
  border-radius: 44rpx;
  font-size: 30rpx;
}
</style>
