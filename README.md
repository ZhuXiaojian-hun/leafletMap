# Leaflet 在线地图

基于 Leaflet 的轻量级在线地图网站，提供高效、便捷、多功能的地理信息服务。

## 项目简介

本项目是一个纯前端的地图展示应用，无需构建工具，无需安装依赖，开箱即用。支持多种地图图层切换、叠加层控制、标记点添加等功能。

## 功能特性

- 🗺️ **多图层支持** - 支持高德、谷歌、ArcGIS、必应、天地图等多种地图源
- 🔄 **图层切换** - 底图图层和叠加图层独立管理，可自由组合
- 📍 **标记功能** - 支持添加标记点和弹窗
- 📏 **比例尺** - 实时显示地图比例尺
- 📱 **响应式设计** - 支持桌面端和移动端
- 🚀 **零配置** - 无需构建，直接浏览器打开即可使用

## 快速开始

### 方式一：直接打开
```bash
# 双击 index.html 直接在浏览器打开
```

### 方式二：本地服务器
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080

# Node.js (需安装 http-server)
npx http-server -p 8080
```

然后访问：http://localhost:8080

## 文件结构

```
leafletMap/
├── index.html              # 主页面入口
├── AGENTS.md               # 开发指南
├── README.md               # 项目说明
├── css/
│   └── style.css           # 自定义样式
├── js/
│   ├── config.js           # 地图配置（图层、中心点、缩放等）
│   └── map.js              # 地图初始化与 API
└── lib/
    ├── leaflet/            # Leaflet 1.9.4 核心库
    └── expand/             # 扩展插件（天地图、高德等）
```

## 配置说明

### 添加新图层

编辑 `js/config.js`，在对应数组中添加配置：

**底图图层**（单选按钮）：
```javascript
{
    name: "图层名称",
    type: "图层类型",
    url: "https://tile-server/{z}/{x}/{y}.png",
    subdomains: ["1", "2", "3"],
    maxZoom: 18,
    default: false  // 设为 true 作为默认底图
}
```

**叠加图层**（复选框）：
```javascript
{
    name: "图层名称",
    type: "图层类型",
    url: "https://tile-server/{z}/{x}/{y}.png",
    subdomains: "abc",
    maxZoom: 18
}
```

### 修改地图初始视图

编辑 `js/config.js` 中的 `MapConfig`：
```javascript
const MapConfig = {
    center: [28, 113],    // 纬度，经度
    zoom: 3,              // 初始缩放级别
    minZoom: 2,           // 最小缩放
    maxZoom: 20           // 最大缩放
};
```

## MapApp API

```javascript
// 获取地图实例
const map = MapApp.getMap();

// 添加标记点
const marker = MapApp.addMarker(28.0, 113.0);

// 添加带弹窗的标记
const marker = MapApp.addMarker(28.0, 113.0);
MapApp.addPopup(marker, "<h3>标题</h3><p>内容</p>");

// 设置地图视图
MapApp.setView(28.0, 113.0, 10);

// 自适应边界
MapApp.fitBounds([[28, 113], [29, 114]]);
```

## 支持的地图源

### 底图
| 名称 | 类型 | 最大缩放 |
|------|------|----------|
| 高德矢量 | 矢量地图 | 18 |
| 高德卫星 | 卫星影像 | 18 |
| ArcGIS 卫星 | 卫星影像 | 19 |
| ArcGIS 街道 | 矢量地图 | 19 |
| 谷歌卫星 | 卫星影像 | 19 |
| 谷歌地形 | 地形图 | 19 |
| 必应航空 | 航空影像 | 18 |
| OpenStreetMap | 矢量地图 | 18 |
| 天地图矢量 | 矢量地图 | 18 |
| 天地图影像 | 卫星影像 | 18 |

### 叠加层
- 本地离线地图（需放置在 `./maps/` 目录）
- 自定义测试图层

## 本地离线地图

如需使用本地离线地图瓦片，请按以下结构放置：

```
leafletMap/
└── maps/
    └── gd/           # 高德离线
        ├── 0/        # 缩放级别
        │   └── 0/    # X 坐标
        │       └── 0.png  # Y 坐标
        ├── 1/
        └── ...
```

瓦片命名格式：`{z}/{x}/{y}.png` 或 `{z}/{y}/{x}.png`

## 注意事项

1. **URL 格式**：瓦片 URL 必须使用 `{z}/{x}/{y}` 或 `{z}/{y}/{x}` 占位符
2. **子域配置**：subdomains 需与瓦片服务器要求匹配
3. **HTTPS 建议**：外部瓦片服务优先使用 HTTPS，避免混合内容警告
4. **API 密钥**：天地图服务需要在配置中添加 API 密钥
5. **跨域问题**：本地离线地图建议使用本地服务器访问

## 浏览器支持

- Chrome / Edge (推荐)
- Firefox
- Safari
- 其他支持 ES6 的现代浏览器

## 技术栈

- [Leaflet 1.9.4](https://leafletjs.com/) - 地图核心库
- [leaflet.ChineseTmsProviders](https://github.com/Leaflet/Leaflet.ChineseTmsProviders) - 中国地图 providers 插件

## 许可证

MIT License
