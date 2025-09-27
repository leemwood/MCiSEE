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
.launcher-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 16px;
  color: var(--md-sys-color-primary);
}

.no-launchers {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background-color: var(--md-sys-color-surface-variant);
  border-radius: 12px;
  color: var(--md-sys-color-on-surface-variant);
}

.no-data-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.5;
}

.launcher-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
}

.launcher-card {
  background-color: var(--md-sys-color-surface);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.launcher-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.launcher-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.launcher-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--md-sys-color-on-surface);
  margin: 0;
}

.launcher-abbr {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.launcher-info {
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: var(--md-sys-color-on-surface);
}

.info-icon {
  font-size: 1rem;
  opacity: 0.7;
}

.launcher-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.download-button {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}

.download-button:hover {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

.github-button {
  background-color: transparent;
  color: var(--md-sys-color-primary);
  border: 1px solid var(--md-sys-color-primary);
}

.github-button:hover {
  background-color: var(--md-sys-color-primary-container);
}

.preview-button {
  background-color: transparent;
  color: var(--md-sys-color-tertiary);
  border: 1px solid var(--md-sys-color-tertiary);
}

.preview-button:hover {
  background-color: var(--md-sys-color-tertiary-container);
  color: var(--md-sys-color-on-tertiary-container);
}

.website-button {
  background-color: transparent;
  color: var(--md-sys-color-secondary);
  border: 1px solid var(--md-sys-color-secondary);
}

.website-button:hover {
  background-color: var(--md-sys-color-secondary-container);
}

.button-icon {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .launcher-grid {
    grid-template-columns: 1fr;
  }
  
  .launcher-actions {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
    justify-content: center;
  }
}
</style>