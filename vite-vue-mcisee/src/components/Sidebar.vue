<template>
  <div id="目录" class="sidebar">
    <div class="info">{{ $t('content') }}</div>
    <dl>
      <dt><a href="#顶部">{{ $t('top') }}</a></dt>
      <dt><a href="#设备">{{ $t('device') }}</a></dt>
      <dt><a href="#软件">{{ $t('app') }}</a></dt>
      <dd><a href="#启动器">{{ $t('launcher') }}</a></dd>
      <dt><a href="#网站">{{ $t('website') }}</a></dt>
      <dd><a href="#快速查询">{{ $t('searchable') }}</a></dd>
      <dd><a href="#实用网站">{{ $t('utilityWebsite') }}</a></dd>
      <dd><a href="#论坛">{{ $t('forum') }}</a></dd>
      <dt><a href="#配置">{{ $t('config') }}</a></dt>
      <dt><a href="#底部">{{ $t('bottom') }}</a></dt>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'Sidebar'
}
</script>

<style scoped>
/* 侧边栏样式已在全局CSS中定义 */
</style>