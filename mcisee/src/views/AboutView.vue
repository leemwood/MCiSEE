<template>
  <div class="about">
    <div class="container">
      <!-- 页面标题 -->
      <section class="page-header">
        <h1 class="page-title">{{ $t('about.title') }}</h1>
        <p class="page-subtitle">{{ $t('about.subtitle') }}</p>
      </section>
      
      <!-- 项目信息 -->
      <section class="project-info">
        <div class="row">
          <div class="col col-md-4">
            <div class="project-logo">
              <img src="/assets/icon/appiconRound.png" alt="MCiSEE" class="logo-image">
            </div>
          </div>
          <div class="col col-md-8">
            <div class="project-details">
              <h2 class="project-name">MCiSEE</h2>
              <p class="project-version">{{ $t('about.version') }}: 2.0.0</p>
              <p class="project-description">{{ $t('about.description') }}</p>
              
              <div class="project-links">
                <a href="https://github.com/MCiSEE/MCiSEE" class="button" target="_blank">
                  {{ $t('about.github') }}
                </a>
                <a href="https://github.com/MCiSEE/MCiSEE/issues" class="button outline" target="_blank">
                  {{ $t('about.issues') }}
                </a>
                <a href="https://github.com/MCiSEE/MCiSEE/blob/main/CONTRIBUTING.md" class="button outline" target="_blank">
                  {{ $t('about.contribute') }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 网站设置 -->
      <section class="settings-section">
        <div class="card">
          <div class="card-header">
            <h3>{{ $t('about.settings.title') }}</h3>
          </div>
          <div class="card-body">
            <div class="settings-grid">
              <!-- 主题设置 -->
              <div class="setting-item">
                <div class="setting-label">
                  <h4>{{ $t('about.settings.theme.title') }}</h4>
                  <p class="text-muted">{{ $t('about.settings.theme.description') }}</p>
                </div>
                <div class="setting-control">
                  <div class="theme-options">
                    <button 
                      v-for="option in themeOptions" 
                      :key="option.value"
                      :class="['theme-option', { active: currentTheme === option.value }]"
                      @click="setTheme(option.value)"
                    >
                      <span class="theme-icon">{{ option.icon }}</span>
                      <span class="theme-label">{{ $t(option.label) }}</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- 语言设置 -->
              <div class="setting-item">
                <div class="setting-label">
                  <h4>{{ $t('about.settings.language.title') }}</h4>
                  <p class="text-muted">{{ $t('about.settings.language.description') }}</p>
                </div>
                <div class="setting-control">
                  <select v-model="currentLocale" @change="changeLanguage" class="language-select">
                    <option v-for="lang in languages" :key="lang.code" :value="lang.code">
                      {{ lang.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 技术栈 -->
      <section class="tech-stack">
        <h2 class="section-title">{{ $t('about.techStack.title') }}</h2>
        <div class="row">
          <div class="col col-md-4">
            <div class="card tech-card">
              <div class="tech-icon">⚡</div>
              <h3>Vue 3</h3>
              <p class="text-muted">{{ $t('about.techStack.vue') }}</p>
            </div>
          </div>
          <div class="col col-md-4">
            <div class="card tech-card">
              <div class="tech-icon">🎨</div>
              <h3>ClarityUI</h3>
              <p class="text-muted">{{ $t('about.techStack.clarity') }}</p>
            </div>
          </div>
          <div class="col col-md-4">
            <div class="card tech-card">
              <div class="tech-icon">🌐</div>
              <h3>Vue I18n</h3>
              <p class="text-muted">{{ $t('about.techStack.i18n') }}</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 贡献者 -->
      <section class="contributors">
        <h2 class="section-title">{{ $t('about.contributors.title') }}</h2>
        <div class="card">
          <div class="card-body">
            <p class="text-muted text-center">{{ $t('about.contributors.description') }}</p>
            <div class="contributor-actions">
              <a href="https://github.com/MCiSEE/MCiSEE/graphs/contributors" class="button" target="_blank">
                {{ $t('about.contributors.view') }}
              </a>
              <a href="https://github.com/MCiSEE/MCiSEE/blob/main/CONTRIBUTING.md" class="button outline" target="_blank">
                {{ $t('about.contributors.join') }}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '../composables/useTheme'
import { setLocale, availableLocales as languages } from '../i18n'

const { locale } = useI18n()
const { theme: currentTheme, themeOptions, setTheme } = useTheme()

const currentLocale = ref(locale.value)

// 语言切换
const changeLanguage = async () => {
  await setLocale(currentLocale.value)
}

onMounted(() => {
  currentLocale.value = locale.value
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

.project-info {
  margin-bottom: 3rem;
}

.project-logo {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  box-shadow: var(--shadow);
}

.project-details {
  padding-left: 2rem;
}

.project-name {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.project-version {
  color: var(--text-muted);
  margin-bottom: 1rem;
  font-size: 1.125rem;
}

.project-description {
  color: var(--text-color);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.project-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.settings-section {
  margin-bottom: 3rem;
}

.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.setting-label h4 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
}

.setting-label p {
  margin: 0;
  font-size: 0.9rem;
}

.setting-control {
  flex-shrink: 0;
}

.theme-options {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--card-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
}

.theme-option:hover {
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

.theme-option.active {
  border-color: var(--primary-color);
  background: var(--primary-color-alpha);
}

.theme-icon {
  font-size: 1.5rem;
}

.theme-label {
  font-size: 0.875rem;
  font-weight: 500;
}

.language-select {
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.language-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 2rem;
  text-align: center;
}

.tech-stack {
  margin-bottom: 3rem;
}

.tech-card {
  text-align: center;
  height: 100%;
  transition: transform 0.2s ease;
}

.tech-card:hover {
  transform: translateY(-2px);
}

.tech-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.tech-card h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.tech-card p {
  line-height: 1.5;
}

.contributors {
  margin-bottom: 3rem;
}

.contributor-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .project-details {
    padding-left: 0;
    text-align: center;
  }
  
  .project-links {
    justify-content: center;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .setting-label {
    text-align: center;
  }
  
  .theme-options {
    justify-content: center;
  }
  
  .language-select {
    width: 100%;
  }
  
  .contributor-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .contributor-actions .button {
    width: 200px;
  }
}
</style>
