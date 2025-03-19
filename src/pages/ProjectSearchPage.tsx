/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/
import {Project} from "../types/models.ts";
import ProjectCard from "../Components/ProjectCard.tsx";
import {Input} from "../Components/ui/input.tsx";
import Header from "@/Components/header.tsx";
import {Button} from "@/Components/ui/button.tsx";
import {useQuery} from "@tanstack/react-query";
import {searchQuery} from "@/api/searchService.tsx";
import {useState} from "react";

const ProjectSearchBar = () => {

    const [searchTerm, setSearchTerm] = useState("a");
    const {data, error, isLoading, refetch} = useQuery(searchQuery(searchTerm))

    const handleSearch = () => {
        refetch()
    }
    const projects = (data as Project[]) || [];

    return (
        <>
            <Header/>
            <div className="mb-5 min-h-screen">
                <div className="flex flex-row mb-15 mt-15 justify-center">
                    <Input className="w-1/3 rounded-2xl" type="search" placeholder="Search for any project.."
                           onChange={(e) => setSearchTerm(e.target.value)}/>
                    <Button onClick={handleSearch} type="submit">Search</Button>
                </div>
                <div className="flex flex-col items-center">
                    <h2 className="mb-8 text-3xl font-bold">Results</h2>
                    {isLoading && <h3>Loading...</h3>}
                    {error && <h3>Error: {(error as Error).message}</h3>}
                    {projects.slice(0, 10).map((project) => (
                        <ProjectCard project={project}/>
                    ))}
                </div>
            </div>

        </>)
}

export default ProjectSearchBar