/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import Header from "@/components/header.tsx";
import Footer from "@/components/footer.tsx";
import { ReactElement } from "react";
import { Outlet } from "react-router-dom";

/** Layout component <br>
 * This component is used to create the layout of the page.
 */
export default function Layout(): ReactElement {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
