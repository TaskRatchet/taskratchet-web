/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	plugins: [react(), visualizer()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./global-setup.ts'],
		mockReset: true,
	},
});
