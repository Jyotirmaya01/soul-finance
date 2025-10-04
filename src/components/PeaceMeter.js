"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeaceMeter = PeaceMeter;
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
function PeaceMeter(_a) {
    var score = _a.score, _b = _a.size, size = _b === void 0 ? "md" : _b;
    var sizes = {
        sm: { container: 120, stroke: 8 },
        md: { container: 160, stroke: 12 },
        lg: { container: 200, stroke: 16 },
    };
    var _c = sizes[size], container = _c.container, stroke = _c.stroke;
    var radius = (container - stroke) / 2;
    var circumference = 2 * Math.PI * radius;
    var offset = circumference - (score / 100) * circumference;
    var getColor = function (score) {
        if (score >= 80)
            return "text-green-500";
        if (score >= 60)
            return "text-blue-500";
        if (score >= 40)
            return "text-yellow-500";
        return "text-orange-500";
    };
    return (<div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: container, height: container }}>
        <svg className="transform -rotate-90" width={container} height={container}>
          <circle cx={container / 2} cy={container / 2} r={radius} stroke="currentColor" strokeWidth={stroke} fill="none" className="text-muted"/>
          <framer_motion_1.motion.circle cx={container / 2} cy={container / 2} r={radius} stroke="currentColor" strokeWidth={stroke} fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className={getColor(score)} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.5, ease: "easeOut" }}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <lucide_react_1.Heart className={"".concat(getColor(score), " mb-1")} size={size === "lg" ? 32 : 24} fill="currentColor"/>
          <framer_motion_1.motion.span className={"font-bold ".concat(getColor(score), " ").concat(size === "lg" ? "text-3xl" : "text-2xl")} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
            {score}
          </framer_motion_1.motion.span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-medium">Peace Meter™</p>
    </div>);
}
