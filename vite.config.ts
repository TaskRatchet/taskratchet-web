import { visualizer } from 'rollup-plugin-visualizer';

export default {
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
};
