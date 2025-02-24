/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import { Routes, Route } from "react-router";
import App from "./pages/App.tsx";
import ProjectPagina from "./pages/projectPagina.tsx";
import SettingsPagina from "./pages/settings.tsx";

/*
 this contains all of the different routes to the different pages. 
 We might need to use ? and : (and others) later in order to create optional and branching routes.
*/

const allRoutes = 
<Routes>
  <Route index element={<App/>} /> 
  <Route path="/projectPagina" element={<ProjectPagina/>}/>
  <Route path="/settings" element={<SettingsPagina/>}/>
</Routes>

export default allRoutes 