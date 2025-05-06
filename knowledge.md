# TaskRatchet Web

## Project Overview
- SvelteKit web application
- Uses Tailwind CSS for styling
- Cloudflare adapter for deployment
- TypeScript for type safety
- Vitest for testing with Testing Library
- PNPM for package management

## Development
- Use PNPM for package management (see .tool-versions)
- Node.js version 22.9.0 required
- PNPM version 10.6.1 required

## Testing
Run tests after changes:
```bash
pnpm test
```

## Code Style
- Prettier for formatting
- ESLint for linting
- Uses tabs for indentation
- Single quotes preferred
- Max line width: 100 characters

## Important Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run tests
- `pnpm lint` - Run linting
- `pnpm format` - Format code

## Project Structure
- `/src/routes` - SvelteKit routes
- `/src/lib` - Shared components and utilities
- `/static` - Static assets