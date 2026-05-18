# 修复说明 - 2026-05-18

## 🐛 修复的问题

### 1. 定位重复问题
**问题描述**：地图先定位到正确位置（长沙），然后又定位到北京。

**原因**：
- 原生定位成功后，`setView: 'always'` 选项会导致地图持续跟踪位置
- 没有标志位阻止重复定位

**解决方案**：
1. 添加全局标志 `hasLocated` 防止重复定位
2. 原生定位成功后设置 `hasLocated = true`
3. IP 定位前检查 `hasLocated`，已定位则跳过
4. 原生定位失败时才触发 IP 定位

**修改文件**：`js/map.js`
```javascript
let hasLocated = false;  // 新增全局标志

// 原生定位成功
onLocationFound: function(e) {
    console.log('原生定位成功:', e.latitude, e.longitude, '精度:', e.accuracy);
    hasLocated = true;  // 标记已定位
}

// 原生定位失败
onLocationError: function(err, control) {
    console.warn('原生定位失败:', err.message);
    if (!hasLocated) {  // 仅在未定位时使用 IP 定位
        ipLocationFallback(map);
    }
}

// IP 定位函数开头
async function ipLocationFallback(mapInstance) {
    if (hasLocated) {
        console.log('已经定位过，跳过 IP 定位');
        return;
    }
    // ... 定位逻辑
    hasLocated = true;  // 定位成功后标记
}
```

### 2. 全屏按钮图标不显示
**问题描述**：全屏按钮只显示白色背景，没有图标。

**原因**：
- leaflet.fullscreen.js 是 minified 版本，生成的 HTML 结构与预期不同
- CSS 选择器可能不匹配实际生成的元素

**解决方案**：
在 `index.html` 中添加内联样式（优先级最高）：

```html
<style>
.leaflet-control-fullscreen a {
    background-color: #fff;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
}
.leaflet-control-fullscreen .fullscreen-icon {
    background-image: url("data:image/svg+xml,...") !important;
    background-size: 24px 24px !important;
    /* ... 其他样式 ... */
}
.leaflet-control-fullscreen .fullscreen-icon.leaflet-fullscreen-on {
    background-image: url("data:image/svg+xml,...") !important;
}
</style>
```

**修改文件**：`index.html`、`lib/expand/leaflet.fullscreen.css`

## ✅ 修复后的效果

### 定位功能
1. **首次加载**：
   - 尝试原生定位（需要浏览器权限）
   - 如果原生定位失败，自动 IP 定位到城市级别
   - 定位成功后不再重复定位

2. **点击定位按钮**：
   - 如果已定位过，只触发原生定位
   - 如果原生定位失败，才触发 IP 定位

3. **预期日志**：
```
开始 IP 定位...
尝试 IP 定位 API: ipapi.co
ipapi.co 返回数据：{lat: 28.2, lng: 112.9, city: "Changsha", ...}
IP 定位成功：ipapi.co Changsha 28.2 112.9
```

### 全屏按钮
1. **正常状态**：
   - 白色背景（30x30px）
   - 黑色展开图标（24x24px，四个角对齐）
   - 图标居中显示

2. **全屏状态**：
   - 图标变为收缩图标
   - 再次点击退出全屏

3. **触摸设备**：
   - 按钮尺寸 36x36px
   - 图标尺寸 28x28px

## 📋 测试步骤

### 1. 清除缓存
在浏览器中按 `Ctrl + F5` 强制刷新，清除旧缓存。

### 2. 打开开发者工具
按 `F12` 打开控制台，查看日志输出。

### 3. 验证定位
**预期看到**：
```
开始 IP 定位...
尝试 IP 定位 API: ipapi.co
IP 定位成功：ipapi.co Changsha 28.2 112.9
```

**地图应该**：
- 自动定位到长沙（或你所在的城市）
- 缩放级别 12（城市级别）
- 不会再次跳到其他位置

### 4. 验证全屏按钮
**检查项**：
- [ ] 按钮有白色背景
- [ ] 显示黑色展开图标（四个角）
- [ ] 点击后进入全屏
- [ ] 全屏后图标变为收缩图标
- [ ] 再次点击退出全屏

**如果图标仍不显示**：
1. F12 → Elements → 检查全屏按钮元素
2. 查看 Computed 样式中的 `background-image`
3. 确认 CSS 是否加载成功

### 5. 验证定位按钮
**测试场景**：
1. **允许定位权限**：
   - 应该定位到当前位置
   - 控制台显示：`原生定位成功：28.2 112.9 精度：100`

2. **拒绝定位权限**：
   - 应该触发 IP 定位
   - 控制台显示：`原生定位失败：...`
   - 然后：`IP 定位成功：...`

## 🔍 故障排查

### 定位还是跳到北京
1. **检查控制台日志**：
   - 确认 `hasLocated` 标志是否生效
   - 查看是否有多个 API 同时返回结果

2. **手动测试**：
   ```javascript
   // 在控制台执行
   console.log('hasLocated:', hasLocated);
   ```

3. **如果还是重复**：
   - 可能是浏览器缓存问题
   - 清除浏览器缓存（Ctrl+Shift+Delete）
   - 或使用隐私模式测试

### 全屏图标不显示
1. **检查 CSS 加载**：
   - F12 → Network → 筛选 CSS
   - 确认 `leaflet.fullscreen.css` 状态 200

2. **手动添加样式**：
   在控制台执行：
   ```javascript
   document.querySelector('.leaflet-control-fullscreen .fullscreen-icon').style.backgroundImage = 
   'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%23000\' d=\'M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z\'/%3E%3C/svg%3E")';
   ```

3. **如果手动添加后显示**：
   - 说明 CSS 选择器有问题
   - 检查内联样式是否正确添加

### CORS 错误
如果看到 CORS 错误：
```
Access to fetch at 'https://ipapi.co/json/' from origin 'null' has been blocked by CORS policy
```

**解决方案**：
1. 使用 HTTP 服务器而不是直接打开文件：
   ```bash
   cd C:\MySoft\MyProj\leafletMap
   python -m http.server 8080
   ```
2. 访问：`http://localhost:8080`

## 📝 技术说明

### IP 定位 API 优先级
1. **ipapi.co** - 数据准确，1000 次/天免费
2. **ipwho.is** - 60 次/分钟，无需 API 密钥
3. **ip-api.com** - 45 次/分钟，免费非商用

### 定位精度
- **原生定位**：50-100 米（WiFi），10-20 米（GPS）
- **IP 定位**：城市级别（缩放级别 12）

### 全屏实现
- 使用浏览器原生 Fullscreen API
- 降级支持：伪全屏模式（position: fixed）
- 图标：内联 SVG data URI，无需外部文件

---

**修复时间**：2026-05-18
**修复版本**：v1.1.1
