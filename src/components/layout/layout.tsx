/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ReactElement } from "react";
import { Outlet } from "react-router-dom";

/** Layout component <br>
 * This component is used to create the layout of the page.
 */
export default function Layout(): ReactElement {
  return (
    <>
      <Header />
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-8">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
