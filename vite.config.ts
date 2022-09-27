/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import compress from 'vite-plugin-compress';

export default defineConfig({
	plugins: [react(), visualizer(), compress()],
	test: {
		environment: 'jsdom',
		setupFiles: ['./global-setup.ts'],
		mockReset: true,
		reporters: 'dot',
	},
});
