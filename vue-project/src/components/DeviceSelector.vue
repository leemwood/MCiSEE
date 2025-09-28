<template>
  <div class="device-selector">
    <h2 class="section-title">选择设备平台</h2>
    <div class="device-select-wrapper">
      <el-select
        v-model="selectedDevice"
        class="device-select"
        @change="handleDeviceChange"
        placeholder="请选择设备平台"
        clearable
      >
        <el-option
          v-for="device in devices"
          :key="device.id"
          :label="`${device.icon} ${device.name}`"
          :value="device.id"
        />
      </el-select>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'DeviceSelector',
  props: {
    selectedDevice: {
      type: String,
      required: true
    },
    devices: {
      type: Array,
      required: true
    }
  },
  emits: ['update:selectedDevice'],
  setup(props, { emit }) {
    const selectedDevice = ref(props.selectedDevice)
    
    const handleDeviceChange = () => {
      emit('update:selectedDevice', selectedDevice.value)
    }
    
    // 监听props变化，同步内部状态
    watch(() => props.selectedDevice, (newValue) => {
      selectedDevice.value = newValue
    })

    return {
      selectedDevice,
      handleDeviceChange
    }
  }
}
</script>

<style scoped>
.device-selector {
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 16px;
  color: var(--el-color-primary);
}

.device-select-wrapper {
  display: flex;
  align-items: center;
}

.device-select {
  flex: 1;
  min-width: 200px;
  max-width: 400px;
}

@media (max-width: 768px) {
  .device-select-wrapper {
    width: 100%;
  }
  
  .device-select {
    width: 100%;
    max-width: none;
  }
}
</style>