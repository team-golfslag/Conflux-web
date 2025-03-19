/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Models course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/


import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from "react-router";
import allRoutes from './routes';
import "./index.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

/*
This is the main entry point into the program
*/

const queryClient = new QueryClient();

const root = document.getElementById("root");

createRoot(root!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                {allRoutes}
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
);


