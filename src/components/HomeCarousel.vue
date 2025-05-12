<template>
  <a-carousel autoplay>
    <div v-for="(img, index) in dataList" :key="index">
      <img :src="img.url" :alt="img.introduction" class="carousel-image" />
    </div>
  </a-carousel>
</template>

<script lang="ts" setup>
// 定义 props 接收父组件传递的图片数据
interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  showOp?: boolean
  canEdit?: boolean
  canDelete?: boolean
  onReload?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  default: () => [
    {
      url: 'https://picsum.photos/1200/400?random=1', // 网络图片示例
      alt: 'Banner 1',
      text: 'First Slide',
    },
    {
      url: 'https://picsum.photos/1200/400?random=1', // 网络图片示例
      alt: 'Banner 1',
      text: 'First Slide',
    },
  ],
  loading: false,
  showOp: false,
  canEdit: false,
  canDelete: false,
})
</script>

<style scoped>
/* 轮播项容器 */
:deep(.slick-slide) {
  height: 32vh; /* 保持你的原始高度设置 */
  text-align: center;
  background: #364d79;
  overflow: hidden;
  display: flex !important; /* 新增 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

/* 图片样式 */
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 核心属性：保持比例填满容器 */
  display: block; /* 消除图片底部间隙 */
  border-radius: 4px; /* 可选圆角 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* 可选阴影 */
}

/* 文字样式 */
:deep(.slick-slide h3) {
  color: #fff;
  position: absolute; /* 文字覆盖在图片上 */
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
