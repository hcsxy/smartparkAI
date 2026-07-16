<template>
  <view class="test-container">
    <view class="header">
      <text class="title">🔧 API 测试工具</text>
      <text class="subtitle">用于诊断接口连接问题</text>
    </view>

    <view class="section">
      <view class="section-title">1. 环境检查</view>
      <view class="info-item">
        <text class="label">BASE_URL:</text>
        <text class="value">{{ baseUrl }}</text>
      </view>
      <view class="info-item">
        <text class="label">平台:</text>
        <text class="value">{{ platform }}</text>
      </view>
    </view>

    <view class="section">
      <view class="section-title">2. 测试接口</view>
      
      <view class="test-item">
        <text class="test-name">测试 1: 发送验证码</text>
        <button class="btn-test" @click="testSendCaptcha" :loading="loading1">
          {{ result1 || '点击测试' }}
        </button>
      </view>

      <view class="test-item">
        <text class="test-name">测试 2: 短信登录</text>
        <input class="input" v-model="testCode" placeholder="输入验证码" type="number" maxlength="6" />
        <button class="btn-test" @click="testLogin" :loading="loading2">
          {{ result2 || '点击测试' }}
        </button>
      </view>

      <view class="test-item">
        <text class="test-name">测试 3: 接口文档</text>
        <button class="btn-test" @click="testDoc">访问接口文档</button>
      </view>
    </view>

    <view class="section">
      <view class="section-title">3. 日志输出</view>
      <scroll-view class="log-view" scroll-y>
        <view class="log-item" v-for="(log, index) in logs" :key="index">
          <text class="log-time">{{ log.time }}</text>
          <text class="log-msg" :class="'log-' + log.type">{{ log.msg }}</text>
        </view>
      </scroll-view>
      <button class="btn-clear" @click="clearLogs">清除日志</button>
    </view>

    <view class="section">
      <view class="section-title">4. 常见问题</view>
      <view class="tips">
        <text class="tip">• 确保后端已启动（http://localhost:8080）</text>
        <text class="tip">• 微信开发者工具勾选"不校验合法域名"</text>
        <text class="tip">• 查看后端控制台获取验证码</text>
        <text class="tip">• 真机调试需要使用局域网 IP</text>
      </view>
    </view>

    <view class="footer">
      <button class="btn-back" @click="goBack">返回登录页</button>
    </view>
  </view>
</template>

<script>
const BASE_URL = 'http://localhost:8080/api'
const TEST_MOBILE = '13800000201'

export default {
  data() {
    return {
      baseUrl: BASE_URL,
      platform: '',
      testCode: '',
      loading1: false,
      loading2: false,
      result1: '',
      result2: '',
      logs: []
    }
  },
  onLoad() {
    this.platform = uni.getSystemInfoSync().platform
    this.addLog('info', '测试工具已加载')
  },
  methods: {
    addLog(type, msg) {
      const time = new Date().toLocaleTimeString()
      this.logs.unshift({ time, type, msg })
      if (this.logs.length > 50) this.logs.pop()
      console.log(`[${type.toUpperCase()}] ${msg}`)
    },
    clearLogs() {
      this.logs = []
    },
    testSendCaptcha() {
      this.loading1 = true
      this.result1 = '测试中...'
      this.addLog('info', `请求: POST ${BASE_URL}/auth/captcha/send`)
      this.addLog('info', `参数: { target: "${TEST_MOBILE}", channel: "sms", scene: "login" }`)
      
      uni.request({
        url: BASE_URL + '/auth/captcha/send',
        method: 'POST',
        data: {
          target: TEST_MOBILE,
          channel: 'sms',
          scene: 'login'
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          this.addLog('success', `状态码: ${res.statusCode}`)
          this.addLog('success', `响应: ${JSON.stringify(res.data)}`)
          
          if (res.data && res.data.code === 200) {
            this.result1 = '✅ 成功'
            this.addLog('success', '验证码已发送，请查看后端控制台获取验证码')
            uni.showToast({ 
              title: '成功！查看后端控制台获取验证码', 
              icon: 'none',
              duration: 3000
            })
          } else {
            this.result1 = '❌ 失败'
            this.addLog('error', `业务失败: ${res.data.message || '未知错误'}`)
            uni.showModal({
              title: '接口返回失败',
              content: JSON.stringify(res.data),
              showCancel: false
            })
          }
        },
        fail: (err) => {
          this.result1 = '❌ 异常'
          this.addLog('error', `请求失败: ${JSON.stringify(err)}`)
          
          let tips = '请检查：\n'
          tips += '1. 后端是否启动\n'
          tips += '2. 是否勾选"不校验合法域名"\n'
          tips += '3. 防火墙设置'
          
          uni.showModal({
            title: '连接失败',
            content: tips,
            showCancel: false
          })
        },
        complete: () => {
          this.loading1 = false
        }
      })
    },
    testLogin() {
      if (!this.testCode) {
        this.addLog('warn', '请输入验证码')
        return uni.showToast({ title: '请输入验证码', icon: 'none' })
      }
      
      this.loading2 = true
      this.result2 = '测试中...'
      this.addLog('info', `请求: POST ${BASE_URL}/auth/login/sms`)
      this.addLog('info', `参数: { mobile: "${TEST_MOBILE}", code: "${this.testCode}", clientType: "miniapp" }`)
      
      uni.request({
        url: BASE_URL + '/auth/login/sms',
        method: 'POST',
        data: {
          mobile: TEST_MOBILE,
          code: this.testCode,
          clientType: 'miniapp'
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          this.addLog('success', `状态码: ${res.statusCode}`)
          this.addLog('success', `响应: ${JSON.stringify(res.data)}`)
          
          if (res.data && res.data.code === 200) {
            this.result2 = '✅ 成功'
            this.addLog('success', '登录成功！')
            const data = res.data.data
            if (data && data.accessToken) {
              this.addLog('success', `Token: ${data.accessToken.substring(0, 20)}...`)
              uni.showModal({
                title: '登录成功',
                content: '已获取 Token，是否跳转到首页？',
                success: (r) => {
                  if (r.confirm) {
                    uni.setStorageSync('accessToken', data.accessToken)
                    uni.setStorageSync('refreshToken', data.refreshToken)
                    uni.reLaunch({ url: '/pages/index/index' })
                  }
                }
              })
            }
          } else {
            this.result2 = '❌ 失败'
            this.addLog('error', `业务失败: ${res.data.message || '未知错误'}`)
            uni.showModal({
              title: '登录失败',
              content: res.data.message || JSON.stringify(res.data),
              showCancel: false
            })
          }
        },
        fail: (err) => {
          this.result2 = '❌ 异常'
          this.addLog('error', `请求失败: ${JSON.stringify(err)}`)
          uni.showModal({
            title: '连接失败',
            content: '无法连接到服务器，请检查后端是否启动',
            showCancel: false
          })
        },
        complete: () => {
          this.loading2 = false
        }
      })
    },
    testDoc() {
      this.addLog('info', '尝试访问接口文档...')
      // #ifdef H5
      window.open('http://localhost:8080/api/doc.html', '_blank')
      // #endif
      
      // #ifndef H5
      uni.showModal({
        title: '接口文档地址',
        content: 'http://localhost:8080/api/doc.html\n\n请在浏览器中访问',
        confirmText: '复制地址',
        success: (res) => {
          if (res.confirm) {
            uni.setClipboardData({
              data: 'http://localhost:8080/api/doc.html',
              success: () => {
                uni.showToast({ title: '已复制', icon: 'success' })
              }
            })
          }
        }
      })
      // #endif
    },
    goBack() {
      uni.navigateBack({
        fail: () => {
          uni.redirectTo({ url: '/pages/login/login' })
        }
      })
    }
  }
}
</script>

<style scoped>
.test-container {
  padding: 20rpx;
  background: #f5f7fa;
  min-height: 100vh;
}
.header {
  background: linear-gradient(135deg, #2f7cd6, #1b4b91);
  padding: 40rpx;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
}
.title {
  color: #fff;
  font-size: 40rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 12rpx;
}
.subtitle {
  color: rgba(255,255,255,0.8);
  font-size: 26rpx;
  display: block;
}
.section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}
.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1f2d3d;
  margin-bottom: 24rpx;
}
.info-item {
  display: flex;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #ebeef5;
}
.info-item:last-child {
  border-bottom: none;
}
.label {
  color: #909399;
  font-size: 28rpx;
  width: 180rpx;
}
.value {
  color: #303133;
  font-size: 28rpx;
  flex: 1;
  word-break: break-all;
}
.test-item {
  margin-bottom: 30rpx;
}
.test-item:last-child {
  margin-bottom: 0;
}
.test-name {
  display: block;
  font-size: 28rpx;
  color: #606266;
  margin-bottom: 16rpx;
}
.btn-test {
  width: 100%;
  background: linear-gradient(135deg, #67c23a, #85ce61);
  color: #fff;
  border-radius: 12rpx;
  font-size: 28rpx;
  padding: 24rpx;
}
.input {
  width: 100%;
  background: #f5f7fa;
  border-radius: 12rpx;
  padding: 24rpx;
  font-size: 28rpx;
  margin-bottom: 16rpx;
  box-sizing: border-box;
}
.log-view {
  height: 500rpx;
  background: #1e1e1e;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}
.log-item {
  margin-bottom: 16rpx;
  font-family: monospace;
}
.log-time {
  color: #909399;
  font-size: 22rpx;
  display: block;
  margin-bottom: 4rpx;
}
.log-msg {
  font-size: 24rpx;
  display: block;
  word-break: break-all;
}
.log-info {
  color: #409eff;
}
.log-success {
  color: #67c23a;
}
.log-warn {
  color: #e6a23c;
}
.log-error {
  color: #f56c6c;
}
.btn-clear {
  width: 100%;
  background: #f56c6c;
  color: #fff;
  border-radius: 12rpx;
  font-size: 28rpx;
  padding: 20rpx;
}
.tips {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.tip {
  color: #606266;
  font-size: 26rpx;
  line-height: 1.6;
}
.footer {
  padding: 20rpx 0;
}
.btn-back {
  width: 100%;
  background: #909399;
  color: #fff;
  border-radius: 12rpx;
  font-size: 28rpx;
  padding: 24rpx;
}
</style>
