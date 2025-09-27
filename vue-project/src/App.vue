<template>
  <div id="app" :class="theme">
    <!-- 公告栏 -->
    <div class="announcement-bar" v-if="announcement">
      <div class="announcement-content">
        <span class="announcement-icon">📢</span>
        <span class="announcement-text">{{ announcement }}</span>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <main class="main-content">
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

      <!-- 搜索区域 -->
      <SearchSection 
        :searchSites="searchSites"
        @search="handleSearch"
      />

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
      <p>&copy; 2024 MCiSEE. 所见皆是Minecraft.</p>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import DeviceSelector from './components/DeviceSelector.vue'
import LauncherList from './components/LauncherList.vue'
import SearchSection from './components/SearchSection.vue'
import ConfigSection from './components/ConfigSection.vue'
import UtilitySites from './components/UtilitySites.vue'

// 导入JSON数据文件
import { parseJsonc } from './utils/jsoncParser'

// 导入JSONC文件内容
import launcherJsonc from '../data/launcher.jsonc?raw'
import searchableJsonc from '../data/searchable.jsonc?raw'
import utilityWebsiteJsonc from '../data/utilityWebsite.jsonc?raw'

// 解析JSONC数据
const launcherData = parseJsonc(launcherJsonc)
const searchableData = parseJsonc(searchableJsonc)
const utilityWebsiteData = parseJsonc(utilityWebsiteJsonc)

export default {
  name: 'App',
  components: {
    DeviceSelector,
    LauncherList,
    SearchSection,
    ConfigSection,
    UtilitySites
  },
  setup() {
    // 响应式数据
    const selectedDevice = ref('Android')
    const theme = ref('light')
    const showUpdatePrompt = ref(true)
    const autoCheckUpdates = ref(true)
    const announcement = ref('欢迎使用MCiSEE！这里汇集了各种Minecraft启动器和资源。')

    // 设备列表
    const devices = [
      { id: 'Android', name: 'Android', icon: '📱' },
      { id: 'iOS', name: 'iOS', icon: '📱' },
      { id: 'Windows', name: 'Windows', icon: '💻' },
      { id: 'macOS', name: 'macOS', icon: '💻' },
      { id: 'Linux', name: 'Linux', icon: '💻' }
    ]

    // 计算属性：组合配置对象
    const config = computed(() => ({
      theme: theme.value,
      showUpdatePrompt: showUpdatePrompt.value,
      autoCheckUpdates: autoCheckUpdates.value
    }))

    // 计算属性：根据选择的设备过滤启动器
    const filteredLaunchers = computed(() => {
      const deviceKey = selectedDevice.value + 'Launcher'
      return launcherData[deviceKey] || []
    })

    // 搜索网站数据
    const searchSites = computed(() => {
      // searchableData 是一个数组，不是对象
      if (Array.isArray(searchableData)) {
        return searchableData.map(item => ({
          title: item.title,
          url: item.url,
          search: item.search || '',
          abbr: item.abbr || '',
          note: item.note || ''
        }))
      }
      return []
    })

    // 实用网站数据
    const utilitySites = computed(() => {
      return utilityWebsiteData || []
    })

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

    const handleSearch = (searchData) => {
      console.log('搜索:', searchData)
      // 这里可以添加搜索逻辑
      if (searchData.site && searchData.query) {
        const searchUrl = searchData.site.url.replace('{query}', encodeURIComponent(searchData.query))
        window.open(searchUrl, '_blank')
      }
    }

    const handleConfigChange = (newConfig) => {
      console.log('配置已更改:', newConfig)
      theme.value = newConfig.theme
      showUpdatePrompt.value = newConfig.showUpdatePrompt
      autoCheckUpdates.value = newConfig.autoCheckUpdates
    }

    // 生命周期
    onMounted(() => {
      console.log('App 已挂载')
      console.log('启动器数据:', launcherData)
      console.log('可搜索数据:', searchableData)
    })

    return {
      selectedDevice,
      theme,
      showUpdatePrompt,
      autoCheckUpdates,
      announcement,
      devices,
      config,
      filteredLaunchers,
      searchSites,
      utilitySites,
      searchableData,
      handleDeviceChange,
      handleLauncherClick,
      handleSearch,
      handleConfigChange
    }
  }
}
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', 'Noto Sans SC', sans-serif;
  line-height: 1.6;
  background-color: var(--md-sys-color-background);
  color: var(--md-sys-color-on-background);
  transition: all 0.3s ease;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 主题变量 */
#app.light {
  --md-sys-color-background: #fef7ff;
  --md-sys-color-on-background: #1d1b20;
  --md-sys-color-surface: #fef7ff;
  --md-sys-color-surface-variant: #e7e0ec;
  --md-sys-color-on-surface: #1d1b20;
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-secondary: #625b71;
  --md-sys-color-on-secondary: #ffffff;
  --md-sys-color-error: #ba1a1a;
  --md-sys-color-on-error: #ffffff;
}

#app.dark {
  --md-sys-color-background: #141218;
  --md-sys-color-on-background: #e6e1e5;
  --md-sys-color-surface: #141218;
  --md-sys-color-surface-variant: #49454f;
  --md-sys-color-on-surface: #e6e1e5;
  --md-sys-color-primary: #d0bcff;
  --md-sys-color-on-primary: #381e72;
  --md-sys-color-secondary: #ccc2dc;
  --md-sys-color-on-secondary: #332d41;
  --md-sys-color-error: #ffb4ab;
  --md-sys-color-on-error: #690005;
}

/* 公告栏样式 */
.announcement-bar {
  background: linear-gradient(135deg, var(--md-sys-color-primary), var(--md-sys-color-secondary));
  color: var(--md-sys-color-on-primary);
  padding: 12px 20px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}

.announcement-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.announcement-icon {
  font-size: 16px;
}

.announcement-text {
  opacity: 0.9;
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* 页脚样式 */
.footer {
  background-color: var(--md-sys-color-surface-variant);
  color: var(--md-sys-color-on-surface);
  text-align: center;
  padding: 20px;
  margin-top: auto;
}

.footer p {
  opacity: 0.7;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
  
  .announcement-bar {
    padding: 10px 16px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 12px;
  }
}
</style>