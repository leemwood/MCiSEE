<template>
  <!-- 展开按钮（在侧边栏完全隐藏时显示） -->
  <button 
    v-show="isCollapsed" 
    class="expand-button" 
    @click="toggleSidebar"
    :title="'展开侧边栏'"
  >
    <span class="toggle-icon">></span>
  </button>

  <nav class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
    <!-- 侧边栏头部 -->
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <span class="logo-text" v-show="!isCollapsed">MCiSEE</span>
      </div>
      <button 
        class="sidebar-toggle" 
        @click="toggleSidebar"
        :title="isCollapsed ? '展开侧边栏' : '收起侧边栏'"
      >
        <span class="toggle-icon">{{ isCollapsed ? '>' : '<' }}</span>
      </button>
    </div>

    <!-- 导航菜单 -->
    <div class="sidebar-content">
      <ul class="nav-menu">
        <li class="nav-item">
          <a href="#顶部" class="nav-link" @click="handleNavClick">
            <span class="nav-text" v-show="!isCollapsed">{{ $t('top') }}</span>
          </a>
        </li>
        
        <li class="nav-item">
          <a href="#设备" class="nav-link" @click="handleNavClick">
            <span class="nav-text" v-show="!isCollapsed">{{ $t('device') }}</span>
          </a>
        </li>
        
        <li class="nav-item nav-group">
          <a href="#软件" class="nav-link" @click="handleNavClick">
            <span class="nav-text" v-show="!isCollapsed">{{ $t('app') }}</span>
          </a>
          <ul class="nav-submenu" v-show="!isCollapsed">
            <li class="nav-subitem">
              <a href="#启动器" class="nav-sublink" @click="handleNavClick">
                <span class="nav-subtext">{{ $t('launcher') }}</span>
              </a>
            </li>
          </ul>
        </li>
        
        <li class="nav-item nav-group">
          <a href="#网站" class="nav-link" @click="handleNavClick">
            <span class="nav-text" v-show="!isCollapsed">{{ $t('website') }}</span>
          </a>
          <ul class="nav-submenu" v-show="!isCollapsed">
            <li class="nav-subitem">
              <a href="#快速查询" class="nav-sublink" @click="handleNavClick">
                <span class="nav-subtext">{{ $t('searchable') }}</span>
              </a>
            </li>
            <li class="nav-subitem">
              <a href="#实用网站" class="nav-sublink" @click="handleNavClick">
                <span class="nav-subtext">{{ $t('utilityWebsite') }}</span>
              </a>
            </li>
            <li class="nav-subitem">
              <a href="#论坛" class="nav-sublink" @click="handleNavClick">
                <span class="nav-subtext">{{ $t('forum') }}</span>
              </a>
            </li>
          </ul>
        </li>
        
        <li class="nav-item">
          <a href="#配置" class="nav-link" @click="handleNavClick">
            <span class="nav-text" v-show="!isCollapsed">{{ $t('config') }}</span>
          </a>
        </li>
        
        <li class="nav-item">
          <a href="#底部" class="nav-link" @click="handleNavClick">
            <span class="nav-text" v-show="!isCollapsed">{{ $t('bottom') }}</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- 侧边栏底部 -->
    <div class="sidebar-footer" v-show="!isCollapsed">
      <div class="sidebar-info">
        <span class="info-text">{{ $t('content') }}</span>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, onUnmounted, inject } from 'vue'

export default {
  name: 'Sidebar',
  setup() {
    const sidebarCollapsed = inject('sidebarCollapsed')
    const isCollapsed = ref(false)
    
    // 切换侧边栏展开/收起状态
    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value
      // 同步更新父组件状态
      if (sidebarCollapsed) {
        sidebarCollapsed.value = isCollapsed.value
      }
      // 保存用户偏好到localStorage
      localStorage.setItem('sidebar-collapsed', isCollapsed.value.toString())
    }
    
    // 处理导航链接点击
    const handleNavClick = (event) => {
      // 平滑滚动到目标元素
      const href = event.currentTarget.getAttribute('href')
      if (href && href.startsWith('#')) {
        event.preventDefault()
        const targetId = href.substring(1)
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          })
        }
      }
    }
    
    // 监听窗口大小变化，自动调整侧边栏状态
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        isCollapsed.value = true
      }
    }
    
    onMounted(() => {
      // 从localStorage恢复用户偏好
      const savedState = localStorage.getItem('sidebar-collapsed')
      if (savedState !== null) {
        isCollapsed.value = savedState === 'true'
      } else {
        // 默认在移动端收起侧边栏
        isCollapsed.value = window.innerWidth <= 768
      }
      
      // 同步初始状态到父组件
      if (sidebarCollapsed) {
        sidebarCollapsed.value = isCollapsed.value
      }
      
      // 监听窗口大小变化
      window.addEventListener('resize', handleResize)
    })
    
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })
    
    return {
      isCollapsed,
      toggleSidebar,
      handleNavClick
    }
  }
}
</script>

<style scoped>
/* 侧边栏主体 */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 280px;
  background: rgba(0, 0, 0, 0.2) !important;
  backdrop-filter: blur(25px) !important;
  -webkit-backdrop-filter: blur(25px) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: translateX(0);
}

/* 收起状态 */
.sidebar-collapsed {
  width: 48px;
  transform: translateX(-100%);
}

/* 展开按钮（在完全隐藏时显示） */
.expand-button {
  position: fixed;
  left: 8px;
  top: 20px;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.2) !important;
  backdrop-filter: blur(25px) !important;
  -webkit-backdrop-filter: blur(25px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.expand-button:hover {
  background: var(--sidebar-toggle-hover, rgba(243, 244, 246, 0.9));
  transform: scale(1.05);
}

.expand-button .toggle-icon {
  font-size: 12px;
  color: var(--sidebar-text, #6b7280);
}

/* 侧边栏头部 */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 64px;
  background: rgba(0, 0, 0, 0.1) !important;
  backdrop-filter: blur(25px) !important;
  -webkit-backdrop-filter: blur(25px) !important;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 18px;
  color: var(--sidebar-text, #1f2937);
}

.logo-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.logo-text {
  transition: opacity 0.2s ease;
}

.sidebar-toggle {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(229, 231, 235, 0.2) !important;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.sidebar-toggle:hover {
  background: rgba(229, 231, 235, 0.8);
  transform: scale(1.05);
}

.toggle-icon {
  font-size: 12px;
  color: var(--sidebar-text, #6b7280);
  transition: transform 0.2s ease;
}

/* 侧边栏内容 */
.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

/* 导航菜单 */
.nav-menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin: 2px 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--sidebar-text, #4b5563);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
}

.nav-link:hover {
  background: var(--sidebar-hover, rgba(243, 244, 246, 0.6));
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  color: var(--sidebar-text-hover, #1f2937);
  transform: translateX(2px);
}

.nav-link:active {
  background: var(--sidebar-active, rgba(229, 231, 235, 0.8));
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.nav-icon {
  font-size: 18px;
  flex-shrink: 0;
  width: 20px;
  text-align: center;
}

.nav-text {
  transition: opacity 0.2s ease;
}

/* 子菜单 */
.nav-submenu {
  list-style: none;
  margin: 4px 0 0 0;
  padding: 0;
}

.nav-subitem {
  margin: 1px 0;
}

.nav-sublink {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px 8px 48px;
  color: var(--sidebar-subtext, #6b7280);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 13px;
}

.nav-sublink:hover {
  background: var(--sidebar-hover, rgba(249, 250, 251, 0.6));
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  color: var(--sidebar-subtext-hover, #374151);
  transform: translateX(2px);
}

.nav-subicon {
  font-size: 14px;
  flex-shrink: 0;
  width: 16px;
  text-align: center;
}

/* 侧边栏底部 */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1) !important;
  backdrop-filter: blur(25px) !important;
  -webkit-backdrop-filter: blur(25px) !important;
}

.sidebar-info {
  text-align: center;
}

.info-text {
  font-size: 12px;
  color: var(--sidebar-muted, #9ca3af);
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar:not(.sidebar-collapsed) {
    transform: translateX(0);
    width: 280px;
  }
  
  .sidebar-collapsed {
    transform: translateX(-100%);
    width: 48px;
  }
  
  .expand-button {
    left: 8px;
    top: 20px;
  }
}

/* 深色主题 */
[data-theme="dark"] .sidebar,
[data-theme="dark"] .expand-button {
  background: rgba(31, 41, 55, 0.85) !important;
  border-right-color: rgba(55, 65, 81, 0.3) !important;
  --sidebar-bg: rgba(31, 41, 55, 0.85);
  --sidebar-border: rgba(55, 65, 81, 0.3);
  --sidebar-header-bg: rgba(31, 41, 55, 0.1);
  --sidebar-footer-bg: rgba(31, 41, 55, 0.1);
  --sidebar-text: #f9fafb;
  --sidebar-text-hover: #ffffff;
  --sidebar-subtext: #d1d5db;
  --sidebar-subtext-hover: #f3f4f6;
  --sidebar-hover: rgba(55, 65, 81, 0.6);
  --sidebar-active: rgba(75, 85, 99, 0.8);
  --sidebar-toggle-bg: rgba(55, 65, 81, 0.6);
  --sidebar-toggle-hover: rgba(75, 85, 99, 0.8);
  --sidebar-muted: #9ca3af;
}

[data-theme="dark"] .sidebar-header {
  background: rgba(31, 41, 55, 0.1) !important;
  border-bottom-color: rgba(55, 65, 81, 0.3) !important;
}

[data-theme="dark"] .sidebar-toggle {
  background: rgba(55, 65, 81, 0.6) !important;
}

[data-theme="dark"] .sidebar-toggle:hover {
  background: rgba(75, 85, 99, 0.8) !important;
}

[data-theme="dark"] .sidebar-footer {
  background: rgba(31, 41, 55, 0.1) !important;
  border-top-color: rgba(55, 65, 81, 0.3) !important;
}

/* 浅色主题 */
[data-theme="light"] .sidebar,
[data-theme="light"] .expand-button {
  background: rgba(255, 255, 255, 0.85) !important;
  border-right-color: rgba(229, 231, 235, 0.3) !important;
  --sidebar-bg: rgba(255, 255, 255, 0.85);
  --sidebar-border: rgba(229, 231, 235, 0.3);
  --sidebar-header-bg: rgba(255, 255, 255, 0.1);
  --sidebar-footer-bg: rgba(255, 255, 255, 0.1);
  --sidebar-text: #1f2937;
  --sidebar-text-hover: #111827;
  --sidebar-subtext: #6b7280;
  --sidebar-subtext-hover: #374151;
  --sidebar-hover: rgba(243, 244, 246, 0.6);
  --sidebar-active: rgba(229, 231, 235, 0.8);
  --sidebar-toggle-bg: rgba(243, 244, 246, 0.6);
  --sidebar-toggle-hover: rgba(229, 231, 235, 0.8);
  --sidebar-muted: #9ca3af;
}

[data-theme="light"] .sidebar-header {
  background: rgba(255, 255, 255, 0.1) !important;
  border-bottom-color: rgba(229, 231, 235, 0.3) !important;
}

[data-theme="light"] .sidebar-toggle {
  background: rgba(243, 244, 246, 0.6) !important;
}

[data-theme="light"] .sidebar-toggle:hover {
  background: rgba(229, 231, 235, 0.8) !important;
}

[data-theme="light"] .sidebar-footer {
  background: rgba(255, 255, 255, 0.1) !important;
  border-top-color: rgba(229, 231, 235, 0.3) !important;
}

/* 滚动条样式 */
.sidebar-content::-webkit-scrollbar {
  width: 4px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: var(--sidebar-muted, #d1d5db);
  border-radius: 2px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: var(--sidebar-text, #9ca3af);
}

/* 动画效果 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.nav-text,
.nav-subtext {
  animation: slideIn 0.2s ease;
}

/* 焦点样式 */
.nav-link:focus,
.nav-sublink:focus,
.sidebar-toggle:focus {
  outline: 2px solid var(--focus-color, #3b82f6);
  outline-offset: 2px;
}
</style>