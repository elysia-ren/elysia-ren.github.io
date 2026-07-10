# 💎 资源宝库 — 添加指南

## 快速添加

1. 如果有本地文件，放入 `resources/` 目录
2. 编辑 `manifest.json` 添加一条记录
3. 推送到 GitHub，自动生效

## manifest.json 示例

```json
{
  "id": "my-resource",
  "name": "资源名称",
  "description": "资源描述",
  "icon": "fas fa-image",
  "category": "素材",
  "type": "link",
  "url": "https://example.com",
  "tags": ["壁纸", "高清"]
}
```

## 字段说明

| 字段 | 说明 |
|------|------|
| `id` | 唯一标识 |
| `name` | 显示名称 |
| `description` | 简短描述 |
| `icon` | FontAwesome 图标 |
| `category` | 分类（用于筛选） |
| `type` | `link` 或 `file` |
| `url` | 链接地址或文件路径 |
| `tags` | 标签数组 |

## 推荐分类

- 素材
- 工具
- 学习
- 壁纸
- 链接

详细文档见 [API.md](../API.md)
