<template>
  <div id="utilities-page">
    <!-- 公告栏 -->
    <div class="announcement-bar" v-if="announcements.length > 0">
      <ul>
        <li v-for="(announcement, index) in announcements" 
            :key="index" 
            :class="{ active: currentAnnouncementIndex === index }">
          <span class="announcement-icon">📢</span>
          <span class="announcement-text" v-html="announcement"></span>
        </li>
      </ul>
    </div>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- 导航栏 -->
      <nav class="page-navigation">
        <router-link to="/" class="nav-link">启动器下载</router-link>
        <router-link to="/utilities" class="nav-link active">实用网站</router-link>
        <router-link to="/search" class="nav-link">搜索功能</router-link>
      </nav>

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
    ConfigSection
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
      utilitySites,
      forumSites,
      handleConfigChange
    }
  }
}
</script>

<style scoped>
.page-navigation {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: var(--md-sys-color-surface);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-link {
  padding: 0.75rem 1.5rem;
  margin: 0 0.5rem;
  text-decoration: none;
  color: var(--md-sys-color-on-surface);
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  background-color: var(--md-sys-color-surface-variant);
  transform: translateY(-2px);
}

.nav-link.active {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}

.nav-link.active:hover {
  background-color: var(--md-sys-color-primary);
  transform: none;
}
</style>