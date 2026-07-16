<template>
  <view class="page" v-if="notice">
    <view class="title">{{ notice.title }}</view>
    <view class="meta">
      <text>{{ notice.publisher || '园区管理处' }}</text>
      <text>{{ short(notice.publishTime) }}</text>
      <text>浏览 {{ notice.viewCount }}</text>
    </view>
    <image v-if="notice.coverUrl" :src="notice.coverUrl" class="cover" mode="widthFix" />
    <rich-text class="content" :nodes="notice.content || notice.summary || ''"></rich-text>
  </view>
</template>

<script>
import { noticeDetail } from '@/api/common'

export default {
  data() {
    return { notice: null }
  },
  onLoad(options) {
    if (options.id) this.load(options.id)
  },
  methods: {
    async load(id) {
      this.notice = await noticeDetail(id)
    },
    short(t) {
      return t ? t.replace('T', ' ').substring(0, 16) : ''
    }
  }
}
</script>

<style>
page { background: #fff; }
.page { padding: 32rpx; }
.title { font-size: 38rpx; font-weight: bold; color: #1f2d3d; line-height: 1.4; }
.meta { display: flex; gap: 24rpx; font-size: 24rpx; color: #909399; margin: 20rpx 0 28rpx; }
.cover { width: 100%; border-radius: 14rpx; margin-bottom: 24rpx; }
.content { font-size: 30rpx; color: #303133; line-height: 1.8; }
</style>
