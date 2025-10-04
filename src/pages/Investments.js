"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Investments;
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var api_1 = require("@/convex/_generated/api");
var use_auth_1 = require("@/hooks/use-auth");
var react_1 = require("convex/react");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var react_2 = require("react");
var react_router_1 = require("react-router");
function Investments() {
    var navigate = (0, react_router_1.useNavigate)();
    var _a = (0, use_auth_1.useAuth)(), authLoading = _a.isLoading, isAuthenticated = _a.isAuthenticated, user = _a.user;
    var investments = (0, react_1.useQuery)(api_1.api.investments.getMatchingInvestments);
    (0, react_2.useEffect)(function () {
        if (!authLoading && !isAuthenticated) {
            navigate("/auth");
        }
    }, [authLoading, isAuthenticated, navigate]);
    var getRiskColor = function (risk) {
        if (risk === "Low")
            return "text-green-600 bg-green-100 dark:bg-green-900/30";
        if (risk === "Medium")
            return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
    };
    if (authLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin"/>
      </div>);
    }
    return (<div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button_1.Button variant="ghost" onClick={function () { return navigate("/dashboard"); }}>
            <lucide_react_1.ArrowLeft className="mr-2 h-4 w-4"/>
            Back to Dashboard
          </button_1.Button>
          <h1 className="text-xl font-bold">Soul Investments</h1>
          <div className="w-24"/>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Investments That Match Your Soul
          </h2>
          <p className="text-muted-foreground">
            Curated opportunities aligned with your values and financial archetype
          </p>
        </framer_motion_1.motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investments === null || investments === void 0 ? void 0 : investments.map(function (investment, index) {
            var _a;
            return (<framer_motion_1.motion.div key={investment._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <card_1.Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 h-full flex flex-col">
                <card_1.CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <card_1.CardTitle className="text-lg">{investment.name}</card_1.CardTitle>
                    {investment.isPremium && (<badge_1.Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                        Premium
                      </badge_1.Badge>)}
                  </div>
                  <card_1.CardDescription>{investment.description}</card_1.CardDescription>
                </card_1.CardHeader>
                <card_1.CardContent className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">ESG Score</span>
                      <div className="flex items-center gap-1">
                        <lucide_react_1.Leaf className="h-4 w-4 text-green-500"/>
                        <span className="font-semibold">{investment.esgScore}/100</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Expected Return</span>
                      <div className="flex items-center gap-1">
                        <lucide_react_1.TrendingUp className="h-4 w-4 text-blue-500"/>
                        <span className="font-semibold">{investment.expectedReturn}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Risk Level</span>
                      <badge_1.Badge className={getRiskColor(investment.riskLevel)}>
                        <lucide_react_1.Shield className="h-3 w-3 mr-1"/>
                        {investment.riskLevel}
                      </badge_1.Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Min. Investment</span>
                      <span className="font-semibold">${investment.minInvestment}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 bg-accent rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Why This Matches You</p>
                      <p className="text-sm flex items-center gap-1">
                        <lucide_react_1.Heart className="h-3 w-3 text-pink-500" fill="currentColor"/>
                        Aligned with your {(_a = user === null || user === void 0 ? void 0 : user.archetype) === null || _a === void 0 ? void 0 : _a.replace("_", " ")} values
                      </p>
                    </div>
                    <button_1.Button className="w-full" variant="default">
                      Learn More
                      <lucide_react_1.ExternalLink className="ml-2 h-4 w-4"/>
                    </button_1.Button>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
            </framer_motion_1.motion.div>);
        })}
        </div>
      </div>
    </div>);
}
