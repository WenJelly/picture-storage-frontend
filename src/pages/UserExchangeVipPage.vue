<template>
  <div id="vipExchangePage">
    <h2 style="margin-bottom: 16px">会员码兑换</h2>
    <!-- 兑换码表单 -->
    <a-form :model="formData" layout="vertical" name="formData" @finish="handleSubmit">
      <a-form-item label="兑换码" name="vipCode">
        <a-input v-model:value="formData.vipCode" allow-clear placeholder="请输入会员兑换码" />
      </a-form-item>
      <a-form-item>
        <a-button :loading="loading" html-type="submit" style="width: 100%" type="primary">
          兑换
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
// import { exchangeVipUsingPost } from '@/api/userController.ts'
import { useRouter } from 'vue-router'

// 表单数据
// const formData = reactive<API.VipExchangeRequest>({
//   vipCode: '',
// })

// 提交任务状态
const loading = ref(false)

const router = useRouter()

/**
 * 提交表单
 */
// const handleSubmit = async () => {
//   // 校验兑换码是否为空
//   if (!formData.vipCode) {
//     message.error('请输入兑换码')
//     return
//   }
//
//   loading.value = true
//
//   try {
//     // 调用兑换 API
//     const res = await exchangeVipUsingPost({
//       vipCode: formData.vipCode,
//     })
//
//     // 操作成功
//     if (res.data.code === 0 && res.data.data) {
//       message.success('兑换成功！')
//       // 跳转到主页或其他页面
//       router.push({
//         path: `/`,
//       })
//     } else {
//       message.error('兑换失败：' + res.data.message)
//     }
//   } catch (error) {
//     message.error('兑换失败，请稍后重试')
//   } finally {
//     loading.value = false
//   }
// }
</script>

<style scoped>
#vipExchangePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
