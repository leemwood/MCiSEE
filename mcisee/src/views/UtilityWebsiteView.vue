<template>
  <div class="utility-website-view">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">
            {{ appStore.t('utility.title', '实用网站') }}
          </h1>
          <p class="page-subtitle">
            {{ appStore.t('utility.subtitle', '精选的 Minecraft 相关实用网站，助力你的游戏体验') }}
          </p>
        </div>
      </div>
    </section>

    <!-- 搜索和筛选 -->
    <section class="search-section">
      <div class="container">
        <div class="search-controls">
          <!-- 搜索框 -->
          <div class="search-box">
            <i class="icon-search"></i>
            <input 
              v-model="searchQuery"
              type="text"
              :placeholder="appStore.t('utility.search_placeholder', '搜索网站...')"
              class="search-input"
            >
            <button 
              v-if="searchQuery"
              @click="clearSearch"
              class="clear-button"
            >
              <i class="icon-close"></i>
            </button>
          </div>

          <!-- 分类筛选 -->
          <div class="category-filters">
            <button 
              @click="selectedCategory = null"
              class="filter-button"
              :class="{ 'active': selectedCategory === null }"
            >
              {{ appStore.t('utility.all_categories', '全部') }}
            </button>
            <button 
              v-for="category in categories"
              :key="category.id"
              @click="selectedCategory = category.id"
              class="filter-button"
              :class="{ 'active': selectedCategory === category.id }"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 网站内容 -->
    <section class="websites-section">
      <div class="container">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>{{ appStore.t('common.loading', '加载中...') }}</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="error-container">
          <div class="error-icon">
            <i class="icon-alert"></i>
          </div>
          <h3>{{ appStore.t('common.error', '加载失败') }}</h3>
          <p>{{ error }}</p>
          <button @click="loadWebsites" class="btn btn-primary">
            {{ appStore.t('common.retry', '重试') }}
          </button>
        </div>

        <!-- 网站分类列表 -->
        <div v-else class="categories-container">
          <!-- 搜索结果提示 -->
          <div v-if="searchQuery" class="search-results-info">
            <p>
              {{ appStore.t('utility.search_results', '搜索结果') }}: 
              <strong>{{ filteredWebsites.length }}</strong> 
              {{ appStore.t('utility.websites_found', '个网站') }}
            </p>
          </div>

          <!-- 分类展示 -->
          <div 
            v-for="category in displayCategories" 
            :key="category.id"
            class="category-section"
          >
            <div class="category-header">
              <div class="category-info">
                <h2 class="category-title">
                  <i :class="getCategoryIcon(category.id)"></i>
                  {{ category.name }}
                </h2>
                <p class="category-description">{{ category.description }}</p>
              </div>
              <div class="category-stats">
                <span class="website-count">
                  {{ getCategoryWebsites(category.id).length }} 
                  {{ appStore.t('utility.websites', '个网站') }}
                </span>
              </div>
            </div>

            <!-- 网站网格 -->
            <div class="websites-grid">
              <div 
                v-for="website in getCategoryWebsites(category.id)"
                :key="website.id"
                class="website-card"
                :class="{ 'featured': website.featured }"
              >
                <!-- 特色标签 -->
                <div v-if="website.featured" class="featured-badge">
                  {{ appStore.t('utility.featured', '推荐') }}
                </div>

                <!-- 网站图标 -->
                <div class="website-icon">
                  <!-- 加载状态 -->
                  <div v-if="isIconLoading(website)" class="icon-loading">
                    <div class="loading-spinner"></div>
                  </div>
                  <!-- 网站图标 -->
                  <img 
                    v-else
                    :src="getWebsiteIcon(website)" 
                    :alt="website.name"
                    @error="handleImageError($event, website)"
                    class="website-favicon"
                  >
                </div>

                <!-- 网站信息 -->
                <div class="website-info">
                  <h3 class="website-name">{{ website.name }}</h3>
                  <p class="website-description">{{ website.description || '暂无描述' }}</p>
                  
                  <!-- 标签 -->
                  <div class="website-tags">
                    <span 
                      v-for="tag in website.tags" 
                      :key="tag"
                      class="tag"
                    >
                      {{ tag }}
                    </span>
                  </div>

                  <!-- 网站元信息 -->
                  <div class="website-meta">
                    <div class="meta-item" v-if="website.language">
                      <i class="icon-globe"></i>
                      <span>{{ website.language }}</span>
                    </div>
                    <div class="meta-item" v-if="website.type">
                      <i class="icon-tag"></i>
                      <span>{{ getTypeLabel(website.type) }}</span>
                    </div>
                    <div class="meta-item" v-if="website.status">
                      <i :class="getStatusIcon(website.status)"></i>
                      <span>{{ getStatusLabel(website.status) }}</span>
                    </div>
                  </div>
                </div>

                <!-- 网站操作 -->
                <div class="website-actions">
                  <a 
                    :href="website.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-primary"
                    @click="trackVisit(website.name)"
                  >
                    <i class="icon-external"></i>
                    {{ appStore.t('utility.visit', '访问') }}
                  </a>
                  
                  <!-- 额外链接 -->
                  <div class="website-links">
                    <a 
                      v-if="website.github"
                      :href="website.github"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="link-button"
                      :title="appStore.t('utility.github', 'GitHub')"
                    >
                      <i class="icon-github"></i>
                    </a>
                    <a 
                      v-if="website.docs"
                      :href="website.docs"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="link-button"
                      :title="appStore.t('utility.docs', '文档')"
                    >
                      <i class="icon-book"></i>
                    </a>
                    <button 
                      @click="copyUrl(website.url)"
                      class="link-button"
                      :title="appStore.t('utility.copy_link', '复制链接')"
                    >
                      <i class="icon-copy"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 无结果提示 -->
          <div v-if="filteredWebsites.length === 0" class="no-results">
            <div class="no-results-icon">
              <i class="icon-search"></i>
            </div>
            <h3>{{ appStore.t('utility.no_results', '未找到相关网站') }}</h3>
            <p>{{ appStore.t('utility.try_different_keywords', '尝试使用不同的关键词或选择其他分类') }}</p>
            <button @click="clearSearch" class="btn btn-primary">
              {{ appStore.t('utility.clear_search', '清除搜索') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 提交网站 -->
    <section class="submit-section">
      <div class="container">
        <div class="submit-card">
          <div class="submit-content">
            <h3>{{ appStore.t('utility.submit_title', '推荐网站') }}</h3>
            <p>{{ appStore.t('utility.submit_description', '发现了好用的 Minecraft 相关网站？欢迎推荐给我们！') }}</p>
            <a 
              href="https://github.com/MCiSEE/MCiSEE/issues/new?template=website-submission.md"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary"
            >
              <i class="icon-plus"></i>
              {{ appStore.t('utility.submit_website', '推荐网站') }}
            </a>
          </div>
          <div class="submit-illustration">
            <i class="icon-lightbulb"></i>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/app'
import dataService from '../services/dataService'
import IconService from '../services/iconService'
import type { WebsiteCategory, WebsiteItem } from '../services/dataService'

const appStore = useAppStore()

// 响应式数据
const loading = ref(true)
const error = ref('')
const categories = ref<WebsiteCategory[]>([])
const searchQuery = ref('')
const selectedCategory = ref<string | null>(null)
const websiteIcons = ref<Map<string, string>>(new Map())
const iconLoadingStates = ref<Map<string, boolean>>(new Map())

// 加载网站数据
const loadWebsites = async () => {
  try {
    loading.value = true
    error.value = ''
    const data = await dataService.getUtilityWebsiteData()
    categories.value = data
    
    // 异步加载网站图标
    loadWebsiteIcons()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载网站数据失败'
    console.error('Failed to load websites:', err)
  } finally {
    loading.value = false
  }
}

// 加载网站图标
const loadWebsiteIcons = async () => {
  const allWebsites = categories.value.flatMap(category => category.websites)
  
  // 批量加载图标
  for (const website of allWebsites) {
    const websiteKey = `${website.url}-${website.name}`
    iconLoadingStates.value.set(websiteKey, true)
    
    try {
      const iconUrl = await IconService.getWebsiteIcon(website.url, website.name)
      websiteIcons.value.set(websiteKey, iconUrl)
    } catch (error) {
      console.warn(`Failed to load icon for ${website.name}:`, error)
      // 使用默认图标
      const fallbackIcon = IconService.generateFallbackIcon(website.name)
      websiteIcons.value.set(websiteKey, fallbackIcon)
    } finally {
      iconLoadingStates.value.set(websiteKey, false)
    }
  }
}

// 计算属性
const allWebsites = computed(() => {
  return categories.value.flatMap(category => 
    category.websites.map(website => ({
      ...website,
      categoryId: category.id,
      categoryName: category.name,
      id: `${category.id}-${website.name.replace(/\s+/g, '-').toLowerCase()}`
    }))
  )
})

const filteredWebsites = computed(() => {
  let websites = allWebsites.value

  // 分类筛选
  if (selectedCategory.value) {
    websites = websites.filter(website => website.categoryId === selectedCategory.value)
  }

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    websites = websites.filter(website => 
      website.name.toLowerCase().includes(query) ||
      (website.description && website.description.toLowerCase().includes(query)) ||
      website.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return websites
})

const displayCategories = computed(() => {
  if (searchQuery.value) {
    // 搜索模式：显示包含搜索结果的分类
    const categoriesWithResults = new Set(filteredWebsites.value.map(w => w.categoryId))
    return categories.value.filter(category => categoriesWithResults.has(category.id))
  } else if (selectedCategory.value) {
    // 分类筛选模式：只显示选中的分类
    return categories.value.filter(category => category.id === selectedCategory.value)
  } else {
    // 默认模式：显示所有分类
    return categories.value
  }
})

// 方法
const getCategoryWebsites = (categoryId: string) => {
  return filteredWebsites.value.filter(website => website.categoryId === categoryId)
}

const clearSearch = () => {
  searchQuery.value = ''
  selectedCategory.value = null
}

const handleImageError = (event: Event, website: WebsiteItem) => {
  const img = event.target as HTMLImageElement
  const websiteKey = `${website.url}-${website.name}`
  
  // 生成备用图标
  const fallbackIcon = `data:image/svg+xml,${encodeURIComponent(`
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="8" fill="#6B7280"/>
      <text x="32" y="40" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="white">
        ${website.name.charAt(0).toUpperCase()}
      </text>
    </svg>
  `)}`
  
  // 更新图标缓存
  websiteIcons.value.set(websiteKey, fallbackIcon)
  
  // 设置备用图标
  img.src = fallbackIcon
}

const getCategoryIcon = (categoryId: string) => {
  const iconMap: Record<string, string> = {
    'tools': 'icon-tools',
    'mods': 'icon-puzzle',
    'servers': 'icon-server',
    'resources': 'icon-package',
    'community': 'icon-users',
    'education': 'icon-book',
    'development': 'icon-code',
    'hosting': 'icon-cloud'
  }
  return iconMap[categoryId] || 'icon-folder'
}

const getWebsiteTypeIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    'tool': 'icon-tool',
    'mod': 'icon-puzzle',
    'server': 'icon-server',
    'resource': 'icon-package',
    'community': 'icon-users',
    'wiki': 'icon-book',
    'api': 'icon-code',
    'hosting': 'icon-cloud'
  }
  return iconMap[type] || 'icon-globe'
}

const getTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    'tool': '工具',
    'mod': '模组',
    'server': '服务器',
    'resource': '资源',
    'community': '社区',
    'wiki': '百科',
    'api': 'API',
    'hosting': '托管'
  }
  return labelMap[type] || type
}

const getStatusIcon = (status: string) => {
  const iconMap: Record<string, string> = {
    'active': 'icon-check-circle',
    'maintenance': 'icon-warning',
    'deprecated': 'icon-x-circle'
  }
  return iconMap[status] || 'icon-help-circle'
}

const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    'active': '正常',
    'maintenance': '维护中',
    'deprecated': '已停用'
  }
  return labelMap[status] || status
}

const trackVisit = (websiteName: string) => {
  // 这里可以添加访问统计逻辑
  console.log(`Website visit tracked: ${websiteName}`)
}

const copyUrl = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url)
    // 这里可以显示复制成功的提示
    console.log('URL copied to clipboard')
  } catch (err) {
    console.error('Failed to copy URL:', err)
  }
}

// 获取网站图标
const getWebsiteIcon = (website: WebsiteItem): string => {
  const websiteKey = `${website.url}-${website.name}`
  
  // 如果有预设图标，优先使用
  if (website.icon) {
    return website.icon
  }
  
  // 从缓存中获取
  const cachedIcon = websiteIcons.value.get(websiteKey)
  if (cachedIcon) {
    return cachedIcon
  }
  
  // 返回默认图标
  return '/icons/default-website.svg'
}

// 检查图标是否正在加载
const isIconLoading = (website: WebsiteItem): boolean => {
  const websiteKey = `${website.url}-${website.name}`
  return iconLoadingStates.value.get(websiteKey) || false
}

// 生命周期
onMounted(() => {
  // 清理过期缓存
  IconService.clearExpiredCache()
  
  // 加载网站数据
  loadWebsites()
})
</script>

<style scoped>
.utility-website-view {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 页面头部 */
.page-header {
  padding: 3rem 0;
  background: linear-gradient(135deg, var(--primary-color, #3b82f6), var(--primary-hover, #2563eb));
  color: white;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

/* 搜索区域 */
.search-section {
  padding: 2rem 0;
  background: var(--bg-secondary, #f8fafc);
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.search-controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.search-box {
  position: relative;
  max-width: 500px;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.5rem;
  font-size: 1rem;
  background: var(--card-bg, white);
  color: var(--text-color, #111827);
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-box .icon-search {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary, #6b7280);
}

.clear-button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: color 0.3s ease;
}

.clear-button:hover {
  color: var(--text-color, #111827);
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.filter-button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.5rem;
  background: var(--card-bg, white);
  color: var(--text-color, #111827);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-button:hover {
  border-color: var(--primary-color, #3b82f6);
  color: var(--primary-color, #3b82f6);
}

.filter-button.active {
  background: var(--primary-color, #3b82f6);
  border-color: var(--primary-color, #3b82f6);
  color: white;
}

/* 网站区域 */
.websites-section {
  padding: 3rem 0;
  background: var(--bg-color, #ffffff);
}

.loading-container,
.error-container {
  text-align: center;
  padding: 4rem 0;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid var(--border-color, #e5e7eb);
  border-top: 3px solid var(--primary-color, #3b82f6);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  color: var(--error-color, #ef4444);
  margin-bottom: 1rem;
}

.search-results-info {
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--bg-secondary, #f8fafc);
  border-radius: 0.5rem;
  text-align: center;
}

.category-section {
  margin-bottom: 3rem;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color, #e5e7eb);
}

.category-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color, #111827);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-description {
  color: var(--text-secondary, #6b7280);
  line-height: 1.6;
}

.website-count {
  background: var(--primary-color, #3b82f6);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.websites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.website-card {
  background: var(--card-bg, white);
  border-radius: 1rem;
  border: 1px solid var(--border-color, #e5e7eb);
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: var(--shadow);
}

.website-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color, #3b82f6);
}

.website-card.featured {
  border-color: var(--primary-color, #3b82f6);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(37, 99, 235, 0.05));
}

.featured-badge {
  position: absolute;
  top: -0.5rem;
  right: 1rem;
  background: var(--primary-color, #3b82f6);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.website-icon {
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  background: var(--bg-secondary, #f8fafc);
}

.website-favicon {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
}

.icon-loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary, #f8fafc);
}

.icon-loading .loading-spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid var(--border-color, #e5e7eb);
  border-top: 2px solid var(--primary-color, #3b82f6);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0;
}

.default-icon {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-color, #3b82f6), var(--primary-hover, #2563eb));
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.website-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color, #111827);
  margin-bottom: 0.5rem;
}

.website-description {
  color: var(--text-secondary, #6b7280);
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.website-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.tag {
  background: var(--primary-color, #3b82f6);
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.website-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  color: var(--text-secondary, #6b7280);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.website-actions {
  border-top: 1px solid var(--border-color, #e5e7eb);
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: var(--primary-color, #3b82f6);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover, #2563eb);
  transform: translateY(-1px);
}

.website-links {
  display: flex;
  gap: 0.5rem;
}

.link-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.5rem;
  color: var(--text-secondary, #6b7280);
  text-decoration: none;
  background: var(--card-bg, white);
  transition: all 0.3s ease;
  cursor: pointer;
}

.link-button:hover {
  border-color: var(--primary-color, #3b82f6);
  color: var(--primary-color, #3b82f6);
}

.no-results {
  text-align: center;
  padding: 4rem 0;
}

.no-results-icon {
  font-size: 3rem;
  color: var(--text-secondary, #6b7280);
  margin-bottom: 1rem;
}

/* 提交区域 */
.submit-section {
  padding: 3rem 0;
  background: var(--bg-secondary, #f8fafc);
}

.submit-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--card-bg, white);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow);
}

.submit-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color, #111827);
  margin-bottom: 0.5rem;
}

.submit-content p {
  color: var(--text-secondary, #6b7280);
  margin-bottom: 1rem;
}

.submit-illustration {
  font-size: 3rem;
  color: var(--primary-color, #3b82f6);
}

/* 图标样式 */
.icon-search::before { content: '🔍'; }
.icon-close::before { content: '✕'; }
.icon-tools::before { content: '🔧'; }
.icon-puzzle::before { content: '🧩'; }
.icon-server::before { content: '🖥️'; }
.icon-package::before { content: '📦'; }
.icon-users::before { content: '👥'; }
.icon-book::before { content: '📚'; }
.icon-code::before { content: '💻'; }
.icon-cloud::before { content: '☁️'; }
.icon-folder::before { content: '📁'; }
.icon-tool::before { content: '🔨'; }
.icon-globe::before { content: '🌐'; }
.icon-tag::before { content: '🏷️'; }
.icon-check-circle::before { content: '✅'; }
.icon-warning::before { content: '⚠️'; }
.icon-x-circle::before { content: '❌'; }
.icon-help-circle::before { content: '❓'; }
.icon-external::before { content: '🔗'; }
.icon-github::before { content: '⚡'; }
.icon-copy::before { content: '📋'; }
.icon-alert::before { content: '⚠️'; }
.icon-plus::before { content: '➕'; }
.icon-lightbulb::before { content: '💡'; }

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .search-controls {
    align-items: stretch;
  }

  .category-filters {
    justify-content: flex-start;
  }

  .category-header {
    flex-direction: column;
    gap: 1rem;
  }

  .websites-grid {
    grid-template-columns: 1fr;
  }

  .submit-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .website-card {
    padding: 1rem;
  }

  .website-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .btn {
    justify-content: center;
  }

  .website-links {
    justify-content: center;
  }
}
</style>