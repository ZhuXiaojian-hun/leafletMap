const MapConfig = {
    center: [28, 113],
    zoom: 3,
    minZoom: 2,
    maxZoom: 20,
    
    baseLayers: [
        {
            name: "高德矢量",
            type: "GaodeVector",
            url: "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
            subdomains: ["1", "2", "3", "4"],
            maxZoom: 18,
            default: true
        },
        {
            name: "高德卫星",
            type: "GaodeSatellite",
            layers: [
                {
                    url: "https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
                    subdomains: ["1", "2", "3", "4"],
                    maxZoom: 18
                },
                {
                    url: "https://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}",
                    subdomains: ["1", "2", "3", "4"],
                    maxZoom: 18,
                    isOverlay: true
                }
            ]
        },
        {
            name: "ArcGIS 卫星影像",
            type: "ArcGISSatellite",
            url: "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            subdomains: ["1", "2", "3", "4"],
            maxZoom: 19
        },
        {
            name: "ArcGIS 街道",
            type: "ArcGISStreet",
            url: "https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
            subdomains: ["1", "2", "3", "4"],
            maxZoom: 19
        },
        {
            name: "谷歌卫星图",
            type: "GoogleSatellite",
            url: "https://ggmap01.bosim.top:8880/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s={s}&scale=1&gmapgz.jpg",
            subdomains: "0123456789",
            maxZoom: 19
        },
        {
            name: "谷歌地形图",
            type: "GoogleTerrain",
            url: "https://ggmap01.bosim.top:8880/vt/lyrs=p&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s={s}&scale=1&gmapgz.png",
            subdomains: "0123456789",
            maxZoom: 19
        },
        {
            name: "必应航空图",
            type: "BingAerial",
            url: "https://t0.ssl.ak.tiles.virtualearth.net/tiles/a{x}{y}{z}.jpeg?g=14388",
            subdomains: "abc",
            maxZoom: 18
        },
        {
            name: "OpenStreetMap",
            type: "OSM",
            url: "https://tile-c.openstreetmap.fr/hot/{z}/{x}/{y}.png",
            subdomains: "abc",
            maxZoom: 18
        },
        {
            name: "天地图矢量",
            type: "TianDiTuVector",
            url: "//t{s}.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk={key}",
            subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
            maxZoom: 18,
            key: "174705aebfe31b79b3587279e211cb9a"
        },
        {
            name: "天地图影像",
            type: "TianDiTuSatellite",
            url: "//t{s}.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk={key}",
            subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
            maxZoom: 18,
            key: "174705aebfe31b79b3587279e211cb9a"
        }
    ],
    
    overlayLayers: [
        {
            name: "本地高德卫星",
            type: "LocalGaode",
            url: "./maps/gd/{z}/{x}/{y}.png",
            subdomains: "abc",
            maxZoom: 18
        },
        {
            name: "测试图层",
            type: "Test",
            url: "http://localhost:5001/maps/test/{z}/{x}/{y}.png",
            subdomains: "abc",
            maxZoom: 18
        }
    ]
};
