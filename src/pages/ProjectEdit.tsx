import Project from "@/types/Project.ts";
import {useEffect, useState} from "react";
import {useParams} from "react-router";
import ProjectForm from "@/pageComponents/ProjectForm.tsx";



const ProjectEdit = () => {

    const {projectId} = useParams();

    const [project, setProject] = useState<Project>();

    useEffect(() => {
        setProject({
            id: "1",
            title: "Dit is de titel",
            description: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            startDate: new Date(1742295746),
            endDate: new Date(1742395746),

        })
    }, [projectId])

    return <ProjectForm title="Edit project"
                        initialValue={project}
                        onChange={(x) => {console.log(x)}}
                        onSubmit={() => {}}
    />
}

export default ProjectEdit