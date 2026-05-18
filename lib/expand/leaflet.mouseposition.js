/**
 * L.Control.MousePosition 鼠标坐标显示控件
 * 扩展功能：同时显示当前地图缩放层级、纬度、经度
 * 显示格式：层级 5 | 纬度 35.86170 | 经度 104.19540
 */
L.Control.MousePosition = L.Control.extend({
    options: {
        position: 'bottomright',          // 控件位置
        separator: ' | ',                 // 分隔符
        emptyString: '移动鼠标查看坐标',   // 默认提示文字
        lngFirst: false,                  // 是否经度在前
        numDigits: 5,                     // 坐标小数位数
        lngFormatter: void 0,             // 经度格式化函数
        latFormatter: void 0,             // 纬度格式化函数
        prefix: '',                       // 前缀文字
        zoomLabel: '层级',                // 层级标签文字
        latLabel: '纬度',                 // 纬度标签文字
        lngLabel: '经度'                  // 经度标签文字
    },

    onAdd: function(map) {
        // 创建容器元素
        this._container = L.DomUtil.create('div', 'leaflet-control-mouseposition');
        // 阻止点击事件冒泡
        L.DomEvent.disableClickPropagation(this._container);

        // 初始化当前层级和坐标
        this._currentZoom = map.getZoom();
        this._currentLat = null;
        this._currentLng = null;

        // 监听鼠标移动事件
        map.on('mousemove', this._onMouseMove, this);
        // 监听缩放事件，实时更新层级
        map.on('zoomend', this._onZoomChange, this);

        // 初始化显示
        this._updateDisplay();

        return this._container;
    },

    onRemove: function(map) {
        // 移除事件监听
        map.off('mousemove', this._onMouseMove, this);
        map.off('zoomend', this._onZoomChange, this);
    },

    // 鼠标移动事件处理
    _onMouseMove: function(e) {
        // 保存当前坐标
        this._currentLat = e.latlng.lat;
        this._currentLng = e.latlng.lng;
        // 更新显示
        this._updateDisplay();
    },

    // 缩放变化事件处理
    _onZoomChange: function(e) {
        // 更新当前层级
        this._currentZoom = e.target.getZoom();
        // 立即更新显示（不等待鼠标移动）
        this._updateDisplay();
    },

    // 统一更新显示内容
    _updateDisplay: function() {
        var zoomText = this.options.zoomLabel + ' ' + this._currentZoom;

        // 如果还没有坐标数据，只显示层级
        if (this._currentLat === null || this._currentLng === null) {
            this._container.innerHTML = this.options.prefix + ' ' + zoomText + this.options.separator + this.options.emptyString;
            return;
        }

        // 格式化经度
        var lng = this.options.lngFormatter
            ? this.options.lngFormatter(this._currentLng)
            : L.Util.formatNum(this._currentLng, this.options.numDigits);
        // 格式化纬度
        var lat = this.options.latFormatter
            ? this.options.latFormatter(this._currentLat)
            : L.Util.formatNum(this._currentLat, this.options.numDigits);

        // 组合显示文字：层级 | 纬度 | 经度
        var text = zoomText
            + this.options.separator
            + this.options.latLabel + ' ' + lat
            + this.options.separator
            + this.options.lngLabel + ' ' + lng;

        // 添加前缀
        this._container.innerHTML = this.options.prefix + ' ' + text;
    }
});

// 地图初始化选项
L.Map.mergeOptions({
    positionControl: false
});

// 地图初始化钩子
L.Map.addInitHook(function() {
    if (this.options.positionControl) {
        this.positionControl = new L.Control.MousePosition();
        this.addControl(this.positionControl);
    }
});

// 工厂函数
L.control.mousePosition = function(options) {
    return new L.Control.MousePosition(options);
};
