# 🎮 游戏花园 — 添加指南

## 快速添加

1. 在 `games/` 下创建你的游戏文件夹
2. 在文件夹内创建 `index.html`
3. 在下方 `manifest.json` 中添加一条记录
4. 推送到 GitHub，自动生效

## manifest.json 示例

```json
{
  "id": "my-game",
  "name": "我的游戏",
  "description": "一句话描述",
  "icon": "fas fa-star",
  "category": "休闲",
  "url": "games/my-game/index.html",
  "version": "1.0.0",
  "author": "YourName"
}
```

## 可用图标 (FontAwesome)

`fas fa-gamepad` `fas fa-puzzle-piece` `fas fa-star` `fas fa-rocket`
`fas fa-chess` `fas fa-dice` `fas fa-bomb` `fas fa-music`
`fas fa-paint-brush` `fas fa-brain` `fas fa-heart` `fas fa-fire`

## 推荐分类

- 休闲
- 益智
- 动作
- 创意
- 音乐

详细文档见 [API.md](../API.md)
