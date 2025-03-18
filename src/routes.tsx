/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Models course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import {Routes, Route} from "react-router";
import App from "./pages/App.tsx";
import ProjectPage from "./pages/projectPage.tsx";
import SettingsPage from "./pages/settingsPage.tsx";

/*
 this contains all of the different routes to the different pages. 
 We might need to use ? and : (and others) later in order to create optional and branching routes.
*/

const allRoutes =
    <Routes>
        <Route index element={<App/>}/>
        <Route path="/project/:id" element={<ProjectPage/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
    </Routes>

export default allRoutes 