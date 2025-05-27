/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import ProjectCard from "@/components/projectCard";
import { Input } from "@/components/ui/input.tsx";
import { useState } from "react";
import {
  OrderByType,
  ApiClient,
  ProjectResponseDTO,
  User,
  UserRole,
} from "@team-golfslag/conflux-api-client/src/client";
import { Separator } from "@/components/ui/separator.tsx";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/datepicker.tsx";
import { useDebounce } from "@/hooks/useDebounce"; // Assuming you have or create this hook
import { useSession } from "@/hooks/SessionContext";
import { ApiWrapper } from "@/components/apiWrapper";

/** Project Search Page component <br>
 * Fetches projects from the backend using a debounced search term and selected sort order.
 * The first 15 projects matching the query are displayed.
 */
const ProjectSearchPage = () => {
  const { session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [sort, setSort] = useState(""); // Default to relevance
  const [refreshKey, setRefreshKey] = useState(0); // Used to force refresh the query

  // Debounce the search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 200); // 300ms delay

  /*
   * Function to parse the sort value from the select input
   */
  function parseOrderBy(sortValue: string): OrderByType | undefined {
    switch (sortValue) {
      case "title_asc":
        return OrderByType.TitleAsc;
      case "title_desc":
        return OrderByType.TitleDesc;
      case "start_date_asc":
        return OrderByType.StartDateAsc;
      case "start_date_desc":
        return OrderByType.StartDateDesc;
      case "end_date_asc":
        return OrderByType.EndDateAsc;
      case "end_date_desc":
        return OrderByType.EndDateDesc;
      case "relevance":
      default:
        return undefined;
    }
  }

  const handleStartDateChange = (date: Date | undefined) => {
    console.log("Start Date selected:", date);
    setStartDate(date);
    // Force refresh the query when the date changes
    setRefreshKey((prev) => prev + 1);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    console.log("End Date selected:", date);
    setEndDate(date);
    // Force refresh the query when the date changes
    setRefreshKey((prev) => prev + 1);
  };

  // Define a state variable to track when the API returns no results
  // const [hasNoResults, setHasNoResults] = useState(false);

  return (
    <search>
      <div className="relative mx-auto mb-4 w-full max-w-2xl p-4">
        <Input
          className="mx-auto h-12 w-full max-w-2xl rounded-full text-lg"
          type="search"
          placeholder="Search for title or description.."
          value={searchTerm} // Controlled input
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="text-muted-foreground absolute top-1/2 right-8 -translate-y-1/2" />
      </div>
      <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <span className="w-32 pr-2 text-sm font-semibold text-gray-600">
              Start date after
            </span>
            <DatePicker onDateChange={handleStartDateChange} />
          </div>
          <div className="flex items-center">
            <span className="w-32 pr-2 text-sm font-semibold text-gray-600">
              End date before
            </span>
            <DatePicker onDateChange={handleEndDateChange} />
          </div>
        </div>
        <Select
          value={sort}
          onValueChange={(value) => {
            setSort(value);
            // Force refresh the query when the sort order changes
            setRefreshKey((prev) => prev + 1);
          }}
        >
          <SelectTrigger className="w-50 sm:ml-auto">
            <SelectValue placeholder="Sort by.." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort by</SelectLabel>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="title_asc">Title A-Z</SelectItem>
              <SelectItem value="title_desc">Title Z-A</SelectItem>
              <SelectItem value="start_date_asc">
                Start date ascending
              </SelectItem>
              <SelectItem value="start_date_desc">
                Start date descending
              </SelectItem>
              <SelectItem value="end_date_asc">End date ascending</SelectItem>
              <SelectItem value="end_date_desc">End date descending</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator className="col-span-full my-4" />

      <ApiWrapper<ProjectResponseDTO[]>
        queryFn={(apiClient: ApiClient) =>
          apiClient.projects_GetProjectByQuery(
            debouncedSearchTerm,
            startDate,
            endDate,
            parseOrderBy(sort),
          )
        }
        dependencies={[debouncedSearchTerm, refreshKey]}
        loadingMessage="Searching projects..."
        mode="page"
      >
        {(projects) => (
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 py-8 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
            {projects.length === 0 ? (
              <h3 className="col-span-full text-center text-gray-500">
                No results found
              </h3>
            ) : (
              <>
                {projects.slice(0, 15).map((project) => {
                  // Determine current user roles for search results
                  const currentUser = project.users.find(
                    (user: User) => user.scim_id === session?.user?.scim_id,
                  );
                  const roles = currentUser?.roles
                    ? currentUser.roles.map((role: UserRole) => role.type)
                    : [];
                  return (
                    <ProjectCard
                      project={project}
                      roles={roles}
                      key={project.id}
                    />
                  );
                })}
              </>
            )}
          </div>
        )}
      </ApiWrapper>
    </search>
  );
};

export default ProjectSearchPage;
