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
const Layout = lazy(() => import("./components/layout.tsx"));
const ProjectPage = lazy(() => import("./pages/projectPage.tsx"));
const ProjectSearchPage = lazy(() => import("./pages/projectSearchPage.tsx"));
const SettingsPage = lazy(() => import("./pages/settingsPage.tsx"));
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
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-white p-6 shadow-md">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span className="text-xl font-semibold">Loading...</span>
        </div>
      </div>
    }
  >
    <ScrollToTop />
    <Routes>
      <Route index element={<App />} />
      <Route element={<Layout />}>
        <Route path="settings" element={<SettingsPage />} />
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
