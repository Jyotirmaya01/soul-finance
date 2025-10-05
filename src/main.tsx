import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import AuthPage from "@/pages/Auth.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import Landing from "./pages/Landing.tsx";
import NotFound from "./pages/NotFound.tsx";
import SoulScanQuiz from "./pages/SoulScanQuiz.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Investments from "./pages/Investments.tsx";
import Community from "./pages/Community.tsx";
import Calculators from "./pages/Calculators.tsx";
import Profile from "./pages/Profile.tsx";
import Pricing from "./pages/Pricing.tsx";
import FinancialAstrology from "./pages/FinancialAstrology.tsx";
import "./types/global.d.ts";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/auth",
    element: <AuthPage redirectAfterAuth="/soul-scan" />,
  },
  {
    path: "/soul-scan",
    element: <SoulScanQuiz />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/investments",
    element: <Investments />,
  },
  {
    path: "/community",
    element: <Community />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/calculators",
    element: <Calculators />,
  },
  {
    path: "/astrology",
    element: <FinancialAstrology />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VlyToolbar />
    <InstrumentationProvider>
      <ConvexAuthProvider client={convex}>
        <RouterProvider router={router} />
        <Toaster />
      </ConvexAuthProvider>
    </InstrumentationProvider>
  </StrictMode>,
);