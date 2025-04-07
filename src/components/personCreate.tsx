/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import {useMutation} from "@tanstack/react-query";
import {createPersonQuery} from "@/api/personService.tsx";
import {useEffect} from "react";
import {Person} from "@/types/person.ts";
import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

export default function PersonCreate() {

    const name = "";
    const {
        data: person,
        mutate,
        error: mutationError,
        isSuccess
    } = useMutation<Person>(createPersonQuery(name))

    useEffect(() => {
        if (isSuccess) {
            alert(person.name + " was added successfully.")
        }
    }, [isSuccess, person]);

    if (mutationError) {
        alert(mutationError.message)
    }

    return (
        <Button onClick={() => mutate}>
            <div className="mx-4 flex w-1/6 justify-center">
                <Plus className="h-full w-full rounded-full object-contain"/>
            </div>
            <div className="mx-2 flex w-full flex-col overflow-y-clip p-2">
                <h2 className="mb-3 text-2xl">Add new person</h2>
            </div>
        </Button>
    )
}