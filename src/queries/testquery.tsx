import {queryOptions} from "@tanstack/react-query";

export function createQuery() { //call this inside useQuery() 
    return queryOptions({
        queryKey: ["todos"],
        queryFn: getQuery
    })
}

const getQuery = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos') //fetches some random test data
    return response.json()
}