import {useMutation} from "@tanstack/react-query";
import {createPersonQuery} from "@/api/personService.tsx";
import {useEffect} from "react";
import {Person} from "@/types/person.ts";

export default function PersonAdd() {

    const {
        data: person,
        mutate,
        error: mutationError,
        isSuccess
    } = useMutation<Person>(createPersonQuery("henk de boer"))

    useEffect(() => {
        if (isSuccess) {
            alert(person.name)
        }
    }, [isSuccess, person]);

    if (mutationError) {
        return <p>mutationError.message</p>;
    }

    return (
        <>
            <button onClick={() => mutate()}>YHAEI</button>
        </>
    )
}