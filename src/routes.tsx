/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import ScrollToTop from "./hooks/scrollToTop.tsx";

// Lazy load all page components
const App = lazy(() => import("./pages/app.tsx"));
const Dashboard = lazy(() => import("./pages/dashboard.tsx"));
const Layout = lazy(() => import("./components/layout/layout.tsx"));
const ProjectPage = lazy(() => import("./pages/projectPage.tsx"));
const ProjectSearchPage = lazy(() => import("./pages/projectSearchPage.tsx"));
const ProfilePage = lazy(() => import("./pages/profilePage.tsx"));
const SysAdminPortal = lazy(() => import("./pages/sysAdminPortal.tsx"));

/**
 * This contains all different routes to the different pages.
 * All route components are lazy loaded for better performance.
 */
const allRoutes = (
  <Suspense
    fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-6 rounded-2xl border border-gray-100 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-gray-300/30"></div>
            <Loader2 className="text-primary relative h-12 w-12 animate-spin" />
          </div>
          <div className="space-y-2 text-center">
            <span className="text-xl font-semibold text-gray-800">
              Loading...
            </span>
          </div>
        </div>
      </div>
    }
  >
    <ScrollToTop />
    <Routes>
      <Route index element={<App />} />
      <Route element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects">
          <Route path="search" element={<ProjectSearchPage />} />
          <Route path=":id" element={<ProjectPage />} />
        </Route>
        <Route path="profile" element={<ProfilePage />} />
        <Route path="admin" element={<SysAdminPortal />} />
      </Route>
    </Routes>
  </Suspense>
);

export default allRoutes;
