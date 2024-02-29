/// <reference types="@remix-run/cloudflare" />
/// <reference types="vite/client" />

import type { AppLoadContext } from '@remix-run/cloudflare';
import type { PlatformProxy } from 'wrangler';

type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'>;

declare module '@remix-run/cloudflare' {
	interface AppLoadContext {
		cloudflare: Cloudflare;
	}
}
