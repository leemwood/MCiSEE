<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 引入独立的CSS文件 */
@import './assets/css/global.css';
@import './assets/css/announcement.css';
@import './assets/css/layout.css';
</style>