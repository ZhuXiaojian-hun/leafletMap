# AGENTS.md - Leaflet Map Project

## Project Overview
Static Leaflet-based web map application. No build system, no dependencies to install.

## Quick Start
```bash
# Open directly in browser or serve via any static server
# Example: python -m http.server 8080
# Then visit: http://localhost:8080
```

## File Structure
```
leafletMap/
├── index.html          # Entry point
├── js/
│   ├── config.js       # Map layer configurations (edit here to add/change layers)
│   └── map.js          # Map initialization logic
├── css/
│   └── style.css       # Custom styles
└── lib/
    ├── leaflet/        # Leaflet 1.9.4 core library
    └── expand/         # Chinese tile providers plugin
```

## Key Commands
- **No npm/node required** - pure static files
- **No build step** - edit files and refresh browser
- **Test**: Open `index.html` in browser, verify layers load

## Adding New Layers
Edit `js/config.js`:
- Add to `baseLayers[]` for base map options (radio buttons)
- Add to `overlayLayers[]` for toggleable overlays (checkboxes)

## Map API
```javascript
MapApp.getMap()           // Get Leaflet map instance
MapApp.addMarker(lat, lng)
MapApp.setView(lat, lng, zoom)
MapApp.fitBounds(bounds)
```

## Gotchas
- Tile layer URLs must use `{z}/{x}/{y}` or `{z}/{y}/{x}` format
- Subdomains must match the tile server's requirements
- Local tile layers: use `./maps/` relative path
- External tiles: prefer HTTPS to avoid mixed-content warnings
- TianDiTu layers require API key in config

## Tile Layer Config Format
```javascript
{
    name: "Display Name",
    type: "UniqueType",
    url: "https://tile-server/{z}/{x}/{y}.png",
    subdomains: ["1", "2", "3"],  // or "abc"
    maxZoom: 18,
    key: "api-key-if-needed"
}
```
