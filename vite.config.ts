/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
	plugins: [
		react(),
		visualizer(),
		viteCompression({
			deleteOriginFile: true,
		}),
	],
	test: {
		environment: 'jsdom',
		setupFiles: ['./global-setup.ts'],
		mockReset: true,
		reporters: 'dot',
	},
});
