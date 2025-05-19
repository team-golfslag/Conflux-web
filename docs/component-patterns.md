# Error Handling and Component Organization in Conflux-web

This document outlines the error handling and component organization patterns implemented throughout the Conflux-web project.

## Component Organization

### Custom Hooks

We've extracted reusable logic into custom hooks:

- `useEditableContent.ts`: Manages editable content state, with separate hooks for:
  - `useEditableText`: For simple text fields that can be edited
  - `useTruncatableText`: For text that can be truncated and expanded

### Component Patterns

Components follow these patterns:

1. **ApiWrapper Pattern**: Used to fetch data with loading and error states handled

   - `<ApiWrapper queryFn={...} dependencies={...} loadingMessage="..." mode="page|component">`

2. **ApiMutation Pattern**: Used for data mutations with loading and error handling

   - `<ApiMutation mutationFn={...} data={...} onSuccess={...} loadingMessage="..." mode="page|component">`

3. **Edit Mode Pattern**: Components that need edit functionality implement:

   - A state variable for edit mode: `const [editMode, setEditMode] = useState(false)`
   - Toggle functions: `const toggleEditMode = () => setEditMode(!editMode)`
   - Conditional rendering based on edit mode

4. **Callback Pattern**: Components use callbacks to notify parents of updates
   - `onProjectUpdate`: Used to trigger refresh of parent data
   - `onContributorAdded`, `onContributorUpdated`: Used for specific entity updates

## Error Handling

Error handling is implemented at multiple levels:

1. **API Level**: Using ApiWrapper and ApiMutation components

   - Error states are captured and displayed to users
   - Loading states prevent interactions during API calls

2. **Component Level**: Each component handles its own errors

   - User-friendly error messages
   - Fallback UI when data is missing or invalid

3. **Form Validation**: Input components validate data before submission
   - Prevent invalid data from being submitted to the API
   - Immediate feedback to users on validation errors

## Best Practices

1. Always use ApiWrapper for data fetching
2. Always use ApiMutation for data mutations
3. Extract reusable logic to custom hooks
4. Use descriptive loading and error messages
5. Implement proper state management for edit modes
6. Use callbacks to communicate between components
7. Write tests for all error handling and edge cases

## Testing

Components are tested with Cypress component tests:

- Regular functionality in normal state
- Error handling capabilities
- Edge cases with missing or invalid data
- User interactions like editing and saving

## Example Components

These components follow the patterns above:

- `ProjectOverview`: Using custom hooks for editable content
- `ProjectDetails`: Using edit mode pattern and API mutations
- `ProjectContributors`: Error handling for CRUD operations
- `AddContributorModal`: Form validation and error handling
