"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeVisualization = TreeVisualization;
var framer_motion_1 = require("framer-motion");
var react_1 = require("react");
function TreeVisualization() {
    var _a = (0, react_1.useState)(false), isGrowing = _a[0], setIsGrowing = _a[1];
    (0, react_1.useEffect)(function () {
        setIsGrowing(true);
    }, []);
    return (<div className="relative w-full h-[400px] flex items-end justify-center overflow-hidden">
      {/* Trunk */}
      <framer_motion_1.motion.div className="absolute bottom-0 w-16 bg-gradient-to-t from-amber-800 to-amber-700 rounded-t-lg" initial={{ height: 0 }} animate={{ height: isGrowing ? 120 : 0 }} transition={{ duration: 1, ease: "easeOut" }}/>

      {/* Leaves/Crown */}
      <framer_motion_1.motion.div className="absolute bottom-24 w-64 h-64 rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 opacity-90" initial={{ scale: 0, opacity: 0 }} animate={{ scale: isGrowing ? 1 : 0, opacity: isGrowing ? 0.9 : 0 }} transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}/>

      {/* Additional leaf layers */}
      <framer_motion_1.motion.div className="absolute bottom-32 left-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 opacity-80" initial={{ scale: 0, x: -50 }} animate={{ scale: isGrowing ? 1 : 0, x: isGrowing ? 0 : -50 }} transition={{ duration: 1.2, delay: 0.8 }}/>

      <framer_motion_1.motion.div className="absolute bottom-32 right-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-teal-400 to-green-500 opacity-80" initial={{ scale: 0, x: 50 }} animate={{ scale: isGrowing ? 1 : 0, x: isGrowing ? 0 : 50 }} transition={{ duration: 1.2, delay: 0.8 }}/>

      {/* Floating particles */}
      {__spreadArray([], Array(8), true).map(function (_, i) { return (<framer_motion_1.motion.div key={i} className="absolute w-2 h-2 rounded-full bg-green-400" initial={{ opacity: 0, y: 0 }} animate={{
                opacity: [0, 1, 0],
                y: [-20, -80],
                x: [0, (i % 2 === 0 ? 1 : -1) * 30],
            }} transition={{
                duration: 3,
                delay: 1.5 + i * 0.2,
                repeat: Infinity,
                repeatDelay: 2,
            }} style={{
                bottom: "".concat(100 + i * 20, "px"),
                left: "calc(50% + ".concat((i % 3 - 1) * 40, "px)"),
            }}/>); })}
    </div>);
}
