import { cloudflareDevProxyVitePlugin as remixCloudflareDevProxy, vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
	plugins: [
		remixCloudflareDevProxy({
			configPath: './wrangler.toml',
			persist: { path: '../../.wrangler/state/v3' },
		}),
		remix(),
		tsconfigPaths(),
	],
}));
