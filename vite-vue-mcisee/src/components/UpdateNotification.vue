<template>
  <div class="update-notifications">
    <div 
      v-for="update in updates" 
      :key="update.id"
      :class="['update-layer', update.id]"
    >
      <div class="update-content">
        <div class="update-header">
          <h4 class="update-title">
            {{ update.abbr }} {{ $t('has_new_version') }}
          </h4>
          <button 
            class="close-btn"
            @click="dismissUpdate(update.id)"
            :title="$t('close')"
          >
            ❌
          </button>
        </div>
        
        <div class="update-info">
          <div class="version-info">
            <span class="version-label">{{ $t('current_version') }}:</span>
            <span class="version-number">{{ update.lastVersion }}</span>
          </div>
          <div class="version-info">
            <span class="version-label">{{ $t('latest_version') }}:</span>
            <span class="version-number latest">{{ update.latestVersion }}</span>
          </div>
          <div class="device-info">
            <span class="device-label">{{ $t('device') }}:</span>
            <span class="device-name">{{ getDeviceName(update.device) }}</span>
          </div>
          <div class="release-type">
            <span class="type-badge" :class="update.stableOrDev">
              {{ $t(update.stableOrDev) }}
            </span>
          </div>
        </div>
        
        <div class="update-actions">
          <a 
            class="download-btn"
            :href="getDownloadUrl(update.download)"
            :data-backup-href="update.download"
            target="_blank"
            @click="handleDownload(update)"
          >
            {{ getDownloadText(update.stableOrDev) }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import updateChecker from '../services/updateChecker.js'

export default {
  name: 'UpdateNotification',
  setup() {
    const updates = ref([])
    
    // 加载更新信息
    const loadUpdates = () => {
      updates.value = updateChecker.getAllUpdates()
    }
    
    // 处理新更新事件
    const handleUpdateAvailable = (event) => {
      loadUpdates()
    }
    
    // 处理更新删除事件
    const handleUpdateDismissed = (event) => {
      loadUpdates()
    }
    
    // 关闭更新提示
    const dismissUpdate = (updateId) => {
      const update = updates.value.find(u => u.id === updateId)
      if (update) {
        // 记录下载状态
        updateChecker.recordDownload(
          update.device,
          update.abbr,
          update.latestVersion,
          update.stableOrDev === 'release' ? 'stable' : 'dev'
        )
      }
      
      updateChecker.deleteUpdateLayer(updateId)
    }
    
    // 处理下载点击
    const handleDownload = (update) => {
      // 记录下载状态
      updateChecker.recordDownload(
        update.device,
        update.abbr,
        update.latestVersion,
        update.stableOrDev === 'release' ? 'stable' : 'dev'
      )
      
      // 显示下载提示
      const message = `${update.abbr} ${update.latestVersion}`
      
      // 创建下载提示
      const event = new CustomEvent('show-download-notification', {
        detail: { message }
      })
      window.dispatchEvent(event)
    }
    
    // 获取下载链接
    const getDownloadUrl = (url) => {
      return updateChecker.getDownloadMirror(url)
    }
    
    // 获取设备名称
    const getDeviceName = (device) => {
      const deviceNames = {
        'windows': 'Windows',
        'macos': 'macOS',
        'linux': 'Linux',
        'android': 'Android',
        'ios': 'iOS'
      }
      return deviceNames[device] || device
    }
    
    // 获取下载按钮文本
    const getDownloadText = (stableOrDev) => {
      const downloadSVG = '⬇️'
      const download = '下载'
      const release = '稳定版'
      const preRelease = '开发版'
      const latest = '最新'
      
      if (stableOrDev === 'release') {
        return `${downloadSVG} ${download} ${latest} ${release}`
      } else {
        return `${downloadSVG} ${download} ${latest} ${preRelease}`
      }
    }
    
    onMounted(() => {
      // 监听更新事件
      window.addEventListener('launcher-update-available', handleUpdateAvailable)
      window.addEventListener('launcher-update-dismissed', handleUpdateDismissed)
      
      // 初始加载
      loadUpdates()
    })
    
    onUnmounted(() => {
      // 清理事件监听
      window.removeEventListener('launcher-update-available', handleUpdateAvailable)
      window.removeEventListener('launcher-update-dismissed', handleUpdateDismissed)
    })
    
    return {
      updates,
      dismissUpdate,
      handleDownload,
      getDownloadUrl,
      getDeviceName,
      getDownloadText
    }
  }
}
</script>

<style scoped>
.update-notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
}

.update-layer {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 10px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.update-content {
  padding: 16px;
}

.update-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.update-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #f5f5f5;
}

.update-info {
  margin-bottom: 16px;
}

.version-info,
.device-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.version-label,
.device-label {
  color: #666;
  font-weight: 500;
}

.version-number {
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.version-number.latest {
  color: #28a745;
}

.device-name {
  font-weight: 500;
}

.release-type {
  margin-top: 8px;
}

.type-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.type-badge.release {
  background-color: #e3f2fd;
  color: #1976d2;
}

.type-badge.preRelease {
  background-color: #fff3e0;
  color: #f57c00;
}

.update-actions {
  display: flex;
  justify-content: flex-end;
}

.download-btn {
  background: #007bff;
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.download-btn:hover {
  background: #0056b3;
  text-decoration: none;
  color: white;
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .update-layer {
    background: #2d2d2d;
    border-color: #444;
    color: #fff;
  }
  
  .update-title {
    color: #fff;
  }
  
  .close-btn:hover {
    background-color: #404040;
  }
  
  .version-label,
  .device-label {
    color: #ccc;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .update-notifications {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .update-content {
    padding: 12px;
  }
  
  .update-title {
    font-size: 14px;
  }
  
  .version-info,
  .device-info {
    font-size: 13px;
  }
}
</style>