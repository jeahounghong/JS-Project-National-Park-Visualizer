/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("// const ParksAPI = require('./parksAPI');\n const US_MAP = __webpack_require__(/*! ./us_map */ \"./src/us_map.js\")\n// let api_data = ParksAPI.data();\n\n\nlet parks;\n// fetch('https://developer.nps.gov/api/v1/parks?limit=467&api_key=P3sQ0KIWhYmCMsDJp5VDzLSAAOvDY0X7psUzGTMN')\n\ndocument.addEventListener(\"DOMContentLoaded\", () => {\n    fetch('https://developer.nps.gov/api/v1/parks?limit=467&api_key=P3sQ0KIWhYmCMsDJp5VDzLSAAOvDY0X7psUzGTMN')\n        .then(res => res.json())\n        .then(res => parks = res.data)\n        .then(populateMap)\n        // .then(() => parks = data.data)\n        // .then(() => console.log(parks))\n})\n\nfunction populateMap(){\n    US_MAP.generateMap(parks);\n    console.log(parks)\n    console.log(Object.keys(parks));\n}\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/us_map.js":
/*!***********************!*\
  !*** ./src/us_map.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"generateMap\": () => (/* binding */ generateMap)\n/* harmony export */ });\n// document.addEventListener(\"DOMContentLoaded\", () => {\nfunction generateMap(parks){\n    var margin = {\n        top: 10,\n        bottom: 10,\n        left: 10,\n        right:10\n    }, width = parseInt(d3.select('.viz').style('width'))\n        , width = width - margin.left - margin.right\n        , mapRatio = 0.5\n        , height = width * mapRatio\n        , active = d3.select(null);\n\n    var svg = d3.select('.viz').append('svg')\n        .attr('class', 'center-container')\n        .attr('height', height + margin.top + margin.bottom)\n        .attr('width', width + margin.left + margin.right);\n\n    svg.append('rect')\n        .attr('class', 'background center-container')\n        .attr('height', height + margin.top + margin.bottom)\n        .attr('width', width + margin.left + margin.right)\n        .on('click', clicked);\n\n\n    Promise.resolve(d3.json('https://gist.githubusercontent.com/mbostock/4090846/raw/us.json'))\n        .then(ready);\n\n    let projection = d3.geoAlbersUsa()\n        .translate([width /2 , height / 2])\n        .scale(width);\n\n    // console.log(projection)\n    console.log(`Projection: ${projection([145.7231096, 15.21680033])}`)\n\n    var path = d3.geoPath()\n        .projection(projection);\n\n    var g = svg.append(\"g\")\n        .attr('class', 'center-container center-items us-state')\n        .attr('transform', 'translate('+margin.left+','+margin.top+')')\n        .attr('width', width + margin.left + margin.right)\n        .attr('height', height + margin.top + margin.bottom)\n\n    function ready(us) {\n\n        g.append(\"g\")\n            .attr(\"id\", \"counties\")\n            .selectAll(\"path\")\n            .data(topojson.feature(us, us.objects.counties).features)\n            .enter().append(\"path\")\n            .attr(\"d\", path)\n            .attr(\"class\", \"county-boundary\")\n            .on(\"click\", reset);\n\n        g.append(\"g\")\n            .attr(\"id\", \"states\")\n            .selectAll(\"path\")\n            .data(topojson.feature(us, us.objects.states).features)\n            .enter().append(\"path\")\n            .attr(\"d\", path)\n            .attr(\"class\", \"state\")\n            .on(\"click\", clicked);\n\n        g.append(\"path\")\n            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))\n            .attr(\"id\", \"state-borders\")\n            .attr(\"d\", path);\n        \n        g.append(\"g\")\n            .attr(\"id\",\"parks\")\n            .selectAll(\"path\")\n            .data(parks)\n            .enter().append(\"circle\")\n            .attr(\"id\", function(d){\n                return d.id;\n            })\n            .attr(\"class\", \"parks\")\n            // .attr(\"id\", d.id)\n            .attr(\"r\", 2)\n            .attr(\"cx\", function(d){\n                \n                console.log(d.id)\n                let coords = projection([parseFloat(d.longitude),parseFloat(d.latitude)])\n                if (coords){\n                    return coords[0];\n                } else {\n                    return null;\n                }\n            })\n            .attr(\"cy\", function(d){\n\n                let coords = projection([parseFloat(d.longitude),parseFloat(d.latitude)])\n                if (coords){\n                    return coords[1];\n                } else {\n                    return null;\n                }\n            })\n\n    }\n\n    function clicked(d) {\n        if (d3.select('.background').node() === this) return reset();\n\n        if (active.node() === this) return reset();\n\n        active.classed(\"active\", false);\n        active = d3.select(this).classed(\"active\", true);\n\n        var bounds = path.bounds(d),\n            dx = bounds[1][0] - bounds[0][0],\n            dy = bounds[1][1] - bounds[0][1],\n            x = (bounds[0][0] + bounds[1][0]) / 2,\n            y = (bounds[0][1] + bounds[1][1]) / 2,\n            scale = .9 / Math.max(dx / width, dy / height),\n            translate = [width / 2 - scale * x, height / 2 - scale * y];\n\n        g.transition()\n            .duration(750)\n            .style(\"stroke-width\", 1.5 / scale + \"px\")\n            .attr(\"transform\", \"translate(\" + translate + \")scale(\" + scale + \")\");\n    }\n\n\n    function reset() {\n        active.classed(\"active\", false);\n        active = d3.select(null);\n\n        g.transition()\n            .delay(100)\n            .duration(750)\n            .style(\"stroke-width\", \"1.5px\")\n            .attr('transform', 'translate('+margin.left+','+margin.top+')');\n\n    }\n\n}\n// module.exports.generateMap = us_map;\n\n//# sourceURL=webpack:///./src/us_map.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;