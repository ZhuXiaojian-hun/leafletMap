// ============================================================================
// Leaflet 自定义缩放控件 - 带层级显示
// 功能：在地图左上角显示垂直排列的缩放控件，中间集成当前缩放级别数字
// 结构：[放大按钮 +] / [层级数字] / [缩小按钮 -]
// ============================================================================

// 定义 ZoomWithLevel 控件类
// 继承自 Leaflet 的 L.Control 基类
L.Control.ZoomWithLevel = L.Control.extend({
    // 控件默认配置选项
    options: {
        // 控件位置：左上角（可选：topleft, topright, bottomleft, bottomright）
        position: 'topleft',
        // 放大按钮显示的符号：使用全角加号（更美观）
        zoomInText: '＋',
        // 缩小按钮显示的符号：使用 Unicode 减号（更美观）
        zoomOutText: '−',
        // 放大按钮的提示文字（鼠标悬停时显示）
        zoomInTitle: '放大',
        // 缩小按钮的提示文字（鼠标悬停时显示）
        zoomOutTitle: '缩小'
    },

    // 控件添加到地图时调用的方法
    // 参数 map: Leaflet 地图实例
    onAdd: function (map) {
        // 定义控件容器的 CSS 类名
        // leaflet-bar: Leaflet 工具栏基础样式
        // leaflet-control-zoom-with-level: 自定义缩放控件样式
        var className = 'leaflet-bar leaflet-control-zoom-with-level',
            // 创建控件容器 div 元素，并保存到 this._container
            container = this._container = L.DomUtil.create('div', className);

        // 创建放大按钮
        // 参数 1: 按钮显示的文本（来自配置）
        // 参数 2: 按钮标题/提示文字（来自配置）
        // 参数 3: CSS 类名（追加 '-in' 后缀）
        // 参数 4: 父容器
        // 参数 5: 点击事件处理函数
        this._zoomInButton = this._createButton(this.options.zoomInText, this.options.zoomInTitle, className + '-in', container, this._zoomIn);
        
        // 创建缩放级别显示区域（位于放大和缩小按钮中间）
        // 类名追加 '-level' 后缀
        this._zoomLevel = L.DomUtil.create('div', className + '-level', container);
        
        // 创建缩小按钮
        // 类名追加 '-out' 后缀
        this._zoomOutButton = this._createButton(this.options.zoomOutText, this.options.zoomOutTitle, className + '-out', container, this._zoomOut);

        // 初始化显示当前地图的缩放级别
        this._updateLevel(map.getZoom());

        // 监听地图的 zoomend 事件（缩放结束时触发）
        map.on('zoomend', function() {
            // 当地图缩放级别改变时，更新显示的层级数字
            this._updateLevel(map.getZoom());
        }, this);

        // 返回控件容器，Leaflet 会将其添加到地图中
        return container;
    },

    // 创建按钮的辅助方法
    // 参数 html: 按钮显示的 HTML 内容（如 '+' 或 '-'）
    // 参数 title: 按钮的 title 属性（鼠标悬停提示）
    // 参数 className: 按钮的 CSS 类名
    // 参数 container: 父容器元素
    // 参数 fn: 点击事件处理函数
    _createButton: function (html, title, className, container, fn) {
        // 创建 <a> 链接元素作为按钮
        var link = L.DomUtil.create('a', className, container);
        // 设置按钮显示的文本内容
        link.innerHTML = html;
        // 设置链接地址为 '#'（防止页面跳转）
        link.href = '#';
        // 设置按钮的 title 属性（鼠标悬停提示）
        link.title = title;

        // 绑定 DOM 事件
        L.DomEvent
            // 阻止事件冒泡：mousedown 和 dblclick 事件不向上传播
            .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
            // 阻止默认行为：click 事件不触发默认链接跳转
            .on(link, 'click', L.DomEvent.stop)
            // 绑定点击事件处理函数（执行缩放操作）
            .on(link, 'click', fn, this)
            // 点击后将焦点重新设置到地图上（方便键盘操作）
            .on(link, 'click', this._refocusOnMap, this);

        // 返回创建的按钮元素
        return link;
    },

    // 放大操作的处理函数
    // 参数 e: 事件对象
    _zoomIn: function (e) {
        // 调用地图的 zoomIn 方法
        // 如果按住 Shift 键，一次放大 3 级；否则放大 1 级
        this._map.zoomIn(e.shiftKey ? 3 : 1);
    },

    // 缩小操作的处理函数
    // 参数 e: 事件对象
    _zoomOut: function (e) {
        // 调用地图的 zoomOut 方法
        // 如果按住 Shift 键，一次缩小 3 级；否则缩小 1 级
        this._map.zoomOut(e.shiftKey ? 3 : 1);
    },

    // 更新缩放级别显示的方法
    // 参数 zoom: 当前缩放级别（数字）
    _updateLevel: function(zoom) {
        // 更新层级显示区域的 HTML 内容为当前缩放级别
        this._zoomLevel.innerHTML = zoom;
    },

    // 将焦点重新设置到地图的方法
    // 参数 e: 事件对象
    _refocusOnMap: function(e) {
        // 如果地图实例存在，且事件目标不在地图容器内
        if (this._map && !this._map._container.contains(e.target)) {
            // 将焦点设置到地图容器（方便后续键盘操作）
            this._map.getContainer().focus();
        }
    }
});

// ============================================================================
// 工厂方法：创建 ZoomWithLevel 控件
// 用法：L.control.zoomWithLevel({ position: 'topleft' })
// ============================================================================
L.control.zoomWithLevel = function (options) {
    // 返回新的 ZoomWithLevel 控件实例
    // options 会覆盖默认配置
    return new L.Control.ZoomWithLevel(options);
};
