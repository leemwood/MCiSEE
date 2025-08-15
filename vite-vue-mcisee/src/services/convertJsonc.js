// 转换JSONC文件为JSON格式的工具脚本
import fs from 'fs'
import path from 'path'

// 读取并转换JSONC文件
function convertJsoncToJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    
    // 移除单行注释
    let cleanJson = content.replace(/\/\/.*$/gm, '')
    // 移除多行注释
    cleanJson = cleanJson.replace(/\/\*[\s\S]*?\*\//g, '')
    
    // 解析并重新格式化JSON
    const parsed = JSON.parse(cleanJson)
    const formatted = JSON.stringify(parsed, null, 2)
    
    // 写入新的JSON文件
    const jsonPath = filePath.replace('.jsonc', '.json')
    fs.writeFileSync(jsonPath, formatted, 'utf-8')
    
    console.log(`转换完成: ${filePath} -> ${jsonPath}`)
    return true
  } catch (error) {
    console.error(`转换失败 ${filePath}:`, error.message)
    return false
  }
}

// 转换所有JSONC文件
const servicesDir = path.dirname(new URL(import.meta.url).pathname)
const jsoncFiles = [
  'launcher.jsonc',
  'searchable.jsonc', 
  'utilityWebsite.jsonc',
  'forum.jsonc'
]

jsoncFiles.forEach(file => {
  const filePath = path.join(servicesDir, file)
  if (fs.existsSync(filePath)) {
    convertJsoncToJson(filePath)
  }
})