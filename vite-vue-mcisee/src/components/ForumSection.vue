<template>
  <div class="forum-container" id="论坛">
    <div class="header">
      <h2 class="title">
        {{ $t('forum') }}
        <span class="count">({{ totalForums }})</span>
      </h2>
    </div>

    <div v-if="loading" class="loading">
      <p>正在加载论坛数据...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>
    
    <div v-else class="categories">
      <div v-for="(category, index) in forumData" :key="index" class="category">
        <div class="category-header" @click="toggleCategory(index)">
          <div class="category-info">
            <span class="category-name">{{ getCleanCategoryName(Object.keys(category)[0]) }}</span>
            <span class="forum-count">{{ Object.values(category)[0].length }}</span>
          </div>
          <span class="expand-icon" :class="{ expanded: expandedCategories[index] }">▼</span>
        </div>
        
        <div class="forum-list" :class="{ expanded: expandedCategories[index] }">
          <div class="forum-grid">
            <div v-for="(forum, fIndex) in Object.values(category)[0]" :key="fIndex" class="forum-item">
              <a :href="forum[1]" target="_blank" class="forum-link" rel="noopener noreferrer">
                <div class="forum-header">
                  <span class="forum-name">{{ forum[0] }}</span>
                </div>
                <p class="forum-description" v-if="forum[2]">{{ forum[2] }}</p>
                <span class="forum-domain">{{ getDomain(forum[1]) }}</span>
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
  name: 'ForumSection',
  data() {
    return {
      forumData: [],
      loading: true,
      error: null,
      expandedCategories: {}
    }
  },
  computed: {
    totalForums() {
      return this.forumData.reduce((total, category) => {
        return total + Object.values(category)[0].length
      }, 0)
    }
  },
  methods: {
    toggleCategory(index) {
      this.expandedCategories[index] = !this.expandedCategories[index]
      // 保存展开状态到本地存储
      localStorage.setItem('forumExpandedCategories', JSON.stringify(this.expandedCategories))
    },
    
    getDomain(url) {
      try {
        return new URL(url).hostname
      } catch {
        return url
      }
    },
    
    setDefaultExpandedCategories() {
      // 检查每个分类，如果名称包含[open]标签，则默认展开
      this.forumData.forEach((category, index) => {
        const categoryName = Object.keys(category)[0]
        if (categoryName.includes('[open]')) {
          // 如果本地存储中没有该分类的状态，则设为展开
          if (this.expandedCategories[index] === undefined) {
            this.expandedCategories[index] = true
          }
        }
      })
      // 保存到本地存储
      localStorage.setItem('forumExpandedCategories', JSON.stringify(this.expandedCategories))
    },
    
    getCleanCategoryName(categoryName) {
      // 移除[open]标签
      return categoryName.replace(/\[open\]/g, '')
    },
    
    async loadForumData() {
      try {
        this.loading = true
        this.error = null
        this.forumData = await dataService.loadForumData()
      } catch (error) {
        console.error('加载论坛数据失败:', error)
        this.error = '加载论坛数据失败，请刷新页面重试'
        // 使用默认数据作为后备
        this.forumData = dataService.getDefaultForumData()
      } finally {
        this.loading = false
      }
    }
  },
  
  mounted() {
    // 恢复分类展开状态
    const savedCategories = localStorage.getItem('forumExpandedCategories')
    if (savedCategories) {
      try {
        this.expandedCategories = JSON.parse(savedCategories)
      } catch (e) {
        this.expandedCategories = {}
      }
    }
    
    // 加载论坛数据
    this.loadForumData().then(() => {
      // 设置默认展开状态（带有[open]标签的分类）
      this.setDefaultExpandedCategories()
    })
  }
}
</script>

<style scoped>
.forum-container {
  margin: 2rem 0;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.error {
  color: #ff6b6b;
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
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.category-header {
  padding: 1rem;
  background: #f8f9fa;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease;
}

.category-header:hover {
  background: #e9ecef;
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

.forum-count {
  background: #28a745;
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

.forum-list {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.forum-list.expanded {
  max-height: none;
  overflow: visible;
}

.forum-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.forum-item {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.forum-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: #28a745;
}

.forum-link {
  display: block;
  text-decoration: none;
  color: inherit;
  padding: 1rem;
}

.forum-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.forum-name {
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

.forum-item:hover .link-icon {
  opacity: 1;
  color: #28a745;
}

.forum-description {
  color: #666;
  font-size: 0.85rem;
  line-height: 1.4;
  margin: 0 0 0.75rem 0;
}

.forum-domain {
  color: #999;
  font-size: 0.75rem;
  background: #f8f9fa;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .forum-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.875rem;
  }
}

@media (max-width: 992px) {
  .forum-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
  }
}

@media (max-width: 768px) {
  .forum-grid {
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
  
  .forum-link {
    padding: 0.75rem;
  }
  
  .forum-name {
    font-size: 0.9rem;
  }
  
  .forum-description {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .forum-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  
  .forum-link {
    padding: 0.5rem;
  }
  
  .forum-name {
    font-size: 0.85rem;
  }
  
  .forum-description {
    font-size: 0.75rem;
    line-height: 1.3;
  }
  
  .forum-domain {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
  }
}

@media (max-width: 320px) {
  .forum-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}

/* 深色主题支持 */
@media (prefers-color-scheme: dark) {
  .forum-container {
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
  
  .forum-item {
    background: #2d3748;
    border-color: #4a5568;
  }
  
  .forum-item:hover {
    border-color: #28a745;
  }
  
  .forum-name {
    color: #e0e0e0;
  }
  
  .forum-description {
    color: #a0aec0;
  }
  
  .forum-domain {
    background: #374151;
    color: #9ca3af;
  }
}
</style>