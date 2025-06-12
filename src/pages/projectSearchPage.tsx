/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import ProjectCard from "@/components/projectCard";
import { Input } from "@/components/ui/input.tsx";
import React, { useState, useContext, useCallback } from "react";
import {
  OrderByType,
  ApiClient,
  ProjectResponseDTO,
  UserRole,
  UserResponseDTO,
} from "@team-golfslag/conflux-api-client/src/client";
import { Separator } from "@/components/ui/separator.tsx";
import { Search, Download } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Pagination } from "@/components/ui/pagination";
import { ApiClientContext } from "@/lib/ApiClientContext";
import CsvExportDialog from "@/components/csvExportDialog";

/** Project Search Page component <br>
 * Fetches projects from the backend using a debounced search term and selected sort order.
 * Projects are displayed with client-side pagination for better user experience.
 */
const ProjectSearchPage = () => {
  const { session, saveSession } = useSession();
  const apiClient = useContext(ApiClientContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [lectorate, setLectorate] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState(""); // Default to relevance
  const [refreshKey, setRefreshKey] = useState(0); // Used to force refresh the query

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Handle favorite toggle
  const handleFavoriteToggle = useCallback(
    async (projectId: string, isFavorite: boolean) => {
      if (!session?.user) return;

      try {
        // Call the API to update favorite status in the background
        await apiClient.projects_FavoriteProject(projectId, isFavorite);

        // Fetch fresh session data from server to get updated favorites
        const freshSession = await apiClient.userSession_UserSession();
        saveSession(freshSession);
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
      }
    },
    [session, saveSession, apiClient],
  );

  // Debounce the search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 200); // 300ms delay

  // Fetch available lectorates
  const { data: availableLectorates } = useApiQuery(
    (client) => client.admin_GetLectorates(),
    [],
  );

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
    setStartDate(date);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleLectorateChange = (value: string) => {
    setLectorate(value === "all" ? undefined : value);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Reset pagination when search term or lectorate changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, lectorate]);

  // Handle pagination changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  // CSV download functionality
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [triggerDownload, setTriggerDownload] = useState(false);
  const [exportOptions, setExportOptions] = useState<{
    include_start_date?: boolean;
    include_end_date?: boolean;
    include_users?: boolean;
    include_contributors?: boolean;
    include_products?: boolean;
    include_organisations?: boolean;
    include_title?: boolean;
    include_description?: boolean;
    include_lectorate?: boolean;
    include_owner_organisation?: boolean;
  } | null>(null);

  const { data: csvData, isLoading: isDownloading } = useApiQuery(
    (apiClient: ApiClient) => {
      if (!triggerDownload || !exportOptions) {
        return Promise.resolve(null);
      }
      return apiClient.projects_ExportToCsv(
        exportOptions.include_start_date,
        exportOptions.include_end_date,
        exportOptions.include_users,
        exportOptions.include_contributors,
        exportOptions.include_products,
        exportOptions.include_organisations,
        exportOptions.include_title,
        exportOptions.include_description,
        exportOptions.include_lectorate,
        exportOptions.include_owner_organisation,
        debouncedSearchTerm,
        startDate,
        endDate,
        lectorate,
        parseOrderBy(sort),
      );
    },
    [
      debouncedSearchTerm,
      startDate,
      endDate,
      lectorate,
      sort,
      triggerDownload,
      exportOptions,
    ],
  );

  // Effect to handle the actual download when data is received
  React.useEffect(() => {
    if (csvData && triggerDownload && csvData !== null) {
      try {
        // csvData is a FileResponse object with a data property containing the Blob
        const blob = csvData.data; // Use the blob directly from the FileResponse
        const fileName =
          csvData.fileName ||
          `projects_export_${new Date().toISOString().split("T")[0]}.csv`;

        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading CSV:", error);
      }

      // Reset trigger
      setTriggerDownload(false);
    }
  }, [csvData, triggerDownload]);

  const handleDownloadCSV = () => {
    setShowExportDialog(true);
  };

  const handleExport = (options: typeof exportOptions) => {
    setExportOptions(options);
    setTriggerDownload(true);
    setShowExportDialog(false);
  };

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
      <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Start date after
            </label>
            <DatePicker onDateChange={handleStartDateChange} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              End date before
            </label>
            <DatePicker onDateChange={handleEndDateChange} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Lectorate
            </label>
            <Select
              value={lectorate || "all"}
              onValueChange={handleLectorateChange}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All lectorates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All lectorates</SelectItem>
                {availableLectorates?.map((lectorateName) => (
                  <SelectItem key={lectorateName} value={lectorateName}>
                    {lectorateName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by</label>
            <Select
              value={sort}
              onValueChange={(value) => {
                setSort(value);
                setCurrentPage(1); // Reset to first page when sort changes
                // Force refresh the query when the sort order changes
                setRefreshKey((prev) => prev + 1);
              }}
            >
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Sort by..." />
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
                  <SelectItem value="end_date_asc">
                    End date ascending
                  </SelectItem>
                  <SelectItem value="end_date_desc">
                    End date descending
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleDownloadCSV}
            disabled={isDownloading}
            variant="outline"
            size="default"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Downloading..." : "Download CSV"}
          </Button>
        </div>
      </div>
      <Separator className="col-span-full my-4" />

      <ApiWrapper<ProjectResponseDTO[]>
        queryFn={(apiClient: ApiClient) =>
          apiClient.projects_GetProjectByQuery(
            debouncedSearchTerm,
            startDate,
            endDate,
            lectorate,
            parseOrderBy(sort),
          )
        }
        dependencies={[
          debouncedSearchTerm,
          startDate,
          endDate,
          lectorate,
          refreshKey,
        ]}
        loadingMessage="Searching projects..."
        mode="page"
      >
        {(projects) => {
          // Calculate pagination
          const totalItems = projects.length;
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginatedProjects = projects.slice(startIndex, endIndex);

          return (
            <div className="space-y-6">
              <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 py-8 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
                {projects.length === 0 ? (
                  <h3 className="col-span-full text-center text-gray-500">
                    No results found
                  </h3>
                ) : (
                  <>
                    {paginatedProjects.map((project) => {
                      // Determine current user roles for search results
                      const currentUser = project.users.find(
                        (user: UserResponseDTO) =>
                          user.scim_id === session?.user?.scim_id,
                      );
                      const roles = currentUser?.roles
                        ? currentUser.roles.map((role: UserRole) => role.type)
                        : [];

                      // Check if project is favorited
                      const isFavorite =
                        session?.user?.favourite_project_ids?.includes(
                          project.id,
                        ) ?? false;

                      return (
                        <ProjectCard
                          project={project}
                          roles={roles}
                          isFavorite={isFavorite}
                          onFavoriteToggle={handleFavoriteToggle}
                          key={project.id}
                        />
                      );
                    })}
                  </>
                )}
              </div>

              {/* Pagination Component */}
              {projects.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  pageSizeOptions={[6, 15, 30, 60, 90]}
                  showPageSizeSelector={true}
                  showPageInfo={true}
                />
              )}
            </div>
          );
        }}
      </ApiWrapper>

      {/* CSV Export Dialog */}
      <CsvExportDialog
        isOpen={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={handleExport}
        isDownloading={isDownloading}
      />
    </search>
  );
};

export default ProjectSearchPage;
