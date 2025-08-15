<template>
  <div class="forum-container" id="论坛">
    <div class="label margin-top-20">{{ $t('forum') }}</div>
    <a class="to-unfold" href="#论坛-展开" @click="toggleExpand" v-if="!isExpanded">{{ $t('unfold') }}</a>
    <a class="to-fold" href="#论坛-收起" @click="toggleExpand" v-if="isExpanded">{{ $t('fold') }}</a>
    
    <div class="forum-list" :class="{ expanded: isExpanded }">
      <div v-for="(category, categoryIndex) in forumData" :key="categoryIndex" class="category">
        <h3 class="category-title">{{ Object.keys(category)[0] }}</h3>
        <div class="forum-grid">
          <div 
            v-for="(forum, index) in Object.values(category)[0]" 
            :key="index" 
            class="forum-item"
          >
            <a :href="forum[1]" target="_blank" class="forum-link">
              <div class="forum-name">{{ forum[0] }}</div>
              <div class="forum-description" v-if="forum[2]">{{ forum[2] }}</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForumSection',
  data() {
    return {
      isExpanded: false,
      forumData: [],
      // 论坛数据 - 从原项目的forum.jsonc获取
      defaultForumData: [
      {
        "官方论坛 (Official Forums)": [
          ["Minecraft官方论坛", "https://www.minecraft.net/zh-hans/community", "官方社区论坛"],
          ["Minecraft反馈网站", "https://feedback.minecraft.net/", "官方反馈和建议平台"]
        ]
      },
      {
        "中文社区 (Chinese Community)": [
          ["MCBBS", "https://www.mcbbs.net/", "最大的中文Minecraft论坛"],
          ["苦力怕论坛", "https://klpbbs.com/", "专业的Minecraft技术论坛"],
          ["MineBBS", "https://www.minebbs.com/", "Minecraft中文社区"],
          ["我的世界中文论坛", "https://mc.163.com/", "网易我的世界官方论坛"]
        ]
      },
      {
        "国际社区 (International Community)": [
          ["Reddit - Minecraft", "https://www.reddit.com/r/Minecraft/", "Reddit上的Minecraft社区"],
          ["Minecraft Forum", "https://www.minecraftforum.net/", "老牌Minecraft论坛"],
          ["Planet Minecraft", "https://www.planetminecraft.com/", "Minecraft作品分享平台"],
          ["CurseForge Community", "https://www.curseforge.com/minecraft/mc-mods", "模组社区讨论"]
        ]
      },
      {
        "技术开发 (Development)": [
          ["SpigotMC", "https://www.spigotmc.org/", "服务端插件开发社区"],
          ["Fabric Discord", "https://discord.gg/v6v4pMv", "Fabric模组开发Discord"],
          ["Forge Forums", "https://forums.minecraftforge.net/", "Forge模组开发论坛"],
          ["Bukkit Forums", "https://bukkit.org/", "Bukkit插件开发论坛"]
        ]
      },
      {
        "服务器社区 (Server Community)": [
          ["Hypixel论坛", "https://hypixel.net/", "知名服务器Hypixel的论坛"],
          ["服务器列表", "https://minecraft-server-list.com/", "Minecraft服务器列表"],
          ["中国版服务器", "https://mc.163.com/server/", "网易版服务器社区"]
        ]
      },
      {
        "创作分享 (Creative Sharing)": [
          ["Minecraft Maps", "https://www.minecraftmaps.com/", "地图作品分享"],
          ["Minecraft Schematics", "https://www.minecraft-schematics.com/", "建筑蓝图分享"],
          ["Minecraft Builds", "https://www.minecraft-builds.com/", "建筑作品展示"]
        ]
      }
    ]
    }
  },
  methods: {
    toggleExpand(event) {
      event.preventDefault()
      this.isExpanded = !this.isExpanded
      localStorage.setItem('forumExpanded', this.isExpanded.toString())
    },
    
    async loadForumData() {
      try {
        // 尝试从API或本地文件加载数据
        // 这里使用默认数据
        this.forumData = this.defaultForumData
      } catch (error) {
        console.error('加载论坛数据失败:', error)
        this.forumData = this.defaultForumData
      }
    }
  },
  
  mounted() {
    // 恢复展开状态
    const savedExpanded = localStorage.getItem('forumExpanded')
    this.isExpanded = savedExpanded === 'true'
    
    // 加载论坛数据
    this.loadForumData()
  }
}
</script>

<style scoped>
.forum-container {
  margin: 2rem 0;
}

.forum-list {
  max-height: 300px;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.forum-list.expanded {
  max-height: none;
}

.category {
  margin: 1.5rem 0;
}

.category-title {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
  border-bottom: 2px solid #28a745;
  padding-bottom: 0.25rem;
}

.forum-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.forum-item {
  background: rgba(40, 167, 69, 0.1);
  border: 1px solid rgba(40, 167, 69, 0.2);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.forum-item:hover {
  background: rgba(40, 167, 69, 0.15);
  border-color: #28a745;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.forum-link {
  display: block;
  padding: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.forum-name {
  font-weight: 500;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  color: #28a745;
}

.forum-description {
  font-size: 0.8rem;
  color: #666;
  line-height: 1.4;
}

.to-unfold, .to-fold {
  float: right;
  font-size: 0.8rem;
  color: #28a745;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.to-unfold:hover, .to-fold:hover {
  background-color: rgba(40, 167, 69, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .forum-grid {
    grid-template-columns: 1fr;
  }
  
  .forum-item {
    margin-bottom: 0.5rem;
  }
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .category-title {
    color: #fff;
  }
  
  .forum-description {
    color: #ccc;
  }
  
  .forum-item {
    background: rgba(0, 0, 0, 0.2);
    border-color: rgba(40, 167, 69, 0.1);
  }
  
  .forum-item:hover {
    background: rgba(0, 0, 0, 0.3);
  }
}
</style>