<template>
  <div id="search-page">
    <!-- 公告栏 -->
    <el-alert 
      v-if="announcements.length > 0"
      :title="announcements[currentAnnouncementIndex]"
      type="info"
      :closable="false"
      show-icon
      class="announcement-bar"
    />

    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- 导航栏 -->
      <el-menu 
        :default-active="$route.path" 
        mode="horizontal" 
        class="page-navigation"
        router
      >
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          <span>启动器下载</span>
        </el-menu-item>
        <el-menu-item index="/utilities">
          <el-icon><Link /></el-icon>
          <span>实用网站</span>
        </el-menu-item>
        <el-menu-item index="/search">
          <el-icon><Search /></el-icon>
          <span>搜索功能</span>
        </el-menu-item>
        <el-menu-item index="/about">
          <el-icon><InfoFilled /></el-icon>
          <span>关于</span>
        </el-menu-item>
      </el-menu>

      <!-- 搜索区域 -->
      <SearchSection 
        :searchSites="searchSites"
        @search="handleSearch"
      />

      <!-- 配置区域 -->
      <ConfigSection 
        :config="config"
        @config-change="handleConfigChange"
      />
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <h2>统计信息</h2>
        <hr>
        <div class="footer-stats">
          <div class="footer-stat-item">
            <h3>访问统计</h3>
            <div class="stat-content">
              <img src="https://visitor-badge.laobi.icu/badge?page_id=teaSummer.MCiSEE" alt="Visitor Count">
            </div>
          </div>
          
          <div class="footer-stat-item">
            <h3>贡献者</h3>
            <div class="stat-content">
              <img src="https://contrib.rocks/image?repo=teaSummer.MCiSEE" alt="Contributors">
            </div>
          </div>
          
          <div class="footer-stat-item">
            <h3>GitHub星星历史</h3>
            <div class="stat-content">
              <img src="https://starchart.cc/teaSummer/MCiSEE.svg?variant=adaptive" alt="Stars Over Time">
            </div>
          </div>
        </div>
        <hr>
        <div class="footer-links">
          <p class="footer-icp">ICP备案信息</p>
          <p class="footer-social">
            <a href="https://github.com/teaSummer/MCiSEE" target="_blank">GitHub</a> |
            <a href="https://github.com/teaSummer/MCiSEE/#贡献教程" target="_blank">贡献教程</a> |
            <a href="https://afdian.com/a/MCiSEE" target="_blank">爱发电赞助</a> |
            <a href="https://www.007idc.cn/aff/RIWDQNQO" target="_blank" rel="noopener" class="sponsor">007IDC</a>
          </p>
          <p class="footer-license">
            本作品采用 
            <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a> 
            许可协议进行许可
          </p>
          <p class="footer-credit">感谢所有贡献者和支持者</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import SearchSection from '../components/SearchSection.vue'
import ConfigSection from '../components/ConfigSection.vue'
import { i18n } from '../utils/i18n'
import {
  ElAlert,
  ElMenu,
  ElMenuItem,
  ElIcon
} from 'element-plus'
import {
  House,
  Link,
  Search,
  InfoFilled
} from '@element-plus/icons-vue'

// 导入JSON数据文件
import { parseJsonc } from '../utils/jsoncParser'

// 导入JSONC文件内容
import searchJsonc from '../../data/searchable.jsonc?raw'

// 解析JSONC数据
const searchData = parseJsonc(searchJsonc)

export default {
  name: 'SearchPage',
  components: {
    SearchSection,
    ConfigSection,
    ElAlert,
    ElMenu,
    ElMenuItem,
    ElIcon,
    House,
    Link,
    Search,
    InfoFilled
  },
  setup() {
    const router = useRouter()
    
    // 响应式数据
    const theme = ref('light')
    const showUpdatePrompt = ref(true)
    const autoCheckUpdates = ref(true)
    const currentAnnouncementIndex = ref(0)
    const announcements = ref([])
    let announcementInterval = null

    // 计算属性：组合配置对象
    const config = computed(() => ({
      theme: theme.value,
      showUpdatePrompt: showUpdatePrompt.value,
      autoCheckUpdates: autoCheckUpdates.value
    }))

    // 搜索网站数据
    const searchSites = computed(() => {
      if (!searchData || !Array.isArray(searchData)) {
        return []
      }
      
      // 直接返回数组格式
      return searchData
    })

    // 公告相关方法
    const switchAnnouncement = () => {
      if (announcements.value.length > 0) {
        currentAnnouncementIndex.value = (currentAnnouncementIndex.value + 1) % announcements.value.length
        console.log('切换到公告索引:', currentAnnouncementIndex.value)
      }
    }

    const initAnnouncements = async () => {
      // 加载默认语言
      await i18n.loadLanguage('zh-CN')
      
      // 获取公告内容
      const announcementKeys = ['announcement.1', 'announcement.2', 'announcement.3', 'announcement.4']
      announcements.value = announcementKeys.map(key => i18n.t(key))
      
      // 启动公告轮播
      if (announcements.value.length > 0) {
        // 重置索引为0
        currentAnnouncementIndex.value = 0
        announcementInterval = setInterval(switchAnnouncement, 5000)
      }
    }

    const handleSearch = (searchData) => {
      console.log('执行搜索:', searchData)
      const { query, site } = searchData
      
      if (query && site) {
        // 构建搜索URL
        let searchUrl = site.url.replace('{query}', encodeURIComponent(query))
        
        // 在新窗口打开搜索结果
        window.open(searchUrl, '_blank')
      }
    }

    const handleConfigChange = (newConfig) => {
      console.log('配置已更改:', newConfig)
      theme.value = newConfig.theme
      showUpdatePrompt.value = newConfig.showUpdatePrompt
      autoCheckUpdates.value = newConfig.autoCheckUpdates
      
      // 应用主题更改
      const appElement = document.getElementById('search-page')
      const root = document.documentElement
      
      if (appElement) {
        appElement.classList.remove('light', 'dark')
        
        let actualTheme = newConfig.theme
        if (actualTheme === 'auto') {
          actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        
        appElement.classList.add(actualTheme)
        root.setAttribute('data-theme', actualTheme)
        root.style.setProperty('color-scheme', actualTheme)
      }
    }



    // 生命周期
    onMounted(async () => {
      console.log('SearchPage 已挂载')
      console.log('搜索数据:', searchData)
      
      // 初始化公告功能
      await initAnnouncements()
      
      // 加载保存的主题设置
      const savedTheme = localStorage.getItem('mciSeeTheme')
      const appElement = document.getElementById('search-page')
      const root = document.documentElement
      
      if (appElement) {
        appElement.classList.remove('light', 'dark')
        
        let actualTheme = savedTheme || 'light'
        theme.value = savedTheme || 'light'
        
        if (actualTheme === 'auto') {
          actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        
        appElement.classList.add(actualTheme)
        root.setAttribute('data-theme', actualTheme)
        root.style.setProperty('color-scheme', actualTheme)
      }
    })

    onUnmounted(() => {
      // 清除定时器
      if (announcementInterval) {
        clearInterval(announcementInterval)
      }
    })

    return {
      theme,
      showUpdatePrompt,
      autoCheckUpdates,
      currentAnnouncementIndex,
      announcements,
      config,
      searchSites,
      handleSearch,
      handleConfigChange
    }
  }
}
</script>

<style scoped>
/* 自定义样式 */
.announcement-bar {
  margin-bottom: 20px;
}

.page-navigation {
  margin-bottom: 20px;
}

.main-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.footer {
  margin-top: 40px;
  padding: 20px;
  background-color: var(--el-bg-color-page);
  border-top: 1px solid var(--el-border-color-light);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content h2 {
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
}

.footer-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.footer-stat-item h3 {
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.footer-links {
  text-align: center;
  color: var(--el-text-color-secondary);
}

.footer-links a {
  color: var(--el-color-primary);
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
  
  .footer-stats {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .footer {
    padding: 16px;
  }
}
</style>