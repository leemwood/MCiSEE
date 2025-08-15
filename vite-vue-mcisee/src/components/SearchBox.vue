<template>
  <div class="search-container">
    <div class="search-box">
      <div class="search-input-wrapper">
        <select v-model="selectedEngine" class="search-engine-select">
          <option v-for="engine in searchEngines" :key="engine.abbr" :value="engine.abbr">
            {{ engine.title }}
          </option>
        </select>
        <input 
          v-model="searchQuery" 
          type="text" 
          class="search-input" 
          :placeholder="currentEngine?.note || '输入搜索关键词'"
          @keyup.enter="performSearch"
          @input="onSearchInput"
        />
        <button class="search-button" @click="performSearch" :disabled="!searchQuery.trim()">
          <i class="material-icons">search</i>
        </button>
        <button v-if="searchQuery" class="clear-button" @click="clearSearch">
          <i class="material-icons">clear</i>
        </button>
      </div>
      
      <!-- 搜索建议 -->
      <div v-if="showSuggestions && suggestions.length > 0" class="search-suggestions">
        <div 
          v-for="(suggestion, index) in suggestions" 
          :key="index"
          class="suggestion-item"
          @click="selectSuggestion(suggestion)"
        >
          {{ suggestion }}
        </div>
      </div>
    </div>
    
    <!-- 快速搜索按钮 -->
    <div class="quick-search">
      <button 
        v-for="engine in quickSearchEngines" 
        :key="engine.abbr"
        class="quick-search-btn"
        @click="quickSearch(engine.abbr)"
        :title="engine.title"
      >
        {{ engine.abbr }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { getSearchableData, buildSearchUrl } from '../services/dataLoader.js'

export default {
  name: 'SearchBox',
  setup() {
    const searchEngines = ref([])
    const selectedEngine = ref('site')
    const searchQuery = ref('')
    const showSuggestions = ref(false)
    const suggestions = ref([])
    
    // 常用搜索引擎
    const quickSearchEngines = computed(() => {
      return searchEngines.value.filter(engine => 
        ['wiki', 'curse', 'modrinth', 'mcmod'].includes(engine.abbr)
      )
    })
    
    // 当前选中的搜索引擎
    const currentEngine = computed(() => {
      return searchEngines.value.find(engine => engine.abbr === selectedEngine.value)
    })
    
    // 加载搜索引擎数据
    const loadSearchEngines = () => {
      try {
        searchEngines.value = getSearchableData()
        if (searchEngines.value.length > 0) {
          selectedEngine.value = searchEngines.value[0].abbr
        }
      } catch (error) {
        console.error('加载搜索引擎数据失败:', error)
      }
    }
    
    // 执行搜索
    const performSearch = () => {
      if (!searchQuery.value.trim()) return
      
      const searchUrl = buildSearchUrl(selectedEngine.value, searchQuery.value.trim())
      if (searchUrl) {
        window.open(searchUrl, '_blank')
        addToSearchHistory(searchQuery.value.trim())
      }
    }
    
    // 快速搜索
    const quickSearch = (engineAbbr) => {
      if (!searchQuery.value.trim()) return
      
      const searchUrl = buildSearchUrl(engineAbbr, searchQuery.value.trim())
      if (searchUrl) {
        window.open(searchUrl, '_blank')
        addToSearchHistory(searchQuery.value.trim())
      }
    }
    
    // 清除搜索
    const clearSearch = () => {
      searchQuery.value = ''
      showSuggestions.value = false
    }
    
    // 搜索输入事件
    const onSearchInput = () => {
      if (searchQuery.value.trim()) {
        loadSuggestions()
      } else {
        showSuggestions.value = false
      }
    }
    
    // 选择建议
    const selectSuggestion = (suggestion) => {
      searchQuery.value = suggestion
      showSuggestions.value = false
      performSearch()
    }
    
    // 加载搜索建议
    const loadSuggestions = () => {
      const history = getSearchHistory()
      const query = searchQuery.value.toLowerCase()
      
      suggestions.value = history
        .filter(item => item.toLowerCase().includes(query))
        .slice(0, 5)
      
      showSuggestions.value = suggestions.value.length > 0
    }
    
    // 添加到搜索历史
    const addToSearchHistory = (query) => {
      try {
        let history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
        history = history.filter(item => item !== query)
        history.unshift(query)
        history = history.slice(0, 10) // 只保留最近10条
        localStorage.setItem('searchHistory', JSON.stringify(history))
      } catch (error) {
        console.error('保存搜索历史失败:', error)
      }
    }
    
    // 获取搜索历史
    const getSearchHistory = () => {
      try {
        return JSON.parse(localStorage.getItem('searchHistory') || '[]')
      } catch (error) {
        return []
      }
    }
    
    // 监听点击外部关闭建议
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-box')) {
        showSuggestions.value = false
      }
    }
    
    onMounted(() => {
      loadSearchEngines()
      document.addEventListener('click', handleClickOutside)
    })
    
    return {
      searchEngines,
      selectedEngine,
      searchQuery,
      showSuggestions,
      suggestions,
      quickSearchEngines,
      currentEngine,
      performSearch,
      quickSearch,
      clearSearch,
      onSearchInput,
      selectSuggestion
    }
  }
}
</script>

<style scoped>
.search-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  margin-bottom: 16px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background: var(--mdui-color-surface-container);
  border-radius: 28px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}

.search-input-wrapper:focus-within {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.search-engine-select {
  background: transparent;
  border: none;
  padding: 12px 16px;
  border-radius: 24px;
  color: var(--mdui-color-on-surface);
  font-size: 14px;
  cursor: pointer;
  min-width: 120px;
}

.search-engine-select:focus {
  outline: none;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px 16px;
  font-size: 16px;
  color: var(--mdui-color-on-surface);
  outline: none;
}

.search-input::placeholder {
  color: var(--mdui-color-on-surface-variant);
}

.search-button,
.clear-button {
  background: var(--mdui-color-primary);
  border: none;
  border-radius: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-left: 4px;
}

.search-button:hover,
.clear-button:hover {
  background: var(--mdui-color-primary-container);
}

.search-button:disabled {
  background: var(--mdui-color-surface-variant);
  cursor: not-allowed;
}

.search-button .material-icons,
.clear-button .material-icons {
  color: var(--mdui-color-on-primary);
  font-size: 20px;
}

.clear-button {
  background: var(--mdui-color-surface-variant);
}

.clear-button .material-icons {
  color: var(--mdui-color-on-surface-variant);
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--mdui-color-surface-container);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 4px;
  overflow: hidden;
}

.suggestion-item {
  padding: 12px 16px;
  cursor: pointer;
  color: var(--mdui-color-on-surface);
  transition: background-color 0.2s ease;
}

.suggestion-item:hover {
  background: var(--mdui-color-surface-variant);
}

.quick-search {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.quick-search-btn {
  background: var(--mdui-color-secondary-container);
  color: var(--mdui-color-on-secondary-container);
  border: none;
  border-radius: 16px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
}

.quick-search-btn:hover {
  background: var(--mdui-color-secondary);
  color: var(--mdui-color-on-secondary);
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-input-wrapper {
    flex-direction: column;
    align-items: stretch;
    border-radius: 16px;
    padding: 8px;
  }
  
  .search-engine-select {
    border-bottom: 1px solid var(--mdui-color-outline-variant);
    border-radius: 0;
    margin-bottom: 8px;
  }
  
  .search-input {
    margin-bottom: 8px;
  }
  
  .search-button,
  .clear-button {
    align-self: center;
    margin: 0 4px;
  }
  
  .quick-search {
    justify-content: flex-start;
  }
  
  .quick-search-btn {
    font-size: 11px;
    padding: 6px 12px;
  }
}
/* 移动端优化 */
@media (max-width: 768px) {
  .search-container {
    padding: 1rem 0.5rem;
  }
  
  .search-form {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .search-select {
    width: 100%;
    font-size: 16px;
  }
  
  .search-input {
    width: 100%;
    font-size: 16px;
    padding: 0.75rem;
  }
  
  .search-button {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    min-height: 44px;
  }
}

@media (max-width: 480px) {
  .search-container {
    padding: 0.75rem 0.25rem;
  }
  
  .search-form {
    gap: 0.5rem;
  }
  
  .search-input {
    padding: 0.6rem;
  }
  
  .search-button {
    padding: 0.6rem;
  }
}
</style>