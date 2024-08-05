/// <reference types="vitest" />
import { UserConfig, defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());

	const config: UserConfig = {
		plugins: [react(), visualizer()],
		test: {
			environment: 'jsdom',
			setupFiles: ['./global-setup.ts'],
			clearMocks: true,
			reporters: 'dot',
		},
		build: {
			rollupOptions: {
				output: {
					manualChunks: {
						dom: ['react-dom'],
						material: ['@mui/material'],
						firebase: ['firebase/auth'],
					},
				},
			},
		},
		define: {
			__FIREBASE_API_KEY__: JSON.stringify(env.VITE_FIREBASE_API_KEY),
			__FIREBASE_AUTH_DOMAIN__: JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN),
			__FIREBASE_DATABASE_URL__: JSON.stringify(env.VITE_FIREBASE_DATABASE_URL),
			__FIREBASE_PROJECT_ID__: JSON.stringify(env.VITE_FIREBASE_PROJECT_ID),
			__FIREBASE_STORAGE_BUCKET__: JSON.stringify(
				env.VITE_FIREBASE_STORAGE_BUCKET,
			),
			__FIREBASE_MESSAGING_SENDER_ID__: JSON.stringify(
				env.VITE_FIREBASE_MESSAGING_SENDER_ID,
			),
			__FIREBASE_APP_ID__: JSON.stringify(env.VITE_FIREBASE_APP_ID),
		},
	};

	return config;
});
