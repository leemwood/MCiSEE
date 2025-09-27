<template>
  <div class="search-section">
    <h2 class="section-title">快速搜索</h2>
    
    <!-- 搜索表单 -->
    <div class="search-form">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="输入搜索关键词"
          class="search-input"
          @keyup.enter="performSearch"
        >
      </div>
      
      <select 
        v-model="selectedSite"
        class="site-select"
      >
        <option 
          v-for="site in searchSites" 
          :key="site.title"
          :value="site"
        >
          {{ site.title }}
        </option>
      </select>
      
      <button @click="performSearch" class="search-button">
        <span class="button-icon">🔍</span>
        搜索
      </button>
    </div>
    
    <!-- 网站分类列表 -->
    <div class="website-categories">
      <div 
        v-for="category in categorizedSites" 
        :key="category.name"
        class="website-category"
      >
        <h4 class="category-title">{{ category.name }}</h4>
        <div class="website-grid">
          <a 
            v-for="site in category.sites" 
            :key="site.title"
            :href="site.url.replace('{query}', '')"
            target="_blank"
            class="website-item"
          >
            <span class="website-icon">🌐</span>
            <span class="website-name">{{ site.title }}</span>
            <span class="website-abbr" v-if="site.abbr">{{ site.abbr }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'SearchSection',
  props: {
    searchSites: {
      type: Array,
      required: true
    }
  },
  emits: ['search'],
  setup(props, { emit }) {
    const searchQuery = ref('')
    const selectedSite = ref(props.searchSites[0] || null)

    // 按分类组织网站
    const categorizedSites = computed(() => {
      const categories = {}
      
      props.searchSites.forEach(site => {
        const category = site.category || '其他'
        if (!categories[category]) {
          categories[category] = {
            name: category,
            sites: []
          }
        }
        categories[category].sites.push(site)
      })
      
      return Object.values(categories)
    })

    const performSearch = () => {
      if (!searchQuery.value.trim()) return
      
      const site = selectedSite.value
      if (site && site.url) {
        emit('search', {
          query: searchQuery.value,
          site: site
        })
      }
    }

    return {
      searchQuery,
      selectedSite,
      categorizedSites,
      performSearch
    }
  }
}
</script>

<style scoped>
.search-section {
  margin: 32px 0;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 16px;
  color: var(--md-sys-color-primary);
}

.search-form {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-input-wrapper {
  flex: 1;
  min-width: 200px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  font-size: 1.2rem;
  opacity: 0.6;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid var(--md-sys-color-surface-variant);
  border-radius: 8px;
  font-size: 1rem;
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--md-sys-color-primary);
  box-shadow: 0 0 0 3px rgba(103, 80, 164, 0.1);
}

.site-select {
  flex: 1;
  min-width: 200px;
  padding: 12px;
  border: 2px solid var(--md-sys-color-surface-variant);
  border-radius: 8px;
  font-size: 1rem;
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  cursor: pointer;
  transition: all 0.2s ease;
}

.site-select:focus {
  outline: none;
  border-color: var(--md-sys-color-primary);
  box-shadow: 0 0 0 3px rgba(103, 80, 164, 0.1);
}

.search-button {
  min-width: 120px;
  padding: 12px 24px;
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.search-button:hover {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

.button-icon {
  font-size: 1.2rem;
}

.website-categories {
  margin-top: 24px;
}

.website-category {
  margin-bottom: 32px;
}

.category-title {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 16px;
  color: var(--md-sys-color-primary);
  border-bottom: 2px solid var(--md-sys-color-primary-container);
  padding-bottom: 8px;
}

.website-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.website-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: var(--md-sys-color-surface-variant);
  border-radius: 8px;
  text-decoration: none;
  color: var(--md-sys-color-on-surface-variant);
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.website-item:hover {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  border-color: var(--md-sys-color-primary);
  transform: translateY(-1px);
}

.website-icon {
  font-size: 1.2rem;
  opacity: 0.8;
}

.website-name {
  flex: 1;
  font-weight: 500;
}

.website-abbr {
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input-wrapper,
  .site-select,
  .search-button {
    width: 100%;
  }
  
  .website-grid {
    grid-template-columns: 1fr;
  }
}
</style>