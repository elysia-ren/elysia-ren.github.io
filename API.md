# 接口文档 — 粉色妖精小姐的秘密基地

> 本文档说明如何向网站添加新内容（游戏、资源等）。所有扩展均基于 **manifest.json** 配置文件实现，无需修改页面代码。

---

## 目录结构

```
├── index.html              # 首页
├── explore.html            # 妖精工坊（内置工具页）
├── games.html              # 游戏花园（动态加载）
├── resources.html          # 资源宝库（动态加载）
├── common.css              # 公共样式
├── common.js               # 公共脚本
├── assets/
│   └── music/              # 背景音乐
├── games/
│   ├── manifest.json       # ⭐ 游戏清单
│   ├── README.md           # 游戏添加指南
│   └── <game-id>/          # 每个游戏一个文件夹
│       └── index.html
└── resources/
    ├── manifest.json       # ⭐ 资源清单
    └── README.md           # 资源添加指南
```

---

## 1. 游戏接口 (games/manifest.json)

### 文件位置

`games/manifest.json`

### 数据格式

JSON 数组，每个元素为一个游戏对象：

```json
[
  {
    "id": "game-id",
    "name": "游戏名称",
    "description": "游戏简介，一句话描述",
    "icon": "fas fa-puzzle-piece",
    "category": "休闲",
    "url": "games/game-id/index.html",
    "version": "1.0.0",
    "author": "作者名"
  }
]
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 唯一标识，与文件夹名一致 |
| `name` | string | ✅ | 显示名称 |
| `description` | string | ✅ | 简短描述 |
| `icon` | string | ❌ | FontAwesome 图标类名，默认 `fas fa-gamepad` |
| `category` | string | ❌ | 分类标签，用于筛选，默认"未分类" |
| `url` | string | ✅ | 游戏入口页面的相对路径 |
| `version` | string | ❌ | 版本号 |
| `author` | string | ❌ | 作者 |

### 添加新游戏步骤

1. 在 `games/` 下创建文件夹，如 `games/my-game/`
2. 在文件夹内创建 `index.html` 作为游戏入口
3. 编辑 `games/manifest.json`，添加一条记录：

```json
{
  "id": "my-game",
  "name": "我的游戏",
  "description": "一个有趣的小游戏",
  "icon": "fas fa-star",
  "category": "益智",
  "url": "games/my-game/index.html",
  "version": "1.0.0",
  "author": "YourName"
}
```

4. 提交到 GitHub，游戏花园页面会自动显示新游戏

### 游戏模板

每个游戏的 `index.html` 建议包含返回按钮：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>游戏名称 - 游戏花园</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../../common.css">
    <style>
        /* 游戏自定义样式 */
    </style>
</head>
<body>
    <a href="../../games.html" class="back-btn">
        <i class="fas fa-arrow-left"></i> 返回游戏花园
    </a>
    <!-- 游戏内容 -->
    <script src="../../common.js"></script>
</body>
</html>
```

> **注意**：游戏页面通过 `../../` 回到根目录引用公共文件。

---

## 2. 资源接口 (resources/manifest.json)

### 文件位置

`resources/manifest.json`

### 数据格式

```json
[
  {
    "id": "resource-id",
    "name": "资源名称",
    "description": "资源描述",
    "icon": "fas fa-gem",
    "category": "素材",
    "type": "link",
    "url": "https://example.com",
    "tags": ["标签1", "标签2"]
  }
]
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 唯一标识 |
| `name` | string | ✅ | 显示名称 |
| `description` | string | ✅ | 简短描述 |
| `icon` | string | ❌ | FontAwesome 图标类名，默认 `fas fa-gem` |
| `category` | string | ❌ | 分类标签，默认"未分类" |
| `type` | string | ❌ | 资源类型：`link`（外链）/ `file`（本地文件）|
| `url` | string | ✅ | 资源链接或文件路径 |
| `tags` | string[] | ❌ | 标签数组，用于展示 |

### 添加新资源步骤

1. 如果是本地文件，放入 `resources/` 或子目录
2. 编辑 `resources/manifest.json`，添加记录
3. 提交到 GitHub

---

## 3. 妖精工坊工具 (explore.html)

工具直接内嵌在 `explore.html` 中，通过 JavaScript 对象定义。

### 工具注册

在 `explore.html` 的 `<script>` 中找到 `tools` 对象，添加新工具：

```javascript
const tools = {
    // ... 已有工具
    'my-tool': {
        title: '我的工具',
        html: `
            <div class="io-area">
                <div><label>输入</label><textarea id="mt-in" placeholder="..."></textarea></div>
                <div><label>输出</label><textarea id="mt-out" readonly></textarea></div>
            </div>
            <div class="action-bar">
                <button class="btn btn-primary" onclick="myToolAction()">
                    <i class="fas fa-magic"></i> 执行
                </button>
            </div>
            <div class="result-msg" id="mt-msg"></div>`
    }
};
```

然后在工具卡片网格中添加对应的卡片 HTML：

```html
<div class="tool-card" onclick="openTool('my-tool')">
    <div class="tool-header">
        <div class="tool-icon"><i class="fas fa-star"></i></div>
        <h3>我的工具</h3>
    </div>
    <p>工具描述文字</p>
    <div class="tool-tags">
        <span class="tag">标签1</span>
        <span class="tag">标签2</span>
    </div>
</div>
```

最后实现工具的业务函数 `myToolAction()`。

---

## 4. 公共资源说明

### common.css — CSS 变量

所有页面共享以下 CSS 变量，修改即可全局生效：

```css
:root {
    --primary: #D8A3E0;        /* 主色调（淡紫） */
    --primary-light: #EBD4F0;  /* 浅紫 */
    --primary-dark: #B87BC0;   /* 深紫 */
    --accent: #FFE0E9;         /* 点缀色（粉） */
    --background: #f8f5fb;     /* 页面背景 */
    --text: #5A4B6E;           /* 文字色 */
    --text-light: #8A7B99;     /* 浅文字色 */
}
```

### common.js — 公共函数

| 函数 | 说明 |
|------|------|
| `initPetals()` | 初始化花瓣飘落背景 |
| `initNavbar()` | 初始化导航栏汉堡菜单 |
| `initMusic()` | 初始化背景音乐播放 |
| `loadManifest(url)` | 加载 manifest.json，返回 Promise<Array> |
| `renderCards(items, container, cardFn)` | 通用卡片渲染 |
| `initScrollAnimations()` | 初始化滚动入场动画 |

### 背景音乐

所有页面共享同一首背景音乐，通过 `localStorage` 同步音量状态。
音乐文件位于 `assets/music/` 目录。

---

## 5. 部署说明

本项目为 GitHub Pages 静态站点：

1. 推送到 `elysia-ren.github.io` 仓库的 `main` 分支
2. GitHub Pages 自动部署
3. 自定义域名：`elysia-elie.ren`（CNAME 文件）

### 注意事项

- 所有路径使用相对路径
- manifest.json 的 `url` 字段使用相对于网站根目录的路径
- 游戏页面引用公共文件用 `../../common.css` 和 `../../common.js`
- 提交后等待 GitHub Pages 构建完成（通常 1-2 分钟）
