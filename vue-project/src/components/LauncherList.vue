<template>
  <div class="launcher-section">
    <h2 class="section-title">{{ device }} 启动器</h2>
    
    <div v-if="launchers.length === 0" class="no-launchers">
      <span class="no-data-icon">ℹ️</span>
      <p>暂无该平台的启动器数据</p>
    </div>
    
    <div v-else class="launcher-grid">
      <div 
        v-for="launcher in launchers" 
        :key="launcher.title"
        class="launcher-card"
      >
        <div class="launcher-header">
          <h3 class="launcher-title">{{ launcher.title }}</h3>
          <span class="launcher-abbr">{{ launcher.abbr }}</span>
        </div>
        
        <div class="launcher-info">
          <div class="info-item" v-if="launcher.version">
            <span class="info-icon">🏷️</span>
            <span>版本: {{ launcher.version }}</span>
          </div>
          
          <div class="info-item" v-if="launcher.github">
            <span class="info-icon">💻</span>
            <span>GitHub: {{ launcher.github }}</span>
          </div>
          
          <div class="info-item" v-if="launcher.remark">
            <span class="info-icon">ℹ️</span>
            <span>{{ launcher.remark }}</span>
          </div>
        </div>
        
        <div class="launcher-actions">
          <button 
            v-if="launcher.download"
            @click="openLink(launcher.download)"
            class="action-button download-button"
          >
            <span class="button-icon">⬇️</span>
            下载
          </button>
          
          <button 
            v-if="launcher.dev && launcher.dev.download"
            @click="openLink(launcher.dev.download)"
            class="action-button preview-button"
          >
            <span class="button-icon">🔬</span>
            预览版
          </button>
          
          <button 
            v-if="launcher.github"
            @click="openGitHub(launcher.github)"
            class="action-button github-button"
          >
            <span class="button-icon">💻</span>
            GitHub
          </button>
          
          <button 
            v-if="launcher.url"
            @click="openLink(launcher.url)"
            class="action-button website-button"
          >
            <span class="button-icon">🌐</span>
            官网
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineProps } from 'vue'

export default {
  name: 'LauncherList',
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