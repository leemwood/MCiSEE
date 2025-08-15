<template>
  <div class="app-container" id="软件">
    <h2 class="page-title">{{ $t('app') }}</h2>
    <div class="launcher-container" id="启动器">
      <div class="label">{{ $t('launcherOnlyJavaEdition') }}</div>
      <div class="launcher-list device-diff">
        <mdui-select 
          class="launcher-list" 
          name="launcher-list" 
          id="launcher-list" 
          placement="bottom" 
          variant="outlined"
          v-model="selectedLauncher"
          @change="onLauncherChange"
          required
        >
          <mdui-menu-item 
            v-for="launcher in availableLaunchers" 
            :key="launcher.id" 
            :value="launcher.id"
          >
            <div slot="custom" class="custom-item">
              <div>{{ launcher.name }}</div>
              <div class="secondary">{{ launcher.description }}</div>
            </div>
          </mdui-menu-item>
        </mdui-select>
      </div>
      
      <div class="launcher-title full-name" v-if="currentLauncher">
        {{ currentLauncher.fullName }}
      </div>
      
      <div class="launcher-goto" v-if="currentLauncher">
        <a 
          v-if="currentLauncher.website" 
          class="button data-url-launcher" 
          :href="currentLauncher.website" 
          target="_blank"
          v-html="getFormattedLinkText('gotoLauncherWebsite', currentLauncher.website)"
        >
        </a>
        <a 
          v-if="currentLauncher.github" 
          class="button data-github-launcher" 
          :href="currentLauncher.github" 
          target="_blank"
          v-html="getFormattedLinkText('gotoLauncherGitHub', currentLauncher.github)"
        >
        </a>
      </div>
      
      <div class="launcher-download gravity-inline" v-if="currentLauncher">
        <div v-if="currentLauncher.downloadUrl">
          <a 
            class="button download data-download-launcher" 
            :href="currentLauncher.downloadUrl"
            @click="onDownloadClick"
            ondragstart="event.dataTransfer.effectAllowed = 'none';"
          >
            {{ formatDownloadText('release') }}
          </a>
        </div>
        <div v-if="currentLauncher.devDownloadUrl">
          <a 
            class="button download data-dev-download-launcher" 
            :href="currentLauncher.devDownloadUrl"
            @click="onDownloadClick"
            ondragstart="event.dataTransfer.effectAllowed = 'none';"
          >
            {{ formatDownloadText('preRelease') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dataService from '../services/dataService.js'

export default {
  name: 'AppSection',
  props: {
    selectedDevice: {
      type: String,
      default: 'Windows'
    }
  },
  data() {
    return {
      selectedLauncher: '',
      launchers: [],
      loading: true,
      error: null
    }
  },
  computed: {
    // 根据设备过滤可用启动器
    availableLaunchers() {
      return this.launchers.filter(launcher => 
        launcher.supportedDevices.includes(this.selectedDevice)
      )
    },
    
    // 当前选中的启动器
    currentLauncher() {
      return this.launchers.find(launcher => launcher.id === this.selectedLauncher)
    }
  },
  methods: {
    async loadLauncherData() {
      try {
        this.loading = true
        this.error = null
        this.launchers = await dataService.loadLauncherData()
      } catch (error) {
        console.error('加载启动器数据失败:', error)
        this.error = '加载启动器数据失败，请刷新页面重试'
        // 使用默认数据作为后备
        this.launchers = dataService.getDefaultLauncherData()
      } finally {
        this.loading = false
      }
    },
    
    onLauncherChange(event) {
      console.log('=== Launcher Change Event ===')
      console.log('Event:', event)
      console.log('Event target value:', event.target?.value)
      console.log('Selected launcher before:', this.selectedLauncher)
      
      // 确保selectedLauncher被正确更新
      if (event.target?.value) {
        this.selectedLauncher = event.target.value
      }
      
      console.log('Selected launcher after:', this.selectedLauncher)
      localStorage.setItem('selectedLauncher', this.selectedLauncher)
      
      // 强制触发响应式更新
      this.$nextTick(() => {
        console.log('Current launcher object:', this.currentLauncher)
        console.log('Available launchers:', this.availableLaunchers.map(l => ({id: l.id, name: l.name})))
      })
    },
    
    onDownloadClick() {
      // 显示下载提示
      const snackbar = document.querySelector('.start-download')
      if (snackbar) {
        snackbar.open = true
      }
    },
    
    formatDownloadText(type) {
      const downloadSVG = '⬇️'
      const download = this.$t('download')
      const release = this.$t('release')
      const preRelease = this.$t('preRelease')
      const latest = this.$t('latest')
      
      if (type === 'release') {
        return `${downloadSVG} ${download} ${latest} ${release}`
      } else {
        return `${downloadSVG} ${download} ${latest} ${preRelease}`
      }
    },
    
    // 生成网站图标
    getFavicon(url) {
      if (!url) return ''
      const domain = url.replace(/https?:\/\//, '').replace(/\/.*/, '')
      return `<img src="https://favicon.pub/api/${domain}?s=16" width="16" height="16" loading="lazy" style="margin-right: 4px; vertical-align: middle;"/>`
    },
    
    // 获取格式化的链接文本
    getFormattedLinkText(key, url) {
      const template = this.$t(key)
      let linkFavicon = ''
      let faviconGH = '<img src="https://favicon.pub/api/github.com?s=16" width="16" height="16" loading="lazy" style="margin-right: 4px; vertical-align: middle;"/>'
      
      if (key === 'gotoLauncherWebsite' && url) {
        linkFavicon = this.getFavicon(url)
      }
      
      return template
        .replace('${linkFavicon}', linkFavicon)
        .replace('${faviconGH}', faviconGH)
    }
  },
  
  async mounted() {
    await this.loadLauncherData()
    
    // 从本地存储获取选中的启动器
    const savedLauncher = localStorage.getItem('selectedLauncher')
    if (savedLauncher && this.availableLaunchers.find(l => l.id === savedLauncher)) {
      this.selectedLauncher = savedLauncher
    } else if (this.availableLaunchers.length > 0) {
      this.selectedLauncher = this.availableLaunchers[0].id
    }
    
    console.log('初始化启动器:', this.selectedLauncher)
    
    // 确保在初始化时也触发一次更新
    this.$nextTick(() => {
      console.log('初始化currentLauncher:', this.currentLauncher)
      // 手动触发一次事件，确保界面更新
      this.onLauncherChange({ target: { value: this.selectedLauncher } })
    })
  }
}
</script>

<style scoped>
.launcher-container {
  margin-top: 1rem;
}

.launcher-title {
  margin: 0.5rem 0;
  font-style: italic;
  color: #666;
}

.launcher-goto {
  margin: 0.5rem 0;
}

.launcher-goto .button {
  margin-right: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.launcher-goto .button:hover {
  background: #0056b3;
}

.launcher-download {
  margin: 1rem 0;
}

.launcher-download .button {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  background: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.launcher-download .button:hover {
  background: #1e7e34;
}

.custom-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.secondary {
  font-size: 0.8rem;
  color: #999;
  display: none;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .launcher-selector {
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .launcher-info {
    padding: 1rem;
    margin: 0.5rem 0;
  }
  
  .launcher-name {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  
  .launcher-description {
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 1rem;
  }
  
  .launcher-links {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .launcher-links a {
    width: 100%;
    text-align: center;
    padding: 0.75rem;
    font-size: 0.9rem;
  }
  
  .launcher-download {
    margin-top: 1rem;
  }
  
  .launcher-download .button {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .launcher-info {
    padding: 0.75rem;
  }
  
  .launcher-name {
    font-size: 1rem;
  }
  
  .launcher-description {
    font-size: 0.85rem;
  }
  
  .launcher-links a {
    padding: 0.6rem;
    font-size: 0.85rem;
  }
}
</style>