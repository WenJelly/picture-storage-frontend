<template>
  <div id="app">
    <BasicLayout />
  </div>
</template>

<script lang="ts" setup>
import BasicLayout from '@/layouts/BasicLayout.vue'
import { useLoginUserStore } from '@/stores/user.ts'

const loginUserStore = useLoginUserStore()
loginUserStore.fetchLoginUser()
</script>

<style>
#app {
}
</style>
