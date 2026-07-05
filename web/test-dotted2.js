const DottedMap = require('dotted-map').default;
const map = new DottedMap({ height: 100, grid: "diagonal" });
const svg = map.getSVG({ radius: 0.22, color: "#FFFFFF40", shape: "circle", backgroundColor: "transparent" });
console.log(svg.substring(0, 500));
