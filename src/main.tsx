import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter} from "react-router";
import allRoutes from './routes';

/*
This is the main entry point into the program
*/

const root = document.getElementById("root");

createRoot(root!).render(
  <StrictMode>
    <BrowserRouter>
        {allRoutes}
    </BrowserRouter>
  </StrictMode>
);

/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

