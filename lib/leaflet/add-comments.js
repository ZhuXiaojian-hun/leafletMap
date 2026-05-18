const fs = require('fs');

const inputFile = 'C:\\MySoft\\MyProj\\leafletMap\\lib\\leaflet\\leaflet-src - chinese.js';
const outputFile = 'C:\\MySoft\\MyProj\\leafletMap\\lib\\leaflet\\leaflet-src - chinese-annotated.js';
const backupFile = 'C:\\MySoft\\MyProj\\leafletMap\\lib\\leaflet\\leaflet-src - chinese.js.backup';

// 备份原文件
fs.copyFileSync(inputFile, backupFile);
console.log('已备份原文件到:', backupFile);

// 读取文件
let content = fs.readFileSync(inputFile, 'utf8');
console.log('文件已读取，开始处理...');

// 注释翻译字典
const translations = {
    // Util
    'Various utility functions, used by Leaflet internally': '各种工具函数，Leaflet 内部使用',
    'Merges the properties of the `src` object (or multiple objects) into `dest` object and returns the latter': '将 src 对象的属性合并到 dest 对象并返回',
    'Compatibility polyfill for [Object.create]': 'Object.create 的兼容性 polyfill',
    'Returns a new function bound to the arguments passed': '返回绑定参数的新函数',
    'Last unique ID used by [`stamp()`]': 'stamp() 使用的最后唯一 ID',
    'Returns the unique ID of an object, assigning it one if it doesn\'t have it': '返回对象的唯一 ID，如果没有则分配一个',
    'Returns a function which executes function `fn` with the given scope `context`': '返回在指定上下文中执行 fn 的函数',
    'Returns the number `num` modulo `range`': '返回数字取模结果',
    'Returns a function which always returns `false`': '返回始终为 false 的函数',
    'Returns the number `num` rounded with specified `precision`': '返回指定精度的四舍五入数字',
    'Trims and splits the string on whitespace and returns the array of parts': '修剪并按空格分割字符串',
    'Merges the given properties to the `options` of the `obj` object': '合并属性到对象的选项',
    'Converts an object into a parameter URL string': '将对象转换为 URL 参数字符串',
    'Simple templating facility': '简单模板功能',
    'Data URI string containing a base64-encoded empty GIF image': '包含空 GIF 的 Data URI',
    'Schedules `fn` to be executed when the browser repaints': '安排函数在浏览器重绘时执行',
    'Cancels a previous `requestAnimFrame`': '取消之前的请求动画帧',
    
    // Class
    'Extends the current class given the properties to be included': '扩展当前类',
    'Returns a Javascript function that is a class constructor': '返回类构造函数',
    'Includes a mixin into the current class': '混入到当前类',
    'Merges `options` into the defaults of the class': '合并选项到类默认值',
    'Adds a constructor hook to the class': '添加构造函数钩子',
    
    // Evented
    'A set of methods shared between event-powered classes': '事件驱动类共享的方法集',
    'Adds a listener function to a particular event type': '添加事件监听器',
    'Removes a previously added listener function': '移除之前添加的监听器',
    'Fires an event of the specified type': '触发指定类型的事件',
    'Returns `true` if a particular event type has any listeners attached to it': '检查是否有事件监听器',
    'Behaves as `on`, except the listener will only get fired once and then removed': '只触发一次的监听器',
    'Adds an event parent - an `Evented` that will receive propagated events': '添加事件父对象',
    'Removes an event parent, so it will stop receiving propagated events': '移除事件父对象',
    
    // Point
    'Represents a point with `x` and `y` coordinates in pixels': '表示像素坐标点',
    'Returns a copy of the current point': '返回当前点的副本',
    'Returns the result of addition of the current and the given points': '返回两点相加结果',
    'Returns the result of subtraction of the given point from the current': '返回两点相减结果',
    'Returns the result of division of the current point by the given number': '返回点的除法结果',
    'Returns the result of multiplication of the current point by the given number': '返回点的乘法结果',
    'Returns a copy of the current point with rounded coordinates': '返回四舍五入的点',
    'Returns the cartesian distance between the current and the given points': '返回两点间距离',
    'Returns `true` if the given point has the same coordinates': '检查坐标是否相同',
    'Returns a string representation of the point for debugging purposes': '返回点的字符串表示',
    
    // Bounds
    'Represents a rectangular area in pixel coordinates': '表示像素坐标中的矩形区域',
    'Extends the bounds to contain the given point': '扩展边界以包含点',
    'Returns the center point of the bounds': '返回边界中心点',
    'Returns the bottom-left point of the bounds': '返回左下角点',
    'Returns the top-right point of the bounds': '返回右上角点',
    'Returns the size of the given bounds': '返回边界大小',
    'Returns `true` if the rectangle contains the given one': '检查是否包含',
    'Returns `true` if the rectangle intersects the given bounds': '检查是否相交',
    'Returns `true` if the rectangle overlaps the given bounds': '检查是否重叠',
    'Returns `true` if the bounds are properly initialized': '检查边界是否已初始化',
    
    // LatLng
    'Represents a geographical point with a certain latitude and longitude': '表示地理经纬度点',
    'Latitude in degrees': '纬度 (度)',
    'Longitude in degrees': '经度 (度)',
    'Altitude in meters (optional)': '海拔高度 (米，可选)',
    'Returns the distance (in meters) to the given `LatLng` calculated using the Spherical Law of Cosines': '返回到另一点的距离 (米)',
    'Returns a new `LatLng` object with the longitude wrapped so it\'s always between -180 and +180 degrees': '返回包装后的经纬度',
    
    // CRS
    'Object that defines coordinate reference systems for projecting geographical points': '定义坐标参考系统的对象',
    'Projects geographical coordinates into pixel coordinates for a given zoom': '将地理坐标投影为像素坐标',
    'The inverse of `latLngToPoint`. Projects pixel coordinates on a given zoom into geographical coordinates': 'latLngToPoint 的反函数',
    'Returns the scale used when transforming projected coordinates into pixel coordinates': '返回投影转换的比例尺',
    'The most common CRS for online maps, used by almost all free and commercial tile providers': '在线地图最常用的 CRS',
    
    // Map
    'The central class of the API — it is used to create a map on a page and manipulate it': 'API 的核心类，用于创建和操作地图',
    'Sets the view of the map (geographical center and zoom) with the given animation options': '设置地图视图 (中心和缩放)',
    'Sets the zoom of the map': '设置地图缩放级别',
    'Increases the zoom of the map by `delta`': '增加地图缩放',
    'Decreases the zoom of the map by `delta`': '减小地图缩放',
    'Sets a map view that contains the given geographical bounds with the maximum zoom level possible': '设置包含指定边界的地图视图',
    'Pans the map to a given center': '平移地图到指定中心',
    'Pans the map by a given number of pixels (animated)': '按指定像素平移地图',
    'Sets the view of the map performing a smooth pan-zoom animation': '执行平滑缩放动画',
    'Restricts the map view to the given bounds': '限制地图视图到指定边界',
    'Sets the lower limit for the available zoom levels': '设置最小缩放级别',
    'Sets the upper limit for the available zoom levels': '设置最大缩放级别',
    'Checks if the map container size changed and updates the map if so': '检查地图容器尺寸变化',
    'Tries to locate the user using the Geolocation API': '尝试使用地理定位 API 定位用户',
    'Destroys the map and clears all related event listeners': '销毁地图并清理事件监听器',
    'Returns the geographical center of the map view': '返回地图视图的地理中心',
    'Returns the current zoom level of the map view': '返回当前缩放级别',
    'Returns the geographical bounds visible in the current map view': '返回当前视图的地理边界',
    'Returns the current size of the map container (in pixels)': '返回地图容器当前大小',
    
    // DOM Util
    'Utility functions to work with the DOM tree, used by Leaflet internally': 'DOM 树操作工具函数',
    'Returns an element given its DOM id, or returns the element itself if it was passed directly': '根据 DOM id 返回元素',
    'Returns the value for a certain style attribute on an element': '返回样式属性值',
    'Creates an HTML element with `tagName`, sets its class to `className`': '创建 HTML 元素',
    'Removes `el` from its parent element': '从父元素移除元素',
    'Makes `el` the last child of its parent, so it renders in front': '将元素置于最前面',
    'Makes `el` the first child of its parent, so it renders behind': '将元素置于最后面',
    'Returns `true` if the element\'s class attribute contains `name`': '检查元素是否包含类名',
    'Adds `name` to the element\'s class attribute': '添加类名到元素',
    'Removes `name` from the element\'s class attribute': '从元素移除类名',
    'Set the opacity of an element (including old IE support)': '设置元素透明度',
    'Sets the position of `el` to coordinates specified by `position`': '设置元素位置',
    'Returns the coordinates of an element previously positioned with setPosition': '返回元素坐标',
    
    // DOM Event
    'Utility functions to work with the DOM events, used by Leaflet internally': 'DOM 事件工具函数',
    'Stop the given event from propagation to parent elements': '阻止事件冒泡',
    'Prevents the default action of the DOM Event from happening': '阻止默认事件行为',
    'Does `stopPropagation` and `preventDefault` at the same time': '同时阻止冒泡和默认行为',
    
    // Animation
    'Used internally for panning animations, utilizing CSS3 Transitions': '内部用于平移动画',
    'Run an animation of a given element to a new position': '运行元素动画',
    'Stops the animation (if currently running)': '停止动画',
    
    // Browser
    'A namespace with static properties for browser/feature detection used by Leaflet internally': '浏览器/特性检测命名空间'
};

// 处理注释
let lines = content.split('\n');
let processedCount = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 处理单行注释
    if (line.includes('//')) {
        for (const [en, zh] of Object.entries(translations)) {
            if (line.includes(en)) {
                lines[i] = line + ' // ' + zh;
                processedCount++;
                break;
            }
        }
    }
    
    // 处理块注释中的 * 行
    if (line.trim().startsWith('*') && !line.trim().startsWith('**')) {
        for (const [en, zh] of Object.entries(translations)) {
            if (line.includes(en)) {
                lines[i] = line + ' // ' + zh;
                processedCount++;
                break;
            }
        }
    }
    
    // 进度显示
    if ((i + 1) % 1000 === 0) {
        process.stdout.write(`\r处理中... ${i + 1}/${lines.length}`);
    }
}

console.log(`\r处理完成！共处理 ${processedCount} 条注释`);

// 写入文件 (使用 UTF-8 with BOM 确保中文正常显示)
const output = lines.join('\n');
fs.writeFileSync(outputFile, '\ufeff' + output, 'utf8');
console.log('输出文件:', outputFile);
