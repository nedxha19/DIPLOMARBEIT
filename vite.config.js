import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		devSourcemap: true
	},
	build: {
		cssCodeSplit: false,
		rollupOptions: {
			output: {
				assetFileNames: 'assets/[name].[hash][extname]'
			}
		}
	}
});
