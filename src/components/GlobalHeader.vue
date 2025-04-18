<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <RouterLink to="/">
          <div class="title-bar">
            <img class="logo" src="/favicon.ico" alt="logo" />
            <div class="title">wenjelly</div>
          </div>
        </RouterLink>
      </a-col>
      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenuClick"
        />
      </a-col>
      <a-col flex="120px">
        <div class="user-login-status">
          <div v-if="loginUserStore.loginUser.id">
            <a-dropdown>
              <ASpace>
                <a-avatar :src="loginUserStore.loginUser.userAvatar" />
                {{ loginUserStore.loginUser.userName ?? '无名' }}
              </ASpace>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="doLogout">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div v-else>
            <a-button type="primary" href="/user/login">登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { routes } from '@/router/routes.ts'
import checkAccess from '@/assets/checkAccess.ts'
import { useLoginUserStore } from '@/stores/user.ts'
import { userLogoutUsingPost } from '@/api/userController.ts'
import { message } from 'ant-design-vue'

// 在组件脚本中导入
const router = useRouter()
const current = ref(['/']) // 默认主页
const loginUserStore = useLoginUserStore()

// 路由跳转后，更新选中的菜单项
router.afterEach((to, from, failure) => {
  current.value = [to.path]
})

/**
 * 展示在菜单的路由数组
 */
const items = computed(() =>
  routes
    .filter((item) => {
      if (item.meta?.show == false) {
        return false
      }
      return checkAccess(loginUserStore.loginUser, item?.meta?.authCheck as string)
    })
    .map((item) => {
      return {
        key: item.path,
        label: item.name,
        title: item.name,
        icon: item.meta?.icon,
      }
    }),
)

/**
 * 路由跳转事件
 * @param key 需要跳转到哪个链接
 */
const doMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  })
}

/**
 * 退出登陆功能
 */
const doLogout = async () => {
  const res = await userLogoutUsingPost()

  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: '未登陆',
    })
    message.success('退出登录成功')
    await router.push('/user/login')
  } else {
    message.error('退出登录失败,' + res.data.message)
  }
}
</script>

<style scoped>
#globalHeader {
}

.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
