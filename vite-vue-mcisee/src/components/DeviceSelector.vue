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
          tip: this.$t('auto_detect')
        },
        {
          value: 'Android',
          label: 'Android',
          tip: 'Android'
        },
        {
          value: 'iOS',
          label: 'iOS',
          tip: 'iOS'
        },
        {
          value: 'Windows',
          label: 'Windows',
          tip: 'Windows'
        },
        {
          value: 'macOS',
          label: 'macOS',
          tip: 'macOS'
        },
        {
          value: 'Linux',
          label: 'Linux',
          tip: 'Linux'
        }
      ]
    }
  },
  methods: {
    detectDevice() {
      const userAgent = navigator.userAgent.toLowerCase()
      
      if (/android/.test(userAgent)) {
        return 'Android'
      } else if (/iphone|ipad|ipod/.test(userAgent)) {
        return 'iOS'
      } else if (/windows/.test(userAgent)) {
        return 'Windows'
      } else if (/macintosh|mac os x/.test(userAgent)) {
        return 'macOS'
      } else if (/linux/.test(userAgent)) {
        return 'Linux'
      }
      return 'Windows' // 默认
    },
    
    onDeviceChange() {
      localStorage.setItem('selectedDevice', this.selectedDevice)
      this.$emit('device-changed', this.selectedDevice)
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
  color: #999;
  display: none;
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