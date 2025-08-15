/**
 * 更新检查服务
 * 检查启动器的最新版本并提供更新提示
 */

class UpdateChecker {
  constructor() {
    this.updateLayers = []
    this.updateLayerNumber = 0
    this.notificationCount = ''
    this.checkedUpdates = false
  }

  /**
   * 创建更新提示层
   * @param {string} abbr - 启动器缩写
   * @param {string} lastVersion - 上次版本
   * @param {string} latestVersion - 最新版本
   * @param {string} download - 下载链接
   * @param {string} device - 设备类型
   * @param {object} deviceInfo - 设备信息
   * @param {string} stableOrDev - 稳定版或开发版
   */
  createUpdateLayer(abbr, lastVersion, latestVersion, download, device, deviceInfo, stableOrDev) {
    this.updateLayerNumber++
    
    const updateInfo = {
      id: `update-layer-${this.updateLayerNumber}`,
      abbr,
      lastVersion,
      latestVersion,
      download,
      device,
      deviceInfo,
      stableOrDev,
      timestamp: Date.now()
    }
    
    this.updateLayers.push(updateInfo)
    this.notificationCount = `(${this.updateLayerNumber})`
    
    // 触发更新事件
    this.dispatchUpdateEvent(updateInfo)
    
    return updateInfo
  }

  /**
   * 删除更新提示层
   * @param {string} updateId - 更新ID
   * @param {boolean} all - 是否删除所有
   */
  deleteUpdateLayer(updateId, all = false) {
    if (all) {
      this.updateLayers = []
      this.updateLayerNumber = 0
      this.notificationCount = ''
    } else {
      const index = this.updateLayers.findIndex(layer => layer.id === updateId)
      if (index !== -1) {
        this.updateLayers.splice(index, 1)
        this.updateLayerNumber--
        this.notificationCount = this.updateLayerNumber > 0 ? `(${this.updateLayerNumber})` : ''
      }
    }
    
    // 触发删除事件
    this.dispatchDeleteEvent(updateId, all)
  }

  /**
   * 检查启动器更新
   * @param {Array} launchers - 启动器列表
   * @param {string} device - 设备类型
   * @param {object} deviceInfo - 设备信息
   */
  async checkLauncherUpdates(launchers, device, deviceInfo) {
    if (this.checkedUpdates) {
      return
    }
    
    this.checkedUpdates = true
    
    for (const launcher of launchers) {
      const abbr = launcher.abbr || launcher.title
      
      // 检查稳定版更新
      if (launcher.hasOwnProperty('version')) {
        const lastStableVersion = localStorage.getItem(`last-${device}-${abbr}-stable-download`)
        const latestStableVersion = launcher.version
        
        if (lastStableVersion && lastStableVersion !== latestStableVersion) {
          this.createUpdateLayer(
            abbr,
            lastStableVersion,
            latestStableVersion,
            launcher.download,
            device,
            deviceInfo,
            'release'
          )
        }
      }
      
      // 检查开发版更新
      if (launcher.hasOwnProperty('dev')) {
        const lastDevVersion = localStorage.getItem(`last-${device}-${abbr}-dev-download`)
        const latestDevVersion = launcher.dev.version
        
        if (lastDevVersion && lastDevVersion !== latestDevVersion) {
          this.createUpdateLayer(
            abbr,
            lastDevVersion,
            latestDevVersion,
            launcher.dev.download,
            device,
            deviceInfo,
            'preRelease'
          )
        }
      }
    }
  }

  /**
   * 记录下载版本
   * @param {string} device - 设备类型
   * @param {string} abbr - 启动器缩写
   * @param {string} version - 版本号
   * @param {string} stableOrDev - 稳定版或开发版
   */
  recordDownload(device, abbr, version, stableOrDev) {
    if (version && version !== 'latest') {
      localStorage.setItem(`last-${device}-${abbr}-${stableOrDev}-download`, version)
    }
  }

  /**
   * 获取下载镜像链接
   * @param {string} url - 原始链接
   * @returns {string} 镜像链接
   */
  getDownloadMirror(url) {
    if (!url) return url
    
    const githubProxy = localStorage.getItem('githubProxy') || 'none'
    
    if (githubProxy === 'none' || !url.includes('github.com')) {
      return url
    }
    
    const proxyMappings = {
      'ghproxy': 'https://ghproxy.com/',
      'mirror': 'https://mirror.ghproxy.com/',
      'gitclone': 'https://gitclone.com/'
    }
    
    const proxyUrl = proxyMappings[githubProxy]
    if (proxyUrl) {
      return proxyUrl + url
    }
    
    return url
  }

  /**
   * 获取更新通知数量
   * @returns {string} 通知数量字符串
   */
  getNotificationCount() {
    return this.notificationCount
  }

  /**
   * 获取所有更新信息
   * @returns {Array} 更新信息列表
   */
  getAllUpdates() {
    return [...this.updateLayers]
  }

  /**
   * 清除所有更新检查状态
   */
  reset() {
    this.updateLayers = []
    this.updateLayerNumber = 0
    this.notificationCount = ''
    this.checkedUpdates = false
  }

  /**
   * 触发更新事件
   * @param {object} updateInfo - 更新信息
   */
  dispatchUpdateEvent(updateInfo) {
    const event = new CustomEvent('launcher-update-available', {
      detail: updateInfo
    })
    window.dispatchEvent(event)
  }

  /**
   * 触发删除事件
   * @param {string} updateId - 更新ID
   * @param {boolean} all - 是否删除所有
   */
  dispatchDeleteEvent(updateId, all) {
    const event = new CustomEvent('launcher-update-dismissed', {
      detail: { updateId, all }
    })
    window.dispatchEvent(event)
  }

  /**
   * 检查是否启用自动更新检查
   * @returns {boolean} 是否启用
   */
  isAutoUpdateEnabled() {
    return localStorage.getItem('autoUpdateCheck') !== 'false'
  }

  /**
   * 设置自动更新检查状态
   * @param {boolean} enabled - 是否启用
   */
  setAutoUpdateEnabled(enabled) {
    localStorage.setItem('autoUpdateCheck', enabled.toString())
    
    if (!enabled) {
      // 如果禁用自动更新检查，清除所有更新提示
      this.deleteUpdateLayer(null, true)
    }
  }

  /**
   * 启用自动更新检查
   */
  enableAutoCheck() {
    this.setAutoUpdateEnabled(true)
    console.log('自动更新检查已启用')
  }

  /**
   * 禁用自动更新检查
   */
  disableAutoCheck() {
    this.setAutoUpdateEnabled(false)
    console.log('自动更新检查已禁用')
  }
}

// 创建单例实例
const updateChecker = new UpdateChecker()

export default updateChecker