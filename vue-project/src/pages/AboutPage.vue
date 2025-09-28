<template>
  <div id="about-page">
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

      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">关于 MCiSEE</h1>
        <p class="page-description">Minecraft 启动器与资源一站式解决方案</p>
      </div>

      <!-- 项目信息 -->
      <div class="info-section">
        <h2 class="section-title">项目信息</h2>
        <div class="info-grid">
          <div class="info-item">
            <h3>项目名称</h3>
            <p>MCiSEE (Minecraft Integrated Search Engine & Explorer)</p>
          </div>
          <div class="info-item">
            <h3>项目描述</h3>
            <p>一个集成了 Minecraft 启动器下载、实用网站导航和资源搜索功能的一站式解决方案</p>
          </div>
          <div class="info-item">
            <h3>开源协议</h3>
            <p>CC BY-NC-SA 4.0</p>
          </div>
          <div class="info-item">
            <h3>项目版本</h3>
            <p>v2.0.0 (Vue重构版)</p>
          </div>
        </div>
      </div>

      <!-- 配置设置区域 -->
      <ConfigSection 
        :config="config"
        @config-change="handleConfigChange"
      />

      <!-- 统计信息 -->
      <div class="stats-section">
        <h2 class="section-title">统计信息</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <h3>访问统计</h3>
            <div class="stat-content">
              <img src="https://visitor-badge.laobi.icu/badge?page_id=teaSummer.MCiSEE" alt="Visitor Count">
            </div>
          </div>
          
          <div class="stat-item">
            <h3>贡献者</h3>
            <div class="stat-content">
              <img src="https://contrib.rocks/image?repo=teaSummer/MCiSEE" alt="Contributors">
            </div>
          </div>
          
          <div class="stat-item">
            <h3>GitHub星星历史</h3>
            <div class="stat-content">
              <img src="https://starchart.cc/teaSummer/MCiSEE.svg?variant=adaptive" alt="Stars Over Time">
            </div>
          </div>
        </div>
      </div>

      <!-- 友情链接 -->
      <div class="links-section">
        <h2 class="section-title">友情链接</h2>
        <div class="links-grid">
          <a href="https://github.com/teaSummer/MCiSEE" target="_blank" class="link-item">
            <span class="link-icon">📱</span>
            <span class="link-text">GitHub仓库</span>
          </a>
          <a href="https://github.com/teaSummer/MCiSEE/#贡献教程" target="_blank" class="link-item">
            <span class="link-icon">📖</span>
            <span class="link-text">贡献教程</span>
          </a>
          <a href="https://afdian.com/a/MCiSEE" target="_blank" class="link-item">
            <span class="link-icon">💖</span>
            <span class="link-text">爱发电赞助</span>
          </a>
          <a href="https://www.007idc.cn/aff/RIWDQNQO" target="_blank" rel="noopener" class="link-item sponsor">
            <span class="link-icon">🌐</span>
            <span class="link-text">007IDC</span>
          </a>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <p class="footer-icp">ICP备案信息</p>
        <p class="footer-license">
          本作品采用 
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a> 
          许可协议进行许可
        </p>
        <p class="footer-credit">感谢所有贡献者和支持者</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ConfigSection from '../components/ConfigSection.vue'
import { i18n } from '../utils/i18n'

// Element Plus组件导入
import { ElAlert, ElMenu, ElMenuItem, ElIcon } from 'element-plus'
import { House, Link, Search, InfoFilled } from '@element-plus/icons-vue'

export default {
  name: 'AboutPage',
  components: {
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

    // 配置更改处理
    const handleConfigChange = (newConfig) => {
      console.log('配置已更改:', newConfig)
      theme.value = newConfig.theme
      showUpdatePrompt.value = newConfig.showUpdatePrompt
      autoCheckUpdates.value = newConfig.autoCheckUpdates
      
      // 应用主题更改
      const appElement = document.getElementById('about-page')
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
      console.log('AboutPage 已挂载')
      
      // 初始化公告功能
      await initAnnouncements()
      
      // 加载保存的主题设置
      const savedTheme = localStorage.getItem('mciSeeTheme')
      const appElement = document.getElementById('about-page')
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
      handleConfigChange
    }
  }
}
</script>

<style scoped lang="css">
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

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.5rem;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
}

.page-description {
  font-size: 1.2rem;
  color: var(--el-text-color-secondary);
}

.info-section,
.stats-section,
.links-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.8rem;
  color: var(--el-text-color-primary);
  margin-bottom: 24px;
  border-bottom: 2px solid var(--el-color-primary);
  padding-bottom: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-item {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 20px;
}

.info-item h3 {
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.info-item p {
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.stat-item {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.stat-item h3 {
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
}

.stat-content img {
  max-width: 100%;
  height: auto;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.link-item {
  display: flex;
  align-items: center;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 16px;
  text-decoration: none;
  color: var(--el-text-color-primary);
  transition: all 0.3s ease;
}

.link-item:hover {
  background-color: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary);
  transform: translateY(-2px);
}

.link-icon {
  font-size: 1.5rem;
  margin-right: 12px;
}

.link-text {
  font-weight: 500;
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
  text-align: center;
}

.footer-icp,
.footer-license,
.footer-credit {
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.footer-license a {
  color: var(--el-color-primary);
  text-decoration: none;
}

.footer-license a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .info-grid,
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .footer {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .links-grid {
    grid-template-columns: 1fr;
  }
}
</style>