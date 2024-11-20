import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: process.env.VITEST
		? {
				conditions: ['browser'],
			}
		: undefined,
	test: {
		environment: 'jsdom',
		setupFiles: ['./global-setup.ts'],
		clearMocks: true,
		reporters: 'dot',
		exclude: [
			'**/node_modules/**',
			'**/dist/**',
			'**/cypress/**',
			'**/.{idea,git,cache,output,temp}/**',
			'**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
			'**/src/react/**',
		],
	},
});
