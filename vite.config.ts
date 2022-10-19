/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	plugins: [react(), visualizer()],
	test: {
		environment: 'jsdom',
		setupFiles: ['./global-setup.ts'],
		mockReset: true,
		reporters: 'dot',
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					material: ['@mui/material'],
				},
			},
		},
	},
});
