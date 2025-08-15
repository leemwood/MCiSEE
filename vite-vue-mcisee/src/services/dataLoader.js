// 导入数据文件
import launcherData from './launcher.json'
import searchableData from './searchable.json'
import utilityWebsiteData from './utilityWebsite.json'
import forumData from './forum.json'

/**
 * 获取启动器数据
 * @param {string} device - 设备类型 ('android', 'ios', 'windows')
 * @returns {Array} 启动器列表
 */
export function getLauncherData(device = null) {
  if (device) {
    return launcherData.filter(launcher => launcher.device.includes(device))
  }
  return launcherData
}

/**
 * 获取可搜索站点数据
 * @returns {Array} 搜索站点列表
 */
export function getSearchableData() {
  return searchableData
}

/**
 * 获取实用网站数据
 * @param {string} category - 分类名称
 * @returns {Array} 网站列表
 */
export function getUtilityWebsiteData(category = null) {
  if (category) {
    return utilityWebsiteData.filter(website => website.category === category)
  }
  return utilityWebsiteData
}

/**
 * 获取论坛数据
 * @returns {Array} 论坛列表
 */
export function getForumData() {
  return forumData
}

/**
 * 获取所有网站分类
 * @returns {Array} 分类列表
 */
export function getWebsiteCategories() {
  const categories = [...new Set(utilityWebsiteData.map(website => website.category))]
  return categories.filter(Boolean)
}

/**
 * 根据关键词搜索启动器
 * @param {string} keyword - 搜索关键词
 * @param {string} device - 设备类型
 * @returns {Array} 匹配的启动器列表
 */
export function searchLaunchers(keyword, device = null) {
  let launchers = getLauncherData(device)
  
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
 * @returns {Array} 匹配的网站列表
 */
export function searchUtilityWebsites(keyword, category = null) {
  let websites = getUtilityWebsiteData(category)
  
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
 * @returns {Object|null} 搜索引擎配置
 */
export function getSearchEngine(abbr) {
  return searchableData.find(engine => engine.abbr === abbr) || null
}

/**
 * 构建搜索URL
 * @param {string} abbr - 搜索引擎缩写
 * @param {string} query - 搜索关键词
 * @returns {string|null} 搜索URL
 */
export function buildSearchUrl(abbr, query) {
  const engine = getSearchEngine(abbr)
  if (!engine || !query) return null
  
  // 站内搜索特殊处理
  if (abbr === 'MCiSEE') {
    return engine.url || '#网站'
  }
  
  // 使用search字段和<T>占位符
  if (!engine.search) return null
  
  return engine.search.replace('<T>', encodeURIComponent(query))
}