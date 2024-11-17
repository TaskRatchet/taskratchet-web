import { defineConfig } from 'astro/config';
import Icons from 'unplugin-icons/vite';

import react from '@astrojs/react';
import { visualizer } from 'rollup-plugin-visualizer';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
	integrations: [
		react(),
		svelte({
			extensions: ['.svelte'],
		}),
	],
	vite: {
		plugins: [
			visualizer({ template: 'raw-data' }),
			Icons({
				compiler: 'svelte',
			}),
		],
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
