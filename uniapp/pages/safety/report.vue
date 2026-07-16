<template>
  <view class="page">
    <view class="card">
      <view class="card-title">
        <text>隐患上报</text>
        <text class="scan" @click="scan">扫码定位</text>
      </view>

      <view class="field">
        <text class="field-label">隐患标题</text>
        <input class="field-input" v-model="form.title" placeholder="如：三楼消防通道被杂物堵塞" />
      </view>

      <view class="field">
        <text class="field-label">隐患类别</text>
        <view class="chips">
          <view class="chip" v-for="c in categories" :key="c.v"
                :class="{ active: form.category === c.v }" @click="form.category = c.v">{{ c.t }}</view>
        </view>
      </view>

      <view class="field">
        <text class="field-label">隐患等级</text>
        <view class="chips">
          <view class="chip" :class="{ active: form.level === 'general' }" @click="form.level = 'general'">一般</view>
          <view class="chip danger" :class="{ active: form.level === 'major' }" @click="form.level = 'major'">重大</view>
        </view>
      </view>

      <view class="field">
        <text class="field-label">所在位置</text>
        <input class="field-input" v-model="form.location" placeholder="如：A栋3F东侧走廊" />
      </view>

      <view class="field">
        <text class="field-label">详细描述</text>
        <textarea class="field-textarea" v-model="form.description" placeholder="请描述隐患情况" />
      </view>

      <view class="field">
        <text class="field-label">现场照片</text>
        <view class="img-list">
          <image v-for="(img, i) in images" :key="i" :src="img" class="img" mode="aspectFill" />
          <view class="img-add" @click="chooseImage" v-if="images.length < 3">+</view>
        </view>
      </view>

      <button class="btn-submit" :loading="submitting" @click="submit">提交隐患</button>
    </view>

    <view class="tip" @click="goMy">查看我的上报 ></view>
  </view>
</template>

<script>
import { reportHazard } from '@/api/safety'

export default {
  data() {
    return {
      submitting: false,
      images: [],
      categories: [
        { v: 'fire', t: '消防' }, { v: 'electric', t: '用电' }, { v: 'structure', t: '建筑' },
        { v: 'facility', t: '设施' }, { v: 'security', t: '治安' }, { v: 'environment', t: '环境' }, { v: 'other', t: '其他' }
      ],
      form: { title: '', category: 'fire', level: 'general', location: '', description: '', photos: '' }
    }
  },
  methods: {
    scan() {
      uni.scanCode({
        success: (res) => {
          this.form.location = res.result
          uni.showToast({ title: '已识别位置', icon: 'none' })
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
      if (!this.form.title) return uni.showToast({ title: '请填写隐患标题', icon: 'none' })
      this.submitting = true
      try {
        // 先上传现场照片，取回可访问URL
        const urls = await this.uploadImages()
        await reportHazard({ ...this.form, photos: urls.join(',') })
        uni.showToast({ title: '上报成功', icon: 'success' })
        setTimeout(() => this.goMy(), 800)
      } catch (e) {
      } finally {
        this.submitting = false
      }
    },
    uploadImages() {
      const BASE_URL = 'http://localhost:8080/api'
      const token = uni.getStorageSync('accessToken')
      const tasks = this.images.map((path) => new Promise((resolve) => {
        uni.uploadFile({
          url: BASE_URL + '/file/upload',
          filePath: path,
          name: 'file',
          header: token ? { Authorization: 'Bearer ' + token } : {},
          success: (res) => {
            try {
              const body = JSON.parse(res.data)
              resolve(body.code === 200 && body.data ? body.data.url : '')
            } catch (e) {
              resolve('')
            }
          },
          fail: () => resolve('')
        })
      }))
      return Promise.all(tasks).then((arr) => arr.filter(Boolean))
    },
    goMy() {
      uni.navigateTo({ url: '/pages/safety/my' })
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
.field-textarea { min-height: 140rpx; background: #f5f7fa; border-radius: 14rpx; padding: 20rpx 24rpx; font-size: 28rpx; width: 100%; box-sizing: border-box; }
.chips { display: flex; flex-wrap: wrap; gap: 16rpx; }
.chip { padding: 12rpx 28rpx; background: #f5f7fa; border-radius: 30rpx; font-size: 26rpx; color: #606266; }
.chip.active { background: #1b4b91; color: #fff; }
.chip.danger.active { background: #e53935; }
.img-list { display: flex; gap: 16rpx; flex-wrap: wrap; }
.img { width: 150rpx; height: 150rpx; border-radius: 12rpx; }
.img-add { width: 150rpx; height: 150rpx; border: 2rpx dashed #c0c4cc; border-radius: 12rpx; display: flex; align-items: center; justify-content: center; font-size: 60rpx; color: #c0c4cc; }
.btn-submit { margin-top: 16rpx; background: linear-gradient(135deg,#2f7cd6,#1b4b91); color: #fff; border-radius: 44rpx; font-size: 32rpx; }
.tip { text-align: center; color: #2f7cd6; font-size: 26rpx; margin-top: 30rpx; }
</style>
