/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import DashboardListView from "@/components/dashboardListView.tsx";
import dashboardMetrics from "@/components/dashboardMetrics.tsx";
import {useContext, useEffect, useState} from "react";
import {ApiClientContext} from "@/lib/ApiClientContext.ts";
import {Project} from "@team-golfslag/conflux-api-client/src/client.ts";

export default function Dashboard() {
    
    const apiClient = useContext(ApiClientContext);
    const [projects, setProjects] = useState<Project[]>();
    const [cancelRequest, setCancelRequest] = useState<() => void>();
    const [error, setError] = useState<Error>();

    useEffect(() => {
        let isCanceled = false;
        if (cancelRequest) cancelRequest();
        setCancelRequest(() => () => {
            isCanceled = true;
        });
        apiClient
            .projects_GetAllProjects()
            .then((ps) => {
                if (!isCanceled) {
                    setProjects(ps);
                    console.log(ps);
                    setCancelRequest(undefined);
                }
            })
            .catch((e) => {
                if (!isCanceled) {
                    setError(e);
                    setCancelRequest(undefined);
                }
            });
    }, [apiClient]);
    
    return (
        <>
            <div>
                <main className="mx-6 mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="md:col-span-1 flex flex-col items-center rounded-lg bg-white p-4 shadow max-h-screen">
                        {!projects && <h3>Loading...</h3>}
                        {DashboardListView(projects)}
                        {error && <h3>Error: {error.message}</h3>}
                    </div>
                    <div className="md:col-span-1 flex flex-col items-center rounded-lg bg-white p-4 shadow max-h-1/2">
                        {dashboardMetrics()}
                    </div>
                </main>
            </div>
        </>
    );
}