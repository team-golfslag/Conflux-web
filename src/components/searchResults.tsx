import {useQuery} from "@tanstack/react-query";
import {createSearchQuery} from "@/api/searchService.tsx";

const SearchResults = () => {
    const {data, error, isLoading} = useQuery(createSearchQuery());
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <div>
            <h2>{data[0].title}</h2>
            <p>{data[0].description}</p>
        </div>
    )
}

export default SearchResults;