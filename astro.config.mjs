import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://astro.build/config
export default defineConfig({
	integrations: [react()],
	vite: {
		plugins: [visualizer({ template: 'raw-data' })],
		build: {
			rollupOptions: {
				output: {
					chunkFileNames: 'assets/[name].[hash].chunk.js',
					entryFileNames: 'assets/[name].[hash].js',
					manualChunks: {
						dom: ['react-dom'],
						material: ['@mui/material'],
					},
				},
			},
		},
	},
});
