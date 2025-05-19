# Error Handling Guide for Conflux-Web

This document provides guidelines for handling API errors in the Conflux-Web application.

## Overview

The application uses three main components to handle API interactions with consistent error handling:

1. `useApiQuery` - A hook for making API calls
2. `ApiWrapper` - A component that combines the `useApiQuery` hook with the `LoadingWrapper`
3. `ApiMutation` - A component for handling create, update, and delete operations with error handling

## Using the `ApiWrapper` Component

The `ApiWrapper` component provides a simple way to make API queries with loading states and error handling.

```tsx
<ApiWrapper
  queryFn={(apiClient) => apiClient.someQuery(params)}
  dependencies={[dependency1, dependency2]} // Variables that should trigger a refresh when changed
  loadingMessage="Loading data..."
>
  {(data) => (
    // Render your UI with the returned data
    <div>{data.name}</div>
  )}
</ApiWrapper>
```

### Features:

- Automatically handles loading states
- Displays errors with a retry button
- Manages data fetching and refetching when dependencies change

## Using the `ApiMutation` Component

The `ApiMutation` component is designed for handling operations that modify data (create, update, delete).

```tsx
<ApiMutation
  mutationFn={(apiClient, data) => apiClient.someUpdateFunction(data)}
  data={formData}
  loadingMessage="Saving changes..."
  onSuccess={(result) => {
    // Handle successful mutation
    toast.success("Changes saved successfully!");
    navigate("/some-route");
  }}
>
  {({ isLoading, error, onSubmit }) => (
    <div>
      {error && <p className="error">{error.message}</p>}
      <Button onClick={onSubmit} disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  )}
</ApiMutation>
```

### Features:

- Handles loading states during mutation
- Provides error handling
- Supports success and error callbacks
- Gives access to the mutation state for UI feedback

## Best Practices

1. **Always use `ApiWrapper` for API queries**

   - Provides consistent loading and error states across the application
   - Centralizes error handling logic

2. **Use `ApiMutation` for all API operations that modify data**

   - Ensures consistent error handling for mutations
   - Provides proper loading states during operations

3. **Provide meaningful loading messages**

   - Help users understand what's happening
   - Be specific about the operation (e.g., "Saving project details..." instead of "Loading...")

4. **Always handle the success case**

   - Update UI state when operations complete
   - Provide feedback to the user

5. **Use the retry mechanism**
   - ApiWrapper provides built-in retry functionality
   - Let users attempt to recover from temporary failures

## Error Handling Flow

1. API calls throw a `SwaggerException` when they fail
2. Error information is captured in the component
3. User is shown an error message with a retry option
4. On retry, the API call is attempted again

## Example Implementation

```tsx
// Fetching data with ApiWrapper
<ApiWrapper
  queryFn={(apiClient) => apiClient.projects_GetProjectById(id)}
  dependencies={[id, refreshKey]}
  loadingMessage="Loading project details..."
>
  {(project) => (
    <div>
      <h1>{project.title}</h1>
      <p>{project.description}</p>

      {/* Nested mutation for updating */}
      <ApiMutation
        mutationFn={(apiClient, data) =>
          apiClient.projects_UpdateProject(id, data)
        }
        data={formData}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      >
        {({ onSubmit, isLoading, error }) => (
          <>
            {error && <div className="error">{error.message}</div>}
            <Button onClick={onSubmit} disabled={isLoading}>
              Save Changes
            </Button>
          </>
        )}
      </ApiMutation>
    </div>
  )}
</ApiWrapper>
```
