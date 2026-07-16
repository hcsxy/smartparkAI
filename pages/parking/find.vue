<template>
  <view class="page">
    <view class="card">
      <view class="card-title">反向寻车</view>
      <view class="field">
        <text class="field-label">车牌号</text>
        <input class="field-input" v-model="plateNo" placeholder="请输入车牌号 如 粤A12345" />
      </view>
      <button class="btn-query" @click="find">查找车辆</button>
    </view>

    <view class="card" v-if="record">
      <image v-if="record.entryImage" :src="record.entryImage" class="snap" mode="widthFix" />
      <view class="loc">
        <text class="loc-ico">🅿️</text>
        <text class="loc-txt">{{ lotName || ('车场#' + (record.lotId || '未知')) }}</text>
      </view>
      <view class="row"><text>车牌号</text><text>{{ record.plateNo }}</text></view>
      <view class="row"><text>入场时间</text><text>{{ short(record.enterTime) }}</text></view>
      <view class="row"><text>停车时长</text><text>{{ duration }}</text></view>
      <view class="tip-nav">如需步行导航，请前往车场指引屏扫码</view>
    </view>
    <view class="empty" v-else-if="searched">未找到该车在场记录</view>
  </view>
</template>

<script>
import { findVehicle } from '@/api/parking'

export default {
  data() {
    return { plateNo: '', record: null, lotName: '', searched: false }
  },
  computed: {
    duration() {
      if (!this.record || !this.record.enterTime) return '-'
      const enter = new Date(this.record.enterTime.replace(/-/g, '/').replace('T', ' '))
      const mins = Math.floor((Date.now() - enter.getTime()) / 60000)
      const h = Math.floor(mins / 60)
      return h > 0 ? `${h}小时${mins % 60}分` : `${mins}分钟`
    }
  },
  methods: {
    async find() {
      if (!this.plateNo) return uni.showToast({ title: '请输入车牌号', icon: 'none' })
      this.searched = true
      try {
        this.record = await findVehicle(this.plateNo.toUpperCase())
      } catch (e) {
        this.record = null
      }
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
.card { background: #fff; border-radius: 24rpx; padding: 36rpx 32rpx; margin-bottom: 24rpx; box-shadow: 0 8rpx 30rpx rgba(27,75,145,.06); }
.card-title { font-size: 34rpx; font-weight: bold; color: #1f2d3d; margin-bottom: 28rpx; }
.field-label { display: block; font-size: 26rpx; color: #909399; margin-bottom: 12rpx; }
.field-input { height: 84rpx; background: #f5f7fa; border-radius: 14rpx; padding: 0 24rpx; font-size: 28rpx; }
.btn-query { margin-top: 28rpx; background: linear-gradient(135deg,#2f7cd6,#1b4b91); color: #fff; border-radius: 44rpx; font-size: 30rpx; }
.snap { width: 100%; border-radius: 14rpx; margin-bottom: 20rpx; }
.loc { display: flex; align-items: center; gap: 12rpx; padding: 20rpx 0; }
.loc-ico { font-size: 44rpx; }
.loc-txt { font-size: 34rpx; font-weight: bold; color: #1b4b91; }
.row { display: flex; justify-content: space-between; padding: 16rpx 0; font-size: 28rpx; color: #606266; border-bottom: 1rpx solid #f0f2f5; }
.tip-nav { margin-top: 20rpx; font-size: 24rpx; color: #909399; text-align: center; }
.empty { text-align: center; color: #909399; padding: 60rpx 0; font-size: 28rpx; }
</style>
