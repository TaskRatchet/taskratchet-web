import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'jsdom',
		setupFiles: ['./global-setup.ts'],
		clearMocks: true,
		reporters: 'dot',
		exclude: ['**/src/react/**'],
	},
});
