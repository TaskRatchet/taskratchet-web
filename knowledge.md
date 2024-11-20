# TaskRatchet Web App

## Verifying changes

Use `pnpm verify` to check that code changes are valid.

## Task Status Behavior

- Pending tasks should have enabled controls (edit button, checkbox)
- Task status must persist across page refreshes
- Some controls should be disabled for non-pending tasks
- Task status determines available actions:
  - Pending: Can edit, complete, uncle, copy
  - Complete: Can mark incomplete, copy
  - Expired: Can copy
- Completing tasks requires careful handling:
  - Marking past-due tasks incomplete is a critical action
  - Reversing incompleted past-due tasks requires support intervention
  - UI should prevent accidental completion

## Future Improvements

### UI/UX

- Add loading states for actions (uncle, edit, etc.)
- Improve mobile responsiveness
- Test dark mode thoroughly
- Add keyboard navigation
- Add ARIA labels for better accessibility

### Error Handling

- Add error handling for failed API calls
- Add error boundaries for component failures

### Testing

- Add unit tests for new Svelte components
- Test performance with large task lists
- Test across different browsers
- Add end-to-end tests for critical paths

### Features

- Consider adding task sorting options
- Consider adding task filtering by status
- Consider adding task categories or tags

## Style Guide

- Keep components minimal and focused
- Use CSS variables for theming
- Follow BEM naming convention for CSS
- Use TypeScript for type safety

## Architecture

- Components should be self-contained
- State management should be simple and local when possible
- Modal state should be managed by the modal component
- API calls should be centralized
