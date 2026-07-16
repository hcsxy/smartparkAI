<template>
  <view class="page">
    <view v-if="list.length === 0" class="empty">暂无预约记录</view>
    <view class="bk-card" v-for="b in list" :key="b.id">
      <view class="bk-head">
        <text class="bk-room">{{ b.roomName }}</text>
        <text class="tag" :class="b.status">{{ statusText(b.status) }}</text>
      </view>
      <view class="bk-subject">{{ b.subject || '会议' }}</view>
      <view class="bk-time">🕐 {{ fmt(b.startTime) }} ~ {{ fmt(b.endTime) }}</view>
      <view class="bk-no">预约号 {{ b.bookingNo }}</view>
      <view class="bk-actions">
        <button v-if="b.status === 'approved'" class="mini-btn primary" @click="doCheckin(b)">签到</button>
        <button v-if="b.status === 'pending' || b.status === 'approved'" class="mini-btn" @click="doCancel(b)">取消</button>
      </view>
    </view>
  </view>
</template>

<script>
import { myBookings, cancelBooking, checkinBooking } from '@/api/meeting'

export default {
  data() {
    return { list: [] }
  },
  onShow() {
    this.load()
  },
  methods: {
    fmt(t) {
      return t ? t.replace('T', ' ').slice(0, 16) : ''
    },
    statusText(s) {
      return ({ pending: '待审批', approved: '已通过', rejected: '已驳回', checkedin: '已签到', cancelled: '已取消', finished: '已结束' })[s] || s
    },
    async load() {
      this.list = (await myBookings()) || []
    },
    async doCancel(b) {
      const r = await new Promise(res => uni.showModal({ title: '提示', content: '确认取消该预约?', success: e => res(e.confirm) }))
      if (!r) return
      await cancelBooking(b.id)
      uni.showToast({ title: '已取消' })
      this.load()
    },
    async doCheckin(b) {
      await checkinBooking(b.id)
      uni.showToast({ title: '签到成功' })
      this.load()
    }
  }
}
</script>

<style>
page { background: #f5f7fa; }
.page { padding: 24rpx; }
.empty { text-align: center; color: #909399; padding: 80rpx 0; font-size: 28rpx; }
.bk-card { background: #fff; border-radius: 20rpx; padding: 28rpx; margin-bottom: 20rpx; box-shadow: 0 6rpx 20rpx rgba(27,75,145,.05); }
.bk-head { display: flex; justify-content: space-between; align-items: center; }
.bk-room { font-size: 30rpx; font-weight: bold; color: #303133; }
.tag { font-size: 22rpx; padding: 4rpx 16rpx; border-radius: 20rpx; }
.tag.pending { background: #fdf6ec; color: #e6a23c; }
.tag.approved { background: #e8f5e9; color: #43a047; }
.tag.rejected { background: #fef0f0; color: #f56c6c; }
.tag.checkedin { background: #ecf5ff; color: #409eff; }
.tag.cancelled { background: #f4f4f5; color: #909399; }
.bk-subject { font-size: 28rpx; color: #606266; margin-top: 14rpx; }
.bk-time { font-size: 26rpx; color: #606266; margin-top: 12rpx; }
.bk-no { font-size: 22rpx; color: #c0c4cc; margin-top: 10rpx; }
.bk-actions { display: flex; gap: 16rpx; justify-content: flex-end; margin-top: 16rpx; }
.mini-btn { font-size: 24rpx; padding: 0 30rpx; height: 56rpx; line-height: 56rpx; border-radius: 28rpx; background: #f0f2f5; color: #606266; margin: 0; }
.mini-btn.primary { background: linear-gradient(135deg, #1b4b91, #2f7cd6); color: #fff; }
</style>
