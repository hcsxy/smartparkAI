<template>
  <view class="page">
    <view class="card">
      <view class="card-title">停车缴费</view>
      <view class="field">
        <text class="field-label">车牌号</text>
        <input class="field-input" v-model="plateNo" placeholder="请输入车牌号 如 粤A12345" />
      </view>
      <button class="btn-query" @click="query">查询费用</button>
    </view>

    <view class="card" v-if="record">
      <view class="fee-box">
        <text class="fee-label">应缴金额</text>
        <text class="fee-amount">￥{{ record.fee || 0 }}</text>
      </view>
      <view class="row"><text>车牌号</text><text>{{ record.plateNo }}</text></view>
      <view class="row"><text>入场时间</text><text>{{ short(record.enterTime) }}</text></view>
      <view class="row"><text>状态</text><text>{{ payText(record.payStatus) }}</text></view>

      <button v-if="canPay" class="btn-pay" @click="pay">微信支付 ￥{{ record.fee }}</button>
      <view v-else class="paid-tip">
        {{ record.payStatus === 'free' ? '白名单车辆免费通行' : '无需缴费' }}
      </view>
    </view>
  </view>
</template>

<script>
import { queryFee, payParking } from '@/api/parking'

export default {
  data() {
    return { plateNo: '', record: null }
  },
  computed: {
    canPay() {
      return this.record && this.record.payStatus === 'unpaid' && Number(this.record.fee) > 0
    }
  },
  methods: {
    async query() {
      if (!this.plateNo) return uni.showToast({ title: '请输入车牌号', icon: 'none' })
      try {
        this.record = await queryFee(this.plateNo.toUpperCase())
      } catch (e) {}
    },
    payText(s) {
      return { unpaid: '待缴费', paid: '已缴费', free: '免费' }[s] || s
    },
    short(t) {
      return t ? t.replace('T', ' ').substring(0, 16) : ''
    },
    async pay() {
      try {
        await payParking(this.record.id)
        uni.showToast({ title: '缴费成功', icon: 'success' })
        this.query()
      } catch (e) {}
    }
  }
}
</script>

<style>
page { background: #f5f7fa; }
.page { padding: 24rpx; }
.card {
  background: #fff; border-radius: 24rpx; padding: 36rpx 32rpx; margin-bottom: 24rpx;
  box-shadow: 0 8rpx 30rpx rgba(27,75,145,.06);
}
.card-title { font-size: 34rpx; font-weight: bold; color: #1f2d3d; margin-bottom: 28rpx; }
.field-label { display: block; font-size: 26rpx; color: #909399; margin-bottom: 12rpx; }
.field-input { height: 84rpx; background: #f5f7fa; border-radius: 14rpx; padding: 0 24rpx; font-size: 28rpx; }
.btn-query { margin-top: 28rpx; background: linear-gradient(135deg,#2f7cd6,#1b4b91); color: #fff; border-radius: 44rpx; font-size: 30rpx; }
.fee-box { text-align: center; padding: 30rpx 0; }
.fee-label { display: block; font-size: 26rpx; color: #909399; }
.fee-amount { font-size: 64rpx; font-weight: bold; color: #f56c6c; margin-top: 12rpx; }
.row { display: flex; justify-content: space-between; padding: 16rpx 0; font-size: 28rpx; color: #606266; border-bottom: 1rpx solid #f0f2f5; }
.btn-pay { margin-top: 30rpx; background: #07c160; color: #fff; border-radius: 44rpx; font-size: 32rpx; }
.paid-tip { text-align: center; color: #67c23a; margin-top: 30rpx; font-size: 28rpx; }
</style>
