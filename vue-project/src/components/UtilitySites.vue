<template>
  <section class="utility-sites">
    <h2>实用网站</h2>
    <div class="sites-container">
      <div 
        v-for="(category, index) in utilitySites" 
        :key="index"
        class="category"
      >
        <h3>{{ Object.keys(category)[0] }}</h3>
        <div class="sites-grid">
          <div 
            v-for="(site, siteIndex) in Object.values(category)[0]" 
            :key="siteIndex"
            class="site-card"
            @click="openSite(site[1])"
          >
            <div class="site-header">
              <h4>{{ site[0] }}</h4>
              <span class="site-badge" v-if="site[2]">{{ site[2] }}</span>
            </div>
            <div class="site-url">{{ site[1] }}</div>
            <div class="site-description" v-if="site[2]">{{ site[2] }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UtilitySites',
  props: {
    utilitySites: {
      type: Array,
      required: true
    }
  },
  methods: {
    openSite(url) {
      if (url && url !== '#') {
        window.open(url, '_blank')
      }
    }
  }
})
</script>

<style scoped>
.utility-sites {
  margin: 32px 0;
}

.utility-sites h2 {
  color: var(--md-sys-color-on-surface);
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 600;
}

.category {
  margin-bottom: 32px;
}

.category h3 {
  color: var(--md-sys-color-primary);
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: 500;
  border-bottom: 2px solid var(--md-sys-color-surface-variant);
  padding-bottom: 8px;
}

.sites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.site-card {
  background: var(--md-sys-color-surface);
  border: 1px solid var(--md-sys-color-surface-variant);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.site-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border-color: var(--md-sys-color-primary);
}

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.site-header h4 {
  color: var(--md-sys-color-on-surface);
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.site-badge {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  margin-left: 8px;
}

.site-url {
  color: var(--md-sys-color-secondary);
  font-size: 14px;
  margin-bottom: 8px;
  word-break: break-all;
}

.site-description {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 14px;
  line-height: 1.4;
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sites-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .utility-sites h2 {
    font-size: 20px;
  }
  
  .category h3 {
    font-size: 18px;
  }
}
</style>