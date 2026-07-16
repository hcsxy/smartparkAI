<template>
  <view class="page">
    <view class="card">
      <view class="card-title">邀请访客</view>

      <view class="field">
        <text class="field-label">访客姓名</text>
        <input class="field-input" v-model="form.name" placeholder="请输入访客姓名" />
      </view>
      <view class="field">
        <text class="field-label">手机号</text>
        <input class="field-input" v-model="form.mobile" type="number" maxlength="11" placeholder="请输入手机号" />
      </view>
      <view class="field">
        <text class="field-label">来访单位</text>
        <input class="field-input" v-model="form.company" placeholder="选填" />
      </view>
      <view class="field">
        <text class="field-label">来访事由</text>
        <input class="field-input" v-model="form.reason" placeholder="选填" />
      </view>
      <view class="field">
        <text class="field-label">到访日期</text>
        <picker mode="date" :value="date" @change="onDate">
          <view class="field-input picker">{{ date }}</view>
        </picker>
      </view>

      <button class="btn-submit" :loading="submitting" @click="submit">生成访客通行码</button>
    </view>

    <!-- 邀请成功展示二维码信息 -->
    <view class="card" v-if="result">
      <view class="card-title">邀请成功</view>
      <view class="qr-box">
        <view class="qr-code">{{ result.qrCode }}</view>
        <text class="qr-tip">请将通行码转发给访客，到访时在闸机扫码通行</text>
      </view>
      <view class="result-row"><text>访客</text><text>{{ result.name }}</text></view>
      <view class="result-row"><text>有效期至</text><text>{{ result.appointEnd }}</text></view>
      <button class="btn-share" open-type="share">转发给访客</button>
    </view>
  </view>
</template>

<script>
import { inviteVisitor } from '@/api/visitor'

export default {
  data() {
    const today = this.formatDate(new Date())
    return {
      date: today,
      submitting: false,
      result: null,
      form: { name: '', mobile: '', company: '', reason: '' }
    }
  },
  methods: {
    formatDate(d) {
      const p = (n) => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
    },
    onDate(e) {
      this.date = e.detail.value
    },
    async submit() {
      if (!this.form.name || !/^1\d{10}$/.test(this.form.mobile)) {
        return uni.showToast({ title: '请填写姓名和正确手机号', icon: 'none' })
      }
      this.submitting = true
      try {
        const payload = {
          ...this.form,
          appointStart: this.date + 'T08:00:00',
          appointEnd: this.date + 'T20:00:00'
        }
        this.result = await inviteVisitor(payload)
        uni.showToast({ title: '邀请成功', icon: 'success' })
      } catch (e) {
        // 统一提示
      } finally {
        this.submitting = false
      }
    }
  },
  onShareAppMessage() {
    return {
      title: `${this.result ? this.result.name : ''} 的园区访客通行码`,
      path: '/pages/visitor/invite'
    }
  }
}
</script>

<style>
page { background: #f5f7fa; }
.page { padding: 24rpx; }
.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 36rpx 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 8rpx 30rpx rgba(27, 75, 145, 0.06);
}
.card-title { font-size: 34rpx; font-weight: bold; color: #1f2d3d; margin-bottom: 28rpx; }
.field { margin-bottom: 28rpx; }
.field-label { display: block; font-size: 26rpx; color: #909399; margin-bottom: 12rpx; }
.field-input {
  height: 84rpx;
  background: #f5f7fa;
  border-radius: 14rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
}
.picker { color: #333; }
.btn-submit {
  margin-top: 16rpx;
  background: linear-gradient(135deg, #2f7cd6, #1b4b91);
  color: #fff;
  border-radius: 44rpx;
  font-size: 30rpx;
}
.qr-box {
  text-align: center;
  padding: 40rpx 0;
  background: #f5f8fd;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}
.qr-code {
  font-size: 30rpx;
  font-weight: bold;
  color: #1b4b91;
  letter-spacing: 2rpx;
  word-break: break-all;
  padding: 0 24rpx;
}
.qr-tip { display: block; font-size: 24rpx; color: #909399; margin-top: 16rpx; }
.result-row {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  font-size: 28rpx;
  color: #606266;
  border-bottom: 1rpx solid #f0f2f5;
}
.btn-share {
  margin-top: 24rpx;
  background: #07c160;
  color: #fff;
  border-radius: 44rpx;
  font-size: 30rpx;
}
</style>
