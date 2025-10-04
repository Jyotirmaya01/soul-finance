"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sonner_1 = require("@/components/ui/sonner");
var vly_toolbar_readonly_tsx_1 = require("../vly-toolbar-readonly.tsx");
var instrumentation_tsx_1 = require("@/instrumentation.tsx");
var Auth_tsx_1 = require("@/pages/Auth.tsx");
var react_1 = require("@convex-dev/auth/react");
var react_2 = require("convex/react");
var react_3 = require("react");
var client_1 = require("react-dom/client");
var react_router_1 = require("react-router");
require("./index.css");
var Landing_tsx_1 = require("./pages/Landing.tsx");
var NotFound_tsx_1 = require("./pages/NotFound.tsx");
var SoulScanQuiz_tsx_1 = require("./pages/SoulScanQuiz.tsx");
var Dashboard_tsx_1 = require("./pages/Dashboard.tsx");
var Investments_tsx_1 = require("./pages/Investments.tsx");
var Community_tsx_1 = require("./pages/Community.tsx");
require("./types/global.d.ts");
var convex = new react_2.ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
function RouteSyncer() {
    var location = (0, react_router_1.useLocation)();
    (0, react_3.useEffect)(function () {
        window.parent.postMessage({ type: "iframe-route-change", path: location.pathname }, "*");
    }, [location.pathname]);
    (0, react_3.useEffect)(function () {
        function handleMessage(event) {
            var _a;
            if (((_a = event.data) === null || _a === void 0 ? void 0 : _a.type) === "navigate") {
                if (event.data.direction === "back")
                    window.history.back();
                if (event.data.direction === "forward")
                    window.history.forward();
            }
        }
        window.addEventListener("message", handleMessage);
        return function () { return window.removeEventListener("message", handleMessage); };
    }, []);
    return null;
}
(0, client_1.createRoot)(document.getElementById("root")).render(<react_3.StrictMode>
    <vly_toolbar_readonly_tsx_1.VlyToolbar />
    <instrumentation_tsx_1.InstrumentationProvider>
      <react_1.ConvexAuthProvider client={convex}>
        <react_router_1.BrowserRouter>
          <RouteSyncer />
          <react_router_1.Routes>
            <react_router_1.Route path="/" element={<Landing_tsx_1.default />}/>
            <react_router_1.Route path="/auth" element={<Auth_tsx_1.default redirectAfterAuth="/soul-scan"/>}/>
            <react_router_1.Route path="/soul-scan" element={<SoulScanQuiz_tsx_1.default />}/>
            <react_router_1.Route path="/dashboard" element={<Dashboard_tsx_1.default />}/>
            <react_router_1.Route path="/investments" element={<Investments_tsx_1.default />}/>
            <react_router_1.Route path="/community" element={<Community_tsx_1.default />}/>
            <react_router_1.Route path="*" element={<NotFound_tsx_1.default />}/>
          </react_router_1.Routes>
        </react_router_1.BrowserRouter>
        <sonner_1.Toaster />
      </react_1.ConvexAuthProvider>
    </instrumentation_tsx_1.InstrumentationProvider>
  </react_3.StrictMode>);
