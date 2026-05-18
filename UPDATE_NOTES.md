# Leaflet 地图 - 更新说明

## ✅ 已完成的更新

### 1. 全屏按钮样式修复
- 修改了 CSS 选择器，兼容不同的类名
- 使用 `display: block` 和 `text-align: center` 确保图标居中
- 图标尺寸：24x24px，在 30x30px 按钮内居中
- 触摸设备适配：36x36px 按钮，28x28px 图标

### 2. IP 定位优化
- **启动时自动 IP 定位**：地图加载后自动定位到城市级别
- **定位按钮备用**：点击定位按钮时，如果原生定位失败，也会触发 IP 定位
- **城市级别精度**：缩放级别固定为 12，显示整个城市范围
- **3 个备用 API**：
  1. ipapi.co（优先）
  2. ipwho.is
  3. ip-api.com

### 3. 文件结构
```
lib/expand/
├── leaflet.fullscreen.css     ✅ 已修复
├── leaflet.fullscreen.js      ✅ 正常
├── leaflet.locate.css         ✅ 正常
├── leaflet.locate.js          ✅ 正常
├── leaflet.mouseposition.css  ✅ 正常
├── leaflet.mouseposition.js   ✅ 正常
├── leaflet.draw.css           ✅ 正常
├── leaflet.draw.js            ✅ 正常
└── images/
    ├── spritesheet.png        ✅ 已复制
    ├── spritesheet-2x.png     ✅ 已复制
    └── spritesheet.svg        ✅ 已复制
```

## 📋 测试步骤

### 方法 1：直接打开（推荐）
直接在浏览器中打开 `index.html` 文件：
```
file:///C:/MySoft/MyProj/leafletMap/index.html
```

### 方法 2：使用 HTTP 服务器
```bash
cd C:\MySoft\MyProj\leafletMap
python -m http.server 8080
# 访问：http://localhost:8080
```

## 🔍 验证清单

### 1. 全屏按钮
- [ ] 按钮显示白色背景
- [ ] 图标显示为四个角的箭头（展开图标）
- [ ] 点击后地图进入全屏
- [ ] 全屏后图标变为收缩图标
- [ ] 再次点击退出全屏

**如果图标不显示**：
- 打开浏览器开发者工具（F12）
- 查看 Console 是否有 CSS 加载错误
- 检查 `.fullscreen-icon` 元素是否有 `background-image` 样式

### 2. 定位功能
- [ ] 地图加载后自动定位到当前城市（通过 IP）
- [ ] 打开浏览器控制台（F12）查看定位日志
- [ ] 点击定位按钮，如果原生定位失败，会自动 IP 定位

**预期日志输出**：
```
开始 IP 定位...
尝试 IP 定位 API: ipapi.co
ipapi.co 返回数据：{lat: 28.2, lng: 112.9, city: "Changsha", ...}
IP 定位成功：ipapi.co Changsha 28.2 112.9
```

**定位精度**：
- 城市级别：缩放级别 12
- 长沙坐标：约 28.2°N, 112.9°E
- 北京坐标：约 39.9°N, 116.4°E

### 3. 绘制控件
- [ ] 右上角显示绘制工具栏
- [ ] 所有图标正常显示（折线、多边形、矩形、圆形、标记）
- [ ] 可以绘制各种图形
- [ ] 可以编辑和删除绘制的图形

### 4. 坐标显示
- [ ] 右下角实时显示：层级 X | 纬度 XX.XXXXX | 经度 XXX.XXXXX
- [ ] 移动鼠标时坐标实时更新

## 🐛 故障排查

### 全屏按钮没有图标
1. **检查 CSS 加载**：
   - F12 → Network → 筛选 CSS
   - 确认 `leaflet.fullscreen.css` 加载成功（状态 200）

2. **检查 CSS 选择器**：
   - F12 → Elements → 全屏按钮
   - 查看元素是否有 `fullscreen-icon` 类
   - 检查 computed 样式中的 `background-image`

3. **手动修复**：
   如果图标还是不显示，可以在 `index.html` 中添加内联样式：
   ```html
   <style>
   .leaflet-control-fullscreen .fullscreen-icon {
       background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z'/%3E%3C/svg%3E") !important;
   }
   </style>
   ```

### 定位不准确
1. **清除浏览器缓存**：Ctrl+F5 强制刷新
2. **查看控制台日志**：确认是哪个 API 返回了错误位置
3. **IP 定位限制**：只能定位到城市级别，无法精确定位到街道

### CORS 错误
如果直接在浏览器打开 `index.html` 遇到 CORS 错误：
- 这是正常的浏览器安全策略
- IP 定位 API 都已验证支持 CORS
- 如果仍有问题，建议使用 HTTP 服务器

## 📝 注意事项

1. **HTTPS 要求**：
   - 原生定位功能需要 HTTPS 或 localhost
   - IP 定位不受此限制，file:// 协议也可用

2. **IP 定位精度**：
   - 只能定位到城市级别
   - 坐标通常是城市中心点
   - 无法替代 GPS 精确定位

3. **浏览器兼容性**：
   - 全屏功能：现代浏览器都支持
   - 定位功能：需要浏览器支持 Geolocation API
   - 绘制功能：需要浏览器支持 SVG

4. **离线使用**：
   - 所有插件文件已本地化
   - 底图图层需要网络（高德、谷歌等在线地图）
   - IP 定位需要网络

## 🎯 下一步建议

1. **添加本地图层**：
   - 将瓦片地图下载到 `maps/` 目录
   - 在 `config.js` 中添加本地图层配置

2. **保存绘制要素**：
   - 当前绘制的要素刷新页面后消失
   - 可以添加导出为 GeoJSON 功能

3. **自定义底图**：
   - 添加更多离线地图源
   - 配置天地图等免费地图服务

---

**更新时间**：2026-05-18
**版本**：v1.1.0
