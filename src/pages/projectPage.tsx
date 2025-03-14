/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/


import { Link } from "react-router";
import {useState} from "react";
import {Card, CardContent, CardDescription, CardTitle} from "../components/ui/card"

/*
this is the main entry point into the projects page. 

This should do the following:
 - either via function or URL, receive info on which project to load
 - api call to receive the information on the project. This should also have error handling.
 - present the information in a way conforming to the styleguide and figma
 - apparantly, yesterday ben added shadeUi which can manage the components. 
 - So, use that. see this website: https://ui.shadcn.com/docs/components/card#usage
*/


function ProjectPage(){

    let [dataIsLoading, setDataIsLoading] = useState(true)
    let [projectData, setProjectData]     = useState(null)

    return (
    <div className="">
        <div className="flex flex-col w-full px-3 py-4 gap-20 bg-red-500 place-content-center">
            <Card className="w-50 flex-1 justify-center">
                <CardTitle className="text-center font-bold">Project Name Here</CardTitle>
            </Card>
            <Link className="flex-1" to = "/"> go to home </Link>
        </div>
    </div>
    )
}

export default ProjectPage