<template>
  <div class="utility-website-container">
    <div class="header">
      <h2 class="title">
        {{ $t('utilityWebsite') }}
        <span class="count">({{ totalWebsites }})</span>
      </h2>
    </div>

    <div class="categories">
      <div v-for="(category, index) in websiteData" :key="index" class="category">
        <div class="category-header" @click="toggleCategory(index)">
          <div class="category-info">

            <span class="category-name">{{ getCleanCategoryName(Object.keys(category)[0]) }}</span>
            <span class="website-count">{{ Object.values(category)[0].length }}</span>
          </div>
          <span class="expand-icon" :class="{ expanded: expandedCategories[index] }">▼</span>
        </div>
        
        <div class="website-list" :class="{ expanded: expandedCategories[index] }">
          <div class="website-grid">
            <div v-for="(website, wIndex) in Object.values(category)[0]" :key="wIndex" class="website-item">
              <a :href="website[1]" target="_blank" class="website-link" rel="noopener noreferrer">
                <div class="website-header">
                  <img v-if="getFaviconUrl(website[1])" :src="getFaviconUrl(website[1])" class="website-favicon" width="16" height="16" loading="lazy" @error="onFaviconError" />
                  <span class="website-name">{{ website[0] }}</span>
                </div>
                <p class="website-desc" v-if="website[2]">{{ website[2] }}</p>
                <span class="website-domain">{{ getDomain(website[1]) }}</span>
              </a>
            </div>
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
      websiteData: [],
      loading: true,
      error: null,
      expandedCategories: {}
    }
  },
  computed: {
    totalWebsites() {
      return this.websiteData.reduce((total, category) => {
        return total + Object.values(category)[0].length
      }, 0)
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
    
    toggleCategory(index) {
      this.expandedCategories[index] = !this.expandedCategories[index]
      // 保存展开状态到本地存储
      localStorage.setItem('expandedCategories', JSON.stringify(this.expandedCategories))
    },
    

    
    getDomain(url) {
      try {
        return new URL(url).hostname
      } catch {
        return url
      }
    },
    
    // 获取网站favicon URL
    getFaviconUrl(url) {
      if (!url || url.startsWith('#')) return ''
      try {
        const domain = url.replace(/https?:\/\//, '').replace(/\/.*/, '')
        return `https://favicon.pub/api/${domain}?s=16`
      } catch {
        return ''
      }
    },
    
    // 处理favicon加载错误
    onFaviconError(event) {
      // 隐藏加载失败的图标
      event.target.style.display = 'none'
    },
    
    setDefaultExpandedCategories() {
      this.websiteData.forEach((category, index) => {
        const categoryName = Object.keys(category)[0]
        if (categoryName.includes('[open]') && this.expandedCategories[index] === undefined) {
          this.expandedCategories[index] = true
        }
      })
      // 更新本地存储
      localStorage.setItem('expandedCategories', JSON.stringify(this.expandedCategories))
    },
    
    getCleanCategoryName(categoryName) {
      return categoryName.replace(/\[open\]/g, '')
    }
  },
  
  async mounted() {
    // 恢复分类展开状态
    const savedCategories = localStorage.getItem('expandedCategories')
    if (savedCategories) {
      try {
        this.expandedCategories = JSON.parse(savedCategories)
      } catch (e) {
        this.expandedCategories = {}
      }
    }
    
    // 加载网站数据
    await this.loadWebsiteData()
    
    // 设置默认展开分类
    this.setDefaultExpandedCategories()
  }
}
</script>

<style scoped>
.utility-website-container {
  margin: 2rem 0;
  background: rgba(248, 249, 250, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(224, 224, 224, 0.3);
}

.header {
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  font-size: 1.2rem;
}

.count {
  font-size: 0.9rem;
  color: #666;
  font-weight: 400;
}

.categories {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category {
  border: 1px solid rgba(224, 224, 224, 0.4);
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.category-header {
  padding: 1rem;
  background: rgba(248, 249, 250, 0.7);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
}

.category-header:hover {
  background: rgba(233, 236, 239, 0.8);
  transform: translateY(-1px);
}

.category-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.category-icon {
  font-size: 1.1rem;
}

.category-name {
  font-weight: 500;
  color: #333;
}

.website-count {
  background: #007bff;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.expand-icon {
  transition: transform 0.2s ease;
  color: #666;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.website-list {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.website-list.expanded {
  max-height: none;
  overflow: visible;
}

.website-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.website-item {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(224, 224, 224, 0.4);
  border-radius: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(6px);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.website-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.15);
  border-color: rgba(0, 123, 255, 0.6);
  background: rgba(255, 255, 255, 0.95);
}

.website-link {
  display: block;
  text-decoration: none;
  color: inherit;
  padding: 1rem;
}

.website-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
}

.website-favicon {
  flex-shrink: 0;
  border-radius: 2px;
  vertical-align: middle;
}

.website-name {
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
  flex: 1;
}

.link-icon {
  color: #666;
  font-size: 0.9rem;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.website-item:hover .link-icon {
  opacity: 1;
  color: #007bff;
}

.website-desc {
  color: #666;
  font-size: 0.85rem;
  line-height: 1.4;
  margin: 0 0 0.75rem 0;
}

.website-domain {
  color: #999;
  font-size: 0.75rem;
  background: #f8f9fa;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .website-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.875rem;
  }
}

@media (max-width: 992px) {
  .website-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
  }
}

@media (max-width: 768px) {
  .website-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 0.75rem;
    padding: 0.75rem;
  }
  
  .category-header {
    padding: 0.75rem;
  }
  
  .title {
    font-size: 1.3rem;
  }
  
  .website-link {
    padding: 0.75rem;
  }
  
  .website-name {
    font-size: 0.9rem;
  }
  
  .website-desc {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .website-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  
  .website-link {
    padding: 0.5rem;
  }
  
  .website-name {
    font-size: 0.85rem;
  }
  
  .website-desc {
    font-size: 0.75rem;
    line-height: 1.3;
  }
  
  .website-domain {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
  }
}

@media (max-width: 320px) {
  .website-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}

/* 深色主题支持 */
@media (prefers-color-scheme: dark) {
  .utility-website-container {
    color: #e0e0e0;
  }
  
  .title {
    color: #e0e0e0;
  }
  
  .category {
    background: #2d3748;
    border-color: #4a5568;
  }
  
  .category-header {
    background: #374151;
  }
  
  .category-header:hover {
    background: #4b5563;
  }
  
  .category-name {
    color: #e0e0e0;
  }
  
  .website-item {
    background: #2d3748;
    border-color: #4a5568;
  }
  
  .website-item:hover {
    border-color: #4a9eff;
  }
  
  .website-name {
    color: #e0e0e0;
  }
  
  .website-desc {
    color: #a0aec0;
  }
  
  .website-domain {
    background: #374151;
    color: #9ca3af;
  }
}
</style>