<template>
  <div id="home-page">
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

      <!-- 设备选择器 -->
      <DeviceSelector 
        :devices="devices" 
        v-model:selectedDevice="selectedDevice"
        @device-change="handleDeviceChange"
      />

      <!-- 启动器列表 -->
      <LauncherList 
        :launchers="filteredLaunchers" 
        :device="selectedDevice"
        @launcher-click="handleLauncherClick"
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
              <img src="https://contrib.rocks/image?repo=teaSummer/MCiSEE" alt="Contributors">
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
import DeviceSelector from '../components/DeviceSelector.vue'
import LauncherList from '../components/LauncherList.vue'
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
import launcherJsonc from '../../data/launcher.jsonc?raw'

// 解析JSONC数据
const launcherData = parseJsonc(launcherJsonc)

export default {
  name: 'HomePage',
  components: {
    DeviceSelector,
    LauncherList,
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
    const selectedDevice = ref('Android')
    const currentAnnouncementIndex = ref(0)
    const announcements = ref([])
    let announcementInterval = null

    // 设备列表
    const devices = [
      { id: 'Android', name: 'Android', icon: '📱' },
      { id: 'iOS', name: 'iOS', icon: '📱' },
      { id: 'Windows', name: 'Windows', icon: '💻' },
      { id: 'macOS', name: 'macOS', icon: '💻' },
      { id: 'Linux', name: 'Linux', icon: '💻' }
    ]

    // 计算属性：根据选择的设备过滤启动器
    const filteredLaunchers = computed(() => {
      const deviceKey = selectedDevice.value + 'Launcher'
      return launcherData[deviceKey] || []
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

    // 方法
    const handleDeviceChange = (device) => {
      selectedDevice.value = device
      console.log('设备已切换:', device)
    }

    const handleLauncherClick = (launcher) => {
      console.log('启动器被点击:', launcher)
      // 这里可以添加打开下载链接的逻辑
      if (launcher.download) {
        window.open(launcher.download, '_blank')
      }
    }

    // 生命周期
    onMounted(async () => {
      console.log('HomePage 已挂载')
      console.log('启动器数据:', launcherData)
      
      // 初始化公告功能
      await initAnnouncements()
    })

    onUnmounted(() => {
      // 清除定时器
      if (announcementInterval) {
        clearInterval(announcementInterval)
      }
    })

    return {
      selectedDevice,
      currentAnnouncementIndex,
      announcements,
      devices,
      filteredLaunchers,
      handleDeviceChange,
      handleLauncherClick
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