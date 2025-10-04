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
exports.default = Community;
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var tabs_1 = require("@/components/ui/tabs");
var api_1 = require("@/convex/_generated/api");
var use_auth_1 = require("@/hooks/use-auth");
var react_1 = require("convex/react");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var sonner_1 = require("sonner");
function Community() {
    var _this = this;
    var navigate = (0, react_router_1.useNavigate)();
    var _a = (0, use_auth_1.useAuth)(), authLoading = _a.isLoading, isAuthenticated = _a.isAuthenticated;
    var publicCircles = (0, react_1.useQuery)(api_1.api.circles.getPublicCircles);
    var userCircles = (0, react_1.useQuery)(api_1.api.circles.getUserCircles);
    var joinCircle = (0, react_1.useMutation)(api_1.api.circles.joinCircle);
    (0, react_2.useEffect)(function () {
        if (!authLoading && !isAuthenticated) {
            navigate("/auth");
        }
    }, [authLoading, isAuthenticated, navigate]);
    var handleJoinCircle = function (circleId) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, joinCircle({ circleId: circleId })];
                case 1:
                    _a.sent();
                    sonner_1.toast.success("Joined circle! 🎉");
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    sonner_1.toast.error("Failed to join circle");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    if (authLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin"/>
      </div>);
    }
    return (<div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button_1.Button variant="ghost" onClick={function () { return navigate("/dashboard"); }}>
            <lucide_react_1.ArrowLeft className="mr-2 h-4 w-4"/>
            Back to Dashboard
          </button_1.Button>
          <h1 className="text-xl font-bold">Community Hub</h1>
          <div className="w-24"/>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Connect With Your Tribe
          </h2>
          <p className="text-muted-foreground">
            Join circles, share experiences, and grow together
          </p>
        </framer_motion_1.motion.div>

        <tabs_1.Tabs defaultValue="discover" className="space-y-6">
          <tabs_1.TabsList className="grid w-full max-w-md grid-cols-2">
            <tabs_1.TabsTrigger value="discover">Discover</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="my-circles">My Circles</tabs_1.TabsTrigger>
          </tabs_1.TabsList>

          <tabs_1.TabsContent value="discover" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Public Circles</h3>
              <button_1.Button>
                <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
                Create Circle
              </button_1.Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicCircles === null || publicCircles === void 0 ? void 0 : publicCircles.map(function (circle, index) { return (<framer_motion_1.motion.div key={circle._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <card_1.Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                    <card_1.CardHeader>
                      <card_1.CardTitle className="flex items-center gap-2">
                        <lucide_react_1.Users className="h-5 w-5 text-blue-500"/>
                        {circle.name}
                      </card_1.CardTitle>
                      <card_1.CardDescription>{circle.description}</card_1.CardDescription>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {circle.memberCount} members
                        </span>
                        <button_1.Button size="sm" onClick={function () { return handleJoinCircle(circle._id); }}>
                          Join
                        </button_1.Button>
                      </div>
                    </card_1.CardContent>
                  </card_1.Card>
                </framer_motion_1.motion.div>); })}
            </div>
          </tabs_1.TabsContent>

          <tabs_1.TabsContent value="my-circles" className="space-y-6">
            <h3 className="text-xl font-semibold">Your Circles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCircles && userCircles.length > 0 ? (userCircles.map(function (circle, index) { return (<framer_motion_1.motion.div key={circle._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <card_1.Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                      <card_1.CardHeader>
                        <card_1.CardTitle className="flex items-center gap-2">
                          <lucide_react_1.Users className="h-5 w-5 text-green-500"/>
                          {circle.name}
                        </card_1.CardTitle>
                        <card_1.CardDescription>{circle.description}</card_1.CardDescription>
                      </card_1.CardHeader>
                      <card_1.CardContent>
                        <span className="text-sm text-muted-foreground">
                          {circle.memberCount} members
                        </span>
                      </card_1.CardContent>
                    </card_1.Card>
                  </framer_motion_1.motion.div>); })) : (<p className="text-muted-foreground col-span-full text-center py-12">
                  You haven't joined any circles yet. Explore and connect!
                </p>)}
            </div>
          </tabs_1.TabsContent>
        </tabs_1.Tabs>
      </div>
    </div>);
}
