/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
import ScrollToTop from "./hooks/scrollToTop.tsx";

// Lazy load all page components
const App = lazy(() => import("./pages/app.tsx"));
const Dashboard = lazy(() => import("./pages/dashboard.tsx"));
const Layout = lazy(() => import("./components/layout.tsx"));
const ProjectPage = lazy(() => import("./pages/projectPage.tsx"));
const ProjectEdit = lazy(() => import("./pages/projectEditPage.tsx"));
const ProjectSearchPage = lazy(() => import("./pages/projectSearchPage.tsx"));
const SettingsPage = lazy(() => import("./pages/settingsPage.tsx"));
const ProfilePage = lazy(() => import("./pages/profilePage.tsx"));

/**
 * This contains all different routes to the different pages.
 * All route components are lazy loaded for better performance.
 */
const allRoutes = (
  <Suspense
    fallback={
      <div className="flex h-screen items-center justify-center">
        Loading...
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
          <Route path=":id/edit" element={<ProjectEdit />} />
        </Route>
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  </Suspense>
);

export default allRoutes;
