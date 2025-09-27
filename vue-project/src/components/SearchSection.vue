<template>
  <div class="search-section">
    <h2 class="section-title">快速搜索</h2>
    
    <!-- 搜索表单 -->
    <div class="search-form">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input 
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="search-input"
          @keyup.enter="performSearch"
          @input="handleInput"
          @focus="showSuggestions = true"
          @blur="onInputBlur"
        >
        <button 
          v-if="searchQuery"
          @click="clearSearch"
          class="search-clear"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="loading-spinner">⏳</span>
          <span v-else>✕</span>
        </button>
        
        <!-- 搜索建议下拉框 -->
        <div v-if="showSuggestions && suggestions.length > 0" class="suggestions-dropdown">
          <div 
            v-for="(suggestion, index) in suggestions" 
            :key="index"
            class="suggestion-item"
            :class="{ active: activeSuggestionIndex === index }"
            @mousedown="selectSuggestion(suggestion)"
          >
            {{ suggestion }}
          </div>
        </div>
      </div>
      
      <select 
        v-model="selectedSite"
        class="site-select"
        @change="handleSiteChange"
      >
        <option 
          v-for="site in searchSites" 
          :key="site.title"
          :value="site"
        >
          {{ site.title }}
        </option>
      </select>
      
      <!-- Modrinth特殊选项 -->
      <div v-if="selectedSite.abbr === 'Modrinth'" class="modrinth-options">
        <select v-model="modrinthProjectType" class="modrinth-select">
          <option value="mod">模组</option>
          <option value="plugin">插件</option>
          <option value="datapack">数据包</option>
          <option value="resourcepack">资源包</option>
          <option value="shader">光影</option>
          <option value="modpack">整合包</option>
        </select>
        
        <select 
          v-model="modrinthVersions" 
          class="modrinth-select" 
          multiple
          size="3"
        >
          <option value="all">所有版本</option>
          <option 
            v-for="version in minecraftVersions" 
            :key="version" 
            :value="version"
          >
            {{ version }}
          </option>
        </select>
        
        <button 
          @click="fetchMinecraftVersions" 
          class="version-fetch-btn"
          :disabled="isFetchingVersions"
        >
          {{ isFetchingVersions ? '获取中...' : '获取版本' }}
        </button>
      </div>
      
      <button 
        @click="performSearch" 
        class="search-button"
        :disabled="!searchQuery || isLoading"
      >
        <span class="button-icon">🔍</span>
        {{ searchButtonText }}
      </button>
    </div>
    
    <!-- 搜索历史 -->
    <div v-if="searchHistory.length > 0" class="search-history">
      <h3 class="history-title">搜索历史</h3>
      <div class="history-items">
        <div 
          v-for="(history, index) in searchHistory" 
          :key="index"
          class="history-item"
          @click="useHistory(history)"
        >
          <span class="history-query">{{ history.query }}</span>
          <span class="history-site">{{ history.site.title }}</span>
          <button @click.stop="removeHistory(index)" class="history-remove">×</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'

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
    // 响应式数据
    const searchQuery = ref('')
    const selectedSite = ref(props.searchSites[0] || null)
    const searchInput = ref(null)
    const showSuggestions = ref(false)
    const suggestions = ref([])
    const activeSuggestionIndex = ref(-1)
    const isLoading = ref(false)
    const searchHistory = ref([])
    const modrinthProjectType = ref('mod')
    const modrinthVersions = ref(['all'])
    const minecraftVersions = ref([])
    const isFetchingVersions = ref(false)
    
    // 计算属性
    const searchPlaceholder = computed(() => {
      if (selectedSite.value?.abbr === 'MCiSEE') {
        return '搜索本站内容...'
      }
      return '输入搜索关键词'
    })
    
    const searchButtonText = computed(() => {
      if (selectedSite.value?.abbr === 'MCiSEE') {
        return '站内搜索'
      }
      return '搜索'
    })
    
    // 方法
    const performSearch = async () => {
      if (!searchQuery.value.trim()) return
      
      const site = selectedSite.value
      if (site && site.url) {
        // 添加到搜索历史
        addToHistory({
          query: searchQuery.value,
          site: site,
          timestamp: Date.now()
        })
        
        // 处理特殊搜索逻辑
        let searchUrl = ''
        
        if (site.abbr === 'Modrinth') {
          // Modrinth特殊处理
          searchUrl = buildModrinthSearchUrl()
        } else if (site.search) {
          // 使用自定义搜索模板
          searchUrl = site.search.replace('<T>', encodeURIComponent(searchQuery.value))
        } else {
          // 默认搜索URL
          searchUrl = site.url
        }
        
        emit('search', {
          query: searchQuery.value,
          site: site,
          url: searchUrl
        })
        
        // 如果是外部搜索，直接打开链接
        if (site.abbr !== 'MCiSEE') {
          window.open(searchUrl, '_blank')
        }
      }
    }
    
    const buildModrinthSearchUrl = () => {
      const query = encodeURIComponent(searchQuery.value)
      let versions = ''
      
      if (modrinthVersions.value.length > 0 && !modrinthVersions.value.includes('all')) {
        versions = modrinthVersions.value.map(v => `versions=${v}`).join('&')
      }
      
      return `https://modrinth.com/${modrinthProjectType.value}s?q=${query}${versions ? '&' + versions : ''}`
    }
    
    const handleInput = () => {
      showSuggestions.value = true
      activeSuggestionIndex.value = -1
      
      if (searchQuery.value.trim()) {
        fetchSuggestions()
      } else {
        suggestions.value = []
      }
    }
    
    const fetchSuggestions = async () => {
      if (!selectedSite.value?.abbr) return
      
      isLoading.value = true
      
      try {
        const abbr = selectedSite.value.abbr
        const query = encodeURIComponent(searchQuery.value)
        
        let apiUrl = ''
        
        // 根据站点选择不同的API
        switch (abbr) {
          case 'Wiki':
            apiUrl = `https://zh.minecraft.wiki/api.php?action=opensearch&search=${query}&limit=10`
            break
          case 'BWiki':
            apiUrl = `https://wiki.biligame.com/mc/api.php?action=opensearch&search=${query}&limit=10`
            break
          case 'Modrinth':
            // Modrinth API需要特殊处理
            const facets = buildModrinthFacets()
            apiUrl = `https://api.modrinth.com/v2/search?limit=10&index=relevance&query=${query}&facets=${facets}`
            break
          case 'MCMOD':
            apiUrl = `https://search.mcmod.cn/suggest.php?key=${query}`
            break
          default:
            suggestions.value = []
            return
        }
        
        const response = await fetch(apiUrl)
        const data = await response.json()
        
        // 处理不同API的响应格式
        if (abbr === 'Modrinth') {
          suggestions.value = data.hits.map(item => item.title)
        } else if (Array.isArray(data) && data.length > 1) {
          suggestions.value = data[1]
        } else {
          suggestions.value = []
        }
        
      } catch (error) {
        console.error('获取搜索建议失败:', error)
        suggestions.value = []
      } finally {
        isLoading.value = false
      }
    }
    
    const buildModrinthFacets = () => {
      let facets = []
      
      // 项目类型
      facets.push(`[\"project_type:${modrinthProjectType.value}\"]`)
      
      // 版本过滤
      if (modrinthVersions.value.length > 0 && !modrinthVersions.value.includes('all')) {
        const versionFacets = modrinthVersions.value.map(v => `\"versions:${v}\"`)
        facets.push(`[${versionFacets.join(',')}]`)
      }
      
      return encodeURIComponent(facets.join(','))
    }
    
    const selectSuggestion = (suggestion) => {
      searchQuery.value = suggestion
      showSuggestions.value = false
      performSearch()
    }
    
    const onInputBlur = () => {
      setTimeout(() => {
        showSuggestions.value = false
      }, 200)
    }
    
    const clearSearch = () => {
      searchQuery.value = ''
      suggestions.value = []
      showSuggestions.value = false
      searchInput.value?.focus()
    }
    
    const handleSiteChange = () => {
      suggestions.value = []
      showSuggestions.value = false
      
      // 保存站点选择到localStorage
      if (selectedSite.value) {
        localStorage.setItem('searchable-checked', selectedSite.value.title)
      }
    }
    
    const addToHistory = (historyItem) => {
      // 限制历史记录数量
      const maxHistory = 10
      
      // 移除重复项
      searchHistory.value = searchHistory.value.filter(
        item => !(item.query === historyItem.query && item.site.title === historyItem.site.title)
      )
      
      // 添加到开头
      searchHistory.value.unshift(historyItem)
      
      // 限制数量
      if (searchHistory.value.length > maxHistory) {
        searchHistory.value = searchHistory.value.slice(0, maxHistory)
      }
      
      // 保存到localStorage
      localStorage.setItem('search-history', JSON.stringify(searchHistory.value))
    }
    
    const useHistory = (historyItem) => {
      searchQuery.value = historyItem.query
      selectedSite.value = historyItem.site
      performSearch()
    }
    
    const removeHistory = (index) => {
      searchHistory.value.splice(index, 1)
      localStorage.setItem('search-history', JSON.stringify(searchHistory.value))
    }
    
    const fetchMinecraftVersions = async () => {
      isFetchingVersions.value = true
      
      try {
        const response = await fetch('https://piston-meta.mojang.com/mc/game/version_manifest.json')
        const data = await response.json()
        
        // 只获取正式版
        minecraftVersions.value = data.versions
          .filter(v => v.type === 'release')
          .map(v => v.id)
          .reverse() // 最新的版本在前
          
      } catch (error) {
        console.error('获取Minecraft版本失败:', error)
      } finally {
        isFetchingVersions.value = false
      }
    }
    
    // 生命周期
    onMounted(() => {
      // 从localStorage加载搜索历史
      const savedHistory = localStorage.getItem('search-history')
      if (savedHistory) {
        try {
          searchHistory.value = JSON.parse(savedHistory)
        } catch (error) {
          console.error('加载搜索历史失败:', error)
        }
      }
      
      // 加载上次选择的站点
      const savedSite = localStorage.getItem('searchable-checked')
      if (savedSite) {
        const site = props.searchSites.find(s => s.title === savedSite)
        if (site) {
          selectedSite.value = site
        }
      }
    })
    
    // 监听站点变化，自动获取版本
    watch(selectedSite, (newSite) => {
      if (newSite?.abbr === 'Modrinth' && minecraftVersions.value.length === 0) {
        fetchMinecraftVersions()
      }
    })

    return {
      searchQuery,
      selectedSite,
      searchInput,
      showSuggestions,
      suggestions,
      activeSuggestionIndex,
      isLoading,
      searchHistory,
      modrinthProjectType,
      modrinthVersions,
      minecraftVersions,
      isFetchingVersions,
      searchPlaceholder,
      searchButtonText,
      performSearch,
      handleInput,
      onInputBlur,
      clearSearch,
      handleSiteChange,
      selectSuggestion,
      useHistory,
      removeHistory,
      fetchMinecraftVersions
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
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 40px;
  border: 2px solid var(--md-sys-color-surface-variant);
  border-radius: 8px;
  font-size: 1rem;
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  transition: all 0.2s ease;
  position: relative;
  z-index: 1;
}

.search-input:focus {
  outline: none;
  border-color: var(--md-sys-color-primary);
  box-shadow: 0 0 0 3px rgba(103, 80, 164, 0.1);
}

.search-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2rem;
  color: var(--md-sys-color-on-surface-variant);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  z-index: 2;
}

.search-clear:hover {
  background-color: var(--md-sys-color-surface-variant);
  color: var(--md-sys-color-on-surface);
}

.search-clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--md-sys-color-surface);
  border: 2px solid var(--md-sys-color-surface-variant);
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid var(--md-sys-color-surface-variant);
}

.suggestion-item:hover,
.suggestion-item.active {
  background-color: var(--md-sys-color-surface-variant);
}

.suggestion-item:last-child {
  border-bottom: none;
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
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
  padding-right: 36px;
}

.site-select:focus {
  outline: none;
  border-color: var(--md-sys-color-primary);
  box-shadow: 0 0 0 3px rgba(103, 80, 164, 0.1);
}

.site-select option {
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  padding: 8px;
}

.modrinth-options {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 8px;
  padding: 12px;
  background-color: var(--md-sys-color-surface-variant);
  border-radius: 8px;
}

.modrinth-select {
  flex: 1;
  min-width: 120px;
  padding: 8px;
  border: 1px solid var(--md-sys-color-outline);
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
}

.version-fetch-btn {
  padding: 8px 12px;
  background-color: var(--md-sys-color-tertiary);
  color: var(--md-sys-color-on-tertiary);
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.version-fetch-btn:hover:not(:disabled) {
  background-color: var(--md-sys-color-tertiary-container);
  color: var(--md-sys-color-on-tertiary-container);
}

.version-fetch-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.search-button:hover:not(:disabled) {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

.search-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-icon {
  font-size: 1.2rem;
}

.search-history {
  margin-top: 24px;
}

.history-title {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 12px;
  color: var(--md-sys-color-on-surface-variant);
}

.history-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: var(--md-sys-color-surface-variant);
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.history-item:hover {
  background-color: var(--md-sys-color-surface-container-high);
}

.history-query {
  font-weight: 500;
  color: var(--md-sys-color-on-surface);
}

.history-site {
  font-size: 0.9rem;
  color: var(--md-sys-color-on-surface-variant);
  margin-left: auto;
  margin-right: 12px;
}

.history-remove {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: var(--md-sys-color-on-surface-variant);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 3px;
  transition: all 0.2s ease;
}

.history-remove:hover {
  background-color: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
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
  
  .modrinth-options {
    flex-direction: column;
    align-items: stretch;
  }
  
  .modrinth-select {
    width: 100%;
  }
  
  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .history-site {
    margin-left: 0;
    margin-right: 0;
  }
}
</style>