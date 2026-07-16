<template>
  <view class="mine">
    <!-- 用户信息 -->
    <view class="profile">
      <view class="avatar">{{ avatarText }}</view>
      <view class="profile-info">
        <text class="nick">{{ nickname }}</text>
        <text class="uid">ID: {{ userId || '-' }}</text>
      </view>
    </view>

    <!-- 我的服务 -->
    <view class="group">
      <view class="group-title">我的服务</view>
      <view class="cell" @click="go('/pages/visitor/my')">
        <text class="cell-ico">📨</text>
        <text class="cell-txt">我的访客邀请</text>
        <text class="cell-arrow">›</text>
      </view>
      <view class="cell" @click="go('/pages/repair/my')">
        <text class="cell-ico">📋</text>
        <text class="cell-txt">我的报修</text>
        <text class="cell-arrow">›</text>
      </view>
      <view class="cell" @click="go('/pages/safety/my')">
        <text class="cell-ico">⚠️</text>
        <text class="cell-txt">我的隐患上报</text>
        <text class="cell-arrow">›</text>
      </view>
      <view class="cell" @click="go('/pages/meeting/my')">
        <text class="cell-ico">📅</text>
        <text class="cell-txt">我的会议预约</text>
        <text class="cell-arrow">›</text>
      </view>
      <view class="cell" @click="go('/pages/access/record')">
        <text class="cell-ico">🚪</text>
        <text class="cell-txt">通行记录</text>
        <text class="cell-arrow">›</text>
      </view>
    </view>

    <!-- 其他 -->
    <view class="group">
      <view class="group-title">其他</view>
      <view class="cell" @click="go('/pages/energy/bill')">
        <text class="cell-ico">⚡</text>
        <text class="cell-txt">能耗账单</text>
        <text class="cell-arrow">›</text>
      </view>
      <view class="cell" @click="go('/pages/notice/list')">
        <text class="cell-ico">📢</text>
        <text class="cell-txt">园区公告</text>
        <text class="cell-arrow">›</text>
      </view>
      <view class="cell" @click="go('/pages/portal/wifi')">
        <text class="cell-ico">📶</text>
        <text class="cell-txt">连接WiFi</text>
        <text class="cell-arrow">›</text>
      </view>
    </view>

    <button class="logout" @click="logout">退出登录</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userId: '',
      nickname: '园区用户'
    }
  },
  onShow() {
    this.userId = uni.getStorageSync('userId') || ''
    this.nickname = uni.getStorageSync('nickname') || '园区用户'
  },
  computed: {
    avatarText() {
      return (this.nickname || '园').charAt(0)
    }
  },
  methods: {
    go(url) {
      uni.navigateTo({
        url,
        fail: () => uni.showToast({ title: '功能开发中', icon: 'none' })
      })
    },
    logout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗?',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('accessToken')
            uni.removeStorageSync('refreshToken')
            uni.removeStorageSync('userId')
            uni.reLaunch({ url: '/pages/login/login' })
          }
        }
      })
    }
  }
}
</script>

<style>
page { background: #f5f7fa; }
.mine { padding-bottom: 40rpx; }
.profile {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #1b4b91, #2f7cd6);
  padding: 60rpx 40rpx;
  color: #fff;
  border-radius: 0 0 32rpx 32rpx;
}
.avatar {
  width: 110rpx;
  height: 110rpx;
  line-height: 110rpx;
  text-align: center;
  font-size: 48rpx;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.22);
  border-radius: 50%;
}
.profile-info { margin-left: 28rpx; display: flex; flex-direction: column; }
.nick { font-size: 36rpx; font-weight: bold; }
.uid { font-size: 24rpx; opacity: 0.85; margin-top: 10rpx; }

.group { margin: 24rpx; background: #fff; border-radius: 20rpx; padding: 8rpx 24rpx; box-shadow: 0 6rpx 20rpx rgba(27,75,145,.05); }
.group-title { font-size: 26rpx; color: #909399; padding: 20rpx 0 12rpx; }
.cell {
  display: flex;
  align-items: center;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #f0f2f5;
}
.cell:last-child { border-bottom: none; }
.cell-ico { font-size: 40rpx; width: 60rpx; }
.cell-txt { flex: 1; font-size: 30rpx; color: #303133; }
.cell-arrow { font-size: 40rpx; color: #c0c4cc; }

.logout { margin: 40rpx 24rpx 0; background: #fff; color: #f56c6c; border-radius: 44rpx; font-size: 30rpx; }
</style>
