<template>
  <div ref="waterfallRef" class="waterfall-container">
    <div v-for="(row, rowIndex) in imgList" :key="rowIndex" class="waterfall-row">
      <div
        v-for="(img, imgIndex) in row"
        :key="imgIndex"
        class="waterfall-item"
        :style="{
          width: `${img.width}px`,
          height: `${img.height}px`,
          marginRight: imgIndex < row.length - 1 ? '10px' : '0',
        }"
        @click="doClickPicture(img)"
        @mouseenter="handleMouseEnter(img.id)"
        @mouseleave="handleMouseLeave"
      >
        <img :src="img.url" class="waterfall-image" />

        <transition name="fade">
          <div class="hover-overlay" v-if="hoveredId === img.id" key="overlay">
            <div class="user-info">
              <a-avatar :src="img.user?.userAvatar" :size="32" class="user-avatar"></a-avatar>
              <a-typography-text class="user-name">
                {{ img.user?.userName || '未知用户' }}
              </a-typography-text>
            </div>

            <div class="action-buttons">
              <!--点赞-->
              <a-button type="text" class="action-btn">
                <template #icon>
                  <LikeOutlined :style="{ color: '#fff' }" />
                </template>
              </a-button>
              <!--评论-->
              <a-button type="text" class="action-btn">
                <template #icon>
                  <MessageOutlined :style="{ color: '#fff' }" />
                </template>
              </a-button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { nextTick, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Avatar as AAvatar, Button as AButton } from 'ant-design-vue'

import { LikeOutlined, MessageOutlined } from '@ant-design/icons-vue'
import UserVO = API.UserVO

interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  showOp?: boolean
  canEdit?: boolean
  canDelete?: boolean
  onReload?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showOp: false,
  canEdit: false,
  canDelete: false,
})

interface WaterfallImage {
  url: string
  width: number
  height: number
  id: number
  user: UserVO
}

// 响应式状态
const baseHeight = ref(320)
const imgList = reactive<WaterfallImage[][]>([[]])
const rowWidth = ref(0)
const rowCount = ref(0)
const waterfallRef = ref<HTMLElement | null>(null)
const hoveredId = ref<number | null>(null)

const handleMouseEnter = (id: number) => {
  hoveredId.value = id
}

const handleMouseLeave = () => {
  hoveredId.value = null
}

watch(
  () => props.dataList,
  async (newList) => {
    if (newList?.length) {
      resetLayout()
      await loadImages(newList)
    }
  },
  { immediate: true, deep: true },
)

const resetLayout = () => {
  imgList.splice(0, imgList.length)
  imgList.push([])
  rowWidth.value = 0
  rowCount.value = 0
}

const loadImages = async (list: API.PictureVO[]) => {
  await Promise.all(
    list.map(async (item) => {
      if (!item.thumbnailUrl) return

      const image = new Image()
      await new Promise((resolve, reject) => {
        image.onload = resolve
        image.onerror = () => reject(`加载失败: ${item.url}`)
        image.src = item.url
        image.id = item.id
      })

      await nextTick()

      handleImageLayout({
        url: item.url,
        width: baseHeight.value * (image.naturalWidth / image.naturalHeight),
        height: baseHeight.value,
        id: item.id,
        user: item.user,
      })
    }),
  )
}

const handleImageLayout = (image: WaterfallImage) => {
  if (!waterfallRef.value) return

  const containerWidth = waterfallRef.value.clientWidth
  const currentRow = imgList[rowCount.value] || []

  // 计算累计宽度（包含10px间距）
  const newWidth = rowWidth.value + image.width + (currentRow.length > 0 ? 10 : 0)

  if (newWidth > containerWidth) {
    // 调整当前行
    const availableWidth = containerWidth - (currentRow.length - 1) * 10
    const scale = availableWidth / rowWidth.value
    currentRow.forEach((img) => {
      img.height = baseHeight.value * scale
      img.width *= scale
    })

    // 新建行（保持响应性）
    rowCount.value += 1
    rowWidth.value = image.width
    imgList[rowCount.value] = reactive([image])
  } else {
    rowWidth.value = newWidth
    currentRow.push(reactive(image))
  }
}

const router = useRouter()
// 跳转至图片详情页
const doClickPicture = (picture: API.PictureVO) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}
</script>

<style>
.waterfall-container {
  width: 100%;
}

.waterfall-row {
  display: flex;
  margin-bottom: 16px;
}

.waterfall-item {
  flex-shrink: 0;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  position: relative;
  cursor: pointer;
}

.waterfall-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 悬停覆盖层样式 */
.hover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 用户信息样式 */
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  background-color: rgba(255, 255, 255, 0.2);
}

.user-name {
  color: #fff;
  font-size: 14px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 8px;
  border-radius: 16px;
  transition: background 0.3s;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.1s ease;
  opacity: 1;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px); /* 添加垂直移动效果 */
}

/* 确保悬停层初始状态 */
.hover-overlay {
  opacity: 1;
  will-change: opacity, transform; /* 优化动画性能 */
  /* 添加常规过渡 */
  transition: all 0.3s ease;
  /* 新增以下属性 */
  backface-visibility: hidden;
  perspective: 1000px;
  transform-style: preserve-3d;
}

.waterfall-item:hover .hover-overlay {
  transform: translateY(0);
}
</style>
