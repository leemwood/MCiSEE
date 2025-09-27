// Material Design 3 组件注册
import * as md from '@material/web/all.js'

export function registerMaterialComponents(app) {
  // 注册 Material Design 3 组件
  const components = [
    'md-filled-button',
    'md-outlined-button',
    'md-text-button',
    'md-elevated-button',
    'md-tonal-button',
    'md-filled-text-field',
    'md-outlined-text-field',
    'md-filled-select',
    'md-outlined-select',
    'md-list',
    'md-list-item',
    'md-checkbox',
    'md-radio',
    'md-switch',
    'md-slider',
    'md-circular-progress',
    'md-linear-progress',
    'md-dialog',
    'md-snackbar',
    'md-tabs',
    'md-primary-tab',
    'md-secondary-tab',
    'md-chip',
    'md-filter-chip',
    'md-input-chip',
    'md-suggestion-chip',
    'md-divider',
    'md-icon',
    'md-icon-button',
    'md-fab',
    'md-filled-tonal-fab',
    'md-outlined-fab',
    'md-navigation-drawer',
    'md-navigation-bar',
    'md-navigation-tab'
  ]

  components.forEach(componentName => {
    const element = customElements.get(componentName)
    if (element) {
      app.component(componentName, element)
    }
  })
}