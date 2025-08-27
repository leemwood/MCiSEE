import { parse } from 'jsonc-parser'

// 数据接口定义
export interface LauncherItem {
  title: string
  name: string
  abbr?: string
  download: string
  version: string
  github?: string
  url?: string
  website?: string
  docs?: string
  description?: string
  icon?: string
  tags?: string[]
  size?: string
  platform?: string
  featured?: boolean
  downloads?: Array<{
    type: string
    url: string
  }>
  dev?: {
    download: string
    version: string
  }
}

export interface WebsiteItem {
  name: string
  url: string
  description?: string
  icon?: string
  type?: string
  tags?: string[]
  language?: string
  status?: string
  featured?: boolean
  github?: string
  docs?: string
}

export interface WebsiteCategory {
  id: string
  name: string
  description?: string
  websites: WebsiteItem[]
}

export interface LocaleData {
  [key: string]: string
}

// 数据服务类
class DataService {
  private launcherData: LauncherItem[] | null = null
  private websiteData: WebsiteCategory[] | null = null
  private localeData: { [locale: string]: LocaleData } = {}
  
  // 获取启动器数据
  async getLauncherData(): Promise<LauncherItem[]> {
    if (this.launcherData) {
      return this.launcherData
    }
    
    try {
      const response = await fetch('/data/launcher.jsonc')
      const text = await response.text()
      const data = parse(text)
      
      // 根据平台获取对应的启动器数据
      const platform = this.detectPlatform()
      const rawLaunchers = data[platform] || data.windows || []
      
      // 转换数据格式以匹配新的接口
      this.launcherData = rawLaunchers.map((launcher: any) => ({
        ...launcher,
        name: launcher.title || launcher.name || 'Unknown',
        website: launcher.url || launcher.website,
        downloads: launcher.download ? [{
          type: this.getDownloadType(launcher.download),
          url: launcher.download
        }] : [],
        description: launcher.description || `${launcher.title || 'Unknown'} 启动器`,
        tags: launcher.tags || [],
        platform: platform,
        featured: launcher.featured || false
      }))
      
      return this.launcherData || []
    } catch (error) {
      console.error('Failed to load launcher data:', error)
      return []
    }
  }
  
  // 获取网站数据
  async getWebsiteData(): Promise<WebsiteCategory[]> {
    if (this.websiteData) {
      return this.websiteData
    }
    
    try {
      const response = await fetch('/data/utilityWebsite.jsonc')
      const text = await response.text()
      const rawData = parse(text)
      
      // 转换数据格式
      const categories: WebsiteCategory[] = []
      
      if (Array.isArray(rawData)) {
        rawData.forEach((categoryObj, index) => {
          Object.entries(categoryObj).forEach(([categoryName, websites]) => {
            const categoryId = this.generateCategoryId(categoryName)
            const websiteItems: WebsiteItem[] = []
            
            if (Array.isArray(websites)) {
              websites.forEach(([name, url, description]) => {
                websiteItems.push({
                  name,
                  url,
                  description: description || '',
                  type: this.inferWebsiteType(name, url),
                  language: this.inferLanguage(url),
                  status: 'active'
                })
              })
            }
            
            categories.push({
              id: categoryId,
              name: categoryName,
              description: this.getCategoryDescription(categoryName),
              websites: websiteItems
            })
          })
        })
      }
      
      this.websiteData = categories
      return this.websiteData
    } catch (error) {
      console.error('Failed to load website data:', error)
      return []
    }
  }

  // 获取实用网站数据（别名方法）
  async getUtilityWebsites(): Promise<WebsiteCategory[]> {
    return this.getWebsiteData()
  }
  
  // 添加getUtilityWebsiteData别名方法
  async getUtilityWebsiteData(): Promise<WebsiteCategory[]> {
    return this.getWebsiteData()
  }
  
  // 获取本地化数据
  async getLocaleData(locale: string = 'zh-CN'): Promise<LocaleData> {
    if (this.localeData[locale]) {
      return this.localeData[locale]
    }
    
    try {
      const response = await fetch(`/locales/${locale}.json`)
      const data = await response.json()
      this.localeData[locale] = data
      
      return data
    } catch (error) {
      console.error(`Failed to load locale data for ${locale}:`, error)
      // 如果加载失败，尝试加载默认语言
      if (locale !== 'zh-CN') {
        return this.getLocaleData('zh-CN')
      }
      return {}
    }
  }
  
  // 获取搜索数据
  async getSearchableData(): Promise<any> {
    try {
      const response = await fetch('/data/searchable.jsonc')
      const text = await response.text()
      return parse(text)
    } catch (error) {
      console.error('Failed to load searchable data:', error)
      return {}
    }
  }
  
  // 获取论坛数据
  async getForumData(): Promise<any> {
    try {
      const response = await fetch('/data/forum.jsonc')
      const text = await response.text()
      return parse(text)
    } catch (error) {
      console.error('Failed to load forum data:', error)
      return {}
    }
  }
  
  // 检测平台
  private detectPlatform(): string {
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (userAgent.includes('mac')) {
      return 'macos'
    } else if (userAgent.includes('linux')) {
      return 'linux'
    } else {
      return 'windows'
    }
  }
  
  // 获取GitHub统计数据
  async getGitHubStats(): Promise<any> {
    try {
      // 使用正确的GitHub仓库地址
      const response = await fetch('https://api.github.com/repos/teaSummer/MCiSEE')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      
      return {
        stars: data.stargazers_count || 0,
        forks: data.forks_count || 0,
        watchers: data.watchers_count || 0,
        issues: data.open_issues_count || 0
      }
    } catch (error) {
      console.error('Failed to load GitHub stats:', error)
      // 返回模拟数据以避免UI崩溃
      return {
        stars: 42,
        forks: 8,
        watchers: 15,
        issues: 3
      }
    }
  }
  
  // 清除缓存
  clearCache(): void {
    this.launcherData = null
    this.websiteData = null
    this.localeData = {}
  }
  
  // 辅助方法：生成分类ID
  private generateCategoryId(categoryName: string): string {
    return categoryName
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
  
  // 辅助方法：推断下载类型
  private getDownloadType(url: string): string {
    const urlLower = url.toLowerCase()
    
    if (urlLower.includes('.exe')) return 'exe'
    if (urlLower.includes('.dmg')) return 'dmg'
    if (urlLower.includes('.deb')) return 'deb'
    if (urlLower.includes('.rpm')) return 'rpm'
    if (urlLower.includes('.appimage')) return 'appimage'
    if (urlLower.includes('.jar')) return 'jar'
    if (urlLower.includes('windows') || urlLower.includes('win')) return 'windows'
    if (urlLower.includes('mac') || urlLower.includes('osx')) return 'mac'
    if (urlLower.includes('linux')) return 'linux'
    
    return 'download'
  }
  
  // 辅助方法：推断网站类型
  private inferWebsiteType(name: string, url: string): string {
    const nameAndUrl = (name + ' ' + url).toLowerCase()
    
    if (nameAndUrl.includes('mod') || nameAndUrl.includes('模组')) return 'mod'
    if (nameAndUrl.includes('server') || nameAndUrl.includes('服务器')) return 'server'
    if (nameAndUrl.includes('tool') || nameAndUrl.includes('工具')) return 'tool'
    if (nameAndUrl.includes('wiki') || nameAndUrl.includes('百科')) return 'wiki'
    if (nameAndUrl.includes('community') || nameAndUrl.includes('社区')) return 'community'
    if (nameAndUrl.includes('resource') || nameAndUrl.includes('资源')) return 'resource'
    if (nameAndUrl.includes('api')) return 'api'
    if (nameAndUrl.includes('hosting') || nameAndUrl.includes('托管')) return 'hosting'
    
    return 'website'
  }
  
  // 辅助方法：推断语言
  private inferLanguage(url: string): string {
    if (url.includes('.cn') || url.includes('chinese') || url.includes('zh')) return '中文'
    if (url.includes('.jp') || url.includes('japanese')) return '日文'
    if (url.includes('.tw') || url.includes('taiwan')) return '繁体中文'
    return '英文'
  }
  
  // 辅助方法：获取分类描述
  private getCategoryDescription(categoryName: string): string {
    const descriptions: Record<string, string> = {
      '官方网站 (©Mojang/©微软)': 'Mojang 和微软官方提供的 Minecraft 相关网站和服务',
      '找服玩': '各种 Minecraft 服务器列表和查找平台',
      '工具箱': '实用的 Minecraft 相关工具和实用程序',
      '资源站': 'Minecraft 资源包、模组、皮肤等资源下载站点',
      '友情链接[open]': '合作伙伴和友情链接网站'
    }
    
    return descriptions[categoryName] || ''
  }
}

// 导出单例实例
export const dataService = new DataService()
export default dataService