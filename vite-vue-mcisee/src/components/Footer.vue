<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- 项目信息 -->
      <div class="footer-section">
        <div class="footer-title">项目信息</div>
        <div class="project-links">
          <a href="https://github.com/Hex-Dragon/MCiSEE" target="_blank" class="project-link">
            <i class="material-icons">code</i>
            源代码
          </a>
          <a href="https://github.com/Hex-Dragon/MCiSEE/issues" target="_blank" class="project-link">
            <i class="material-icons">bug_report</i>
            报告问题
          </a>
          <a href="https://github.com/Hex-Dragon/MCiSEE/blob/main/LICENSE" target="_blank" class="project-link">
            <i class="material-icons">gavel</i>
            许可证
          </a>
        </div>
        <div class="version-info">
          <span>版本: {{ version }}</span>
          <span>最后更新: {{ lastUpdated }}</span>
        </div>
      </div>

    </div>
    
    <!-- 版权信息 -->
    <div class="footer-bottom">
      <div class="copyright">
        <p>&copy; {{ currentYear }} MCiSEE. 保留所有权利</p>
        <p>用 ❤️ 为 Minecraft 社区制作</p>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Footer',
  setup() {
    const currentYear = computed(() => new Date().getFullYear())
    const version = '2.0.0'
    const lastUpdated = new Date().toLocaleDateString()
    
    const handleStarsChartError = (event) => {
      event.target.style.display = 'none'
      console.warn('星标历史图表加载失败')
    }
    
    return {
      currentYear,
      version,
      lastUpdated,
      handleStarsChartError
    }
  }
}
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-top: 1px solid #dee2e6;
  margin-top: 3rem;
  padding: 2rem 0 1rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.footer-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.footer-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
  border-bottom: 2px solid #28a745;
  padding-bottom: 0.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 0.75rem;
  background: rgba(40, 167, 69, 0.1);
  border-radius: 6px;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 600;
  color: #28a745;
}

.contributors-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.contributor-item {
  display: block;
  transition: transform 0.2s;
}

.contributor-item:hover {
  transform: scale(1.1);
}

.contributor-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #28a745;
}

.contributors-loading {
  text-align: center;
  color: #666;
  font-style: italic;
}

.stars-chart {
  text-align: center;
}

.stars-history-img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.project-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.project-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  text-decoration: none;
  color: #28a745;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.project-link:hover {
  background-color: rgba(40, 167, 69, 0.1);
}

.project-link .material-icons {
  font-size: 18px;
}

.version-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: #666;
}

.footer-bottom {
  border-top: 1px solid #dee2e6;
  margin-top: 2rem;
  padding-top: 1rem;
}

.copyright {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.copyright p {
  margin: 0.25rem 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    padding: 0 0.5rem;
  }
  
  .footer-section {
    padding: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .project-links {
    gap: 0.25rem;
  }
  
  .project-link {
    padding: 0.25rem;
    font-size: 0.9rem;
  }
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .footer {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-top-color: #444;
  }
  
  .footer-section {
    background: #2d2d2d;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .footer-title {
    color: #fff;
  }
  
  .stat-item {
    background: rgba(40, 167, 69, 0.2);
  }
  
  .stat-label {
    color: #ccc;
  }
  
  .contributors-loading {
    color: #ccc;
  }
  
  .version-info {
    color: #ccc;
  }
  
  .copyright {
    color: #ccc;
  }
  
  .footer-bottom {
    border-top-color: #444;
  }
}
</style>