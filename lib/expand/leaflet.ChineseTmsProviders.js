// ============================================================================
// Leaflet 中国地图 Providers 插件
// 来源：https://github.com/htoooth/Leaflet.ChineseTmsProviders
// 功能：提供中国主流地图服务的瓦片图层配置（天地图、高德、谷歌、百度、腾讯等）
// ============================================================================

// 引入百度坐标系定义（来自开源项目）
// this L.CRS.Baidu from https://github.com/muyao1987/leaflet-tileLayer-baidugaode/blob/master/src/tileLayer.baidu.js

// 如果已加载 L.Proj 投影库，则定义百度坐标系
if (L.Proj) {
    // 定义百度使用的 EPSG:900913 投影坐标系
    // 使用墨卡托投影，但采用了不同的椭球体参数
    L.CRS.Baidu = new L.Proj.CRS('EPSG:900913', '+proj=merc +a=6378206 +b=6356584.314245179 +lat_ts=0.0 +lon_0=0.0 +x_0=0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs', {
        // 定义各级缩放级别的分辨率（从 0 级到 18 级）
        resolutions: function () {
            // 定义最大缩放级别为 19 级
            var level = 19
            // 创建分辨率数组
            var res = [];
            // 0 级分辨率：2 的 18 次方（约 262144）
            res[0] = Math.pow(2, 18);
            // 循环计算 1-18 级的分辨率，每级减半
            for (var i = 1; i < level; i++) {
                res[i] = Math.pow(2, (18 - i))
            }
            // 返回分辨率数组
            return res;
        }(),
        // 定义瓦片原点坐标为 [0, 0]
        origin: [0, 0],
        // 定义坐标系边界范围（墨卡托坐标）
        bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
    });
}

// ============================================================================
// 定义中国地图瓦片图层类
// 继承自 Leaflet 的 TileLayer 基类
// ============================================================================
L.TileLayer.ChinaProvider = L.TileLayer.extend({

    // 构造函数：初始化图层
    // 参数 type: 图层类型字符串，格式为 "提供商。地图类型。图层类型"（如 "TianDiTu.Normal.Map"）
    // 参数 options: 配置选项对象
    initialize: function(type, options) { // (type, Object)
        // 获取所有地图提供商配置
        var providers = L.TileLayer.ChinaProvider.providers;

        // 初始化选项对象，如果未传入则使用空对象
        options = options || {}

        // 将类型字符串按点号分割为数组
        var parts = type.split('.');

        // 提取第一部分：提供商名称（如 "TianDiTu"、"GaoDe"）
        var providerName = parts[0];
        // 提取第二部分：地图类型（如 "Normal"普通图、"Satellite"卫星图、"Terrain"地形图）
        var mapName = parts[1];
        // 提取第三部分：图层类型（如 "Map"底图、"Annotion"注记层）
        var mapType = parts[2];

        // 根据类型从配置中获取对应的瓦片 URL 模板
        var url = providers[providerName][mapName][mapType];
        // 设置子域名配置（用于多服务器负载均衡）
        options.subdomains = providers[providerName].Subdomains;
        // 设置 API 密钥（如天地图需要 tk 参数），优先使用传入的 key，否则使用配置的默认值
        options.key = options.key || providers[providerName].key;

        // 如果该提供商配置了 tms 选项（瓦片翻转，用于符合 TMS 规范）
        if ('tms' in providers[providerName]) {
            // 将 tms 配置复制到 options 中
            options.tms = providers[providerName]['tms']
        }

        // 调用父类 TileLayer 的初始化方法，传入 URL 和选项
        L.TileLayer.prototype.initialize.call(this, url, options);
    },

    // 重写获取瓦片 URL 的方法
    // 参数 coords: 瓦片坐标对象，包含 x、y、z（缩放级别）属性
    getTileUrl: function (coords) {
        // 创建数据对象，用于 URL 模板替换
        var data = {
            // s: 子域名（用于多服务器负载均衡）
            s: this._getSubdomain(coords),
            // x: 瓦片 X 坐标
            x: coords.x,
            // y: 瓦片 Y 坐标
            y: coords.y,
            // z: 当前缩放级别
            z: this._getZoomForUrl(),
        };
        // 如果地图已加载且不是无限坐标系（即普通地图）
        if (this._map && !this._map.options.crs.infinite) {
            // 计算翻转后的 Y 坐标（Leaflet 使用左上角原点，TMS 使用左下角原点）
            var invertedY = this._globalTileRange.max.y - coords.y;
            // 如果启用了 TMS 模式
            if (this.options.tms) {
                // 使用翻转后的 Y 坐标
                data['y'] = invertedY;
            }
            // 添加-y 参数（某些地图服务需要）
            data['-y'] = invertedY;
        }

        // 计算百度地图特有的切片索引（16 进制分块）
        // 右移 4 位相当于除以 16，用于百度地图的瓦片分块策略
        data.sx = data.x >> 4
        // 计算 Y 方向的切片索引：(2 的 z 次方 - y) 右移 4 位
        data.sy = (( 1 << data.z) - data.y) >> 4

        // 使用模板引擎替换 URL 中的占位符，返回最终瓦片 URL
        // L.Util.template 会将 {x}、{y}、{z}、{s} 等替换为实际值
        return L.Util.template(this._url, L.Util.extend(data, this.options));
    },
});

// ============================================================================
// 定义中国地图提供商配置
// 包含各大地图服务商的瓦片 URL 模板和配置参数
// ============================================================================
L.TileLayer.ChinaProvider.providers = {
    // =========================================================================
    // 天地图（国家地理信息公共服务平台）
    // 需要 API 密钥（tk 参数），支持矢量、影像、地形三种底图
    // =========================================================================
    TianDiTu: {
        // 普通地图（矢量底图）
        Normal: {
            // 矢量底图 URL：vec 表示矢量，w 表示 Web 墨卡托投影
            Map: "//t{s}.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk={key}",
            // 矢量注记 URL：cva 表示中文矢量注记
            Annotion: "//t{s}.tianditu.gov.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk={key}"
        },
        // 卫星影像图
        Satellite: {
            // 影像底图 URL：img 表示影像
            Map: "//t{s}.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk={key}",
            // 影像注记 URL：cia 表示中文影像注记
            Annotion: "//t{s}.tianditu.gov.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk={key}"
        },
        // 地形图
        Terrain: {
            // 地形底图 URL：ter 表示地形
            Map: "//t{s}.tianditu.gov.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk={key}",
            // 地形注记 URL：cta 表示中文地形注记
            Annotion: "//t{s}.tianditu.gov.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}&tk={key}"
        },
        // 子域名列表：0-7 共 8 个服务器，用于负载均衡
        Subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        // 天地图 API 密钥（注意：生产环境应申请自己的密钥）
        key: "174705aebfe31b79b3587279e211cb9a"
    },

    // =========================================================================
    // 高德地图
    // 支持普通矢量图和卫星影像（含注记）
    // =========================================================================
    GaoDe: {
        // 普通地图（矢量底图）
        Normal: {
            // 矢量底图 URL：webrd 表示 Web 渲染，支持语言、尺寸、缩放比例、样式等参数
            Map: '//webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
        },
        // 卫星影像图
        Satellite: {
            // 影像底图 URL：style=6 表示卫星图样式
            Map: '//webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
            // 影像注记 URL：style=8 表示注记样式
            Annotion: '//webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'
        },
        // 子域名列表：1-4 共 4 个服务器
        Subdomains: ["1", "2", "3", "4"]
    },

    // =========================================================================
    // 谷歌地图（中国区）
    // 支持普通地图和卫星影像（含注记）
    // =========================================================================
    Google: {
        // 普通地图
        Normal: {
            // 矢量底图 URL：lyrs=m 表示 roadmap（道路图），@189 表示版本
            Map: "//www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
        },
        // 卫星影像图
        Satellite: {
            // 影像底图 URL：lyrs=s 表示 satellite（纯卫星图）
            Map: "//www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}",
            // 混合图 URL：lyrs=y 表示 hybrid（卫星图 + 注记）
            Annotion: "//www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}"
        },
        // 子域名：谷歌不使用子域名
        Subdomains: []
    },

    // =========================================================================
    // Geoq 地图（国家基础地理信息中心）
    // 支持多种主题地图
    // =========================================================================
    Geoq: {
        // 普通地图系列
        Normal: {
            // 社区地图：ChinaOnlineCommunity
            Map: "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
            // 蓝紫色风格街道图
            PurplishBlue: "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
            // 灰色风格街道图
            Gray: "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}",
            // 暖色风格街道图
            Warm: "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}",
        },
        // 专题地图系列
        Theme: {
            // 世界水系图：Hydro 表示水文
            Hydro: "//thematic.geoq.cn/arcgis/rest/services/ThematicMaps/WorldHydroMap/MapServer/tile/{z}/{y}/{x}"
        },
        // 子域名：Geoq 不使用子域名
        Subdomains: []
    },

    // =========================================================================
    // OpenStreetMap（OSM）
    // 全球开源地图项目
    // =========================================================================
    OSM: {
        // 普通地图
        Normal: {
            // 标准 OSM 瓦片 URL
            Map: "//{s}.tile.osm.org/{z}/{x}/{y}.png",
        },
        // 子域名列表：a、b、c 共 3 个服务器
        Subdomains: ['a', 'b', 'c']
    },

    // =========================================================================
    // 百度地图
    // 使用独特的 BD-09 坐标系和 TMS 规范
    // =========================================================================
    Baidu: {
        // 普通地图
        Normal: {
            // 矢量底图 URL：pl 表示普通标签，scaler=1 表示缩放比例
            Map: '//online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1'
        },
        // 卫星影像图
        Satellite: {
            // 影像底图 URL：type=sate 表示卫星图，fm=46 表示格式
            Map: '//shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46',
            // 影像注记 URL：sl 表示卫星标签
            Annotion: '//online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=sl&v=020'
        },
        // 子域名：0-9 共 10 个服务器（使用字符串形式）
        Subdomains: '0123456789',
        // 启用 TMS 模式：百度使用 TMS 规范（Y 轴翻转）
        tms: true
    },

    // =========================================================================
    // 腾讯地图（SOSO 地图）
    // 支持矢量、卫星、地形三种底图
    // =========================================================================
    Tencent: {
        // 普通地图（矢量底图）
        Normal: {
            // 矢量瓦片 URL：type=vector，styleid=3 表示样式 ID，注意使用{-y}翻转 Y 坐标
            Map: "//rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={-y}&type=vector&styleid=3",
        },
        // 卫星影像图
        Satellite: {
            // 影像瓦片 URL：使用 sx/sy 进行 16 进制分块，{-y}翻转 Y 坐标
            Map: "//p{s}.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{-y}.jpg",
        },
        // 地形图
        Terrain: {
            // 地形瓦片 URL：demTiles 表示数字高程模型
            Map: "//p{s}.map.gtimg.com/demTiles/{z}/{sx}/{sy}/{x}_{-y}.jpg"
        },
        // 子域名：0-3 共 4 个服务器
        Subdomains: '0123',
    }

};

// ============================================================================
// 工厂方法：创建中国地图瓦片图层
// 用法：L.tileLayer.chinaProvider('TianDiTu.Normal.Map', options)
// ============================================================================
L.tileLayer.chinaProvider = function(type, options) {
    // 返回新的 ChinaProvider 图层实例
    return new L.TileLayer.ChinaProvider(type, options);
};
