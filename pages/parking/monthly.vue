<template>
  <view class="page">
    <view class="card">
      <view class="card-title">月卡续费</view>
      <view class="field">
        <text class="field-label">车牌号</text>
        <input class="field-input" v-model="plateNo" placeholder="请输入车牌号 如 粤A12345" />
      </view>
      <button class="btn-query" @click="query">查询月卡</button>
    </view>

    <view class="card" v-if="queried">
      <view v-if="card">
        <view class="row"><text>车牌号</text><text>{{ card.plateNo }}</text></view>
        <view class="row"><text>车主</text><text>{{ card.ownerName || '-' }}</text></view>
        <view class="row"><text>当前到期</text><text :class="{expired: isExpired}">{{ card.endDate || '未开通' }}</text></view>
      </view>
      <view v-else class="tip">该车暂无月卡，续费即开通</view>

      <view class="field" style="margin-top:24rpx">
        <text class="field-label">续费月数</text>
        <view class="months">
          <view v-for="m in [1,3,6,12]" :key="m" :class="['m-item',{active:months===m}]" @click="months=m">{{ m }}个月</view>
        </view>
      </view>
      <view class="amount">应付 <text class="amt">￥{{ months * 300 }}</text></view>
      <button class="btn-pay" @click="renew">微信支付续费</button>
    </view>
  </view>
</template>

<script>
import { queryMonthly, renewMonthly } from '@/api/parking'

export default {
  data() {
    return { plateNo: '', card: null, queried: false, months: 1 }
  },
  computed: {
    isExpired() {
      return this.card && this.card.endDate && this.card.endDate < new Date().toISOString().substring(0, 10)
    }
  },
  methods: {
    async query() {
      if (!this.plateNo) return uni.showToast({ title: '请输入车牌号', icon: 'none' })
      this.card = await queryMonthly(this.plateNo.toUpperCase())
      this.queried = true
    },
    async renew() {
      try {
        this.card = await renewMonthly(this.plateNo.toUpperCase(), this.card ? this.card.ownerName : '', this.months)
        uni.showToast({ title: '续费成功', icon: 'success' })
      } catch (e) {}
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
.row { display: flex; justify-content: space-between; padding: 16rpx 0; font-size: 28rpx; color: #606266; border-bottom: 1rpx solid #f0f2f5; }
.expired { color: #f56c6c; }
.tip { text-align: center; color: #909399; padding: 20rpx 0; font-size: 28rpx; }
.months { display: flex; gap: 16rpx; }
.m-item { flex: 1; text-align: center; padding: 20rpx 0; background: #f5f7fa; border-radius: 14rpx; font-size: 26rpx; color: #606266; }
.m-item.active { background: #1b4b91; color: #fff; }
.amount { text-align: center; margin: 30rpx 0 10rpx; font-size: 28rpx; color: #606266; }
.amount .amt { font-size: 48rpx; font-weight: bold; color: #f56c6c; }
.btn-pay { margin-top: 20rpx; background: #07c160; color: #fff; border-radius: 44rpx; font-size: 32rpx; }
</style>
