# MCiSEE - Vite + Vue 版本

这是 MCiSEE 项目的 Vite + Vue 重构版本，提供了更现代的开发体验和更好的性能。

## 🚀 特性

- ⚡️ **Vite** - 极速的构建工具
- 🖖 **Vue 3** - 渐进式 JavaScript 框架
- 🌍 **国际化** - 支持多语言切换
- 🎨 **MDUI** - Material Design 组件库
- 📱 **响应式设计** - 适配各种设备
- 🌙 **主题切换** - 支持亮色/暗色/经典主题
- 🔍 **智能搜索** - 集成多个搜索引擎
- 📊 **访问统计** - 实时访问数据展示

## 📦 项目结构

```
vite-vue-mcisee/
├── public/                 # 静态资源
├── src/
│   ├── components/         # Vue 组件
│   │   ├── AnnouncementBar.vue    # 公告栏
│   │   ├── Sidebar.vue            # 侧边栏导航
│   │   ├── Introduction.vue       # 项目介绍
│   │   ├── DeviceSelector.vue     # 设备选择器
│   │   ├── AppSection.vue         # 应用程序部分
│   │   ├── WebsiteSection.vue     # 网站搜索部分
│   │   ├── UtilityWebsites.vue    # 实用网站
│   │   ├── ForumSection.vue       # 论坛部分
│   │   ├── ConfigSection.vue      # 配置部分
│   │   └── Footer.vue             # 页脚
│   ├── locales/            # 国际化文件
│   │   ├── zh-CN.json             # 中文
│   │   └── en-US.json             # 英文
│   ├── App.vue             # 主应用组件
│   ├── main.js             # 应用入口
│   └── style.css           # 全局样式
├── index.html              # HTML 模板
├── vite.config.js          # Vite 配置
├── package.json            # 项目配置
└── README.md               # 项目说明
```

## 🛠️ 开发

### 环境要求

- Node.js >= 16
- npm 或 yarn 或 pnpm

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

开发服务器将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

构建产物将输出到 `dist` 目录。

### 预览生产版本

```bash
npm run preview
# 或
yarn preview
# 或
pnpm preview
```

## 🎨 主要组件说明

### AnnouncementBar
公告栏组件，显示项目公告和支持链接。

### Sidebar
侧边栏导航组件，提供页面内导航功能。

### Introduction
项目介绍组件，展示 MCiSEE 的基本信息。

### DeviceSelector
设备选择器组件，支持自动检测和手动选择设备类型。

### AppSection
应用程序部分，展示各种 Minecraft 启动器。

### WebsiteSection
网站搜索部分，集成多个搜索引擎和快速查询功能。

### UtilityWebsites
实用网站组件，分类展示各种 Minecraft 相关网站。

### ForumSection
论坛部分，展示各种 Minecraft 社区论坛。

### ConfigSection
配置部分，提供主题切换、语言选择等设置。

### Footer
页脚组件，包含访问统计、贡献者信息等。

## 🌍 国际化

项目支持多语言，目前包含：
- 简体中文 (zh-CN)
- English (en-US)

语言文件位于 `src/locales/` 目录下。

## 🎨 主题系统

支持四种主题：
- **默认** - 跟随系统主题
- **亮色** - 亮色主题
- **暗色** - 暗色主题
- **经典** - 经典主题

主题设置会自动保存到本地存储。

## 📱 响应式设计

项目采用响应式设计，适配：
- 桌面端 (>= 1024px)
- 平板端 (768px - 1023px)
- 移动端 (< 768px)

## 🔧 配置选项

- **主题选择** - 切换界面主题
- **调试模式** - 启用调试信息
- **GitHub 代理** - 选择 GitHub 访问代理
- **自动更新检查** - 自动检查项目更新
- **搜索提示长度** - 设置搜索提示的长度
- **语言选择** - 切换界面语言

## 📊 统计功能

集成了不蒜子统计，提供：
- 总访问量
- 独立访客数
- 页面浏览量

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [原项目](../)
- [GitHub 仓库](https://github.com/Hex-Dragon/MCiSEE)
- [问题反馈](https://github.com/Hex-Dragon/MCiSEE/issues)