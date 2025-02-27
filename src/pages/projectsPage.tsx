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

const projects = ["onderoek1", "proj2", "hetENEProjectsMetEenLangeNaamZonderSpatiesZodatWeDatKunnenTesten NuMetSpatie", "proj", "proj", "proj", "proj"];

function ProjectsPage() {
    return (
    <>
        <h1>Projects</h1>
        <Link to = "/"> go to home </Link>
        <div className="flex-wrap space-x-4 space-y-4 w-130 bg-blue-50">
          {projects.map((name:string)=> <ProjectCard name={name}/>)}
        </div>
    </>
    )
}


function ProjectCard(props:any){
  return(<>
    <div className="cursor-wait rounded-lg bg-blue-600 border-4 w-30">
      <h2 className="truncate">{props.name}</h2>
      <a>haha</a>
    </div>
  </>)
}



export default ProjectsPage