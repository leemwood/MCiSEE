// 数据服务 - 从JSONc文件读取数据

// 改进的JSONc解析器（移除注释）
function parseJsonc(text) {
  let result = ''
  let inString = false
  let inSingleLineComment = false
  let inMultiLineComment = false
  let escapeNext = false
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const nextChar = text[i + 1]
    
    if (escapeNext) {
      if (inString) result += char
      escapeNext = false
      continue
    }
    
    if (char === '\\' && inString) {
      result += char
      escapeNext = true
      continue
    }
    
    if (char === '"' && !inSingleLineComment && !inMultiLineComment) {
      inString = !inString
      result += char
      continue
    }
    
    if (inString) {
      result += char
      continue
    }
    
    if (char === '/' && nextChar === '/' && !inMultiLineComment) {
      inSingleLineComment = true
      i++ // 跳过下一个字符
      continue
    }
    
    if (char === '/' && nextChar === '*' && !inSingleLineComment) {
      inMultiLineComment = true
      i++ // 跳过下一个字符
      continue
    }
    
    if (char === '*' && nextChar === '/' && inMultiLineComment) {
      inMultiLineComment = false
      i++ // 跳过下一个字符
      continue
    }
    
    if (char === '\n' && inSingleLineComment) {
      inSingleLineComment = false
      result += char
      continue
    }
    
    if (!inSingleLineComment && !inMultiLineComment) {
      result += char
    }
  }
  
  // 移除尾随逗号
  result = result.replace(/,\s*([}\]])/g, '$1')
  
  return JSON.parse(result)
}

// 缓存数据
const cache = new Map()

// 通用数据获取函数
async function fetchData(filename) {
  if (cache.has(filename)) {
    return cache.get(filename)
  }
  
  try {
    const response = await fetch(`/data/${filename}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filename}: ${response.statusText}`)
    }
    
    const text = await response.text()
    const data = parseJsonc(text)
    
    cache.set(filename, data)
    return data
  } catch (error) {
    console.error(`Error loading ${filename}:`, error)
    return null
  }
}

// 获取启动器数据
export async function getLauncherData() {
  return await fetchData('launcher.jsonc')
}

// 获取实用网站数据
export async function getUtilityWebsiteData() {
  return await fetchData('utilityWebsite.jsonc')
}

// 获取论坛数据
export async function getForumData() {
  return await fetchData('forum.jsonc')
}

// 获取可搜索数据
export async function getSearchableData() {
  return await fetchData('searchable.jsonc')
}

// 清除缓存
export function clearCache() {
  cache.clear()
}

// 获取GitHub统计数据
export async function getGitHubStats() {
  try {
    const response = await fetch('https://api.github.com/repos/teaSummer/MCiSEE')
    if (!response.ok) {
      throw new Error('Failed to fetch GitHub stats')
    }
    
    const data = await response.json()
    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      watchers: data.watchers_count,
      issues: data.open_issues_count
    }
  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    return {
      stars: '---',
      forks: '---',
      watchers: '---',
      issues: '---'
    }
  }
}