<template>
  <div class="device-selector">
    <h2 class="section-title">选择设备平台</h2>
    <div class="device-grid">
      <div 
        v-for="device in devices" 
        :key="device.id"
        class="device-card"
        :class="{ active: selectedDevice === device.id }"
        @click="selectDevice(device.id)"
      >
        <span class="device-icon">{{ device.icon }}</span>
        <span class="device-label">{{ device.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineProps, defineEmits } from 'vue'

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
    const selectDevice = (device) => {
      emit('update:selectedDevice', device)
    }

    return {
      selectDevice
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

.device-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.device-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  background-color: var(--md-sys-color-surface-variant);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.device-card:hover {
  background-color: var(--md-sys-color-primary-container);
  transform: translateY(-2px);
}

.device-card.active {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  border-color: var(--md-sys-color-primary);
}

.device-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.device-label {
  font-size: 1rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .device-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .device-card {
    padding: 16px 12px;
  }
  
  .device-icon {
    font-size: 1.5rem;
  }
}
</style>