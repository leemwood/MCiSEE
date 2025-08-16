<template>
  <footer class="footer" id="底部">
    <div class="page-content">
      <div class="footer-content">
        <h2>统计信息</h2>
        <hr>
        <div class="article">
          <h3 class="inline-block">访问计数</h3>
          <div class="inline">
            <details style="text-align: center;" open>
              <summary class="noicon"></summary>
              <img src="https://visitor-badge.laobi.icu/badge?page_id=teaSummer.MCiSEE" alt="Visitor Count">
            </details>
          </div>

          <h3 class="inline-block">贡献者</h3>
          <div class="inline">
            <details style="text-align: center;">
              <summary class="noicon"></summary>
              <img src="https://contrib.rocks/image?repo=teaSummer/MCiSEE" alt="Contributors">
            </details>
          </div>

          <h3 class="inline-block">GitHub星星历史图</h3>
          <div class="inline">
            <details style="text-align: center;">
              <summary class="noicon"></summary>
              <img src="https://starchart.cc/teaSummer/MCiSEE.svg?variant=adaptive" alt="Stars Over Time">
            </details>
          </div>
        </div>
        <hr>
        <p class="ICP">本站已运行 {{ version }} 版本</p>
        <p class="ICP">最后更新时间：{{ lastUpdated }}</p>
        <p class="GitHub">
          <a href="https://github.com/Hex-Dragon/MCiSEE" target="_blank">GitHub</a> |
          <a href="https://github.com/Hex-Dragon/MCiSEE/issues" target="_blank">报告问题</a> |
          <a href="https://github.com/Hex-Dragon/MCiSEE/blob/main/LICENSE" target="_blank">许可证</a>
        </p>
        <p class="license gravity-inline">
          <text>本项目采用</text>
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a>
          <text>许可协议</text>
        </p>
        <p class="credit inline">&copy; {{ currentYear }} MCiSEE. 用 ❤️ 为 Minecraft 社区制作</p>
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
  font-size: 0.9rem;
  margin: 2rem 0;
  text-align: center;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8));
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content {
  padding: 2rem 0;
}

.footer-content h2 {
  margin-bottom: 1rem;
  color: var(--text-color, #333);
}

.footer-content hr {
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, #ddd, transparent);
  margin: 1.5rem 0;
}

.article {
  margin: 2rem 0;
}

.article h3 {
  margin: 1.5rem 0 0.5rem;
  color: var(--text-color, #333);
  font-size: 1rem;
}

.article details {
  margin: 0.5rem 0 1rem;
}

.article summary {
  cursor: pointer;
  outline: none;
}

.article summary.noicon {
  list-style: none;
}

.article summary.noicon::-webkit-details-marker {
  display: none;
}

.article img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ICP {
  margin: 0.5rem 0;
  color: var(--text-color-secondary, #666);
  font-size: 0.85rem;
}

.GitHub {
  margin: 1rem 0;
  color: var(--text-color, #333);
}

.GitHub a {
  color: var(--link-color, #007bff);
  text-decoration: none;
  margin: 0 0.25rem;
}

.GitHub a:hover {
  text-decoration: underline;
}

.license {
  margin: 1rem 0;
  color: var(--text-color-secondary, #666);
  font-size: 0.85rem;
}

.license a {
  color: var(--link-color, #007bff);
  text-decoration: none;
}

.license a:hover {
  text-decoration: underline;
}

.credit {
  margin: 1.5rem 0 0;
  color: var(--text-color-secondary, #666);
  font-size: 0.8rem;
}

.inline-block {
  display: inline-block;
}

.inline {
  display: inline;
}

.gravity-inline {
  text-align: center;
}

.gravity-inline * {
  margin: 0 0.25rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-content {
    padding: 0 1rem;
  }
  
  .footer-content {
    padding: 1.5rem 0;
  }
  
  .article h3 {
    font-size: 0.9rem;
  }
  
  .ICP, .license {
    font-size: 0.8rem;
  }
  
  .credit {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .page-content {
    padding: 0 0.75rem;
  }
  
  .footer-content {
    padding: 1rem 0;
  }
  
  .article h3 {
    font-size: 0.85rem;
  }
  
  .ICP, .license {
    font-size: 0.75rem;
  }
  
  .credit {
    font-size: 0.7rem;
  }
}
</style>