<template>
  <view class="index">
    <view class="banner">
      <view class="banner-title">海创科技城智慧园区</view>
      <view class="banner-sub">一站式园区服务</view>
    </view>

    <view class="section">
      <view class="section-title">访客服务</view>
      <view class="grid">
        <view class="cell" @click="go('/pages/visitor/my')">
          <text class="cell-ico">📨</text><text class="cell-txt">访客邀请</text>
        </view>
        <view class="cell" @click="go('/pages/visitor/invite')">
          <text class="cell-ico">➕</text><text class="cell-txt">邀请访客</text>
        </view>
        <view class="cell" @click="go('/pages/access/record')">
          <text class="cell-ico">🚪</text><text class="cell-txt">通行记录</text>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">停车服务</view>
      <view class="grid">
        <view class="cell" @click="go('/pages/parking/pay')">
          <text class="cell-ico">💰</text><text class="cell-txt">停车缴费</text>
        </view>
        <view class="cell" @click="go('/pages/parking/monthly')">
          <text class="cell-ico">🎫</text><text class="cell-txt">月卡续费</text>
        </view>
        <view class="cell" @click="go('/pages/parking/find')">
          <text class="cell-ico">🔍</text><text class="cell-txt">反向寻车</text>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">园区服务</view>
      <view class="grid">
        <view class="cell" @click="go('/pages/repair/repair')">
          <text class="cell-ico">🔧</text><text class="cell-txt">扫码报修</text>
        </view>
        <view class="cell" @click="go('/pages/repair/my')">
          <text class="cell-ico">📋</text><text class="cell-txt">我的报修</text>
        </view>
        <view class="cell" @click="go('/pages/safety/report')">
          <text class="cell-ico">⚠️</text><text class="cell-txt">隐患上报</text>
        </view>
        <view class="cell" @click="go('/pages/enterprise/list')">
          <text class="cell-ico">🏢</text><text class="cell-txt">企业查询</text>
        </view>
        <view class="cell" @click="go('/pages/energy/bill')">
          <text class="cell-ico">⚡</text><text class="cell-txt">能耗账单</text>
        </view>
        <view class="cell" @click="go('/pages/meeting/list')">
          <text class="cell-ico">📅</text><text class="cell-txt">会议室预约</text>
        </view>
        <view class="cell" @click="goTab('/pages/notify/list')">
          <text class="cell-ico">🔔</text><text class="cell-txt">消息通知</text>
        </view>
        <view class="cell" @click="go('/pages/portal/wifi')">
          <text class="cell-ico">📶</text><text class="cell-txt">连接WiFi</text>
        </view>
        <view class="cell" @click="go('/pages/notice/list')">
          <text class="cell-ico">📢</text><text class="cell-txt">园区公告</text>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
export default {
  methods: {
    go(url) {
      uni.navigateTo({ url })
    },
    goTab(url) {
      uni.switchTab({ url })
    }
  }
}
</script>

<style>
page { background: #f5f7fa; }
.index { padding-bottom: 40rpx; }
.banner {
  background: linear-gradient(135deg, #1b4b91, #2f7cd6);
  padding: 60rpx 40rpx 70rpx;
  color: #fff;
  border-radius: 0 0 32rpx 32rpx;
}
.banner-title { font-size: 40rpx; font-weight: bold; }
.banner-sub { font-size: 26rpx; opacity: 0.85; margin-top: 12rpx; }
.section { margin: 24rpx; background: #fff; border-radius: 20rpx; padding: 28rpx 24rpx; box-shadow: 0 6rpx 20rpx rgba(27,75,145,.05); }
.section-title { font-size: 30rpx; font-weight: bold; color: #1f2d3d; margin-bottom: 20rpx; }
.grid { display: flex; flex-wrap: wrap; }
.cell { width: 25%; display: flex; flex-direction: column; align-items: center; padding: 16rpx 0; }
.cell-ico { font-size: 52rpx; }
.cell-txt { font-size: 24rpx; color: #606266; margin-top: 10rpx; }
.logout { margin: 40rpx 24rpx 0; background: #fff; color: #909399; border-radius: 44rpx; font-size: 28rpx; }
</style>
