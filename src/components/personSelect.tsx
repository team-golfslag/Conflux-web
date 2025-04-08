/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import * as React from "react"

// import {useMediaQuery} from "@/hooks/use-media-query"
import {Button} from "@/components/ui/button.tsx"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command.tsx"
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer.tsx"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.tsx"
import {useState, useEffect} from 'react';
import {Person} from "@/types/person.ts";
import {useQuery} from "@tanstack/react-query";
import {searchPeopleQuery} from "@/api/personService.tsx";
import {Plus} from "lucide-react";


function getWindowDimensions() {
    const {innerWidth: width, innerHeight: height} = window;
    return {
        width,
        height
    };
}

function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}


export function PersonSelect() {
    const {data, error, isLoading} = useQuery(searchPeopleQuery(""));
    const people = (data as Person[]) || [];

    const [open, setOpen] = React.useState(false)
    const isDesktop = useWindowDimensions().width >= 800
    const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(
        null
    )
    console.log(selectedPerson);
    if (isDesktop) {
        return (
            <div
                className="border-border my-2 flex max-h-49 rounded-lg border-2 text-black bg-white
                duration-300 hover:cursor-pointer hover:border-purple-700 hover:shadow-lg hover:shadow-gray-300">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button className="flex flex-row overflow-hidden justify-left">

                                <div className="mx-2 flex w-max">
                                    <Plus className="h-full w-full rounded-full object-contain"/>
                                </div>
                                <div className="mx-2 my-5 w-full">
                                    <h2 className="mb-3 text-2xl my-2 overflow-hidden max-w-full">Add new person</h2>
                                </div>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                        {isLoading && "Loading..."}
                        {error && `Error... ${error.message}`}
                        <StatusList setOpen={setOpen} setSelectedPerson={setSelectedPerson} people={people}/>
                    </PopoverContent>
                </Popover>
            </div>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    className="border-border my-2 flex max-h-49 rounded-lg border-2 bg-white px-4 py-4 duration-300 hover:cursor-pointer hover:border-purple-700 hover:shadow-lg hover:shadow-gray-300">
                    <div className="mx-4 flex w-1/6 justify-center">
                        <Plus className="h-full w-full rounded-full object-contain"/>
                    </div>
                    <div className="mx-2 flex w-full flex-col overflow-y-clip p-2">
                        <h2 className="mb-3 text-2xl">Add new person</h2>
                    </div>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mt-4 border-t">
                    {isLoading && "Loading..."}
                    {error && `Error... ${error.message}`}
                    <StatusList setOpen={setOpen} setSelectedPerson={setSelectedPerson} people={people}/>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

function StatusList({
                        setOpen,
                        setSelectedPerson,
                        people,
                    }: {
    setOpen: (open: boolean) => void
    setSelectedPerson: (person: Person | null) => void
    people: Person[]
}) {
    const [name, setName] = useState("");
    return (
        <Command>
            <CommandInput placeholder="Filter people..." onValueChange={(e) => setName(e)}/>
            <CommandList>
                <CommandEmpty>
                    <Button>
                        Add {name} as new person
                    </Button>
                </CommandEmpty>
                <CommandGroup>
                    {people.map((person) => (
                        <CommandItem
                            key={person.id}
                            value={person.name}
                            onSelect={(value) => {
                                setSelectedPerson(
                                    people.find((priority) => priority.name === value) || null
                                )
                                setOpen(false)
                            }}
                        >
                            {person.name}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}
