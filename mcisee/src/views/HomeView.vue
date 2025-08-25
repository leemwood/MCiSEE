<template>
  <div class="home">
    <div class="container">
      <!-- 英雄区域 -->
      <section class="hero">
        <div class="hero-content">
          <img src="/assets/icon/appiconRound.png" alt="MCiSEE" class="hero-logo">
          <h1 class="hero-title">{{ $t('home.title') }}</h1>
          <p class="hero-subtitle">{{ $t('home.subtitle') }}</p>
          <div class="hero-actions">
            <router-link to="/download" class="button">
              {{ $t('home.downloadLauncher') }}
            </router-link>
            <router-link to="/websites" class="button outline">
              {{ $t('home.exploreWebsites') }}
            </router-link>
          </div>
        </div>
      </section>
      
      <!-- 功能特色 -->
      <section class="features">
        <div class="row">
          <div class="col col-md-4">
            <div class="card hoverable text-center">
              <div class="feature-icon">🚀</div>
              <h3>{{ $t('home.features.launcher.title') }}</h3>
              <p class="text-muted">{{ $t('home.features.launcher.description') }}</p>
            </div>
          </div>
          <div class="col col-md-4">
            <div class="card hoverable text-center">
              <div class="feature-icon">🌐</div>
              <h3>{{ $t('home.features.websites.title') }}</h3>
              <p class="text-muted">{{ $t('home.features.websites.description') }}</p>
            </div>
          </div>
          <div class="col col-md-4">
            <div class="card hoverable text-center">
              <div class="feature-icon">💬</div>
              <h3>{{ $t('home.features.community.title') }}</h3>
              <p class="text-muted">{{ $t('home.features.community.description') }}</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 最新更新 -->
      <section class="updates">
        <h2 class="text-center mb-4">{{ $t('home.updates.title') }}</h2>
        <div class="row">
          <div class="col col-md-6">
            <div class="card">
              <div class="card-header">{{ $t('home.updates.launcher') }}</div>
              <div v-if="loading" class="text-center">
                <div class="spinner"></div>
              </div>
              <div v-else-if="latestLaunchers.length > 0">
                <div v-for="launcher in latestLaunchers" :key="launcher.title" class="launcher-item">
                  <h4>{{ launcher.title }}</h4>
                  <p class="text-muted">{{ $t('home.updates.version') }}: {{ launcher.version }}</p>
                  <a v-if="launcher.download" :href="launcher.download" class="button" target="_blank">
                    {{ $t('home.updates.download') }}
                  </a>
                </div>
              </div>
              <div v-else class="text-muted">
                {{ $t('home.updates.noData') }}
              </div>
            </div>
          </div>
          <div class="col col-md-6">
            <div class="card">
              <div class="card-header">{{ $t('home.updates.websites') }}</div>
              <div v-if="loading" class="text-center">
                <div class="spinner"></div>
              </div>
              <div v-else-if="featuredWebsites.length > 0">
                <div v-for="website in featuredWebsites" :key="website.name" class="website-item">
                  <h4>{{ website.name }}</h4>
                  <p class="text-muted">{{ website.description }}</p>
                  <a :href="website.url" class="button outline" target="_blank">
                    {{ $t('home.updates.visit') }}
                  </a>
                </div>
              </div>
              <div v-else class="text-muted">
                {{ $t('home.updates.noData') }}
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
import { getLauncherData, getUtilityWebsiteData } from '../services/dataService'

const loading = ref(true)
const latestLaunchers = ref([])
const featuredWebsites = ref([])

onMounted(async () => {
  try {
    // 加载启动器数据
    const launcherData = await getLauncherData()
    if (launcherData && launcherData.AndroidLauncher) {
      latestLaunchers.value = launcherData.AndroidLauncher.slice(0, 3)
    }
    
    // 加载网站数据
    const websiteData = await getUtilityWebsiteData()
    if (websiteData && websiteData.length > 0) {
      const officialSites = websiteData[0]['官方网站 (©Mojang/©微软)'] || []
      featuredWebsites.value = officialSites.slice(0, 3).map(site => ({
        name: site[0],
        url: site[1],
        description: site[2] || ''
      }))
    }
  } catch (error) {
    console.error('Failed to load home data:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 4rem 0;
  margin-bottom: 4rem;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.hero-logo {
  width: 120px;
  height: 120px;
  margin-bottom: 2rem;
  border-radius: 50%;
  box-shadow: var(--shadow);
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.features {
  margin-bottom: 4rem;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.updates {
  margin-bottom: 4rem;
}

.launcher-item,
.website-item {
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
}

.launcher-item:last-child,
.website-item:last-child {
  border-bottom: none;
}

.launcher-item h4,
.website-item h4 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.launcher-item p,
.website-item p {
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-actions .button {
    width: 200px;
  }
}
</style>
