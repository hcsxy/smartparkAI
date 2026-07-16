<template>
  <view class="login">
    <!-- 顶部渐变品牌区 -->
    <view class="hero">
      <view class="hero-bg"></view>
      <!-- 光点 -->
      <view class="spark spark-1"></view>
      <view class="spark spark-2"></view>
      <view class="spark spark-3"></view>
      <!-- 楼宇天际线剪影 -->
      <view class="skyline">
        <view class="bld" v-for="(b, i) in buildings" :key="i" :style="{ height: b.h + 'rpx', width: b.w + 'rpx' }">
          <view class="win" v-for="n in b.win" :key="n"></view>
        </view>
      </view>

      <view class="hero-content">
        <view class="logo-circle">
          <text class="logo-icon">🏙</text>
        </view>
        <text class="app-name">海创科技城</text>
        <text class="app-sub">智慧园区 · 一站式园区服务</text>
      </view>
    </view>

    <!-- 登录卡片 -->
    <view class="card">
      <view class="card-title">欢迎登录</view>
      <view class="card-sub">手机号验证码快捷登录</view>

      <!-- 手机号 -->
      <view class="field">
        <text class="field-icon">📱</text>
        <input class="field-input" v-model="mobile" type="number" placeholder="请输入手机号" maxlength="11" />
      </view>

      <!-- 验证码 -->
      <view class="field">
        <text class="field-icon">🔒</text>
        <input class="field-input" v-model="code" type="number" placeholder="请输入验证码" maxlength="6" />
        <text class="code-btn" :class="{ disabled: countdown > 0 }" @click="onSendCode">
          {{ countdown > 0 ? countdown + 's' : '获取验证码' }}
        </text>
      </view>

      <button class="btn-login" @click="handleSmsLogin">登 录</button>

      <view class="agreement">
        登录即代表同意
        <text class="link">《用户协议》</text>和<text class="link">《隐私政策》</text>
      </view>
    </view>

    <!-- 服务特性 -->
    <view class="features">
      <view class="feat"><text class="feat-ico">🚪</text><text class="feat-txt">无感通行</text></view>
      <view class="feat"><text class="feat-ico">🅿️</text><text class="feat-txt">智慧停车</text></view>
      <view class="feat"><text class="feat-ico">🔧</text><text class="feat-txt">一键报修</text></view>
      <view class="feat"><text class="feat-ico">📢</text><text class="feat-txt">园区资讯</text></view>
    </view>

    <view class="footer">© 2026 海创科技城 · 智慧园区</view>
    
    <!-- 调试入口：长按 Logo 跳转测试页面 -->
    <view class="debug-trigger" @longpress="goToTest"></view>
  </view>
</template>

<script>
import { loginBySms, sendCaptcha, verifyMfa } from '@/api/auth'

export default {
  data() {
    return {
      mobile: '',
      code: '',
      countdown: 0,
      // 天际线楼宇配置（高度/宽度/窗户数）
      buildings: [
        { h: 90, w: 44, win: 6 },
        { h: 140, w: 52, win: 12 },
        { h: 110, w: 40, win: 9 },
        { h: 180, w: 58, win: 16 },
        { h: 130, w: 46, win: 10 },
        { h: 200, w: 50, win: 18 },
        { h: 120, w: 42, win: 9 },
        { h: 160, w: 54, win: 14 },
        { h: 100, w: 40, win: 6 }
      ]
    }
  },
  methods: {
    onSendCode() {
      if (this.countdown > 0) return
      if (!/^1\d{10}$/.test(this.mobile)) {
        return uni.showToast({ title: '请输入正确手机号', icon: 'none' })
      }
      sendCaptcha(this.mobile).then(() => {
        uni.showToast({ title: '验证码已发送', icon: 'none' })
        this.startCountdown()
      })
    },
    startCountdown() {
      this.countdown = 60
      const timer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) clearInterval(timer)
      }, 1000)
    },
    async handleSmsLogin() {
      if (!this.mobile || !this.code) {
        return uni.showToast({ title: '请填写手机号和验证码', icon: 'none' })
      }
      try {
        const result = await loginBySms(this.mobile, this.code)
        this.afterLogin(result)
      } catch (e) {
        // ignore
      }
    },
    afterLogin(result) {
      if (result.mfaRequired) {
        uni.showModal({
          title: '安全验证',
          editable: true,
          placeholderText: '请输入验证码',
          success: async (r) => {
            if (r.confirm) {
              const final = await verifyMfa(result.mfaToken, r.content)
              this.saveAndGo(final)
            }
          }
        })
        return
      }
      this.saveAndGo(result)
    },
    saveAndGo(result) {
      uni.setStorageSync('accessToken', result.accessToken)
      uni.setStorageSync('refreshToken', result.refreshToken)
      if (result.userId) uni.setStorageSync('userId', result.userId)
      uni.showToast({ title: '登录成功', icon: 'success' })
      uni.reLaunch({ url: '/pages/index/index' })
    },
    goToTest() {
      uni.navigateTo({ url: '/pages/login/test-api' })
    }
  }
}
</script>

<style>
page {
  background: #f5f7fa;
}
.login {
  min-height: 100vh;
}

/* 顶部品牌区 */
.hero {
  position: relative;
  height: 480rpx;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(150deg, #061a3c 0%, #1b4b91 55%, #2f7cd6 100%);
}
/* 光点 */
.spark {
  position: absolute;
  border-radius: 50%;
  filter: blur(2rpx);
  opacity: 0.7;
}
.spark-1 {
  width: 16rpx; height: 16rpx; background: #4facfe;
  top: 90rpx; left: 80rpx;
  box-shadow: 0 0 24rpx 6rpx rgba(79,172,254,.6);
}
.spark-2 {
  width: 12rpx; height: 12rpx; background: #a5d8ff;
  top: 150rpx; right: 120rpx;
  box-shadow: 0 0 20rpx 5rpx rgba(165,216,255,.6);
}
.spark-3 {
  width: 10rpx; height: 10rpx; background: #7cc4ff;
  top: 60rpx; right: 220rpx;
  box-shadow: 0 0 16rpx 4rpx rgba(124,196,255,.6);
}
/* 楼宇天际线 */
.skyline {
  position: absolute;
  bottom: 40rpx;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 8rpx;
  opacity: 0.35;
  z-index: 1;
}
.bld {
  background: linear-gradient(180deg, rgba(165,216,255,.6), rgba(11,42,91,.1));
  border-radius: 6rpx 6rpx 0 0;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  padding: 8rpx 6rpx;
  gap: 6rpx;
}
.win {
  width: 8rpx;
  height: 8rpx;
  background: rgba(255,255,255,.55);
  border-radius: 2rpx;
}
.hero-content {
  position: relative;
  z-index: 2;
  padding-top: 100rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.logo-circle {
  width: 130rpx;
  height: 130rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.15);
  border: 2rpx solid rgba(255,255,255,.25);
}
.logo-icon {
  font-size: 64rpx;
}
.app-name {
  color: #fff;
  font-size: 44rpx;
  font-weight: bold;
  margin-top: 24rpx;
  letter-spacing: 4rpx;
}
.app-sub {
  color: rgba(255, 255, 255, 0.85);
  font-size: 26rpx;
  margin-top: 12rpx;
  letter-spacing: 2rpx;
}

/* 登录卡片 */
.card {
  position: relative;
  z-index: 3;
  margin: -60rpx 48rpx 0;
  background: #fff;
  border-radius: 28rpx;
  padding: 48rpx 44rpx 40rpx;
  box-shadow: 0 12rpx 40rpx rgba(27, 75, 145, 0.12);
}
.card-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #1f2d3d;
  margin-bottom: 8rpx;
}
.card-sub {
  font-size: 26rpx;
  color: #909399;
  margin-bottom: 44rpx;
}
.field {
  display: flex;
  align-items: center;
  height: 96rpx;
  background: #f7f9fc;
  border: 1rpx solid #eef1f6;
  border-radius: 18rpx;
  padding: 0 26rpx;
  margin-bottom: 30rpx;
  transition: all 0.2s;
}
.field:focus-within {
  background: #fff;
  border-color: #2f7cd6;
  box-shadow: 0 6rpx 18rpx rgba(47, 124, 214, 0.12);
}
.field-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
}
.field-input {
  flex: 1;
  font-size: 28rpx;
  background: transparent;
}
.code-btn {
  color: #2f7cd6;
  font-size: 26rpx;
  padding-left: 20rpx;
  border-left: 1rpx solid #e4e7ed;
  white-space: nowrap;
}
.code-btn.disabled {
  color: #c0c4cc;
}
.btn-login {
  margin-top: 20rpx;
  height: 96rpx;
  line-height: 96rpx;
  background: linear-gradient(135deg, #2f7cd6, #1b4b91);
  color: #fff;
  border-radius: 48rpx;
  font-size: 32rpx;
  letter-spacing: 8rpx;
  box-shadow: 0 10rpx 24rpx rgba(47, 124, 214, 0.32);
  transition: transform 0.1s, box-shadow 0.2s;
}
.btn-login:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 12rpx rgba(47, 124, 214, 0.28);
}
.agreement {
  text-align: center;
  color: #a8b0bd;
  font-size: 22rpx;
  margin-top: 32rpx;
}
.agreement .link {
  color: #2f7cd6;
}
/* 服务特性 */
.features {
  display: flex;
  justify-content: space-around;
  margin: 40rpx 48rpx 0;
}
.feat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}
.feat-ico {
  font-size: 44rpx;
}
.feat-txt {
  font-size: 24rpx;
  color: #909399;
}
.footer {
  text-align: center;
  color: #c0c4cc;
  font-size: 22rpx;
  margin-top: 40rpx;
  padding-bottom: 40rpx;
}
.debug-trigger {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100rpx;
  height: 100rpx;
  opacity: 0;
}
</style>
