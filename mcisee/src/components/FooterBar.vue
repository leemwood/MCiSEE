<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>MCiSEE</h3>
          <p class="text-muted">{{ $t('footer.description') }}</p>
        </div>
        
        <div class="footer-section">
          <h4>{{ $t('footer.links') }}</h4>
          <div class="footer-links">
            <a href="https://github.com/Hex-Dragon/MCiSEE" target="_blank" class="footer-link">
              {{ $t('footer.github') }}
            </a>
            <a href="https://github.com/Hex-Dragon/MCiSEE/issues" target="_blank" class="footer-link">
              {{ $t('footer.issues') }}
            </a>
            <a href="https://github.com/Hex-Dragon/MCiSEE/blob/main/CONTRIBUTING.md" target="_blank" class="footer-link">
              {{ $t('footer.contribute') }}
            </a>
          </div>
        </div>
        
        <div class="footer-section">
          <h4>{{ $t('footer.stats') }}</h4>
          <div class="github-stats">
            <div class="stat-item">
              <span class="stat-icon">⭐</span>
              <span class="stat-value">{{ stats.stars }}</span>
              <span class="stat-label">{{ $t('footer.stars') }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">🍴</span>
              <span class="stat-value">{{ stats.forks }}</span>
              <span class="stat-label">{{ $t('footer.forks') }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">👀</span>
              <span class="stat-value">{{ stats.watchers }}</span>
              <span class="stat-label">{{ $t('footer.watchers') }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p class="text-muted">
          © 2024 MCiSEE Team. {{ $t('footer.license') }}
        </p>
        <p class="text-muted">
          {{ $t('footer.version') }}: 2.0.0 | {{ $t('footer.builtWith') }} Vue.js & ClarityUI
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getGitHubStats } from '../services/dataService'

const stats = ref({
  stars: '---',
  forks: '---',
  watchers: '---',
  issues: '---'
})

onMounted(async () => {
  try {
    const githubStats = await getGitHubStats()
    stats.value = githubStats
  } catch (error) {
    console.error('Failed to load GitHub stats:', error)
  }
})
</script>

<style scoped>
.footer {
  background: var(--surface-color);
  border-top: 1px solid var(--border-color);
  padding: 3rem 0 1rem;
  margin-top: 4rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3,
.footer-section h4 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

.footer-section h3 {
  font-size: 1.5rem;
  font-weight: 700;
}

.footer-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: var(--primary-color);
}

.github-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon {
  font-size: 1.2rem;
}

.stat-value {
  font-weight: 600;
  color: var(--text-color);
  min-width: 3rem;
}

.stat-label {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
  text-align: center;
}

.footer-bottom p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .github-stats {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .stat-item {
    flex-direction: column;
    text-align: center;
    gap: 0.25rem;
  }
}
</style>