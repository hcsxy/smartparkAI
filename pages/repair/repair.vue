<template>
  <view class="page">
    <view class="card">
      <view class="card-title">
        <text>扫码报修</text>
        <text class="scan" @click="scan">扫码定位设备</text>
      </view>

      <view class="field" v-if="form.deviceCode">
        <text class="field-label">设备编码</text>
        <view class="field-input readonly">{{ form.deviceCode }}</view>
      </view>

      <view class="field">
        <text class="field-label">故障简述</text>
        <input class="field-input" v-model="form.title" placeholder="如：3楼走廊灯不亮" />
      </view>
      <view class="field">
        <text class="field-label">详细描述</text>
        <textarea class="field-textarea" v-model="form.content" placeholder="请描述故障情况" />
      </view>
      <view class="field">
        <text class="field-label">联系电话</text>
        <input class="field-input" v-model="form.reporterMobile" type="number" maxlength="11" placeholder="便于维修联系" />
      </view>

      <view class="field">
        <text class="field-label">现场照片</text>
        <view class="img-list">
          <image v-for="(img, i) in images" :key="i" :src="img" class="img" mode="aspectFill" />
          <view class="img-add" @click="chooseImage" v-if="images.length < 3">+</view>
        </view>
      </view>

      <button class="btn-submit" :loading="submitting" @click="submit">提交报修</button>
    </view>

    <view class="tip" @click="goMy">查看我的报修 ></view>
  </view>
</template>

<script>
import { submitRepair } from '@/api/repair'

export default {
  data() {
    return {
      submitting: false,
      images: [],
      form: { title: '', content: '', deviceCode: '', reporterMobile: '' }
    }
  },
  methods: {
    scan() {
      uni.scanCode({
        success: (res) => {
          this.form.deviceCode = res.result
          uni.showToast({ title: '已识别设备', icon: 'none' })
        }
      })
    },
    chooseImage() {
      uni.chooseImage({
        count: 3 - this.images.length,
        success: (res) => {
          this.images = this.images.concat(res.tempFilePaths)
        }
      })
    },
    async submit() {
      if (!this.form.title) return uni.showToast({ title: '请填写故障简述', icon: 'none' })
      this.submitting = true
      try {
        await submitRepair({ ...this.form, images: this.images })
        uni.showToast({ title: '报修已提交', icon: 'success' })
        setTimeout(() => this.goMy(), 800)
      } catch (e) {
      } finally {
        this.submitting = false
      }
    },
    goMy() {
      uni.navigateTo({ url: '/pages/repair/my' })
    }
  }
}
</script>

<style>
page { background: #f5f7fa; }
.page { padding: 24rpx; }
.card { background: #fff; border-radius: 24rpx; padding: 36rpx 32rpx; box-shadow: 0 8rpx 30rpx rgba(27,75,145,.06); }
.card-title { display: flex; justify-content: space-between; align-items: center; font-size: 34rpx; font-weight: bold; color: #1f2d3d; margin-bottom: 28rpx; }
.scan { font-size: 26rpx; color: #2f7cd6; font-weight: normal; }
.field { margin-bottom: 26rpx; }
.field-label { display: block; font-size: 26rpx; color: #909399; margin-bottom: 12rpx; }
.field-input { height: 84rpx; background: #f5f7fa; border-radius: 14rpx; padding: 0 24rpx; font-size: 28rpx; display: flex; align-items: center; }
.field-input.readonly { color: #1b4b91; }
.field-textarea { min-height: 140rpx; background: #f5f7fa; border-radius: 14rpx; padding: 20rpx 24rpx; font-size: 28rpx; width: 100%; box-sizing: border-box; }
.img-list { display: flex; gap: 16rpx; flex-wrap: wrap; }
.img { width: 150rpx; height: 150rpx; border-radius: 12rpx; }
.img-add { width: 150rpx; height: 150rpx; border: 2rpx dashed #c0c4cc; border-radius: 12rpx; display: flex; align-items: center; justify-content: center; font-size: 60rpx; color: #c0c4cc; }
.btn-submit { margin-top: 16rpx; background: linear-gradient(135deg,#2f7cd6,#1b4b91); color: #fff; border-radius: 44rpx; font-size: 32rpx; }
.tip { text-align: center; color: #2f7cd6; font-size: 26rpx; margin-top: 30rpx; }
</style>
