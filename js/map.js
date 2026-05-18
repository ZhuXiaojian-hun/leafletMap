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

        createLayers();

        L.control.layers(baseMaps, overlayMaps, {
            position: 'topright',
            collapsed: true
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

    window.MapApp = {
        init: initMap,
        getMap: function() { return map; },
        addMarker: addMarker,
        addPopup: addPopup,
        fitBounds: fitBounds,
        setView: setView
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMap);
    } else {
        initMap();
    }
})();
