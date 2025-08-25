<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="nav-brand">
        <img src="/assets/icon/favicon.ico" alt="MCiSEE" style="width: 24px; height: 24px; margin-right: 8px; vertical-align: middle;">
        MCiSEE
      </router-link>
      
      <div class="nav-menu">
        <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
          {{ $t('nav.home') }}
        </router-link>
        <router-link to="/download" class="nav-link" :class="{ active: $route.path === '/download' }">
          {{ $t('nav.download') }}
        </router-link>
        <router-link to="/websites" class="nav-link" :class="{ active: $route.path === '/websites' }">
          {{ $t('nav.websites') }}
        </router-link>
        <router-link to="/about" class="nav-link" :class="{ active: $route.path === '/about' }">
          {{ $t('nav.about') }}
        </router-link>
        
        <div class="nav-controls">
          <!-- 语言切换 -->
          <select 
            v-model="currentLocale" 
            @change="changeLocale"
            class="locale-select"
            :title="$t('nav.language')"
          >
            <option v-for="locale in availableLocales" :key="locale.code" :value="locale.code">
              {{ locale.name }}
            </option>
          </select>
          
          <!-- 主题切换 -->
          <button 
            @click="toggleTheme" 
            class="theme-toggle"
            :title="$t('nav.toggleTheme')"
          >
            <span v-if="isDark">🌙</span>
            <span v-else>☀️</span>
          </button>
          
          <!-- GitHub链接 -->
          <a 
            href="https://github.com/Hex-Dragon/MCiSEE" 
            target="_blank" 
            class="nav-link github-link"
            :title="$t('nav.github')"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '../composables/useTheme'
import { setLocale, availableLocales } from '../i18n'

const { locale } = useI18n()
const { isDark, toggleTheme } = useTheme()

const currentLocale = computed({
  get: () => locale.value,
  set: (value) => {
    setLocale(value)
  }
})

function changeLocale(event) {
  setLocale(event.target.value)
}
</script>

<style scoped>
.nav-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.locale-select {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.locale-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.github-link {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.3s ease;
}

.github-link:hover {
  background: var(--surface-color);
}

@media (max-width: 768px) {
  .nav-menu {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
  
  .nav-controls {
    justify-content: center;
    width: 100%;
  }
  
  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>