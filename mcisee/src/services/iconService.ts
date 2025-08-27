// 网站图标服务
export class IconService {
  private static cache = new Map<string, string>()
  private static readonly FALLBACK_ICON = '/icons/default-website.svg'
  private static readonly CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24小时

  /**
   * 获取网站图标
   * @param url 网站URL
   * @param websiteName 网站名称（用于生成备用图标）
   * @returns 图标URL
   */
  static async getWebsiteIcon(url: string, websiteName?: string): Promise<string> {
    try {
      const domain = this.extractDomain(url)
      if (!domain) {
        return this.generateFallbackIcon(websiteName || 'Website')
      }

      // 检查缓存
      const cacheKey = `icon_${domain}`
      const cached = this.getCachedIcon(cacheKey)
      if (cached) {
        return cached
      }

      // 尝试多种方式获取图标
      const iconUrl = await this.fetchIcon(domain)
      
      // 缓存结果
      this.setCachedIcon(cacheKey, iconUrl)
      
      return iconUrl
    } catch (error) {
      console.warn(`Failed to get icon for ${url}:`, error)
      return this.generateFallbackIcon(websiteName || 'Website')
    }
  }

  /**
   * 批量获取网站图标
   * @param websites 网站列表
   * @returns 包含图标URL的网站列表
   */
  static async batchGetIcons<T extends { url: string; name: string }>(websites: T[]): Promise<(T & { iconUrl: string })[]> {
    const results = await Promise.allSettled(
      websites.map(async (website) => ({
        ...website,
        iconUrl: await this.getWebsiteIcon(website.url, website.name)
      }))
    )

    return results
      .filter((result): result is PromiseFulfilledResult<Awaited<T & { iconUrl: string }>> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value)
  }

  /**
   * 从URL提取域名
   */
  private static extractDomain(url: string): string | null {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
      return urlObj.hostname
    } catch {
      return null
    }
  }

  /**
   * 获取网站图标
   */
  private static async fetchIcon(domain: string): Promise<string> {
    // 尝试多种图标获取方式
    const methods = [
      () => this.tryGoogleFavicon(domain),
      () => this.tryDirectFavicon(domain),
      () => this.tryIconFinder(domain),
      () => this.tryDuckDuckGoFavicon(domain)
    ]

    for (const method of methods) {
      try {
        const iconUrl = await method()
        if (iconUrl && await this.validateIcon(iconUrl)) {
          return iconUrl
        }
      } catch (error) {
        console.debug(`Icon fetch method failed for ${domain}:`, error)
      }
    }

    // 所有方法都失败，返回生成的图标
    return this.generateFallbackIcon(domain)
  }

  /**
   * 使用Google Favicon服务
   */
  private static async tryGoogleFavicon(domain: string): Promise<string> {
    const url = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    return url
  }

  /**
   * 直接获取网站favicon
   */
  private static async tryDirectFavicon(domain: string): Promise<string> {
    const url = `https://${domain}/favicon.ico`
    return url
  }

  /**
   * 使用IconFinder服务
   */
  private static async tryIconFinder(domain: string): Promise<string> {
    const url = `https://icon.horse/icon/${domain}`
    return url
  }

  /**
   * 使用DuckDuckGo Favicon服务
   */
  private static async tryDuckDuckGoFavicon(domain: string): Promise<string> {
    const url = `https://icons.duckduckgo.com/ip3/${domain}.ico`
    return url
  }

  /**
   * 验证图标是否有效
   */
  private static async validateIcon(iconUrl: string): Promise<boolean> {
    try {
      const response = await fetch(iconUrl, { 
        method: 'HEAD',
        mode: 'no-cors'
      })
      return response.ok || response.type === 'opaque'
    } catch {
      return true // 由于CORS限制，假设图标有效
    }
  }

  /**
   * 生成备用图标
   */
  static generateFallbackIcon(name: string): string {
    // 使用第一个字符生成SVG图标
    const firstChar = name.charAt(0).toUpperCase()
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
      '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
    ]
    const color = colors[name.length % colors.length]
    
    const svg = `data:image/svg+xml,${encodeURIComponent(`
      <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="8" fill="${color}"/>
        <text x="32" y="40" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="white">
          ${firstChar}
        </text>
      </svg>
    `)}`
    
    return svg
  }

  /**
   * 获取缓存的图标
   */
  private static getCachedIcon(key: string): string | null {
    const cached = localStorage.getItem(key)
    if (!cached) return null

    try {
      const { url, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp > this.CACHE_EXPIRY) {
        localStorage.removeItem(key)
        return null
      }
      return url
    } catch {
      localStorage.removeItem(key)
      return null
    }
  }

  /**
   * 缓存图标
   */
  private static setCachedIcon(key: string, url: string): void {
    try {
      const data = {
        url,
        timestamp: Date.now()
      }
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to cache icon:', error)
    }
  }

  /**
   * 清除过期缓存
   */
  static clearExpiredCache(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('icon_'))
    keys.forEach(key => {
      this.getCachedIcon(key) // 这会自动清除过期的缓存
    })
  }

  /**
   * 预加载图标
   */
  static preloadIcons(urls: string[]): void {
    urls.forEach(url => {
      const domain = this.extractDomain(url)
      if (domain) {
        // 异步预加载，不等待结果
        this.getWebsiteIcon(url).catch(() => {})
      }
    })
  }
}

export default IconService