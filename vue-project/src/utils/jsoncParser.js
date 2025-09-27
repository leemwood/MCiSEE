import { parse as parseJsoncLib } from 'jsonc-parser'

/**
 * 简单的JSONC解析器
 * 使用jsonc-parser库来解析JSONC文件
 */

/**
 * 解析JSONC内容为JavaScript对象
 * @param {string} jsoncContent - JSONC文件内容
 * @returns {Object} - 解析后的对象
 */
export function parseJsonc(jsoncContent) {
  try {
    // 使用jsonc-parser库来解析JSONC
    const errors = []
    const result = parseJsoncLib(jsoncContent, errors, {
      allowTrailingComma: true,
      allowEmptyContent: true,
      disallowComments: false
    })
    
    if (errors.length > 0) {
      console.warn('JSONC解析警告:', errors)
    }
    
    return result || {}
  } catch (error) {
    console.error('解析JSONC失败:', error)
    return {}
  }
}

/**
 * 异步加载JSONC文件
 * @param {string} filePath - 文件路径
 * @returns {Promise<Object>} - 解析后的对象
 */
export async function loadJsoncFile(filePath) {
  try {
    const response = await fetch(filePath)
    const content = await response.text()
    return parseJsonc(content)
  } catch (error) {
    console.error(`加载JSONC文件失败: ${filePath}`, error)
    return {}
  }
}