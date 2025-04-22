/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Routes, Route } from "react-router";
import ProjectPage from "./pages/projectPage.tsx";
import SettingsPage from "./pages/settingsPage.tsx";
import ProjectSearchPage from "@/pages/projectSearchPage.tsx";
import ProjectEdit from "@/pages/ProjectEdit.tsx";
import Layout from "@/components/layout.tsx";
import App from "@/pages/app.tsx";

/**
 * This contains all different routes to the different pages. <br>
 * We might need to use ? and : (and others) later in order to create optional and branching routes.
 */

const allRoutes = (
  <Routes>
    <Route index element={<App />} />
    <Route element={<Layout />}>
      <Route path="settings" element={<SettingsPage />} />
      <Route path="projects">
        <Route path="search" element={<ProjectSearchPage />} />
        <Route path=":id" element={<ProjectPage />} />
        <Route path=":id/edit" element={<ProjectEdit />} />
      </Route>
    </Route>
  </Routes>
);

export default allRoutes;
