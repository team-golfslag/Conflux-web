/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import {useQuery} from "@tanstack/react-query";
import {Person} from "@/types/person.ts";
import {useState} from "react";
import Header from "@/components/header.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {searchPeopleQuery} from "@/api/personService.tsx";

const PersonSearch = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const {data, error, isLoading, refetch} = useQuery(searchPeopleQuery(searchTerm));

    const handleSearch = () => {
        refetch();
    };
    const people = (data as Person[]) || [];

    return (
        <>
            <Header/>
            <div className="mb-5 min-h-screen">
                <div className="mt-15 mb-15 flex flex-row justify-center">
                    <Input
                        className="w-1/3 rounded-2xl"
                        type="search"
                        placeholder="Search for any project.."
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button onClick={handleSearch} type="submit">
                        Search
                    </Button>
                </div>
                <div className="flex flex-col items-center">
                    <h2 className="mb-8 text-3xl font-bold">Results</h2>
                    {isLoading && <h3>Loading...</h3>}
                    {error && <h3>Error: {error.message}</h3>}
                    {people.slice(0, 10).map((person) => (
                        <p>{person.name}</p>
                    ))}
                </div>
            </div>
        </>
    );
};

export default PersonSearch;

