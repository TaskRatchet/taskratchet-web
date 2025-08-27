# GitHub Copilot Instructions for TaskRatchet Web

## Project Overview

TaskRatchet is a task management application that helps users commit to completing tasks by putting financial stakes on the line. If users don't complete their tasks by the deadline, they are charged the stake amount.

**Live Application**: https://app.taskratchet.com/

## Technology Stack

- **Frontend Framework**: Astro with React integration
- **Language**: TypeScript (strict mode)
- **UI Library**: Material-UI (@mui/material, @mui/lab, @mui/icons-material)
- **State Management**: React Query for server state management
- **API SDK**: @taskratchet/sdk (custom SDK for API interactions)
- **Styling**: SCSS + Material-UI theming
- **Date/Time**: dayjs library
- **Testing**: Vitest + React Testing Library + jsdom
- **Linting**: ESLint with TypeScript, React, and Prettier configs
- **Package Manager**: pnpm (strictly enforced - do not suggest npm or yarn)

## Development Environment

### Setup Commands

```bash
nvm use          # Use correct Node.js version
pnpm install     # Install dependencies (never use npm/yarn)
pnpm start       # Start development server
pnpm test        # Run tests
pnpm lint        # Run linting
pnpm build       # Build for production
```

### Code Quality Standards

- **Zero warnings policy**: `eslint --max-warnings 0`
- **Type safety**: All code must be properly typed
- **Test coverage**: Components should have corresponding test files
- **Prettier formatting**: Auto-formatting is enforced

## Architecture Patterns

### Atomic Design Structure

The project follows atomic design principles with a clear component hierarchy:

```
src/react/components/
├── atoms/          # Basic building blocks (buttons, inputs, icons)
├── molecules/      # Simple component combinations (forms, cards)
├── organisms/      # Complex components (headers, forms with logic)
└── pages/          # Full page components
```

### Component Naming Conventions

- Use PascalCase for component files: `TaskEdit.tsx`
- Include corresponding test files: `TaskEdit.spec.tsx`
- Use descriptive, domain-specific names: `TaskForm`, `BeeminderSettings`

### File Organization

```
ComponentName.tsx       # Main component
ComponentName.spec.tsx  # Test file
ComponentName.scss      # Styles (if needed beyond Material-UI)
index.ts               # Barrel exports (when appropriate)
```

## API Integration Patterns

### TaskRatchet SDK Usage

```typescript
import { getMe, editTask, addTask } from '@taskratchet/sdk';

// Always use the SDK for API calls, not direct fetch/axios
const user = await getMe();
```

### React Query Patterns

```typescript
// Custom hooks for API operations
const useEditTask = () => {
	return useMutation({
		mutationFn: ({ id, due, cents }) => editTask(id, due, cents),
		onSuccess: () => {
			// Invalidate related queries
		},
	});
};

// Query hooks for data fetching
const { data: tasks, isLoading } = useTasks();
```

## Core Domain Types

### Task Management Types

```typescript
type TaskType = {
	id: string;
	task: string; // Task description
	due: number; // Unix timestamp
	cents: number; // Stake amount in cents
	complete: boolean;
	status: 'pending' | 'complete' | 'expired';
	chargeStatus?: 'notified' | 'authorized' | 'captured';
	contested?: boolean;
};

type TaskInput = {
	task: string;
	due: number;
	cents: number;
};
```

### Status Types

- **pending**: Task is active and can be completed
- **complete**: Task has been marked as done
- **expired**: Task deadline has passed without completion

## Component Development Guidelines

### Material-UI Usage

```typescript
// Prefer Material-UI components over custom HTML
import { Button, TextField, Dialog } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// Use sx prop for styling
<Button sx={{ mt: 2, mb: 1 }}>Save</Button>

// Use consistent spacing (multiples of 8px)
<Stack spacing={2}>
```

### Form Handling Patterns

```typescript
// State management for forms
const [task, setTask] = useState<string>('');
const [due, setDue] = useState<number>(getDefaultDue());
const [cents, setCents] = useState<number>(500);
const [error, setError] = useState<string>('');

// Validation patterns
if (cents < 100) {
	setError('Minimum stakes is $1.00');
	return;
}
```

### Error Handling

```typescript
// Display user-friendly error messages
const errorMessage = editTask.error?.message ?? '';
// Validate business rules
if (cents < task.cents) {
	setError('Stakes cannot be less than the original task');
	return;
}
```

## Testing Guidelines

### Test File Structure

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { TestWrapper } from '../test/renderWithQueryProvider';

describe('ComponentName', () => {
	it('should handle the main functionality', () => {
		// Test implementation
	});
});
```

### Common Testing Patterns

```typescript
// Render with React Query wrapper
const { result } = renderHook(useEditTask, {
	wrapper: TestWrapper,
});

// Test user interactions
const button = screen.getByRole('button', { name: 'Save' });
await user.click(button);

// Test async operations
await waitFor(() => {
	expect(mockFunction).toHaveBeenCalledWith(expectedArgs);
});
```

### Mock Patterns

- Use `vitest-fetch-mock` for API mocking
- Mock external dependencies in `__mocks__` directory
- Use controlled promises for async testing

## Business Logic Guidelines

### Financial Stakes

- Stakes are stored in cents (minimum 100 = $1.00)
- Display as dollars: `${task.cents / 100}`
- Validation: ensure cents >= 100

### Date/Time Handling

```typescript
import dayjs from 'dayjs';

// Use Unix timestamps for storage
const due = dayjs().add(1, 'day').unix();

// Format for display
const dateString = browser.getDateString(new Date(task.due * 1000));
```

### Task Operations

- **Create**: Users can create tasks with description, due date, and stakes
- **Edit**: Can only increase stakes and move due date earlier
- **Complete**: Mark tasks as done (only pending tasks)
- **Expire**: System automatically expires overdue tasks

## Common Patterns

### Loading States

```typescript
const mutation = useEditTask();

<LoadingButton
  loading={mutation.isLoading}
  type="submit"
>
  Save
</LoadingButton>
```

### Conditional Rendering

```typescript
// Check task status before rendering actions
{task.status === 'pending' && (
  <Button onClick={handleEdit}>Edit</Button>
)}
```

### Navigation

```typescript
import { Link } from 'react-router-dom';

<Button component={Link} to="/settings">
  Settings
</Button>
```

## Code Style Preferences

1. **Functional Components**: Always use function components with hooks
2. **TypeScript**: Explicit typing, avoid `any`
3. **Destructuring**: Prefer destructuring for props and state
4. **Arrow Functions**: Use arrow functions for inline handlers
5. **Import Organization**: Group imports (React, libraries, local)
6. **Naming**: Use descriptive names that reflect domain concepts

## Performance Considerations

- Use React Query for caching and background updates
- Implement proper loading states
- Lazy load heavy components when appropriate
- Use React.memo for expensive re-renders (sparingly)

## Security Guidelines

- Never expose sensitive data in client-side code
- Use the TaskRatchet SDK for all API communications
- Validate all user inputs before submission
- Handle authentication through the established patterns

## Deployment Notes

- Built with Astro static site generation
- Deployed automatically on master branch merges
- Uses CI/CD pipeline with GitHub Actions
- Environment variables managed through hosting platform

When suggesting code changes or new features, always consider these patterns and maintain consistency with the existing codebase architecture.
