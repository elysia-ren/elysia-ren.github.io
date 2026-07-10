# 粉色妖精小姐的秘密基地 🌸

> elysia-elie.ren — 一个融合梦幻设计与实用功能的静态网站

## 功能模块

| 页面 | 说明 |
|------|------|
| `index.html` | 首页，展示所有功能入口 |
| `explore.html` | 妖精工坊，在线小工具（Base64、JSON、颜色转换等） |
| `games.html` | 游戏花园，自动加载 `games/manifest.json` 中的游戏 |
| `resources.html` | 资源宝库，自动加载 `resources/manifest.json` 中的资源 |

## 快速扩展

### 添加新游戏

1. 在 `games/` 下创建文件夹，如 `games/snake/`
2. 创建 `games/snake/index.html` 作为游戏入口
3. 在 `games/manifest.json` 中添加配置
4. 推送即可，游戏花园页面自动识别

### 添加新资源

1. 编辑 `resources/manifest.json`
2. 推送即可

详见 [API.md](API.md) 接口文档。

## 目录结构

```
├── index.html
├── explore.html
├── games.html
├── resources.html
├── common.css
├── common.js
├── API.md                  # 接口文档
├── CNAME                   # 自定义域名
├── assets/music/           # 背景音乐
├── games/
│   ├── manifest.json       # 游戏清单
│   └── <game-id>/          # 各游戏文件夹
└── resources/
    └── manifest.json       # 资源清单
```

## 技术栈

- 纯静态 HTML/CSS/JS
- GitHub Pages 托管
- FontAwesome 图标
- Animate.css 动画
