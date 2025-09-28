<template>
  <div class="utility-sites">
    <h2>实用网站</h2>
    <el-collapse v-model="activeCategories" accordion>
      <el-collapse-item 
        v-for="category in Object.keys(utilitySites)" 
        :key="category" 
        :name="category"
        :title="category.replace('[open]', '')"
      >
        <div class="sites-grid">
          <el-card 
            v-for="site in utilitySites[category]" 
            :key="site[0]" 
            class="site-card"
            shadow="hover"
            @click="openSite(site[1])"
          >
            <div class="site-content">
              <div class="site-icon">
                <img 
                  :src="getSiteIcon(site[1], site[3])" 
                  :alt="site[0] + '图标'"
                  width="32" 
                  height="32"
                  loading="lazy"
                  @error="handleIconError"
                />
              </div>
              <div class="site-info">
                <h4>{{ site[0] }}</h4>
                <p class="site-url">{{ site[1] }}</p>
                <p class="site-description" v-if="site[2]">{{ site[2] }}</p>
              </div>
            </div>
          </el-card>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import {
  ElCollapse,
  ElCollapseItem,
  ElCard
} from 'element-plus'

export default defineComponent({
  components: {
    ElCollapse,
    ElCollapseItem,
    ElCard
  },
  name: 'UtilitySites',
  props: {
    utilitySites: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const activeCategories = ref([])
    const fIconUrl = 'https://www.faviconextractor.com/favicon/<T>?larger=true'
    
    // 初始化展开状态，友情链接默认展开
    onMounted(() => {
      Object.keys(props.utilitySites).forEach(category => {
        if (category.includes('友情链接')) {
          activeCategories.value.push(category)
        }
      })
    })
    
    const openSite = (url) => {
      if (url && !url.startsWith('#')) {
        window.open(url, '_blank')
      }
    }
    
    // 获取网站图标
    const getSiteIcon = (url, favicon) => {
      // 确保url是字符串类型
      if (typeof url !== 'string') {
        return ''
      }
      
      // 如果提供了自定义图标路径，优先使用
      if (favicon) {
        return favicon
      }
      
      // 如果是内部链接，不显示图标
      if (url.startsWith('#')) {
        return ''
      }
      
      // 使用FaviconExtractor服务获取网站图标
      const domain = url.replace(/https?:\/\//, '').replace(/\/.*/, '')
      return fIconUrl.replace('<T>', domain)
    }
    
    // 处理图标加载错误
    const handleIconError = (event) => {
      // 图标加载失败时移除img元素
      event.target.remove()
    }
    
    return {
      activeCategories,
      openSite,
      getSiteIcon,
      handleIconError
    }
  }
})
</script>

<style scoped>
.utility-sites {
  margin: 32px 0;
}

.utility-sites h2 {
  color: var(--md-sys-color-on-surface);
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 600;
}

.category {
  margin-bottom: 24px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 12px 16px;
  background: var(--md-sys-color-surface-variant);
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-bottom: 0;
}

.category-header:hover {
  background: var(--md-sys-color-primary-container);
}

.category-header h3 {
  color: var(--md-sys-color-on-surface-variant);
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.toggle-icon {
  font-size: 16px;
  color: var(--md-sys-color-on-surface-variant);
  transition: transform 0.3s ease;
}

.toggle-icon.expanded {
  transform: rotate(0deg);
}

.category-header:hover .toggle-icon {
  color: var(--md-sys-color-primary);
}

.sites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.site-card {
  background: var(--md-sys-color-surface);
  border: 1px solid var(--md-sys-color-surface-variant);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.site-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border-color: var(--md-sys-color-primary);
}

.site-icon {
  flex-shrink: 0;
}

.site-icon img {
  border-radius: 4px;
  object-fit: contain;
}

.site-info {
  flex: 1;
  min-width: 0;
}

.site-info h4 {
  color: var(--md-sys-color-on-surface);
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  word-break: break-word;
}

.site-url {
  color: var(--md-sys-color-secondary);
  font-size: 14px;
  margin-bottom: 8px;
  word-break: break-all;
}

.site-description {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 14px;
  line-height: 1.4;
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sites-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .utility-sites h2 {
    font-size: 20px;
  }
  
  .category h3 {
    font-size: 18px;
  }
  
  .site-card {
    padding: 12px;
    gap: 10px;
  }
  
  .site-icon img {
    width: 28px;
    height: 28px;
  }
}
</style>