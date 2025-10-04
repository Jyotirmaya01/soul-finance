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
exports.default = AuthPage;
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var input_otp_1 = require("@/components/ui/input-otp");
var use_auth_1 = require("@/hooks/use-auth");
var lucide_react_1 = require("lucide-react");
var react_1 = require("react");
var react_router_1 = require("react-router");
function Auth(_a) {
    var _this = this;
    var _b = _a === void 0 ? {} : _a, redirectAfterAuth = _b.redirectAfterAuth;
    var _c = (0, use_auth_1.useAuth)(), authLoading = _c.isLoading, isAuthenticated = _c.isAuthenticated, signIn = _c.signIn;
    var navigate = (0, react_router_1.useNavigate)();
    var _d = (0, react_1.useState)("signIn"), step = _d[0], setStep = _d[1];
    var _e = (0, react_1.useState)(""), otp = _e[0], setOtp = _e[1];
    var _f = (0, react_1.useState)(false), isLoading = _f[0], setIsLoading = _f[1];
    var _g = (0, react_1.useState)(null), error = _g[0], setError = _g[1];
    (0, react_1.useEffect)(function () {
        if (!authLoading && isAuthenticated) {
            var redirect = redirectAfterAuth || "/";
            navigate(redirect);
        }
    }, [authLoading, isAuthenticated, navigate, redirectAfterAuth]);
    var handleEmailSubmit = function (event) { return __awaiter(_this, void 0, void 0, function () {
        var formData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    setIsLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    formData = new FormData(event.currentTarget);
                    return [4 /*yield*/, signIn("email-otp", formData)];
                case 2:
                    _a.sent();
                    setStep({ email: formData.get("email") });
                    setIsLoading(false);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Email sign-in error:", error_1);
                    setError(error_1 instanceof Error
                        ? error_1.message
                        : "Failed to send verification code. Please try again.");
                    setIsLoading(false);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleOtpSubmit = function (event) { return __awaiter(_this, void 0, void 0, function () {
        var formData, redirect, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    setIsLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    formData = new FormData(event.currentTarget);
                    return [4 /*yield*/, signIn("email-otp", formData)];
                case 2:
                    _a.sent();
                    console.log("signed in");
                    redirect = redirectAfterAuth || "/";
                    navigate(redirect);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error("OTP verification error:", error_2);
                    setError("The verification code you entered is incorrect.");
                    setIsLoading(false);
                    setOtp("");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleGuestLogin = function () { return __awaiter(_this, void 0, void 0, function () {
        var redirect, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    console.log("Attempting anonymous sign in...");
                    return [4 /*yield*/, signIn("anonymous")];
                case 2:
                    _a.sent();
                    console.log("Anonymous sign in successful");
                    redirect = redirectAfterAuth || "/";
                    navigate(redirect);
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error("Guest login error:", error_3);
                    console.error("Error details:", JSON.stringify(error_3, null, 2));
                    setError("Failed to sign in as guest: ".concat(error_3 instanceof Error ? error_3.message : 'Unknown error'));
                    setIsLoading(false);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen flex flex-col">

      
      {/* Auth Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center justify-center h-full flex-col">
        <card_1.Card className="min-w-[350px] pb-0 border shadow-md">
          {step === "signIn" ? (<>
              <card_1.CardHeader className="text-center">
              <div className="flex justify-center">
                    <img src="./logo.svg" alt="Lock Icon" width={64} height={64} className="rounded-lg mb-4 mt-4 cursor-pointer" onClick={function () { return navigate("/"); }}/>
                  </div>
                <card_1.CardTitle className="text-xl">Get Started</card_1.CardTitle>
                <card_1.CardDescription>
                  Enter your email to log in or sign up
                </card_1.CardDescription>
              </card_1.CardHeader>
              <form onSubmit={handleEmailSubmit}>
                <card_1.CardContent>
                  
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <lucide_react_1.Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                      <input_1.Input name="email" placeholder="name@example.com" type="email" className="pl-9" disabled={isLoading} required/>
                    </div>
                    <button_1.Button type="submit" variant="outline" size="icon" disabled={isLoading}>
                      {isLoading ? (<lucide_react_1.Loader2 className="h-4 w-4 animate-spin"/>) : (<lucide_react_1.ArrowRight className="h-4 w-4"/>)}
                    </button_1.Button>
                  </div>
                  {error && (<p className="mt-2 text-sm text-red-500">{error}</p>)}
                  
                  <div className="mt-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"/>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or
                        </span>
                      </div>
                    </div>
                    
                    <button_1.Button type="button" variant="outline" className="w-full mt-4" onClick={handleGuestLogin} disabled={isLoading}>
                      <lucide_react_1.UserX className="mr-2 h-4 w-4"/>
                      Continue as Guest
                    </button_1.Button>
                  </div>
                </card_1.CardContent>
              </form>
            </>) : (<>
              <card_1.CardHeader className="text-center mt-4">
                <card_1.CardTitle>Check your email</card_1.CardTitle>
                <card_1.CardDescription>
                  We've sent a code to {step.email}
                </card_1.CardDescription>
              </card_1.CardHeader>
              <form onSubmit={handleOtpSubmit}>
                <card_1.CardContent className="pb-4">
                  <input type="hidden" name="email" value={step.email}/>
                  <input type="hidden" name="code" value={otp}/>

                  <div className="flex justify-center">
                    <input_otp_1.InputOTP value={otp} onChange={setOtp} maxLength={6} disabled={isLoading} onKeyDown={function (e) {
                if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                    // Find the closest form and submit it
                    var form = e.target.closest("form");
                    if (form) {
                        form.requestSubmit();
                    }
                }
            }}>
                      <input_otp_1.InputOTPGroup>
                        {Array.from({ length: 6 }).map(function (_, index) { return (<input_otp_1.InputOTPSlot key={index} index={index}/>); })}
                      </input_otp_1.InputOTPGroup>
                    </input_otp_1.InputOTP>
                  </div>
                  {error && (<p className="mt-2 text-sm text-red-500 text-center">
                      {error}
                    </p>)}
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    Didn't receive a code?{" "}
                    <button_1.Button variant="link" className="p-0 h-auto" onClick={function () { return setStep("signIn"); }}>
                      Try again
                    </button_1.Button>
                  </p>
                </card_1.CardContent>
                <card_1.CardFooter className="flex-col gap-2">
                  <button_1.Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                    {isLoading ? (<>
                        <lucide_react_1.Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        Verifying...
                      </>) : (<>
                        Verify code
                        <lucide_react_1.ArrowRight className="ml-2 h-4 w-4"/>
                      </>)}
                  </button_1.Button>
                  <button_1.Button type="button" variant="ghost" onClick={function () { return setStep("signIn"); }} disabled={isLoading} className="w-full">
                    Use different email
                  </button_1.Button>
                </card_1.CardFooter>
              </form>
            </>)}

          <div className="py-4 px-6 text-xs text-center text-muted-foreground bg-muted border-t rounded-b-lg">
            Secured by{" "}
            <a href="https://vly.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">
              vly.ai
            </a>
          </div>
        </card_1.Card>
        </div>
      </div>
    </div>);
}
function AuthPage(props) {
    return (<react_1.Suspense>
      <Auth {...props}/>
    </react_1.Suspense>);
}
