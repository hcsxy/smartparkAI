<template>
  <view class="page">
    <view class="top-bar">
      <text class="title">会议室</text>
      <text class="link" @click="goMy">我的预约 ›</text>
    </view>
    <view v-if="rooms.length === 0" class="empty">暂无可用会议室</view>
    <view class="room-card" v-for="r in rooms" :key="r.id" @click="goBook(r)">
      <view class="room-head">
        <text class="room-name">{{ r.roomName }}</text>
        <text class="tag" :class="r.status === 1 ? 'off' : 'on'">{{ r.status === 1 ? '停用' : '可预约' }}</text>
      </view>
      <view class="room-info">
        <text class="info-item">📍 {{ locationText(r) }}</text>
        <text class="info-item">👥 {{ r.capacity || 0 }}人</text>
      </view>
      <view class="room-info" v-if="r.equipment">
        <text class="facility">{{ r.equipment }}</text>
      </view>
      <view class="room-foot">
        <text class="open">开放 {{ r.openStart }} - {{ r.openEnd }}</text>
        <text class="need" v-if="r.needApprove === 1">需审批</text>
      </view>
    </view>
  </view>
</template>

<script>
import { listRooms } from '@/api/meeting'

export default {
  data() {
    return { rooms: [] }
  },
  onShow() {
    this.load()
  },
  methods: {
    async load() {
      this.rooms = (await listRooms({ status: 0 })) || []
    },
    locationText(r) {
      return r.code || (r.capacity ? r.capacity + '人会议室' : '会议室')
    },
    goBook(r) {
      if (r.status === 1) {
        uni.showToast({ title: '该会议室已停用', icon: 'none' })
        return
      }
      uni.navigateTo({ url: `/pages/meeting/book?roomId=${r.id}&roomName=${encodeURIComponent(r.roomName)}` })
    },
    goMy() {
      uni.navigateTo({ url: '/pages/meeting/my' })
    }
  }
}
</script>

<style>
page { background: #f5f7fa; }
.page { padding: 24rpx; }
.top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20rpx; }
.title { font-size: 34rpx; font-weight: bold; color: #1f2d3d; }
.link { font-size: 26rpx; color: #1b4b91; }
.empty { text-align: center; color: #909399; padding: 80rpx 0; font-size: 28rpx; }
.room-card { background: #fff; border-radius: 20rpx; padding: 28rpx; margin-bottom: 20rpx; box-shadow: 0 6rpx 20rpx rgba(27,75,145,.05); }
.room-head { display: flex; justify-content: space-between; align-items: center; }
.room-name { font-size: 32rpx; font-weight: bold; color: #303133; }
.tag { font-size: 22rpx; padding: 4rpx 16rpx; border-radius: 20rpx; }
.tag.on { background: #e8f5e9; color: #43a047; }
.tag.off { background: #f0f0f0; color: #999; }
.room-info { display: flex; gap: 30rpx; margin-top: 14rpx; }
.info-item { font-size: 26rpx; color: #606266; }
.facility { font-size: 24rpx; color: #909399; }
.room-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 16rpx; }
.open { font-size: 24rpx; color: #909399; }
.need { font-size: 22rpx; color: #e6a23c; }
</style>
