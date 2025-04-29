/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import {ApiClient, Contributor} from "@team-golfslag/conflux-api-client/src/client";
import {ApiClientContext} from "@/lib/ApiClientContext.ts";
import {useContext, useEffect, useState} from "react";
import {Input} from "@/components/ui/input.tsx";
import ProjectContributors from "@/components/projectContributors.tsx";
import {Button} from "@/components/ui/button.tsx";

type ContributorSelectProps = {projectId: string}

const ContributorSelect = (props: ContributorSelectProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [contributors, setContributors] = useState<Contributor[]>();
    const [selectedContributor, setSelectedContributor] = useState<string>();
    const apiClient = useContext(ApiClientContext);

    useEffect(() => {
        apiClient.contributors_GetContributorsByQuery(searchTerm).then(result => setContributors(result));
    }, [searchTerm, apiClient]);

    return <>
        <div className="flex flex-row justify-center py-16">
            <Input
                className="w-1/3 rounded-2xl"
                type="search"
                placeholder="Input contributor name to search"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={ () => addContributorToProject(props.projectId, apiClient, selectedContributor)}>Add contributor</Button>
        </div>
        <div className="flex flex-col items-center">
            <h2 className="mb-8 text-3xl font-bold">Results</h2>
            <ProjectContributors people = {contributors?.slice(0, 5)} onSelect={setSelectedContributor} />
        </div>
    </>
}

const addContributorToProject = (projectId: string, apiClient: ApiClient, contributorId?: string) => {
    if(contributorId === undefined) {
        return;
    }
    apiClient.projects_AddContributorToProject(projectId, contributorId).then(() => {})
}

export default ContributorSelect;