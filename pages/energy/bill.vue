<template>
  <view class="page">
    <!-- 月份选择 -->
    <view class="month-bar">
      <text class="arrow" @click="changeMonth(-1)">‹</text>
      <text class="month">{{ month }}</text>
      <text class="arrow" :class="{disabled: isCurrentMonth}" @click="changeMonth(1)">›</text>
    </view>

    <!-- 总费用卡 -->
    <view class="total-card">
      <text class="total-label">本月能耗费用合计</text>
      <text class="total-amount">￥{{ bill.totalFee || 0 }}</text>
      <view class="total-sub">
        <text>碳排放 {{ bill.carbonKg || 0 }} kg</text>
        <text>折标煤 {{ bill.coalKgce || 0 }} kgce</text>
      </view>
      <view class="mom" :class="momClass">
        用电环比 {{ momText }}
      </view>
    </view>

    <!-- 三类能源明细 -->
    <view class="detail-card">
      <view class="detail-row" v-for="d in details" :key="d.key">
        <view class="d-left">
          <text class="d-ico">{{ d.ico }}</text>
          <text class="d-name">{{ d.name }}</text>
        </view>
        <view class="d-right">
          <text class="d-usage">{{ (bill[d.key] && bill[d.key].usage) || 0 }} {{ d.unit }}</text>
          <text class="d-fee">￥{{ (bill[d.key] && bill[d.key].fee) || 0 }}</text>
        </view>
      </view>
    </view>

    <!-- 峰谷电价明细 -->
    <view class="card" v-if="breakdown">
      <view class="card-title">电费峰谷明细</view>
      <view class="peak-row" v-for="p in peakRows" :key="p.key">
        <text class="peak-name" :class="p.key">{{ p.name }}</text>
        <text class="peak-kwh">{{ p.kwh }} 度 × {{ p.price }}</text>
        <text class="peak-fee">￥{{ p.fee }}</text>
      </view>
    </view>

    <!-- 节能建议 -->
    <view class="tip-card" v-if="bill.suggestion">
      <text class="tip-ico">💡</text>
      <text class="tip-txt">{{ bill.suggestion }}</text>
    </view>
  </view>
</template>

<script>
import { energyBill } from '@/api/common'

export default {
  data() {
    return {
      month: '',
      buildingId: null,
      bill: {},
      details: [
        { key: 'electric', name: '用电', ico: '⚡', unit: '度' },
        { key: 'water', name: '用水', ico: '💧', unit: '吨' },
        { key: 'gas', name: '燃气', ico: '🔥', unit: '立方' }
      ]
    }
  },
  computed: {
    isCurrentMonth() {
      return this.month === this.curMonthStr()
    },
    momClass() {
      const v = Number(this.bill.electricMomPercent || 0)
      return v > 0 ? 'up' : v < 0 ? 'down' : ''
    },
    momText() {
      const v = Number(this.bill.electricMomPercent || 0)
      if (v > 0) return '↑ ' + v + '%'
      if (v < 0) return '↓ ' + Math.abs(v) + '%'
      return '持平'
    },
    breakdown() {
      return this.bill.electricBreakdown
    },
    peakRows() {
      const b = this.bill.electricBreakdown
      if (!b) return []
      return [
        { key: 'peak', name: '峰', ...b.peak },
        { key: 'flat', name: '平', ...b.flat },
        { key: 'valley', name: '谷', ...b.valley }
      ]
    }
  },
  onLoad(options) {
    this.buildingId = options.buildingId || uni.getStorageSync('buildingId') || null
    this.month = this.curMonthStr()
    this.load()
  },
  methods: {
    curMonthStr() {
      const d = new Date()
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
    },
    changeMonth(delta) {
      if (delta > 0 && this.isCurrentMonth) return
      const [y, m] = this.month.split('-').map(Number)
      const d = new Date(y, m - 1 + delta, 1)
      this.month = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
      this.load()
    },
    async load() {
      this.bill = await energyBill(this.buildingId || undefined, this.month)
    }
  }
}
</script>

<style>
page { background: #f5f7fa; }
.page { padding: 24rpx; }
.month-bar {
  display: flex; align-items: center; justify-content: center; gap: 40rpx; margin-bottom: 24rpx;
}
.month { font-size: 32rpx; font-weight: bold; color: #1f2d3d; }
.arrow { font-size: 44rpx; color: #1b4b91; padding: 0 20rpx; }
.arrow.disabled { color: #c0c4cc; }
.total-card {
  background: linear-gradient(135deg, #1b4b91, #2f7cd6);
  border-radius: 24rpx; padding: 44rpx 36rpx; color: #fff; text-align: center;
  box-shadow: 0 10rpx 30rpx rgba(27,75,145,.2);
}
.total-label { font-size: 26rpx; opacity: .85; }
.total-amount { display: block; font-size: 68rpx; font-weight: bold; margin: 12rpx 0; }
.total-sub { display: flex; justify-content: center; gap: 40rpx; font-size: 24rpx; opacity: .85; }
.mom { margin-top: 18rpx; font-size: 26rpx; display: inline-block; padding: 6rpx 24rpx; border-radius: 30rpx; background: rgba(255,255,255,.15); }
.mom.up { color: #ffd6d6; }
.mom.down { color: #c8f5d0; }
.detail-card, .card, .tip-card {
  background: #fff; border-radius: 24rpx; padding: 32rpx; margin-top: 24rpx;
  box-shadow: 0 8rpx 30rpx rgba(27,75,145,.05);
}
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 20rpx 0; border-bottom: 1rpx solid #f0f2f5; }
.detail-row:last-child { border-bottom: none; }
.d-left { display: flex; align-items: center; gap: 16rpx; }
.d-ico { font-size: 40rpx; }
.d-name { font-size: 30rpx; color: #303133; }
.d-right { text-align: right; }
.d-usage { display: block; font-size: 26rpx; color: #909399; }
.d-fee { font-size: 30rpx; font-weight: bold; color: #f56c6c; }
.card-title { font-size: 30rpx; font-weight: bold; color: #1f2d3d; margin-bottom: 20rpx; }
.peak-row { display: flex; align-items: center; padding: 16rpx 0; font-size: 26rpx; }
.peak-name { width: 60rpx; height: 60rpx; line-height: 60rpx; text-align: center; border-radius: 50%; color: #fff; font-size: 26rpx; }
.peak-name.peak { background: #f56c6c; }
.peak-name.flat { background: #e6a23c; }
.peak-name.valley { background: #67c23a; }
.peak-kwh { flex: 1; padding-left: 20rpx; color: #606266; }
.peak-fee { font-weight: bold; color: #1f2d3d; }
.tip-card { display: flex; gap: 16rpx; align-items: flex-start; }
.tip-ico { font-size: 36rpx; }
.tip-txt { flex: 1; font-size: 26rpx; color: #606266; line-height: 1.6; }
</style>
