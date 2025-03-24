/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import {Routes, Route} from "react-router";
import App from "./pages/app.tsx";
import ProjectPage from "./pages/projectPage.tsx";
import SettingsPage from "./pages/settingsPage.tsx";
import ProjectSearchPage from "@/pages/projectSearchPage.tsx";

/**
 * This contains all different routes to the different pages. <br>
 * We might need to use ? and : (and others) later in order to create optional and branching routes.
 */

const allRoutes =
    <Routes>
        <Route index element={<App/>}/>
        <Route path="/project/:id" element={<ProjectPage/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/projects/search" element={<ProjectSearchPage/>}/>
    </Routes>

export default allRoutes 