"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avatar = Avatar;
exports.AvatarImage = AvatarImage;
exports.AvatarFallback = AvatarFallback;
var React = require("react");
var AvatarPrimitive = require("@radix-ui/react-avatar");
var utils_1 = require("@/lib/utils");
function Avatar(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<AvatarPrimitive.Root className={(0, utils_1.cn)("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} {...props}/>);
}
function AvatarImage(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<AvatarPrimitive.Image className={(0, utils_1.cn)("aspect-square h-full w-full", className)} {...props}/>);
}
function AvatarFallback(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<AvatarPrimitive.Fallback className={(0, utils_1.cn)("flex h-full w-full items-center justify-center rounded-full bg-muted", className)} {...props}/>);
}
