/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Models course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import {UseMutationOptions} from "@tanstack/react-query"
import config from "../../config.tsx";
import {Person} from "@/types/person.ts";

export function createPersonQuery(name: string): UseMutationOptions<Person> {
    return {
        mutationFn: () => createPerson(name)
    }
}

const createPerson = async (personName: string): Promise<Person> => {
    const response = await fetch(
        `${config.apiBaseURL}/people`,
        {
            method: "POST",
            body: JSON.stringify({"name": personName}),
            headers: {"Content-Type": "application/json"}
        }
    )

    if (!response.ok) {
        throw new Error(await response.text())
    }

    return await response.json();
}
