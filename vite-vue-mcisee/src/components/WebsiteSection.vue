<template>
  <div class="website-container" id="网站">
    <h2 class="page-title">{{ $t('website') }}</h2>
    
    <!-- 实用网站 -->
    <UtilityWebsites />
    
    <!-- 论坛 -->
    <ForumSection />
  </div>
</template>

<script>
import UtilityWebsites from './UtilityWebsites.vue'
import ForumSection from './ForumSection.vue'

export default {
  name: 'WebsiteSection',
  components: {
    UtilityWebsites,
    ForumSection
  }
}
</script>

<style scoped>
/* WebsiteSection样式 */
.website-container {
  margin: 2rem 0;
}

.page-title {
  color: var(--mdui-color-on-surface);
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 600;
}
</style>