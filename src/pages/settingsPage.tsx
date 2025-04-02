/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Link } from "react-router";

/*
This is the main entrypoint into the settings page.
It is currently empty.
*/

function SettingsPage() {
  return (
    <>
      <h1 className="text-red-500 dark:text-blue-500">
        Please create the settings page here!
      </h1>
      <Link to="/" className="dark:text-red-800">
        {" "}
        go to home{" "}
      </Link>
    </>
  );
}

export default SettingsPage;
