/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/


import { Link } from "react-router"

/*
this is the main entry point into the projects page. 
It is currently empty.
*/

function ProjectPage() 
{
    return (
    <>
        <section class = "fixed top-10 left-10 right-10 bg-sky-500">
            <h1>Title</h1>
        </section>
        <article class = "fixed left-10 top-34 bg-amber-600">
            <section>
            <h1>Project Description</h1>
            <p>blablalba</p>
            </section>
        </article>
        <aside class = "fixed right-10 top-34 bg-amber-600">
            time
        </aside>
        <aside class = "fixed right-10 top-44 bg-amber-600">
            Contributors
        </aside>
        <Link to = "/"> go to home </Link>
    </>
    )
}

export default ProjectPage