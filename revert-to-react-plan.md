# Plan: Revert from Astro to Pure React Application

## Overview
This plan outlines the steps to revert the TaskRatchet web application from Astro back to a pure React SPA using Vite, based on the pre-Astro state at commit 32c97d6.

## Current State Analysis
- **Astro files to remove**: `astro.config.mjs`, `src/layouts/Layout.astro`, `src/pages/*.astro`
- **Dependencies to remove**: `astro`, `@astrojs/react`, `@astrojs/check`
- **Dependencies to add back**: `@vitejs/plugin-react`, `vite`, `sass`
- **Entry point**: Currently uses Astro pages, needs to revert to `index.html` + `src/index.jsx`

## Step-by-Step Migration Plan

### 1. Restore Build Configuration
- **Remove**: `astro.config.mjs`
- **Create**: `vite.config.ts` with React plugin and build optimizations
- **Restore**: Root `index.html` file as main entry point
- **Update**: `tsconfig.json` to remove Astro extends and use standard React config

### 2. Update Package Dependencies
- **Remove Astro deps**: `astro`, `@astrojs/react`, `@astrojs/check`
- **Add Vite deps**: `@vitejs/plugin-react`, `vite`, `sass`
- **Update scripts**: Replace Astro commands with Vite equivalents
  - `dev: "vite"` 
  - `build: "vite build"`
  - `preview: "vite preview"`
- **Remove**: `"type": "module"` from package.json (optional, depends on preference)

### 3. Convert Astro Pages to React Components
- **Delete**: `src/pages/index.astro` (React App already exists)
- **Convert**: `src/pages/login.astro` → React component with routing
- **Convert**: `src/pages/register.astro` → React component with routing
- **Delete**: `src/layouts/Layout.astro`

### 4. Restore React Router Setup
- **Update**: `src/react/App.tsx` to include login/register routes
- **Create**: Login and Register React components from Astro page logic
- **Ensure**: All routes are handled by React Router

### 5. Handle Global Styles and Scripts
- **Extract**: CSS from `Layout.astro` into global CSS file or App component
- **Move**: Stripe and Freshworks scripts to `index.html`
- **Restore**: Color constants and theming in React components

### 6. Update Environment Variables
- **Remove**: Astro-specific env references from `src/env.d.ts`
- **Restore**: Vite environment variable pattern (`VITE_*` prefixes)
- **Update**: Components to use `import.meta.env.VITE_*` instead of `PUBLIC_*`

### 7. Fix TypeScript Configuration
- **Remove**: `/// <reference path="../.astro/types.d.ts" />` from `src/env.d.ts`
- **Update**: `tsconfig.json` to extend standard React TypeScript config
- **Ensure**: All React components have proper TypeScript support

### 8. Update CI/CD and Deployment
- **Update**: GitHub Actions workflows to use Vite build commands
- **Remove**: Astro-specific build artifacts and configurations
- **Ensure**: Static file deployment works with Vite output structure

### 9. Authentication Integration
- **Restore**: Firebase authentication (was removed during Astro transition)
- **Update**: Login/register components to use proper auth flow
- **Ensure**: Session management works with React Router

### 10. Testing and Validation
- **Update**: Test configurations for Vite instead of Astro
- **Test**: All routes and functionality work correctly
- **Verify**: Build output is correct for static deployment
- **Check**: All environment variables and external scripts load properly

## Key Files to Create/Restore

### `index.html` (root)
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>TaskRatchet</title>
    <!-- Stripe, Freshworks, fonts -->
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>
```

### `vite.config.ts`
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [react(), visualizer({ template: 'raw-data' })],
  // ... build config, env vars, etc.
});
```

### Updated `src/react/App.tsx`
- Add routes for `/login` and `/register`
- Include converted login/register components
- Handle authentication state properly

## Risk Mitigation
- **Backup**: Current working state before starting migration
- **Incremental**: Test each step to ensure functionality isn't broken
- **Rollback plan**: Keep Astro branch available for quick revert if needed
- **Environment**: Test in development before deploying to production

## Success Criteria
- ✅ Application builds successfully with Vite
- ✅ All routes work correctly with React Router
- ✅ Authentication flow functions properly
- ✅ All existing React components continue to work
- ✅ Deployment pipeline works with new build process
- ✅ No functionality is lost in the migration