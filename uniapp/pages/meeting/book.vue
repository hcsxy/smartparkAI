<template>
  <view class="page">
    <view class="card">
      <view class="row"><text class="label">会议室</text><text class="value">{{ roomName }}</text></view>
      <view class="row"><text class="label">日期</text>
        <picker mode="date" :value="date" :start="today" @change="onDate">
          <text class="value pick">{{ date }} ›</text>
        </picker>
      </view>
      <view class="row"><text class="label">开始</text>
        <picker mode="time" :value="startT" @change="e => startT = e.detail.value">
          <text class="value pick">{{ startT }} ›</text>
        </picker>
      </view>
      <view class="row"><text class="label">结束</text>
        <picker mode="time" :value="endT" @change="e => endT = e.detail.value">
          <text class="value pick">{{ endT }} ›</text>
        </picker>
      </view>
      <view class="row"><text class="label">主题</text>
        <input class="input" v-model="subject" placeholder="请输入会议主题" />
      </view>
      <view class="row"><text class="label">人数</text>
        <input class="input" type="number" v-model="attendees" placeholder="参会人数" />
      </view>
    </view>

    <view class="card">
      <view class="card-title">当日已占用时段</view>
      <view v-if="occupied.length === 0" class="free">该日暂无预约，时段空闲</view>
      <view class="occ-row" v-for="o in occupied" :key="o.id">
        <text class="occ-time">{{ fmt(o.startTime) }} - {{ fmt(o.endTime) }}</text>
        <text class="occ-sub">{{ o.subject || '会议' }}</text>
      </view>
    </view>

    <button class="submit-btn" @click="submit">提交预约</button>
  </view>
</template>

<script>
import { book, dayBookings } from '@/api/meeting'

export default {
  data() {
    return {
      roomId: null,
      roomName: '',
      date: '',
      today: '',
      startT: '09:00',
      endT: '10:00',
      subject: '',
      attendees: '',
      occupied: []
    }
  },
  onLoad(options) {
    this.roomId = options.roomId
    this.roomName = decodeURIComponent(options.roomName || '')
    const d = new Date()
    this.today = this.dateStr(d)
    this.date = this.today
    this.loadOccupied()
  },
  methods: {
    dateStr(d) {
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
    },
    fmt(t) {
      return t ? t.replace('T', ' ').slice(11, 16) : ''
    },
    onDate(e) {
      this.date = e.detail.value
      this.loadOccupied()
    },
    async loadOccupied() {
      this.occupied = (await dayBookings(this.roomId, this.date)) || []
    },
    async submit() {
      if (!this.subject) {
        uni.showToast({ title: '请填写会议主题', icon: 'none' })
        return
      }
      const startTime = `${this.date}T${this.startT}:00`
      const endTime = `${this.date}T${this.endT}:00`
      if (endTime <= startTime) {
        uni.showToast({ title: '结束需晚于开始', icon: 'none' })
        return
      }
      try {
        await book({
          roomId: Number(this.roomId),
          subject: this.subject,
          startTime,
          endTime,
          attendees: this.attendees ? Number(this.attendees) : undefined
        })
        uni.showToast({ title: '预约成功' })
        setTimeout(() => uni.navigateTo({ url: '/pages/meeting/my' }), 800)
      } catch (e) {
        // request 封装已提示错误
      }
    }
  }
}
</script>

<style>
page { background: #f5f7fa; }
.page { padding: 24rpx; }
.card { background: #fff; border-radius: 20rpx; padding: 12rpx 28rpx; margin-bottom: 24rpx; box-shadow: 0 6rpx 20rpx rgba(27,75,145,.05); }
.row { display: flex; align-items: center; justify-content: space-between; padding: 24rpx 0; border-bottom: 1rpx solid #f0f2f5; }
.row:last-child { border-bottom: none; }
.label { font-size: 28rpx; color: #606266; width: 120rpx; }
.value { font-size: 28rpx; color: #303133; }
.value.pick { color: #1b4b91; }
.input { flex: 1; text-align: right; font-size: 28rpx; }
.card-title { font-size: 28rpx; font-weight: bold; color: #1f2d3d; padding: 20rpx 0; }
.free { font-size: 26rpx; color: #43a047; padding-bottom: 20rpx; }
.occ-row { display: flex; justify-content: space-between; padding: 16rpx 0; border-top: 1rpx solid #f5f5f5; }
.occ-time { font-size: 26rpx; color: #f56c6c; }
.occ-sub { font-size: 24rpx; color: #909399; }
.submit-btn { background: linear-gradient(135deg, #1b4b91, #2f7cd6); color: #fff; border-radius: 44rpx; font-size: 30rpx; margin-top: 20rpx; }
</style>
