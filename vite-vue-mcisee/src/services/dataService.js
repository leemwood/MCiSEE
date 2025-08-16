// 数据加载服务
class DataService {
  constructor() {
    this.cache = new Map()
  }

  // 加载并解析JSONC文件
  async loadJsoncFile(filePath) {
    if (this.cache.has(filePath)) {
      return this.cache.get(filePath)
    }

    try {
      const response = await fetch(filePath)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const text = await response.text()
      // 简单的JSONC解析：移除注释
      const jsonText = this.removeComments(text)
      const data = JSON.parse(jsonText)
      
      this.cache.set(filePath, data)
      return data
    } catch (error) {
      console.error(`加载数据文件失败: ${filePath}`, error)
      throw error
    }
  }

  // 移除JSONC注释和处理特殊字符
  removeComments(text) {
    const lines = text.split('\n')
    const cleanLines = []
    let inMultiLineComment = false
    
    for (let line of lines) {
      // 处理多行注释
      if (inMultiLineComment) {
        const endIndex = line.indexOf('*/')
        if (endIndex !== -1) {
          line = line.substring(endIndex + 2)
          inMultiLineComment = false
        } else {
          continue
        }
      }
      
      // 查找多行注释开始
      const multiCommentStart = line.indexOf('/*')
      if (multiCommentStart !== -1) {
        const endIndex = line.indexOf('*/', multiCommentStart + 2)
        if (endIndex !== -1) {
          line = line.substring(0, multiCommentStart) + line.substring(endIndex + 2)
        } else {
          line = line.substring(0, multiCommentStart)
          inMultiLineComment = true
        }
      }
      
      // 移除单行注释（但要注意字符串中的//）
      let inString = false
      let escaped = false
      let commentIndex = -1
      
      for (let i = 0; i < line.length - 1; i++) {
        const char = line[i]
        const nextChar = line[i + 1]
        
        if (escaped) {
          escaped = false
          continue
        }
        
        if (char === '\\') {
          escaped = true
          continue
        }
        
        if (char === '"') {
          inString = !inString
          continue
        }
        
        if (!inString && char === '/' && nextChar === '/') {
          commentIndex = i
          break
        }
      }
      
      if (commentIndex !== -1) {
        line = line.substring(0, commentIndex)
      }
      
      // 处理字符串中的换行符
      line = line.replace(/"([^"]*?)\\n([^"]*?)"/g, '"$1 $2"')
      
      if (line.trim()) {
        cleanLines.push(line)
      }
    }
    
    let result = cleanLines.join('\n')
    // 移除行尾逗号
    result = result.replace(/,\s*([}\]])/g, '$1')
    // 移除控制字符（但保留必要的空白字符）
    result = result.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    
    return result
  }

  // 加载启动器数据
  async loadLauncherData() {
    try {
      const data = await this.loadJsoncFile('/data/launcher.jsonc')
      return this.transformLauncherData(data)
    } catch (error) {
      console.error('加载启动器数据失败，使用默认数据', error)
      return this.getDefaultLauncherData()
    }
  }

  // 转换启动器数据格式
  transformLauncherData(data) {
    const launchers = []
    const launcherMap = new Map() // 用于合并跨平台启动器
    
    // 处理所有平台的启动器数据
    const platformMappings = {
      'AndroidLauncher': 'Android',
      'iOSLauncher': 'iOS', 
      'WindowsLauncher': 'Windows',
      'macOSLauncher': 'macOS',
      'LinuxLauncher': 'Linux'
    }

    Object.entries(platformMappings).forEach(([dataKey, deviceType]) => {
      if (data[dataKey]) {
        data[dataKey].forEach(launcher => {
          const launcherName = launcher.abbr || launcher.title
          const launcherId = this.generateId(launcher.title)
          
          if (launcherMap.has(launcherName)) {
            // 如果启动器已存在，添加设备支持
            const existingLauncher = launcherMap.get(launcherName)
            existingLauncher.supportedDevices.push(deviceType)
            
            // 如果当前平台有特定的下载链接，更新对应平台的下载信息
            if (launcher.download) {
              existingLauncher.platformDownloads = existingLauncher.platformDownloads || {}
              existingLauncher.platformDownloads[deviceType] = {
                downloadUrl: launcher.download,
                version: launcher.version,
                devDownloadUrl: launcher.dev?.download || null,
                devVersion: launcher.dev?.version || null
              }
            }
          } else {
            // 创建新的启动器条目
            const newLauncher = {
              id: launcherId,
              name: launcherName,
              fullName: launcher.title,
              description: this.getDescription(launcher.title),
              website: launcher.url || null,
              github: launcher.github || null,
              downloadUrl: launcher.download || null,
              devDownloadUrl: launcher.dev?.download || null,
              version: launcher.version || null,
              devVersion: launcher.dev?.version || null,
              supportedDevices: [deviceType],
              platformDownloads: {}
            }
            
            // 添加平台特定的下载信息
            if (launcher.download) {
              newLauncher.platformDownloads[deviceType] = {
                downloadUrl: launcher.download,
                version: launcher.version,
                devDownloadUrl: launcher.dev?.download || null,
                devVersion: launcher.dev?.version || null
              }
            }
            
            launcherMap.set(launcherName, newLauncher)
          }
        })
      }
    })

    // 将Map转换为数组
    return Array.from(launcherMap.values())
  }

  // 生成ID
  generateId(title) {
    return title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // 获取描述
  getDescription(title) {
    const descriptions = {
      'Hello Minecraft! Launcher': '跨平台Minecraft启动器',
      'Plain Craft Launcher 2': '我的世界启动器',
      'BakaXL Launcher': '简洁高效的Minecraft启动器',
      'MultiMC': '跨平台Minecraft实例管理器',
      'ColorMC': '现代化Minecraft启动器',
      'X Minecraft Launcher': '现代化跨平台启动器'
    }
    return descriptions[title] || 'Minecraft启动器'
  }

  // 默认启动器数据
  getDefaultLauncherData() {
    return [
      {
        id: 'hmcl',
        name: 'HMCL',
        fullName: 'Hello Minecraft! Launcher',
        description: '跨平台Minecraft启动器',
        website: 'https://hmcl.huangyuhui.net/',
        github: 'https://github.com/huanghongxun/HMCL',
        downloadUrl: 'https://github.com/huanghongxun/HMCL/releases/latest',
        devDownloadUrl: null,
        supportedDevices: ['Windows', 'macOS', 'Linux']
      },
      {
        id: 'pcl2',
        name: 'PCL2',
        fullName: 'Plain Craft Launcher 2',
        description: '我的世界启动器',
        website: 'https://afdian.net/p/0164034c016c11ebafcb52540025c377',
        github: null,
        downloadUrl: 'https://afdian.net/p/0164034c016c11ebafcb52540025c377',
        devDownloadUrl: null,
        supportedDevices: ['Windows']
      }
    ]
  }

  // 加载实用网站数据
  async loadUtilityWebsiteData() {
    try {
      const response = await fetch('/data/utilityWebsite.jsonc')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const text = await response.text()
      const jsonText = this.removeComments(text)
      const data = JSON.parse(jsonText)
      return this.transformUtilityWebsiteData(data)
    } catch (error) {
      console.error('加载实用网站数据失败，使用默认数据', error)
      return this.getDefaultUtilityWebsiteData()
    }
  }

  // 转换实用网站数据格式
  transformUtilityWebsiteData(data) {
    return data.map(category => {
      const categoryName = Object.keys(category)[0]
      const websites = category[categoryName]
      return {
        [categoryName]: websites
      }
    })
  }

  // 默认实用网站数据
  getDefaultUtilityWebsiteData() {
    return [
      {
        "启动器 (Launcher)": [
          ["HMCL", "https://hmcl.huangyuhui.net/", "跨平台Minecraft启动器"],
          ["PCL2", "https://afdian.net/p/0164034c016c11ebafcb52540025c377", "我的世界启动器"]
        ]
      },
      {
        "模组平台 (Mod Platform)": [
          ["CurseForge", "https://www.curseforge.com/minecraft", "最大的模组平台"],
          ["Modrinth", "https://modrinth.com/", "现代化模组平台"]
        ]
      }
    ]
  }

  // 加载论坛数据
  async loadForumData() {
    try {
      const response = await fetch('/data/forum.jsonc')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const text = await response.text()
      const jsonText = this.removeComments(text)
      const data = JSON.parse(jsonText)
      return this.transformForumData(data)
    } catch (error) {
      console.error('加载论坛数据失败，使用默认数据', error)
      return this.getDefaultForumData()
    }
  }

  // 转换论坛数据格式
  transformForumData(data) {
    return data.map(category => {
      const categoryName = Object.keys(category)[0]
      const forums = category[categoryName]
      return {
        [categoryName]: forums
      }
    })
  }

  // 默认论坛数据
  getDefaultForumData() {
    return [
      {
        "简体中文论坛": [
          ["MineBBS", "https://www.minebbs.com", "综合性MC论坛"],
          ["苦力怕论坛", "https://klpbbs.com", "主营基岩版的中文社区"]
        ]
      },
      {
        "其他论坛": [
          ["国际论坛", "https://www.minecraftforum.net"],
          ["中国香港社区", "https://www.minecraft-hk.com", "交流最新資訊、專業教學"]
        ]
      }
    ]
  }

  // 清除缓存
  clearCache() {
    this.cache.clear()
  }
}

// 创建单例实例
const dataService = new DataService()

export default dataService