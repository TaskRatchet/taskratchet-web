# Navigation Bar and Login Page Implementation Plan

## Navigation Bar
1. Create a new Nav component in `src/lib/components/Nav.svelte`
   ```svelte
   <nav class="bg-gray-800 text-white p-4">
     <div class="container mx-auto flex justify-between items-center">
       <a href="/" class="text-xl font-bold">TaskRatchet</a>
       <div class="space-x-4">
         <a href="/login" class="hover:text-gray-300">Login</a>
       </div>
     </div>
   </nav>
   ```

2. Update the layout to include the Nav component
   ```svelte
   // src/routes/+layout.svelte
   import Nav from '$lib/components/Nav.svelte';
   ```

## Login Page
1. Create a new login page at `src/routes/login/+page.svelte`
   ```svelte
   <div class="min-h-screen bg-gray-100 flex items-center justify-center">
     <div class="bg-white p-8 rounded-lg shadow-md w-96">
       <h1 class="text-2xl font-bold mb-6">Login to TaskRatchet</h1>
       <form class="space-y-4">
         <div>
           <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
           <input type="email" id="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
         </div>
         <div>
           <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
           <input type="password" id="password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
         </div>
         <button type="submit" class="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700">
           Login
         </button>
       </form>
     </div>
   </div>
   ```

2. Add login page test at `src/routes/login/page.svelte.test.ts`
   ```ts
   import { render, screen } from '@testing-library/svelte';
   import Page from './+page.svelte';
   
   describe('Login page', () => {
     test('renders login form', () => {
       render(Page);
       expect(screen.getByRole('heading')).toHaveTextContent('Login to TaskRatchet');
       expect(screen.getByLabelText('Email')).toBeInTheDocument();
       expect(screen.getByLabelText('Password')).toBeInTheDocument();
       expect(screen.getByRole('button')).toHaveTextContent('Login');
     });
   });
   ```

## Testing
- Run unit tests to verify login page functionality
- Verify navigation works correctly
- Check responsive design of nav bar and login form