/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Routes, Route } from "react-router";
import { lazy, Suspense } from "react";

// Lazy-loaded pages
const App = lazy(() => import("@/pages/app.tsx"));
const Layout = lazy(() => import("@/components/layout.tsx"));
const Dashboard = lazy(() => import("./pages/dashboard.tsx"));
const SettingsPage = lazy(() => import("./pages/settingsPage.tsx"));
const ProjectSearchPage = lazy(() => import("@/pages/projectSearchPage.tsx"));
const ProjectPage = lazy(() => import("./pages/projectPage.tsx"));
const ProjectEdit = lazy(() => import("@/pages/ProjectEdit.tsx"));
const NewProject = lazy(() => import("@/pages/NewProject.tsx"));

/**
 * This contains all different routes to the different pages. <br>
 * We might need to use ? and : (and others) later in order to create optional and branching routes.
 */

const allRoutes = (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route index element={<App />} />
      <Route element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="projects">
          <Route path="search" element={<ProjectSearchPage />} />
          <Route path="new" element={<NewProject />} />
          <Route path=":id" element={<ProjectPage />} />
          <Route path=":id/edit" element={<ProjectEdit />} />
        </Route>
      </Route>
    </Routes>
  </Suspense>
);

export default allRoutes;
