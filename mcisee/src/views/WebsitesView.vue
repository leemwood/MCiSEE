<template>
  <div class="websites">
    <div class="container">
      <!-- 页面标题 -->
      <section class="page-header">
        <h1 class="page-title">{{ $t('websites.title') }}</h1>
        <p class="page-subtitle">{{ $t('websites.subtitle') }}</p>
      </section>
      
      <!-- 搜索框 -->
      <section class="search-section">
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            :placeholder="$t('websites.search.placeholder')"
            class="search-input"
          >
          <div class="search-icon">🔍</div>
        </div>
      </section>
      
      <!-- 网站分类 -->
      <section class="website-categories">
        <div v-if="loading" class="text-center">
          <div class="spinner"></div>
          <p class="text-muted">{{ $t('websites.loading') }}</p>
        </div>
        
        <div v-else-if="filteredCategories.length > 0">
          <div v-for="(category, index) in filteredCategories" :key="index" class="category-section">
            <h2 class="category-title">{{ getCategoryName(category) }}</h2>
            <div class="row">
              <div 
                v-for="(website, idx) in getFilteredWebsites(category)" 
                :key="idx" 
                class="col col-md-6 col-lg-4"
              >
                <div class="card website-card hoverable">
                  <div class="card-body">
                    <h3 class="website-name">{{ website[0] }}</h3>
                    <p v-if="website[2]" class="website-description text-muted">
                      {{ website[2] }}
                    </p>
                    <a :href="website[1]" class="button" target="_blank" rel="noopener noreferrer">
                      {{ $t('websites.visit') }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 无搜索结果 -->
        <div v-else-if="searchQuery && !loading" class="no-results">
          <div class="alert warning">
            <p>{{ $t('websites.search.noResults', { query: searchQuery }) }}</p>
          </div>
        </div>
        
        <!-- 无数据 -->
        <div v-else-if="!loading" class="no-data">
          <div class="alert warning">
            <p>{{ $t('websites.noData') }}</p>
          </div>
        </div>
      </section>
      
      <!-- 论坛链接 -->
      <section v-if="forumData.length > 0" class="forum-section">
        <h2 class="section-title">{{ $t('websites.forums.title') }}</h2>
        <div v-for="(forumCategory, index) in forumData" :key="index" class="forum-category">
          <h3 class="forum-category-title">{{ getForumCategoryName(forumCategory) }}</h3>
          <div class="row">
            <div 
              v-for="(forum, idx) in getForumList(forumCategory)" 
              :key="idx" 
              class="col col-md-6 col-lg-4"
            >
              <div class="card forum-card hoverable">
                <div class="card-body">
                  <h4 class="forum-name">{{ forum[0] }}</h4>
                  <p v-if="forum[2]" class="forum-description text-muted">
                    {{ forum[2] }}
                  </p>
                  <a :href="forum[1]" class="button outline" target="_blank" rel="noopener noreferrer">
                    {{ $t('websites.forums.visit') }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getUtilityWebsiteData, getForumData } from '../services/dataService'

const loading = ref(true)
const searchQuery = ref('')
const websiteData = ref([])
const forumData = ref([])

// 获取分类名称
const getCategoryName = (category) => {
  return Object.keys(category)[0]
}

// 获取分类下的网站列表
const getWebsiteList = (category) => {
  const categoryName = getCategoryName(category)
  return category[categoryName] || []
}

// 获取论坛分类名称
const getForumCategoryName = (category) => {
  return Object.keys(category)[0]
}

// 获取论坛列表
const getForumList = (category) => {
  const categoryName = getForumCategoryName(category)
  return category[categoryName] || []
}

// 过滤后的分类
const filteredCategories = computed(() => {
  if (!searchQuery.value) {
    return websiteData.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return websiteData.value.filter(category => {
    const websites = getWebsiteList(category)
    return websites.some(website => 
      website[0].toLowerCase().includes(query) || 
      (website[2] && website[2].toLowerCase().includes(query))
    )
  })
})

// 获取过滤后的网站列表
const getFilteredWebsites = (category) => {
  const websites = getWebsiteList(category)
  if (!searchQuery.value) {
    return websites
  }
  
  const query = searchQuery.value.toLowerCase()
  return websites.filter(website => 
    website[0].toLowerCase().includes(query) || 
    (website[2] && website[2].toLowerCase().includes(query))
  )
}

onMounted(async () => {
  try {
    // 加载网站数据
    const websites = await getUtilityWebsiteData()
    if (websites) {
      websiteData.value = websites
    }
    
    // 加载论坛数据
    const forums = await getForumData()
    if (forums) {
      forumData.value = forums
    }
  } catch (error) {
    console.error('Failed to load website data:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.search-section {
  margin-bottom: 3rem;
}

.search-box {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 2rem;
  font-size: 1rem;
  background: var(--card-bg);
  color: var(--text-color);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 1.25rem;
}

.category-section {
  margin-bottom: 3rem;
}

.category-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 2rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--primary-color);
}

.website-card {
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.website-card:hover {
  transform: translateY(-2px);
}

.website-name {
  color: var(--text-color);
  margin-bottom: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.website-description {
  margin-bottom: 1.5rem;
  line-height: 1.5;
  font-size: 0.9rem;
}

.forum-section {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 2rem;
  text-align: center;
}

.forum-category {
  margin-bottom: 2rem;
}

.forum-category-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1.5rem;
}

.forum-card {
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.forum-card:hover {
  transform: translateY(-2px);
}

.forum-name {
  color: var(--text-color);
  margin-bottom: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
}

.forum-description {
  margin-bottom: 1.5rem;
  line-height: 1.5;
  font-size: 0.875rem;
}

.no-results,
.no-data {
  text-align: center;
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .category-title {
    font-size: 1.5rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .search-input {
    padding: 0.875rem 2.5rem 0.875rem 1rem;
  }
}
</style>