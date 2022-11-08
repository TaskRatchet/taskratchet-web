import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	plugins: [react(), visualizer()],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					dom: ['react-dom'],
					material: ['@mui/material'],
				},
			},
		},
	},
});
