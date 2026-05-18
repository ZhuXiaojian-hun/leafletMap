# AGENTS.md - Leaflet Map Project

## Project Overview
Pure frontend Leaflet map application. No build system, no npm/node dependencies.

## Quick Start
```bash
# Open index.html directly in browser, or serve via:
python -m http.server 8080
# Visit: http://localhost:8080
```

## Architecture
- **Entry**: `index.html` loads scripts in order: leaflet → expand → config → map
- **Config**: `js/config.js` - MapConfig object with layers array
- **Logic**: `js/map.js` - IIFE, auto-initializes on DOMContentLoaded, exposes `MapApp` API
- **No state management** - all config is static in config.js

## Key Commands
- No build/lint/test commands - edit files and refresh browser
- Verify: Open browser, check layers load, switch between base maps

## Adding Layers (Critical)

**Simple base layer:**
```javascript
{ name: "Name", type: "UniqueType", url: "...", subdomains: ["1","2"], maxZoom: 18 }
```

**Composite layer (e.g., satellite + annotation):**
```javascript
{
    name: "高德卫星",
    layers: [
        { url: "...", isOverlay: false },  // Main layer
        { url: "...", isOverlay: true }    // Overlay layer
    ]
}
```

**Set default base map:** Add `default: true` to one baseLayer config

**Overlay layers:** Add to `overlayLayers[]` array (checkboxes in UI)

## MapApp API
```javascript
MapApp.getMap()                  // Returns Leaflet map instance
MapApp.addMarker(lat, lng, opts) // Returns marker
MapApp.addPopup(marker, content) // Binds popup to marker
MapApp.setView(lat, lng, zoom)
MapApp.fitBounds([[lat,lng],[lat,lng]])
```

## Gotchas
- Tile URLs: `{z}/{x}/{y}` or `{z}/{y}/{x}` - must match server format
- Subdomains: Array `["1","2"]` or string `"abc"` - must match tile server
- Local tiles: Use `./maps/` relative path
- External tiles: Use HTTPS to avoid mixed-content warnings
- TianDiTu: Requires `key` field in config (currently: `174705aebfe31b79b3587279e211cb9a`)
- **Do not use npm/node** - this is a static site

## File Boundaries
- `js/config.js` - Edit here for layer changes
- `js/map.js` - Edit here for logic/API changes
- `css/style.css` - Custom styles only
- `lib/` - Third-party libraries (do not modify)

## 优先使用官网在线插件实现功能需求

- leaflet 插件地址：[Plugins - Leaflet - 一个交互式地图 JavaScript 库](https://leafletjs.cn/plugins.html)
- 
