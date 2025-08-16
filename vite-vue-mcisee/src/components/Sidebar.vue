<template>
  <div 
    id="目录" 
    class="sidebar" 
    :class="{ 'sidebar-hidden': isHidden, 'sidebar-visible': !isHidden }"
    @mouseenter="showSidebar"
    @mouseleave="startHideTimer"
    @click="showSidebar"
  >
    <div class="sidebar-toggle" @click="toggleSidebar">
      <span class="toggle-icon">{{ isHidden ? '▶' : '◀' }}</span>
    </div>
    <div class="sidebar-content">
      <div class="info">{{ $t('content') }}</div>
      <dl>
        <dt><a href="#顶部" @click="handleLinkClick">{{ $t('top') }}</a></dt>
        <dt><a href="#设备" @click="handleLinkClick">{{ $t('device') }}</a></dt>
        <dt><a href="#软件" @click="handleLinkClick">{{ $t('app') }}</a></dt>
        <dd><a href="#启动器" @click="handleLinkClick">{{ $t('launcher') }}</a></dd>
        <dt><a href="#网站" @click="handleLinkClick">{{ $t('website') }}</a></dt>
        <dd><a href="#快速查询" @click="handleLinkClick">{{ $t('searchable') }}</a></dd>
        <dd><a href="#实用网站" @click="handleLinkClick">{{ $t('utilityWebsite') }}</a></dd>
        <dd><a href="#论坛" @click="handleLinkClick">{{ $t('forum') }}</a></dd>
        <dt><a href="#配置" @click="handleLinkClick">{{ $t('config') }}</a></dt>
        <dt><a href="#底部" @click="handleLinkClick">{{ $t('bottom') }}</a></dt>
      </dl>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'Sidebar',
  setup() {
    const isHidden = ref(false)
    let hideTimer = null
    let inactivityTimer = null
    const HIDE_DELAY = 3000 // 3秒后自动隐藏
    const INACTIVITY_DELAY = 10000 // 10秒无活动后自动隐藏
    
    // 显示侧边栏
    const showSidebar = () => {
      isHidden.value = false
      clearTimeout(hideTimer)
      clearTimeout(inactivityTimer)
      startInactivityTimer()
    }
    
    // 开始隐藏计时器
    const startHideTimer = () => {
      clearTimeout(hideTimer)
      hideTimer = setTimeout(() => {
        isHidden.value = true
      }, HIDE_DELAY)
    }
    
    // 开始无活动计时器
    const startInactivityTimer = () => {
      clearTimeout(inactivityTimer)
      inactivityTimer = setTimeout(() => {
        isHidden.value = true
      }, INACTIVITY_DELAY)
    }
    
    // 切换侧边栏显示状态
    const toggleSidebar = (event) => {
      event.stopPropagation()
      isHidden.value = !isHidden.value
      if (!isHidden.value) {
        startInactivityTimer()
      }
    }
    
    // 处理链接点击
    const handleLinkClick = () => {
      // 点击链接后延迟隐藏侧边栏
      setTimeout(() => {
        isHidden.value = true
      }, 1000)
    }
    
    // 监听页面活动
    const handlePageActivity = () => {
      if (!isHidden.value) {
        startInactivityTimer()
      }
    }
    
    onMounted(() => {
      // 初始状态：显示侧边栏，然后开始无活动计时器
      startInactivityTimer()
      
      // 监听页面活动事件
      document.addEventListener('mousemove', handlePageActivity)
      document.addEventListener('scroll', handlePageActivity)
      document.addEventListener('keydown', handlePageActivity)
    })
    
    onUnmounted(() => {
      clearTimeout(hideTimer)
      clearTimeout(inactivityTimer)
      document.removeEventListener('mousemove', handlePageActivity)
      document.removeEventListener('scroll', handlePageActivity)
      document.removeEventListener('keydown', handlePageActivity)
    })
    
    return {
      isHidden,
      showSidebar,
      startHideTimer,
      toggleSidebar,
      handleLinkClick
    }
  }
}
</script>

<style scoped>
/* 侧边栏自动隐藏功能样式 */
.sidebar {
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 999;
  background: rgba(0, 0, 0, 0.8);
  padding: var(--spacing-md);
  border-radius: 8px;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  cursor: pointer;
}

/* 隐藏状态 */
.sidebar-hidden {
  transform: translateY(-50%) translateX(-85%);
  opacity: 0.3;
}

/* 显示状态 */
.sidebar-visible {
  transform: translateY(-50%) translateX(0);
  opacity: 1;
}

/* 悬停时完全显示 */
.sidebar:hover {
  transform: translateY(-50%) translateX(0) !important;
  opacity: 1 !important;
}

/* 切换按钮 */
.sidebar-toggle {
  position: absolute;
  right: -15px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-50%) scale(1.1);
}

.toggle-icon {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  transition: transform 0.2s ease;
}

.sidebar-hidden .toggle-icon {
  transform: rotate(0deg);
}

.sidebar-visible .toggle-icon {
  transform: rotate(180deg);
}

/* 侧边栏内容 */
.sidebar-content {
  transition: opacity 0.3s ease;
}

.sidebar-hidden .sidebar-content {
  opacity: 0;
  pointer-events: none;
}

.sidebar-visible .sidebar-content {
  opacity: 1;
  pointer-events: auto;
}

/* 继承全局侧边栏样式 */
.sidebar .info {
  font-weight: bold;
  margin-bottom: var(--spacing-sm);
  display: block;
}

.sidebar dl {
  margin: 0;
}

.sidebar dt,
.sidebar dd {
  margin: var(--spacing-xs) 0;
}

.sidebar a {
  color: inherit;
  text-decoration: none;
  transition: opacity var(--transition-fast);
}

.sidebar a:hover {
  opacity: 0.7;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    left: 10px;
    top: 20px;
    transform: none;
    padding: var(--spacing-sm);
  }
  
  /* 移动端隐藏状态：只显示切换按钮 */
  .sidebar-hidden {
    transform: none;
    opacity: 1;
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .sidebar-hidden .sidebar-content {
    display: none;
  }
  
  .sidebar-hidden .sidebar-toggle {
    position: static;
    transform: none;
    background: transparent;
    border: none;
    width: 100%;
    height: 100%;
  }
  
  /* 移动端显示状态：展开显示内容 */
  .sidebar-visible {
    position: fixed;
    left: 10px;
    top: 10px;
    transform: none;
    opacity: 1;
    width: 280px;
    height: auto;
    padding: var(--spacing-sm);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.9);
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 20px);
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  .sidebar-visible .sidebar-content {
    display: block;
    opacity: 1;
    pointer-events: auto;
  }
  
  .sidebar-visible .sidebar-toggle {
    position: absolute;
    right: -15px;
    top: 10px;
    transform: none;
    width: 30px;
    height: 30px;
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

/* 主题适配 */
[data-theme="light"] .sidebar {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
}

[data-theme="light"] .sidebar-toggle {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(0, 0, 0, 0.1);
}

[data-theme="light"] .toggle-icon {
  color: #333;
}

[data-theme="dark"] .sidebar {
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
}

[data-theme="dark"] .sidebar-toggle {
  background: rgba(0, 0, 0, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .toggle-icon {
  color: #fff;
}

/* 移动端主题适配 */
@media (max-width: 768px) {
  [data-theme="light"] .sidebar-hidden {
    background: rgba(255, 255, 255, 0.9);
  }
  
  [data-theme="light"] .sidebar-visible {
    background: rgba(255, 255, 255, 0.95);
  }
  
  [data-theme="light"] .sidebar-visible .sidebar-toggle {
    background: rgba(255, 255, 255, 0.9);
  }
  
  [data-theme="dark"] .sidebar-hidden {
    background: rgba(0, 0, 0, 0.8);
  }
  
  [data-theme="dark"] .sidebar-visible {
    background: rgba(0, 0, 0, 0.9);
  }
  
  [data-theme="dark"] .sidebar-visible .sidebar-toggle {
    background: rgba(0, 0, 0, 0.8);
  }
}
</style>