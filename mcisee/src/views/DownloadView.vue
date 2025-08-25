<template>
  <div class="download">
    <div class="container">
      <!-- 页面标题 -->
      <section class="page-header">
        <h1 class="page-title">{{ $t('download.title') }}</h1>
        <p class="page-subtitle">{{ $t('download.subtitle') }}</p>
      </section>
      
      <!-- 启动器下载 -->
      <section class="launchers">
        <div v-if="loading" class="text-center">
          <div class="spinner"></div>
          <p class="text-muted">{{ $t('download.loading') }}</p>
        </div>
        
        <div v-else>
          <!-- Android 启动器 -->
          <div v-if="androidLaunchers.length > 0" class="launcher-section">
            <h2 class="section-title">
              <span class="platform-icon">🤖</span>
              {{ $t('download.android') }}
            </h2>
            <div class="row">
              <div v-for="launcher in androidLaunchers" :key="launcher.title" class="col col-md-6 col-lg-4">
                <div class="card launcher-card">
                  <div class="card-header">
                    <h3>{{ launcher.title }}</h3>
                    <span class="version-badge">{{ launcher.version }}</span>
                  </div>
                  <div class="card-body">
                    <p v-if="launcher.description" class="launcher-description">
                      {{ launcher.description }}
                    </p>
                    <div class="launcher-actions">
                      <a v-if="launcher.download" :href="launcher.download" class="button" target="_blank">
                        {{ $t('download.downloadButton') }}
                      </a>
                      <a v-if="launcher.github" :href="launcher.github" class="button outline" target="_blank">
                        {{ $t('download.github') }}
                      </a>
                      <a v-if="launcher.website" :href="launcher.website" class="button outline" target="_blank">
                        {{ $t('download.website') }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- iOS 启动器 -->
          <div v-if="iosLaunchers.length > 0" class="launcher-section">
            <h2 class="section-title">
              <span class="platform-icon">🍎</span>
              {{ $t('download.ios') }}
            </h2>
            <div class="row">
              <div v-for="launcher in iosLaunchers" :key="launcher.title" class="col col-md-6 col-lg-4">
                <div class="card launcher-card">
                  <div class="card-header">
                    <h3>{{ launcher.title }}</h3>
                    <span class="version-badge">{{ launcher.version }}</span>
                  </div>
                  <div class="card-body">
                    <p v-if="launcher.description" class="launcher-description">
                      {{ launcher.description }}
                    </p>
                    <div class="launcher-actions">
                      <a v-if="launcher.download" :href="launcher.download" class="button" target="_blank">
                        {{ $t('download.downloadButton') }}
                      </a>
                      <a v-if="launcher.github" :href="launcher.github" class="button outline" target="_blank">
                        {{ $t('download.github') }}
                      </a>
                      <a v-if="launcher.website" :href="launcher.website" class="button outline" target="_blank">
                        {{ $t('download.website') }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 无数据提示 -->
          <div v-if="androidLaunchers.length === 0 && iosLaunchers.length === 0" class="no-data">
            <div class="alert warning">
              <p>{{ $t('download.noLaunchers') }}</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 下载说明 -->
      <section class="download-info">
        <div class="card">
          <div class="card-header">
            <h3>{{ $t('download.info.title') }}</h3>
          </div>
          <div class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <div class="info-icon">📱</div>
                <h4>{{ $t('download.info.compatibility.title') }}</h4>
                <p class="text-muted">{{ $t('download.info.compatibility.description') }}</p>
              </div>
              <div class="info-item">
                <div class="info-icon">🔒</div>
                <h4>{{ $t('download.info.security.title') }}</h4>
                <p class="text-muted">{{ $t('download.info.security.description') }}</p>
              </div>
              <div class="info-item">
                <div class="info-icon">🆕</div>
                <h4>{{ $t('download.info.updates.title') }}</h4>
                <p class="text-muted">{{ $t('download.info.updates.description') }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getLauncherData } from '../services/dataService'

const loading = ref(true)
const androidLaunchers = ref([])
const iosLaunchers = ref([])

onMounted(async () => {
  try {
    const launcherData = await getLauncherData()
    
    if (launcherData) {
      if (launcherData.AndroidLauncher) {
        androidLaunchers.value = launcherData.AndroidLauncher
      }
      if (launcherData.iOSLauncher) {
        iosLaunchers.value = launcherData.iOSLauncher
      }
    }
  } catch (error) {
    console.error('Failed to load launcher data:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.launcher-section {
  margin-bottom: 3rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 2rem;
}

.platform-icon {
  font-size: 2rem;
}

.launcher-card {
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.launcher-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.launcher-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.launcher-card h3 {
  color: var(--text-color);
  margin: 0;
  font-size: 1.25rem;
}

.version-badge {
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.launcher-description {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.launcher-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.launcher-actions .button {
  text-align: center;
}

.no-data {
  text-align: center;
  padding: 2rem 0;
}

.download-info {
  margin-top: 3rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.info-item {
  text-align: center;
}

.info-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.info-item h4 {
  color: var(--text-color);
  margin-bottom: 0.75rem;
  font-size: 1.125rem;
}

.info-item p {
  line-height: 1.5;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .launcher-actions {
    gap: 0.5rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>