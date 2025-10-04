"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSoulScan = exports.submitSoulScan = void 0;
var values_1 = require("convex/values");
var server_1 = require("./_generated/server");
var users_1 = require("./users");
exports.submitSoulScan = (0, server_1.mutation)({
    args: {
        answers: values_1.v.object({
            personality: values_1.v.array(values_1.v.string()),
            values: values_1.v.array(values_1.v.string()),
            financialFears: values_1.v.array(values_1.v.string()),
            financialDreams: values_1.v.array(values_1.v.string()),
            spendingTriggers: values_1.v.array(values_1.v.string()),
        }),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, archetype, peaceMeter, topValues;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user)
                        throw new Error("Not authenticated");
                    archetype = calculateArchetype(args.answers);
                    peaceMeter = calculatePeaceMeter(args.answers);
                    topValues = args.answers.values.slice(0, 3);
                    // Save soul scan
                    return [4 /*yield*/, ctx.db.insert("soulScans", {
                            userId: user._id,
                            answers: args.answers,
                            archetype: archetype,
                            peaceMeter: peaceMeter,
                            completedAt: Date.now(),
                        })];
                case 2:
                    // Save soul scan
                    _a.sent();
                    // Update user profile
                    return [4 /*yield*/, ctx.db.patch(user._id, {
                            archetype: archetype,
                            peaceMeter: peaceMeter,
                            hasCompletedQuiz: true,
                            topValues: topValues,
                            dashboardTheme: getThemeForArchetype(archetype),
                        })];
                case 3:
                    // Update user profile
                    _a.sent();
                    return [2 /*return*/, { archetype: archetype, peaceMeter: peaceMeter }];
            }
        });
    }); },
});
exports.getUserSoulScan = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var user, scan;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, ctx.db
                            .query("soulScans")
                            .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                            .order("desc")
                            .first()];
                case 2:
                    scan = _a.sent();
                    return [2 /*return*/, scan];
            }
        });
    }); },
});
function calculateArchetype(answers) {
    var values = answers.values.join(" ").toLowerCase();
    if (values.includes("environment") || values.includes("sustainability")) {
        return "earth_guardian";
    }
    else if (values.includes("freedom") || values.includes("independence")) {
        return "freedom_seeker";
    }
    else if (values.includes("family") || values.includes("legacy")) {
        return "legacy_builder";
    }
    else if (values.includes("balance") || values.includes("peace")) {
        return "harmony_keeper";
    }
    else {
        return "adventure_investor";
    }
}
function calculatePeaceMeter(answers) {
    var fearCount = answers.financialFears.length;
    var dreamCount = answers.financialDreams.length;
    var baseScore = 50;
    var dreamBonus = dreamCount * 10;
    var fearPenalty = fearCount * 5;
    return Math.max(0, Math.min(100, baseScore + dreamBonus - fearPenalty));
}
function getThemeForArchetype(archetype) {
    var themes = {
        earth_guardian: "green",
        freedom_seeker: "blue",
        legacy_builder: "gold",
        harmony_keeper: "purple",
        adventure_investor: "orange",
    };
    return themes[archetype] || "blue";
}
