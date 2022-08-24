/// <reference types="vitest" />
/// <reference types="vitest/globals" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	plugins: [react(), visualizer()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./global-setup.ts'],
		mockReset: true,
		include: ['./src/**/*.spec.{ts,tsx}'],
		reporters: 'dot',
	},
});
