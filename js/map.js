(function() {
    'use strict';

    let map = null;
    const layerControl = {};
    const baseMaps = {};
    const overlayMaps = {};

    function initMap() {
        map = L.map('map', {
            center: MapConfig.center,
            zoom: MapConfig.zoom,
            minZoom: MapConfig.minZoom,
            maxZoom: MapConfig.maxZoom,
            attributionControl: MapConfig.attributionControl || false,
            zoomControl: false
        });

        L.control.zoomWithLevel({
            position: 'topleft'
        }).addTo(map);

        L.control.scale({
            position: 'bottomleft',
            metric: true,
            imperial: false,
            maxWidth: 200
        }).addTo(map);

        L.control.fullscreen({
            position: 'topleft',
            title: '全屏',
            titleCancel: '退出全屏'
        }).addTo(map);

        // 自定义定位按钮
        var LocateControl = L.Control.extend({
            options: {
                position: 'topleft'
            },
            onAdd: function(map) {
                var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                container.style.cssText = 'margin-top:10px;';
                var link = L.DomUtil.create('a', '', container);
                link.href = '#';
                link.title = '定位到我的位置';
                link.style.cssText = 'display:block;width:30px;height:30px;background:#fff;text-decoration:none;';
                link.innerHTML = '<svg viewBox="0 0 24 24" style="width:24px;height:24px;margin:3px;fill:#000;"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>';
                
                L.DomEvent.on(link, 'click', function(e) {
                    L.DomEvent.stop(e);
                    console.log('点击定位按钮，使用 IP 定位...');
                    ipLocationFallback(map);
                });
                
                L.DomEvent.disableClickPropagation(container);
                return container;
            }
        });

        map.addControl(new LocateControl());

        createLayers();

        L.control.layers(baseMaps, overlayMaps, {
            position: 'topright',
            collapsed: true
        }).addTo(map);

        var drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);

        if (L.drawLocal) {
            L.drawLocal.draw.toolbar.buttons = {
                polyline: '绘制折线',
                polygon: '绘制多边形',
                rectangle: '绘制矩形',
                circle: '绘制圆形',
                marker: '绘制标记',
                circlemarker: '绘制圆形标记'
            };
            L.drawLocal.draw.handlers.simpleshape.tooltip.error = '松开鼠标结束绘制';
            L.drawLocal.draw.handlers.polygon.tooltip.continue = '点击继续绘制';
            L.drawLocal.edit.toolbar.buttons.edit = '编辑图层';
            L.drawLocal.edit.toolbar.buttons.editDisable = '停止编辑';
            L.drawLocal.edit.toolbar.buttons.remove = '删除图层';
            L.drawLocal.edit.toolbar.buttons.save = '保存';
            L.drawLocal.edit.toolbar.buttons.cancel = '取消';
        }

        var drawControl = new L.Control.Draw({
            position: 'topright',
            draw: {
                polyline: { shapeOptions: { color: '#3b82f6', weight: 4 } },
                polygon: { shapeOptions: { color: '#10b981' } },
                rectangle: { shapeOptions: { color: '#f59e0b' } },
                circle: { shapeOptions: { color: '#ef4444' } },
                marker: true,
                circlemarker: false
            },
            edit: {
                featureGroup: drawnItems,
                remove: true
            }
        });
        map.addControl(drawControl);

        map.on(L.Draw.Event.CREATED, function(e) {
            drawnItems.addLayer(e.layer);
        });

        L.control.mousePosition({
            position: 'bottomright',
            emptyString: '移动鼠标查看坐标'
        }).addTo(map);
    }

    function createLayers() {
        MapConfig.baseLayers.forEach(function(config) {
            let layer;

            if (config.layers) {
                const layerGroup = [];
                config.layers.forEach(function(layerConfig) {
                    const singleLayer = L.tileLayer(layerConfig.url, {
                        subdomains: layerConfig.subdomains,
                        maxZoom: layerConfig.maxZoom,
                        key: layerConfig.key || ''
                    });
                    if (!layerConfig.isOverlay) {
                        layer = singleLayer;
                    }
                    layerGroup.push(singleLayer);
                });
                layer = L.layerGroup(layerGroup);
            } else {
                layer = L.tileLayer(config.url, {
                    subdomains: config.subdomains,
                    maxZoom: config.maxZoom,
                    key: config.key || ''
                });
            }

            baseMaps[config.name] = layer;

            if (config.default) {
                layer.addTo(map);
            }
        });

        MapConfig.overlayLayers.forEach(function(config) {
            const layer = L.tileLayer(config.url, {
                subdomains: config.subdomains,
                maxZoom: config.maxZoom
            });
            overlayMaps[config.name] = layer;
        });
    }

    function addMarker(lat, lng, options) {
        const marker = L.marker([lat, lng], options).addTo(map);
        return marker;
    }

    function addPopup(marker, content) {
        marker.bindPopup(content);
        return marker;
    }

    function fitBounds(bounds) {
        map.fitBounds(bounds);
    }

    function setView(lat, lng, zoom) {
        map.setView([lat, lng], zoom);
    }

    async function ipLocationFallback(mapInstance) {
        console.log('开始 IP 定位...');
        
        // 只使用可靠的 ip-api.com
        var apis = [
            { 
                url: 'http://ip-api.com/json/', 
                name: 'ip-api.com',
                parse: function(data) {
                    return {
                        lat: data.lat,
                        lng: data.lon,
                        city: data.city,
                        region: data.regionName,
                        country: data.country,
                        accuracy: 'city'
                    };
                }
            }
        ];
        
        console.log('尝试 IP 定位 API:', apis[0].name);
        
        try {
            var api = apis[0];
            var res = await fetch(api.url);
            if (!res.ok) {
                console.warn(api.name + ' API 响应失败 (' + res.status + ')');
                return;
            }
            var data = await res.json();
            var location = api.parse(data);
            
            console.log(api.name + ' 返回数据:', location);
            
            // 验证坐标有效性
            if (location.lat && location.lng && !isNaN(location.lat) && !isNaN(location.lng)) {
                // 检查是否是中国境内的坐标
                if (location.lat < 18 || location.lat > 54 || location.lng < 73 || location.lng > 135) {
                    console.warn(api.name + ' 返回的坐标不在中国境内');
                    return;
                }
                
                var zoomLevel = 12;
                mapInstance.flyTo([location.lat, location.lng], zoomLevel, { 
                    duration: 1.5 
                });
                console.log('✅ IP 定位成功:', location.city, location.lat, location.lng);
            } else {
                console.warn(api.name + ' 返回的坐标无效');
            }
        } catch (error) {
            console.log(api.name + ' API 调用失败:', error.message);
        }
    }

    window.MapApp = {
        init: initMap,
        getMap: function() { return map; },
        addMarker: addMarker,
        addPopup: addPopup,
        fitBounds: fitBounds,
        setView: setView,
        testIP: function() { ipLocationFallback(map); }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMap);
    } else {
        initMap();
    }
})();
