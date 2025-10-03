<template>
  <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
      background-color="#333"
      text-color="#fff"
      active-text-color="#409EFF"
  >
    <!-- Botão de expandir/recolher dentro da sidebar -->
    <el-menu-item @click="toggleCollapse" index="0">
      <el-icon>
        <Expand v-if="isCollapse" />
        <Fold v-else />
      </el-icon>
      <template #title>
        {{ isCollapse ? 'Expandir' : 'Recolher' }}
      </template>
    </el-menu-item>

    <el-menu-item index="/daily">
      <el-icon><ChatSquare/></el-icon>
      <template #title>
        <router-link to="/daily" >Daily</router-link>
      </template>
    </el-menu-item>

    <el-menu-item index="2">
      <el-icon><IconMenu /></el-icon>
      <template #title>Teams</template>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <el-icon><Document /></el-icon>
      <template #title>Navigator Three</template>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><User /></el-icon>
      <template #title>Devs</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  Expand,
  Fold, User, ChatSquare,
} from '@element-plus/icons-vue'

const isCollapse = ref(true)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style>

.teste{
  text-decoration: none;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu-vertical-demo .el-popper.is-dark {
  transition-delay: 0.7s !important;
}


</style>
