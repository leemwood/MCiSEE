<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- 访问统计 -->
      <div class="footer-section">
        <div class="footer-title">{{ $t('visit_stats') }}</div>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">{{ $t('total_visits') }}</span>
            <span class="stat-value" id="busuanzi_value_site_pv">--</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ $t('unique_visitors') }}</span>
            <span class="stat-value" id="busuanzi_value_site_uv">--</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ $t('page_views') }}</span>
            <span class="stat-value" id="busuanzi_value_page_pv">--</span>
          </div>
        </div>
      </div>
      
      <!-- 贡献者 -->
      <div class="footer-section">
        <div class="footer-title">{{ $t('contributors') }}</div>
        <div class="contributors-list">
          <a 
            v-for="contributor in contributors" 
            :key="contributor.login"
            :href="contributor.html_url" 
            target="_blank" 
            class="contributor-item"
            :title="contributor.login"
          >
            <img 
              :src="contributor.avatar_url" 
              :alt="contributor.login"
              class="contributor-avatar"
              loading="lazy"
            >
          </a>
        </div>
        <div class="contributors-loading" v-if="contributorsLoading">
          {{ $t('loading_contributors') }}
        </div>
      </div>
      
      <!-- GitHub星标历史 -->
      <div class="footer-section">
        <div class="footer-title">{{ $t('github_stars_history') }}</div>
        <div class="stars-chart">
          <img 
            src="https://api.star-history.com/svg?repos=Hex-Dragon/MCiSEE&type=Date" 
            alt="Star History Chart"
            class="stars-history-img"
            loading="lazy"
            @error="handleStarsChartError"
          >
        </div>
      </div>
      
      <!-- 项目信息 -->
      <div class="footer-section">
        <div class="footer-title">{{ $t('project_info') }}</div>
        <div class="project-links">
          <a href="https://github.com/Hex-Dragon/MCiSEE" target="_blank" class="project-link">
            <mdui-icon name="code"></mdui-icon>
            {{ $t('source_code') }}
          </a>
          <a href="https://github.com/Hex-Dragon/MCiSEE/issues" target="_blank" class="project-link">
            <mdui-icon name="bug_report"></mdui-icon>
            {{ $t('report_issue') }}
          </a>
          <a href="https://github.com/Hex-Dragon/MCiSEE/blob/main/LICENSE" target="_blank" class="project-link">
            <mdui-icon name="gavel"></mdui-icon>
            {{ $t('license') }}
          </a>
        </div>
        <div class="version-info">
          <span>{{ $t('version') }}: {{ version }}</span>
          <span>{{ $t('last_updated') }}: {{ lastUpdated }}</span>
        </div>
      </div>
    </div>
    
    <!-- 版权信息 -->
    <div class="footer-bottom">
      <div class="copyright">
        <p>&copy; {{ currentYear }} MCiSEE. {{ $t('all_rights_reserved') }}</p>
        <p>{{ $t('made_with_love') }} ❤️ {{ $t('for_minecraft_community') }}</p>
      </div>
    </div>
  </footer>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'Footer',
  setup() {
    const { t } = useI18n()
    
    const contributors = ref([])
    const contributorsLoading = ref(true)
    const version = ref('2.0.0')
    const lastUpdated = ref('')
    
    const currentYear = computed(() => new Date().getFullYear())
    
    // 获取贡献者信息
    const fetchContributors = async () => {
      try {
        contributorsLoading.value = true
        const response = await fetch('https://api.github.com/repos/Hex-Dragon/MCiSEE/contributors')
        if (response.ok) {
          const data = await response.json()
          contributors.value = data.slice(0, 10) // 只显示前10个贡献者
        }
      } catch (error) {
        console.error('获取贡献者信息失败:', error)
      } finally {
        contributorsLoading.value = false
      }
    }
    
    // 获取项目信息
    const fetchProjectInfo = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/Hex-Dragon/MCiSEE')
        if (response.ok) {
          const data = await response.json()
          lastUpdated.value = new Date(data.updated_at).toLocaleDateString()
        }
      } catch (error) {
        console.error('获取项目信息失败:', error)
        lastUpdated.value = new Date().toLocaleDateString()
      }
    }
    
    // 处理星标图表加载错误
    const handleStarsChartError = (event) => {
      event.target.style.display = 'none'
      console.warn('星标历史图表加载失败')
    }
    
    // 初始化不蒜子统计
    const initBusuanzi = () => {
      if (typeof window !== 'undefined') {
        // 动态加载不蒜子脚本
        const script = document.createElement('script')
        script.async = true
        script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
        document.head.appendChild(script)
      }
    }
    
    onMounted(() => {
      fetchContributors()
      fetchProjectInfo()
      initBusuanzi()
    })
    
    return {
      contributors,
      contributorsLoading,
      version,
      lastUpdated,
      currentYear,
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