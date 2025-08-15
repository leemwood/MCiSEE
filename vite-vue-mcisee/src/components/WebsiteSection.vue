<template>
  <div class="website-container" id="网站">
    <h2 class="page-title">{{ $t('website') }}</h2>
    <a class="inline-link" id="site-search">{{ $t('siteSearch') }}</a>
    
    <!-- 快速查询 -->
    <div class="searchable-container" id="快速查询">
      <div class="label">{{ $t('searchable') }}</div>
      <label class="inline-block">
        <mdui-select 
          class="searchable-list min-width-215" 
          name="searchable-list" 
          id="searchable-list" 
          placement="bottom" 
          variant="outlined"
          v-model="selectedSearchEngine"
          @change="onSearchEngineChange"
          required
        >
          <mdui-menu-item 
            v-for="engine in searchEngines" 
            :key="engine.id" 
            :value="engine.id"
          >
            <div slot="custom" class="custom-item">
              <div>{{ engine.name }}</div>
            </div>
          </mdui-menu-item>
        </mdui-select>
      </label>
      
      <div class="label searchable-label inline-block" v-if="currentEngine">
        {{ currentEngine.description }}
      </div>
      
      <!-- Modrinth特殊参数 -->
      <div class="searchable-args" v-if="selectedSearchEngine === 'Modrinth'">
        <div class="Modrinth gravity-block">
          <mdui-select 
            class="Modrinth-projectType arg min-width-190" 
            name="Modrinth-projectType"
            placement="bottom" 
            variant="outlined"
            v-model="modrinthProjectType"
            required
          >
            <mdui-menu-item value="mod" selected>
              <div slot="custom" class="custom-item">
                <div>{{ $t('mods') }}</div>
              </div>
            </mdui-menu-item>
            <mdui-menu-item value="plugin">
              <div slot="custom" class="custom-item">
                <div>{{ $t('plugins') }}</div>
              </div>
            </mdui-menu-item>
            <mdui-menu-item value="datapack">
              <div slot="custom" class="custom-item">
                <div>{{ $t('dataPacks') }}</div>
              </div>
            </mdui-menu-item>
            <mdui-menu-item value="shader">
              <div slot="custom" class="custom-item">
                <div>{{ $t('shaders') }}</div>
              </div>
            </mdui-menu-item>
            <mdui-menu-item value="resourcepack">
              <div slot="custom" class="custom-item">
                <div>{{ $t('resourcePacks') }}</div>
              </div>
            </mdui-menu-item>
            <mdui-menu-item value="modpack">
              <div slot="custom" class="custom-item">
                <div>{{ $t('modpacks') }}</div>
              </div>
            </mdui-menu-item>
          </mdui-select>
          
          <mdui-select 
            class="Modrinth-versions arg inline-block" 
            name="Modrinth-versions"
            variant="outlined"
            v-model="modrinthVersions"
            multiple
            required
          >
            <mdui-menu-item value="all">
              <div slot="custom" class="custom-item">
                <div>{{ $t('all') }}</div>
              </div>
            </mdui-menu-item>
            <mdui-menu-item v-for="version in availableVersions" :key="version" :value="version">
              <div slot="custom" class="custom-item">
                <div>{{ version }}</div>
              </div>
            </mdui-menu-item>
          </mdui-select>
          
          <mdui-button 
            class="acquire-versions inline-block" 
            icon="refresh" 
            @click="acquireVersions"
            :loading="loadingVersions"
          >
            {{ $t('acquire') }}
          </mdui-button>
        </div>
      </div>
      
      <!-- 搜索框 -->
      <div class="searchable-search">
        <form class="searchable-form" @submit.prevent="performSearch">
          <label style="display: flex;">
            <mdui-text-field 
              class="searchable-input" 
              type="text" 
              variant="outlined"
              :placeholder="$t('searchFrom')"
              v-model="searchQuery"
              @input="onSearchInput"
            >
              <mdui-button-icon 
                slot="end-icon" 
                icon="clear" 
                class="searchable-clear inline-block"
                type="reset" 
                :disabled="!searchQuery"
                :hidden="!searchQuery"
                @click="clearSearch"
              ></mdui-button-icon>
            </mdui-text-field>
            <mdui-button 
              class="searchable-button inline-block" 
              style="margin: auto 4px;"
              type="submit" 
              icon="search"
              :disabled="!searchQuery.trim()"
            >
              {{ $t('search') }}
            </mdui-button>
          </label>
        </form>
      </div>
    </div>
    
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
  },
  data() {
    return {
      selectedSearchEngine: 'MCiSEE',
      searchQuery: '',
      modrinthProjectType: 'mod',
      modrinthVersions: ['all'],
      availableVersions: [],
      loadingVersions: false,
      searchEngines: [
      {
        id: 'MCiSEE',
        name: 'MCiSEE',
        description: '站内搜索',
        url: '/search?q='
      },
      {
        id: 'Wiki',
        name: 'Minecraft Wiki',
        description: 'Minecraft中文Wiki',
        url: 'https://zh.minecraft.wiki/w/Special:Search?search='
      },
      {
        id: 'BWiki',
        name: 'Minecraft Wiki (镜像)',
        description: 'Minecraft Wiki镜像站',
        url: 'https://wiki.biligame.com/mc/index.php?search='
      },
      {
        id: 'Modrinth',
        name: 'Modrinth',
        description: 'Minecraft模组平台',
        url: 'https://modrinth.com/search?q='
      },
      {
        id: 'MCMOD',
        name: 'MCMOD百科',
        description: 'MC百科',
        url: 'https://www.mcmod.cn/s?key='
      },
      {
        id: 'CurseForge',
        name: 'CurseForge',
        description: 'Minecraft模组平台',
        url: 'https://www.curseforge.com/minecraft/search?search='
      }
      ]
    }
  },
  computed: {
    currentEngine() {
      return this.searchEngines.find(engine => engine.id === this.selectedSearchEngine)
    }
  },
  methods: {
    onSearchEngineChange() {
      localStorage.setItem('selectedSearchEngine', this.selectedSearchEngine)
    },
    
    onSearchInput() {
      // 可以在这里添加搜索建议功能
    },
    
    clearSearch() {
      this.searchQuery = ''
    },
    
    performSearch() {
      if (!this.searchQuery.trim() || !this.currentEngine) return
      
      let searchUrl = this.currentEngine.url + encodeURIComponent(this.searchQuery.trim())
      
      // 特殊处理Modrinth搜索
      if (this.selectedSearchEngine === 'Modrinth') {
        const facets = this.buildModrinthFacets()
        searchUrl = `https://modrinth.com/search?q=${encodeURIComponent(this.searchQuery.trim())}&f=${facets}`
      }
      
      // 根据设置决定是否在新窗口打开
      const searchableDirect = localStorage.getItem('searchable-direct') === 'true'
      if (searchableDirect) {
        window.location.href = searchUrl
      } else {
        window.open(searchUrl, '_blank')
      }
    },
    
    buildModrinthFacets() {
      const facets = []
      
      // 项目类型
      facets.push(`project_type:${this.modrinthProjectType}`)
      
      // 版本
      if (!this.modrinthVersions.includes('all') && this.modrinthVersions.length > 0) {
        const versionFacets = this.modrinthVersions.map(v => `versions:${v}`)
        facets.push(...versionFacets)
      }
      
      return encodeURIComponent(JSON.stringify([facets]))
    },
    
    async acquireVersions() {
      this.loadingVersions = true
      try {
        // 这里应该调用API获取Minecraft版本列表
        // 暂时使用模拟数据
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.availableVersions = [
          '1.20.4', '1.20.3', '1.20.2', '1.20.1', '1.20',
          '1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19',
          '1.18.2', '1.18.1', '1.18',
          '1.17.1', '1.17',
          '1.16.5', '1.16.4', '1.16.3', '1.16.2', '1.16.1', '1.16'
        ]
      } catch (error) {
        console.error('获取版本列表失败:', error)
      } finally {
        this.loadingVersions = false
      }
    }
  },
  
  mounted() {
    // 从本地存储恢复设置
    const savedEngine = localStorage.getItem('selectedSearchEngine')
    if (savedEngine) {
      this.selectedSearchEngine = savedEngine
    }
    
    // 初始化Minecraft版本列表
    this.acquireVersions()
  }
}
</script>

<style scoped>
.searchable-container {
  margin: 2rem 0;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
}

.searchable-args {
  margin: 1rem 0;
}

.searchable-search {
  margin-top: 1rem;
}

.searchable-form label {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.searchable-input {
  flex: 1;
  min-width: 250px;
}

.arg {
  margin: 0.5rem 0.5rem 0.5rem 0;
}

.custom-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>