<template>
  <div class="device-selector">
    <h2 class="section-title">选择设备平台</h2>
    <div class="device-select-wrapper">
      <select 
        v-model="selectedDevice"
        class="device-select"
        @change="handleDeviceChange"
      >
        <option 
          v-for="device in devices" 
          :key="device.id"
          :value="device.id"
        >
          {{ device.icon }} {{ device.name }}
        </option>
      </select>
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
  color: var(--md-sys-color-primary);
}

.device-select-wrapper {
  display: flex;
  align-items: center;
}

.device-select {
  flex: 1;
  min-width: 200px;
  max-width: 400px;
  padding: 12px;
  border: 2px solid var(--md-sys-color-surface-variant);
  border-radius: 8px;
  font-size: 1rem;
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
  padding-right: 36px;
}

.device-select:focus {
  outline: none;
  border-color: var(--md-sys-color-primary);
  box-shadow: 0 0 0 3px rgba(103, 80, 164, 0.1);
}

.device-select option {
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  padding: 8px;
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