<template>
  <div class="utility-website-container" id="实用网站">
    <div class="label margin-top-20">{{ $t('utilityWebsite') }}</div>
    <a class="to-unfold" href="#实用网站-展开" @click="toggleExpand" v-if="!isExpanded">{{ $t('unfold') }}</a>
    <a class="to-fold" href="#实用网站-收起" @click="toggleExpand" v-if="isExpanded">{{ $t('fold') }}</a>
    
    <div class="website-list" :class="{ expanded: isExpanded }">
      <div v-for="(category, categoryIndex) in websiteData" :key="categoryIndex" class="category">
        <h3 class="category-title">{{ Object.keys(category)[0] }}</h3>
        <div class="website-grid">
          <div 
            v-for="(website, index) in Object.values(category)[0]" 
            :key="index" 
            class="website-item"
          >
            <a :href="website[1]" target="_blank" class="website-link">
              <div class="website-name">{{ website[0] }}</div>
              <div class="website-description" v-if="website[2]">{{ website[2] }}</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dataService from '../services/dataService.js'

export default {
  name: 'UtilityWebsites',
  data() {
    return {
      isExpanded: false,
      websiteData: [],
      loading: true,
      error: null
    }
  },
  methods: {
    async loadWebsiteData() {
      try {
        this.loading = true
        this.error = null
        this.websiteData = await dataService.loadUtilityWebsiteData()
      } catch (error) {
        console.error('加载实用网站数据失败:', error)
        this.error = '加载实用网站数据失败，请刷新页面重试'
        // 使用默认数据作为后备
        this.websiteData = dataService.getDefaultUtilityWebsiteData()
      } finally {
        this.loading = false
      }
    },
    
    toggleExpand() {
      this.isExpanded = !this.isExpanded
      // 保存展开状态到本地存储
      localStorage.setItem('utilityWebsitesExpanded', this.isExpanded.toString())
    }
  },
  
  async mounted() {
    // 恢复展开状态
    const savedExpanded = localStorage.getItem('utilityWebsitesExpanded')
    if (savedExpanded !== null) {
      this.isExpanded = savedExpanded === 'true'
    }
    
    // 加载网站数据
    await this.loadWebsiteData()
  }
}
</script>

<style scoped>
.utility-website-container {
  margin: 2rem 0;
}

.website-list {
  max-height: 300px;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.website-list.expanded {
  max-height: none;
}

.category {
  margin: 1.5rem 0;
}

.category-title {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.25rem;
}

.website-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.website-item {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.website-item:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.website-link {
  display: block;
  padding: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.website-name {
  font-weight: 500;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  color: #007bff;
}

.website-description {
  font-size: 0.8rem;
  color: #666;
  line-height: 1.4;
}

.to-unfold, .to-fold {
  float: right;
  font-size: 0.8rem;
  color: #007bff;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.to-unfold:hover, .to-fold:hover {
  background-color: rgba(0, 123, 255, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .website-grid {
    grid-template-columns: 1fr;
  }
  
  .website-item {
    margin-bottom: 0.5rem;
  }
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .category-title {
    color: #fff;
  }
  
  .website-description {
    color: #ccc;
  }
  
  .website-item {
    background: rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .website-item:hover {
    background: rgba(0, 0, 0, 0.3);
  }
}
</style>