<template>
  <div class="device-container" id="设备">
    <h2 class="page-title">{{ $t('device') }}</h2>
    <label class="tip">{{ $t('device.tip') }}</label>
    <mdui-select 
      class="device-list" 
      name="device-list" 
      id="device-list" 
      placement="bottom" 
      variant="outlined"
      v-model="selectedDevice"
      @change="onDeviceChange"
      required
    >
      <mdui-menu-item 
        v-for="device in devices" 
        :key="device.value" 
        :value="device.value"
      >
        <div slot="custom" class="custom-item">
          <div>{{ device.label }}</div>
          <div class="secondary">{{ device.tip }}</div>
        </div>
      </mdui-menu-item>
    </mdui-select>
  </div>
</template>

<script>
export default {
  name: 'DeviceSelector',
  emits: ['device-changed'],
  data() {
    return {
      selectedDevice: ''
    }
  },
  computed: {
    devices() {
      return [
        {
          value: 'auto',
          label: this.$t('auto_detect'),
          tip: '自动检测当前设备类型'
        },
        {
          value: 'Android',
          label: 'Android',
          tip: 'Android 移动设备'
        },
        {
          value: 'iOS',
          label: 'iOS',
          tip: 'iPhone/iPad 设备'
        },
        {
          value: 'Windows',
          label: 'Windows',
          tip: 'Windows 桌面系统'
        },
        {
          value: 'macOS',
          label: 'macOS',
          tip: 'Mac 桌面系统'
        },
        {
          value: 'Linux',
          label: 'Linux',
          tip: 'Linux 桌面系统'
        }
      ]
    }
  },
  methods: {
    onDeviceChange(event) {
      // 手动更新selectedDevice值
      if (event.target.value) {
        this.selectedDevice = event.target.value
      }
      
      // 保存选择到localStorage
      localStorage.setItem('selectedDevice', this.selectedDevice)
      
      // 触发设备变化事件
      this.$emit('device-changed', this.selectedDevice)
    },
    
    // 自动检测设备类型
    detectDevice() {
      const userAgent = navigator.userAgent.toLowerCase()
      
      if (/android/.test(userAgent)) {
        return 'Android'
      } else if (/iphone|ipad|ipod/.test(userAgent)) {
        return 'iOS'
      } else if (/mac/.test(userAgent)) {
        return 'macOS'
      } else if (/linux/.test(userAgent)) {
        return 'Linux'
      } else if (/win/.test(userAgent)) {
        return 'Windows'
      }
      
      return 'Windows' // 默认返回Windows
    },
    
    // 获取实际的设备类型（处理auto选项）
    getActualDevice() {
      if (this.selectedDevice === 'auto') {
        return this.detectDevice()
      }
      return this.selectedDevice
    }
  },
  
  mounted() {
    // 从本地存储获取或自动检测设备
    const savedDevice = localStorage.getItem('selectedDevice')
    this.selectedDevice = savedDevice || this.detectDevice()
    
    // 触发初始设备变更事件
    this.$emit('device-changed', this.selectedDevice)
  }
}
</script>

<style scoped>
.device-container {
  margin-bottom: 2rem;
  text-align: center;
}

.tip {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.custom-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.secondary {
  font-size: 0.8rem;
  color: var(--mdui-color-on-surface-variant);
  margin-top: 0.2rem;
}
/* 移动端优化 */
@media (max-width: 768px) {
  .device-selector {
    padding: 1rem 0.5rem;
  }
  
  .device-select {
    width: 100%;
    font-size: 16px;
    padding: 0.75rem;
    min-height: 44px;
  }
  
  .device-description {
    font-size: 0.9rem;
    margin-top: 0.5rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .device-selector {
    padding: 0.75rem 0.25rem;
  }
  
  .device-select {
    padding: 0.6rem;
  }
  
  .device-description {
    font-size: 0.85rem;
  }
}
</style>