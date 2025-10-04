"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.default = SoulScanQuiz;
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var checkbox_1 = require("@/components/ui/checkbox");
var progress_1 = require("@/components/ui/progress");
var api_1 = require("@/convex/_generated/api");
var use_auth_1 = require("@/hooks/use-auth");
var react_1 = require("convex/react");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var sonner_1 = require("sonner");
var confetti = require("canvas-confetti");
var quizSections = [
    {
        id: "personality",
        title: "Your Personality",
        description: "How do you approach life?",
        options: [
            "I'm a planner who loves structure",
            "I go with the flow",
            "I'm analytical and data-driven",
            "I trust my intuition",
            "I'm collaborative and seek advice",
        ],
    },
    {
        id: "values",
        title: "Your Core Values",
        description: "What matters most to you?",
        options: [
            "Environmental sustainability",
            "Financial freedom",
            "Family and legacy",
            "Personal growth",
            "Community impact",
            "Balance and peace",
            "Adventure and experiences",
        ],
    },
    {
        id: "financialFears",
        title: "Financial Fears",
        description: "What keeps you up at night?",
        options: [
            "Not having enough for retirement",
            "Losing money in investments",
            "Not being able to help loved ones",
            "Missing out on opportunities",
            "Economic uncertainty",
        ],
    },
    {
        id: "financialDreams",
        title: "Financial Dreams",
        description: "What would financial success look like?",
        options: [
            "Early retirement",
            "Owning my dream home",
            "Traveling the world",
            "Starting a business",
            "Leaving a legacy",
            "Living debt-free",
            "Making a difference",
        ],
    },
    {
        id: "spendingTriggers",
        title: "Spending Triggers",
        description: "When do you tend to spend?",
        options: [
            "When I'm stressed",
            "When I'm celebrating",
            "When I see a good deal",
            "When I'm with friends",
            "When I'm bored",
        ],
    },
];
function SoulScanQuiz() {
    var _this = this;
    var navigate = (0, react_router_1.useNavigate)();
    var _a = (0, use_auth_1.useAuth)(), authLoading = _a.isLoading, isAuthenticated = _a.isAuthenticated, user = _a.user;
    var _b = (0, react_2.useState)(0), currentSection = _b[0], setCurrentSection = _b[1];
    var _c = (0, react_2.useState)({
        personality: [],
        values: [],
        financialFears: [],
        financialDreams: [],
        spendingTriggers: [],
    }), answers = _c[0], setAnswers = _c[1];
    var _d = (0, react_2.useState)(false), isSubmitting = _d[0], setIsSubmitting = _d[1];
    var submitSoulScan = (0, react_1.useMutation)(api_1.api.soulScans.submitSoulScan);
    (0, react_2.useEffect)(function () {
        if (!authLoading && !isAuthenticated) {
            navigate("/auth");
        }
    }, [authLoading, isAuthenticated, navigate]);
    (0, react_2.useEffect)(function () {
        if (user === null || user === void 0 ? void 0 : user.hasCompletedQuiz) {
            navigate("/dashboard");
        }
    }, [user, navigate]);
    var progress = ((currentSection + 1) / quizSections.length) * 100;
    var section = quizSections[currentSection];
    var toggleAnswer = function (option) {
        var _a, _b;
        var sectionAnswers = answers[section.id];
        if (sectionAnswers.includes(option)) {
            setAnswers(__assign(__assign({}, answers), (_a = {}, _a[section.id] = sectionAnswers.filter(function (a) { return a !== option; }), _a)));
        }
        else {
            setAnswers(__assign(__assign({}, answers), (_b = {}, _b[section.id] = __spreadArray(__spreadArray([], sectionAnswers, true), [option], false), _b)));
        }
    };
    var handleNext = function () {
        if (answers[section.id].length === 0) {
            sonner_1.toast.error("Please select at least one option");
            return;
        }
        if (currentSection < quizSections.length - 1) {
            setCurrentSection(currentSection + 1);
        }
    };
    var handleBack = function () {
        if (currentSection > 0) {
            setCurrentSection(currentSection - 1);
        }
    };
    var handleSubmit = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (answers[section.id].length === 0) {
                        sonner_1.toast.error("Please select at least one option");
                        return [2 /*return*/];
                    }
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, submitSoulScan({
                            answers: {
                                personality: answers.personality || [],
                                values: answers.values || [],
                                financialFears: answers.financialFears || [],
                                financialDreams: answers.financialDreams || [],
                                spendingTriggers: answers.spendingTriggers || [],
                            }
                        })];
                case 2:
                    result = _a.sent();
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                    });
                    sonner_1.toast.success("Soul Scan Complete! 🎉");
                    setTimeout(function () {
                        navigate("/dashboard");
                    }, 1500);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    sonner_1.toast.error("Failed to submit Soul Scan");
                    setIsSubmitting(false);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    if (authLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin"/>
      </div>);
    }
    return (<div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <lucide_react_1.Sparkles className="text-purple-500"/>
              Soul Scan
            </h1>
            <span className="text-sm text-muted-foreground">
              {currentSection + 1} of {quizSections.length}
            </span>
          </div>
          <progress_1.Progress value={progress} className="h-2"/>
        </framer_motion_1.motion.div>

        <framer_motion_1.motion.div key={currentSection} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
          <card_1.Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-2">
            <card_1.CardHeader>
              <card_1.CardTitle className="text-2xl">{section.title}</card_1.CardTitle>
              <card_1.CardDescription className="text-base">{section.description}</card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              {section.options.map(function (option) { return (<framer_motion_1.motion.div key={option} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <label className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary hover:bg-accent">
                    <checkbox_1.Checkbox checked={answers[section.id].includes(option)} onCheckedChange={function () { return toggleAnswer(option); }}/>
                    <span className="text-sm leading-relaxed">{option}</span>
                  </label>
                </framer_motion_1.motion.div>); })}
            </card_1.CardContent>
          </card_1.Card>
        </framer_motion_1.motion.div>

        <div className="flex justify-between mt-8">
          <button_1.Button variant="outline" onClick={handleBack} disabled={currentSection === 0}>
            <lucide_react_1.ArrowLeft className="mr-2 h-4 w-4"/>
            Back
          </button_1.Button>

          {currentSection < quizSections.length - 1 ? (<button_1.Button onClick={handleNext}>
              Next
              <lucide_react_1.ArrowRight className="ml-2 h-4 w-4"/>
            </button_1.Button>) : (<button_1.Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (<>
                  <lucide_react_1.Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  Analyzing...
                </>) : (<>
                  Complete
                  <lucide_react_1.Sparkles className="ml-2 h-4 w-4"/>
                </>)}
            </button_1.Button>)}
        </div>
      </div>
    </div>);
}
