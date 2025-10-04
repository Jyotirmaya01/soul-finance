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
exports.seedInvestments = void 0;
var server_1 = require("./_generated/server");
exports.seedInvestments = (0, server_1.internalMutation)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var investments, _i, investments_1, inv;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    investments = [
                        {
                            name: "Green Energy Fund",
                            description: "Invest in renewable energy companies making a real impact",
                            category: "ESG",
                            esgScore: 95,
                            minInvestment: 100,
                            expectedReturn: "8-12%",
                            riskLevel: "Medium",
                            matchingArchetypes: ["earth_guardian", "harmony_keeper"],
                            isPremium: false,
                        },
                        {
                            name: "Freedom Index ETF",
                            description: "Diversified portfolio for financial independence",
                            category: "Index Funds",
                            esgScore: 70,
                            minInvestment: 50,
                            expectedReturn: "10-15%",
                            riskLevel: "Medium",
                            matchingArchetypes: ["freedom_seeker", "adventure_investor"],
                            isPremium: false,
                        },
                        {
                            name: "Legacy Real Estate Trust",
                            description: "Build generational wealth through property",
                            category: "Real Estate",
                            esgScore: 75,
                            minInvestment: 1000,
                            expectedReturn: "6-10%",
                            riskLevel: "Low",
                            matchingArchetypes: ["legacy_builder", "harmony_keeper"],
                            isPremium: true,
                        },
                        {
                            name: "Local Community Bonds",
                            description: "Support your community while earning steady returns",
                            category: "Bonds",
                            esgScore: 90,
                            minInvestment: 500,
                            expectedReturn: "4-6%",
                            riskLevel: "Low",
                            matchingArchetypes: ["earth_guardian", "legacy_builder"],
                            isPremium: false,
                        },
                        {
                            name: "Tech Innovation Fund",
                            description: "High-growth potential in emerging technologies",
                            category: "Growth",
                            esgScore: 60,
                            minInvestment: 200,
                            expectedReturn: "15-25%",
                            riskLevel: "High",
                            matchingArchetypes: ["adventure_investor", "freedom_seeker"],
                            isPremium: true,
                        },
                        {
                            name: "Balanced Harmony Portfolio",
                            description: "Perfect mix of stability and growth",
                            category: "Balanced",
                            esgScore: 80,
                            minInvestment: 100,
                            expectedReturn: "7-11%",
                            riskLevel: "Medium",
                            matchingArchetypes: ["harmony_keeper", "legacy_builder"],
                            isPremium: false,
                        },
                    ];
                    _i = 0, investments_1 = investments;
                    _a.label = 1;
                case 1:
                    if (!(_i < investments_1.length)) return [3 /*break*/, 4];
                    inv = investments_1[_i];
                    return [4 /*yield*/, ctx.db.insert("investments", inv)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, { count: investments.length }];
            }
        });
    }); },
});
