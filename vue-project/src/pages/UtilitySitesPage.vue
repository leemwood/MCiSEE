<template>
  <div id="utilities-page">
    <!-- 公告栏 -->
    <div class="announcement-bar" v-if="announcements.length > 0">
      <el-alert
        :title="announcements[currentAnnouncementIndex]"
        type="info"
        :closable="false"
        show-icon
        center
      />
    </div>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- 导航栏 -->
      <div class="page-navigation">
        <el-menu
          mode="horizontal"
          :default-active="$route.path"
          router
          class="navigation-menu"
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
      </div>

      <!-- 实用网站区域 -->
      <UtilitySites 
        :utilitySites="utilitySites"
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
import UtilitySites from '../components/UtilitySites.vue'
import ConfigSection from '../components/ConfigSection.vue'
import { i18n } from '../utils/i18n'

// Element Plus组件导入
import { ElAlert, ElMenu, ElMenuItem, ElIcon } from 'element-plus'
import { House, Link, Search, InfoFilled } from '@element-plus/icons-vue'

// 导入JSON数据文件
import { parseJsonc } from '../utils/jsoncParser'

// 导入JSONC文件内容
import utilityWebsiteJsonc from '../../data/utilityWebsite.jsonc?raw'
import forumJsonc from '../../data/forum.jsonc?raw'

// 解析JSONC数据
const utilityWebsiteData = parseJsonc(utilityWebsiteJsonc)
const forumData = parseJsonc(forumJsonc)

export default {
  name: 'UtilitySitesPage',
  components: {
    UtilitySites,
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

    // 实用网站数据
    const utilitySites = computed(() => {
      if (!utilityWebsiteData || !Array.isArray(utilityWebsiteData)) {
        return {}
      }
      
      // 将数组转换为对象格式
      const result = {}
      utilityWebsiteData.forEach(categoryObj => {
        const categoryName = Object.keys(categoryObj)[0]
        result[categoryName] = categoryObj[categoryName]
      })
      
      return result
    })

    // 论坛网站数据
    const forumSites = computed(() => {
      if (!forumData || !Array.isArray(forumData)) {
        return {}
      }
      
      // 将数组转换为对象格式
      const result = {}
      forumData.forEach(categoryObj => {
        const categoryName = Object.keys(categoryObj)[0]
        result[categoryName] = categoryObj[categoryName]
      })
      
      return result
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

    const handleConfigChange = (newConfig) => {
      console.log('配置已更改:', newConfig)
      theme.value = newConfig.theme
      showUpdatePrompt.value = newConfig.showUpdatePrompt
      autoCheckUpdates.value = newConfig.autoCheckUpdates
      
      // 应用主题更改
      const appElement = document.getElementById('utilities-page')
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

    // 移动菜单控制方法（已移除，使用Element Plus导航组件）

    // 生命周期
    onMounted(async () => {
      console.log('UtilitySitesPage 已挂载')
      console.log('实用网站数据:', utilityWebsiteData)
      console.log('论坛数据:', forumData)
      
      // 初始化公告功能
      await initAnnouncements()
      
      // 加载保存的主题设置
      const savedTheme = localStorage.getItem('mciSeeTheme')
      const appElement = document.getElementById('utilities-page')
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
      
      // 窗口大小变化监听器已移除（使用Element Plus响应式导航组件）
    })

    onUnmounted(() => {
      // 清除定时器
      if (announcementInterval) {
        clearInterval(announcementInterval)
      }
      
      // 窗口大小变化监听器已移除（使用Element Plus响应式导航组件）
    })

    return {
      theme,
      showUpdatePrompt,
      autoCheckUpdates,
      currentAnnouncementIndex,
      announcements,
      config,
      utilitySites,
      forumSites,
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

.navigation-menu {
  border-bottom: none;
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