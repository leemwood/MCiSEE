<template>
  <div class="launcher-section">
    <h2 class="section-title">{{ device }} 启动器</h2>
    
    <el-empty v-if="launchers.length === 0" description="暂无该平台的启动器数据" />
    
    <div v-else class="launcher-grid">
      <el-card 
        v-for="launcher in launchers" 
        :key="launcher.title"
        class="launcher-card"
        shadow="hover"
      >
        <template #header>
          <div class="launcher-header">
            <h3 class="launcher-title">{{ launcher.title }}</h3>
            <el-tag type="primary" size="small">{{ launcher.abbr }}</el-tag>
          </div>
        </template>
        
        <div class="launcher-info">
          <div class="info-item" v-if="launcher.version">
            <el-icon><PriceTag /></el-icon>
            <span>版本: {{ launcher.version }}</span>
          </div>
          
          <div class="info-item" v-if="launcher.github">
            <el-icon><Monitor /></el-icon>
            <span>GitHub: {{ launcher.github }}</span>
          </div>
          
          <div class="info-item" v-if="launcher.remark">
            <el-icon><InfoFilled /></el-icon>
            <span>{{ launcher.remark }}</span>
          </div>
        </div>
        
        <div class="launcher-actions">
          <el-button 
            v-if="launcher.download"
            @click="openLink(launcher.download)"
            type="primary"
            :icon="Download"
          >
            下载
          </el-button>
          
          <el-button 
            v-if="launcher.dev && launcher.dev.download"
            @click="openLink(launcher.dev.download)"
            type="warning"
            :icon="View"
          >
            预览版
          </el-button>
          
          <el-button 
            v-if="launcher.github"
            @click="openGitHub(launcher.github)"
            type="info"
            :icon="Monitor"
          >
            GitHub
          </el-button>
          
          <el-button 
            v-if="launcher.url"
            @click="openLink(launcher.url)"
            type="success"
            :icon="Link"
          >
            官网
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { defineProps } from 'vue'
import { 
  PriceTag, 
  Monitor, 
  InfoFilled, 
  Download, 
  View, 
  Link 
} from '@element-plus/icons-vue'

export default {
  name: 'LauncherList',
  components: {
    PriceTag,
    Monitor,
    InfoFilled,
    Download,
    View,
    Link
  },
  props: {
    device: {
      type: String,
      required: true
    },
    launchers: {
      type: Array,
      required: true
    }
  },
  setup() {
    const openLink = (url) => {
      window.open(url, '_blank')
    }
    
    const openGitHub = (githubPath) => {
      const githubUrl = `https://github.com/${githubPath}`
      window.open(githubUrl, '_blank')
    }

    return {
      openLink,
      openGitHub
    }
  }
}
</script>

<style scoped>
/* 引入启动器列表组件样式 */
@import '../assets/css/launcher.css';
</style>