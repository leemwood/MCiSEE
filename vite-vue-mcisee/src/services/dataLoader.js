// 数据缓存
let launcherData = null
let searchableData = null
let utilityWebsiteData = null
let forumData = null

// 加载数据文件的辅助函数
async function loadJsoncFile(path) {
  const response = await fetch(path)
  const text = await response.text()
  // 改进的JSONC解析，更安全地移除注释
  const lines = text.split('\n')
  const cleanedLines = lines.map(line => {
    // 移除行注释，但保留字符串中的//
    let inString = false
    let escaped = false
    let result = ''
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]
      
      if (escaped) {
        result += char
        escaped = false
        continue
      }
      
      if (char === '\\' && inString) {
        escaped = true
        result += char
        continue
      }
      
      if (char === '"' && !escaped) {
        inString = !inString
        result += char
        continue
      }
      
      if (!inString && char === '/' && nextChar === '/') {
        break // 遇到行注释，停止处理这一行
      }
      
      result += char
    }
    
    return result
  })
  
  const jsonText = cleanedLines.join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '') // 移除块注释
    .replace(/,\s*([}\]])/g, '$1') // 移除多余的逗号
  
  return JSON.parse(jsonText)
}

// 初始化数据
async function initData() {
  if (!launcherData) {
    launcherData = await loadJsoncFile('/data/launcher.jsonc')
  }
  if (!searchableData) {
    searchableData = await loadJsoncFile('/data/searchable.jsonc')
  }
  if (!utilityWebsiteData) {
    utilityWebsiteData = await loadJsoncFile('/data/utilityWebsite.jsonc')
  }
  if (!forumData) {
    forumData = await loadJsoncFile('/data/forum.jsonc')
  }
}

/**
 * 获取启动器数据
 * @param {string} device - 设备类型 ('android', 'ios', 'windows')
 * @returns {Promise<Array>} 启动器列表
 */
export async function getLauncherData(device = null) {
  await initData()
  if (device) {
    return launcherData.filter(launcher => launcher.device.includes(device))
  }
  return launcherData
}

/**
 * 获取可搜索站点数据
 * @returns {Promise<Array>} 搜索站点列表
 */
export async function getSearchableData() {
  await initData()
  return searchableData
}

/**
 * 获取实用网站数据
 * @param {string} category - 分类名称
 * @returns {Promise<Array>} 网站列表
 */
export async function getUtilityWebsiteData(category = null) {
  await initData()
  if (category) {
    return utilityWebsiteData.filter(website => website.category === category)
  }
  return utilityWebsiteData
}

/**
 * 获取论坛数据
 * @returns {Promise<Array>} 论坛列表
 */
export async function getForumData() {
  await initData()
  return forumData
}

/**
 * 获取所有网站分类
 * @returns {Promise<Array>} 分类列表
 */
export async function getWebsiteCategories() {
  await initData()
  const categories = [...new Set(utilityWebsiteData.map(website => website.category))]
  return categories.filter(Boolean)
}

/**
 * 根据关键词搜索启动器
 * @param {string} keyword - 搜索关键词
 * @param {string} device - 设备类型
 * @returns {Promise<Array>} 匹配的启动器列表
 */
export async function searchLaunchers(keyword, device = null) {
  let launchers = await getLauncherData(device)
  
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase()
    launchers = launchers.filter(launcher => 
      launcher.title.toLowerCase().includes(lowerKeyword) ||
      launcher.description?.toLowerCase().includes(lowerKeyword)
    )
  }
  
  return launchers
}

/**
 * 根据关键词搜索实用网站
 * @param {string} keyword - 搜索关键词
 * @param {string} category - 分类
 * @returns {Promise<Array>} 匹配的网站列表
 */
export async function searchUtilityWebsites(keyword, category = null) {
  let websites = await getUtilityWebsiteData(category)
  
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase()
    websites = websites.filter(website => 
      website.name.toLowerCase().includes(lowerKeyword) ||
      website.description?.toLowerCase().includes(lowerKeyword)
    )
  }
  
  return websites
}

/**
 * 获取搜索引擎配置
 * @param {string} abbr - 搜索引擎缩写
 * @returns {Promise<Object|null>} 搜索引擎配置
 */
export async function getSearchEngine(abbr) {
  await initData()
  return searchableData.find(engine => engine.abbr === abbr) || null
}

/**
 * 构建搜索URL
 * @param {string} abbr - 搜索引擎缩写
 * @param {string} query - 搜索关键词
 * @returns {Promise<string|null>} 搜索URL
 */
export async function buildSearchUrl(abbr, query) {
  const engine = await getSearchEngine(abbr)
  if (!engine || !query) return null
  
  // 站内搜索特殊处理
  if (abbr === 'MCiSEE') {
    return engine.url || '#网站'
  }
  
  // 使用search字段和<T>占位符
  if (!engine.search) return null
  
  return engine.search.replace('<T>', encodeURIComponent(query))
}