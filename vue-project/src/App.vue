<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', 'Noto Sans SC', sans-serif;
  line-height: 1.6;
  background-color: var(--md-sys-color-background);
  color: var(--md-sys-color-on-background);
  transition: all 0.3s ease;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 主题变量 - 使用data-theme属性控制 */
:root {
  /* 默认浅色主题变量 */
  --md-sys-color-background: #fef7ff;
  --md-sys-color-on-background: #1d1b20;
  --md-sys-color-surface: #fef7ff;
  --md-sys-color-surface-variant: #e7e0ec;
  --md-sys-color-on-surface: #1d1b20;
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-secondary: #625b71;
  --md-sys-color-on-secondary: #ffffff;
  --md-sys-color-error: #ba1a1a;
  --md-sys-color-on-error: #ffffff;
}

/* 深色主题变量 */
:root[data-theme="dark"] {
  --md-sys-color-background: #141218;
  --md-sys-color-on-background: #e6e1e5;
  --md-sys-color-surface: #141218;
  --md-sys-color-surface-variant: #49454f;
  --md-sys-color-on-surface: #e6e1e5;
  --md-sys-color-primary: #d0bcff;
  --md-sys-color-on-primary: #381e72;
  --md-sys-color-secondary: #ccc2dc;
  --md-sys-color-on-secondary: #332d41;
  --md-sys-color-error: #ffb4ab;
  --md-sys-color-on-error: #690005;
}

/* 浅色主题变量 */
:root[data-theme="light"] {
  --md-sys-color-background: #fef7ff;
  --md-sys-color-on-background: #1d1b20;
  --md-sys-color-surface: #fef7ff;
  --md-sys-color-surface-variant: #e7e0ec;
  --md-sys-color-on-surface: #1d1b20;
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-secondary: #625b71;
  --md-sys-color-on-secondary: #ffffff;
  --md-sys-color-error: #ba1a1a;
  --md-sys-color-on-error: #ffffff;
}

/* 主题切换动画 */
#app {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 所有使用主题变量的元素都添加过渡效果 */
* {
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 公告栏样式 */
.announcement-bar {
  position: fixed;
  top: 0;
  width: 100%;
  height: max(4vh, max-content);
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  line-height: 4vh;
  text-align: center;
  margin: auto;
  font-size: 14px;
  z-index: 0;
  overflow: hidden;
}

.announcement-bar ul {
  list-style: none;
  margin: 0;
  padding: 0;
  height: 100%;
  position: relative;
}

.announcement-bar li {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.announcement-bar li.active {
  opacity: 1;
}

.announcement-icon {
  font-size: 16px;
}

.announcement-text {
  opacity: 0.9;
}

/* 公告动画 */
@keyframes announcement {
  0% { top: 4vh; opacity: 0; }
  15% { top: 0; opacity: 1; }
  75% { top: 0; opacity: 1; }
  100% { top: -2.5vh; opacity: 0; }
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  margin-top: 4vh; /* 为公告栏留出空间 */
}

/* 页脚样式 */
.footer {
  background-color: var(--md-sys-color-surface-variant);
  color: var(--md-sys-color-on-surface);
  padding: 40px 20px;
  margin-top: auto;
  border-top: 1px solid var(--md-sys-color-outline);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer h2 {
  font-size: 1.5rem;
  margin-bottom: 16px;
  color: var(--md-sys-color-primary);
}

.footer h3 {
  font-size: 1.1rem;
  margin-bottom: 8px;
  color: var(--md-sys-color-on-surface);
}

.footer hr {
  border: none;
  border-top: 1px solid var(--md-sys-color-outline);
  margin: 24px 0;
}

.footer-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.footer-stat-item {
  text-align: center;
  min-width: 200px;
}

.stat-content {
  margin-top: 8px;
}

.stat-content img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.footer-links {
  margin-top: 24px;
}

.footer-icp {
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 8px;
}

.footer-social {
  margin-bottom: 16px;
}

.footer-social a {
  color: var(--md-sys-color-primary);
  text-decoration: none;
  margin: 0 4px;
}

.footer-social a:hover {
  text-decoration: underline;
}

.footer-license {
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 8px;
}

.footer-credit {
  font-size: 14px;
  opacity: 0.7;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
  
  .footer-stats {
    flex-direction: column;
    gap: 24px;
  }
  
  .footer-stat-item {
    min-width: auto;
  }
}
</style>