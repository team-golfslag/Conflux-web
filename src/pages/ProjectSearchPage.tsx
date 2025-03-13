import Project from "../typing/Project.ts";
import ProjectCard from "../pageComponents/ProjectCard.tsx";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const ProjectSearchBar = () => {

    const pro: Project = {
        title: "Hoi",
        description: "blablabla",
        id: "09897836754"
    }

    return <>
        <div></div>
            <Input type="text" placeholder="Search for any project.." />
            <Button type="submit">Search</Button>
        <div>
            <h2>Results</h2>
            <ProjectCard project={pro}/>
        </div>

    </>
}

export default ProjectSearchBar