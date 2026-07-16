<template>
  <view class="page">
    <view class="hero">
      <text class="hero-ico">📶</text>
      <text class="hero-title">园区 WiFi</text>
      <text class="hero-tips">{{ info.tips }}</text>
    </view>

    <view v-if="configs.length === 0" class="empty">暂无可用 WiFi 认证配置</view>
    <view class="wifi-card" v-for="c in configs" :key="c.id">
      <view class="wc-head">
        <text class="ssid">{{ c.ssid || c.configName }}</text>
        <text class="auth-tag">{{ authText(c.authType) }}</text>
      </view>
      <view class="wc-row">时长：{{ c.durationMin ? c.durationMin + ' 分钟' : '不限' }}</view>
      <view class="wc-row" v-if="c.configName">配置：{{ c.configName }}</view>
      <button class="connect-btn" @click="connect(c)">连接并认证</button>
    </view>

    <view class="note">
      <text class="note-title">说明</text>
      <text class="note-txt">微信连 WiFi 需在微信商户平台配置门户地址，并由 AC 控制器 Portal 页面重定向到认证页。当前为演示入口，真机对接后自动跳转。</text>
    </view>
  </view>
</template>

<script>
import { portalWifi } from '@/api/portal'

const AUTH = { wechat: '微信认证', sms: '短信认证', account: '账号认证' }

export default {
  data() {
    return { info: {}, configs: [] }
  },
  onLoad() {
    this.load()
  },
  methods: {
    authText(t) {
      return AUTH[t] || t || '认证'
    },
    async load() {
      this.info = (await portalWifi()) || {}
      this.configs = this.info.configs || []
    },
    connect(c) {
      if (c.redirectUrl) {
        // 真机：跳转 AC Portal / 微信连WiFi 落地页
        uni.showModal({ title: '认证跳转', content: '将跳转至认证页：' + c.redirectUrl, showCancel: false })
      } else {
        uni.showToast({ title: '认证功能对接中', icon: 'none' })
      }
    }
  }
}
</script>

<style>
page { background: #f5f7fa; }
.page { padding: 24rpx; }
.hero { background: linear-gradient(135deg, #1b4b91, #2f7cd6); border-radius: 24rpx; padding: 50rpx 40rpx; color: #fff; text-align: center; }
.hero-ico { font-size: 72rpx; }
.hero-title { display: block; font-size: 36rpx; font-weight: bold; margin: 14rpx 0; }
.hero-tips { font-size: 24rpx; opacity: .85; line-height: 1.5; }
.empty { text-align: center; color: #909399; padding: 60rpx 0; font-size: 28rpx; }
.wifi-card { background: #fff; border-radius: 20rpx; padding: 28rpx; margin-top: 24rpx; box-shadow: 0 6rpx 20rpx rgba(27,75,145,.05); }
.wc-head { display: flex; justify-content: space-between; align-items: center; }
.ssid { font-size: 32rpx; font-weight: bold; color: #303133; }
.auth-tag { font-size: 22rpx; padding: 4rpx 16rpx; border-radius: 20rpx; background: #ecf5ff; color: #409eff; }
.wc-row { font-size: 26rpx; color: #606266; margin-top: 14rpx; }
.connect-btn { background: linear-gradient(135deg, #1b4b91, #2f7cd6); color: #fff; border-radius: 40rpx; font-size: 28rpx; margin-top: 20rpx; }
.note { background: #fff; border-radius: 20rpx; padding: 28rpx; margin-top: 24rpx; }
.note-title { font-size: 28rpx; font-weight: bold; color: #1f2d3d; }
.note-txt { display: block; font-size: 24rpx; color: #909399; line-height: 1.6; margin-top: 12rpx; }
</style>
