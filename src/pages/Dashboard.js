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
exports.default = Dashboard;
var PeaceMeter_1 = require("@/components/PeaceMeter");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var textarea_1 = require("@/components/ui/textarea");
var api_1 = require("@/convex/_generated/api");
var use_auth_1 = require("@/hooks/use-auth");
var react_1 = require("convex/react");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var sonner_1 = require("sonner");
function Dashboard() {
    var _this = this;
    var _a;
    var navigate = (0, react_router_1.useNavigate)();
    var _b = (0, use_auth_1.useAuth)(), authLoading = _b.isLoading, isAuthenticated = _b.isAuthenticated, user = _b.user, signOut = _b.signOut;
    var _c = (0, react_2.useState)(""), journalNote = _c[0], setJournalNote = _c[1];
    var _d = (0, react_2.useState)(""), selectedMood = _d[0], setSelectedMood = _d[1];
    var moodJournals = (0, react_1.useQuery)(api_1.api.moodJournals.getUserMoodJournals, { limit: 7 });
    var lifeGoals = (0, react_1.useQuery)(api_1.api.lifeGoals.getUserLifeGoals);
    var createMoodEntry = (0, react_1.useMutation)(api_1.api.moodJournals.createMoodEntry);
    (0, react_2.useEffect)(function () {
        if (!authLoading && !isAuthenticated) {
            navigate("/auth");
        }
    }, [authLoading, isAuthenticated, navigate]);
    (0, react_2.useEffect)(function () {
        if (user && !user.hasCompletedQuiz) {
            navigate("/soul-scan");
        }
    }, [user, navigate]);
    var moods = [
        { emoji: "😊", label: "Great", value: "great" },
        { emoji: "😌", label: "Calm", value: "calm" },
        { emoji: "😐", label: "Okay", value: "okay" },
        { emoji: "😟", label: "Worried", value: "worried" },
        { emoji: "😰", label: "Stressed", value: "stressed" },
    ];
    var handleSaveMood = function () { return __awaiter(_this, void 0, void 0, function () {
        var mood, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedMood) {
                        sonner_1.toast.error("Please select a mood");
                        return [2 /*return*/];
                    }
                    mood = moods.find(function (m) { return m.value === selectedMood; });
                    if (!mood)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, createMoodEntry({
                            date: new Date().toISOString().split("T")[0],
                            mood: mood.label,
                            emoji: mood.emoji,
                            note: journalNote,
                            peaceMeterScore: (user === null || user === void 0 ? void 0 : user.peaceMeter) || 50,
                        })];
                case 2:
                    _a.sent();
                    sonner_1.toast.success("Mood saved! 💚");
                    setJournalNote("");
                    setSelectedMood("");
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    sonner_1.toast.error("Failed to save mood");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var getArchetypeName = function (archetype) {
        var names = {
            earth_guardian: "The Earth Guardian",
            freedom_seeker: "The Freedom Seeker",
            legacy_builder: "The Legacy Builder",
            harmony_keeper: "The Harmony Keeper",
            adventure_investor: "The Adventure Investor",
        };
        return archetype ? names[archetype] : "Explorer";
    };
    if (authLoading || !user) {
        return (<div className="min-h-screen flex items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin"/>
      </div>);
    }
    return (<div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="FinSoul" className="h-8 w-8 cursor-pointer" onClick={function () { return navigate("/"); }}/>
            <h1 className="text-xl font-bold">FinSoul</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button_1.Button variant="ghost" onClick={function () { return navigate("/dashboard"); }}>
              <lucide_react_1.Heart className="mr-2 h-4 w-4"/>
              Home
            </button_1.Button>
            <button_1.Button variant="ghost" onClick={function () { return navigate("/investments"); }}>
              <lucide_react_1.TrendingUp className="mr-2 h-4 w-4"/>
              Investments
            </button_1.Button>
            <button_1.Button variant="ghost" onClick={function () { return navigate("/community"); }}>
              <lucide_react_1.Users className="mr-2 h-4 w-4"/>
              Community
            </button_1.Button>
            <button_1.Button variant="ghost" onClick={function () { return signOut(); }}>
              <lucide_react_1.LogOut className="mr-2 h-4 w-4"/>
              Logout
            </button_1.Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Welcome back, {user.name || "Friend"} 💚
          </h2>
          <p className="text-muted-foreground">
            You're {getArchetypeName(user.archetype)} — let's nurture your financial soul today
          </p>
        </framer_motion_1.motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Peace Meter */}
          <framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <card_1.Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center gap-2">
                  <lucide_react_1.Heart className="text-pink-500"/>
                  Your Peace
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent className="flex flex-col items-center">
                <PeaceMeter_1.PeaceMeter score={user.peaceMeter || 50} size="md"/>
                <button_1.Button variant="outline" className="mt-4 w-full" size="sm">
                  <lucide_react_1.Sparkles className="mr-2 h-4 w-4"/>
                  Take a Breath
                </button_1.Button>
              </card_1.CardContent>
            </card_1.Card>
          </framer_motion_1.motion.div>

          {/* Values Tracker */}
          <framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <card_1.Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center gap-2">
                  <lucide_react_1.Target className="text-blue-500"/>
                  Your Values
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="space-y-3">
                  {(_a = user.topValues) === null || _a === void 0 ? void 0 : _a.slice(0, 3).map(function (value, i) { return (<div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"/>
                      <span className="text-sm">{value}</span>
                    </div>); })}
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </framer_motion_1.motion.div>

          {/* Life Goals */}
          <framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <card_1.Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center gap-2">
                  <lucide_react_1.Target className="text-green-500"/>
                  Life Goals
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                {lifeGoals && lifeGoals.length > 0 ? (<div className="space-y-3">
                    {lifeGoals.slice(0, 3).map(function (goal) { return (<div key={goal._id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{goal.title}</span>
                          <span className="text-muted-foreground">
                            {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 transition-all" style={{ width: "".concat((goal.currentAmount / goal.targetAmount) * 100, "%") }}/>
                        </div>
                      </div>); })}
                  </div>) : (<p className="text-sm text-muted-foreground">No goals yet. Let's create some!</p>)}
                <button_1.Button variant="outline" className="w-full mt-4" size="sm">
                  Add Goal
                </button_1.Button>
              </card_1.CardContent>
            </card_1.Card>
          </framer_motion_1.motion.div>

          {/* Money Mood Journal */}
          <framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="md:col-span-2">
            <card_1.Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center gap-2">
                  <lucide_react_1.BookHeart className="text-purple-500"/>
                  Money Mood Journal
                </card_1.CardTitle>
                <card_1.CardDescription>How are you feeling about money today?</card_1.CardDescription>
              </card_1.CardHeader>
              <card_1.CardContent className="space-y-4">
                <div className="flex gap-2 justify-center">
                  {moods.map(function (mood) { return (<button_1.Button key={mood.value} variant={selectedMood === mood.value ? "default" : "outline"} size="lg" onClick={function () { return setSelectedMood(mood.value); }} className="text-2xl">
                      {mood.emoji}
                    </button_1.Button>); })}
                </div>
                <textarea_1.Textarea placeholder="What's on your mind? (optional)" value={journalNote} onChange={function (e) { return setJournalNote(e.target.value); }} rows={3}/>
                <button_1.Button onClick={handleSaveMood} className="w-full">
                  Save Today's Mood
                </button_1.Button>
              </card_1.CardContent>
            </card_1.Card>
          </framer_motion_1.motion.div>

          {/* AI Coach */}
          <framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
            <card_1.Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center gap-2">
                  <lucide_react_1.MessageCircle className="text-indigo-500"/>
                  AI Coach
                </card_1.CardTitle>
                <card_1.CardDescription>I'm here to help</card_1.CardDescription>
              </card_1.CardHeader>
              <card_1.CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  "Remember, every small step counts. You're doing great! 💚"
                </p>
                <button_1.Button variant="outline" className="w-full">
                  Chat Now
                </button_1.Button>
              </card_1.CardContent>
            </card_1.Card>
          </framer_motion_1.motion.div>
        </div>
      </div>
    </div>);
}
