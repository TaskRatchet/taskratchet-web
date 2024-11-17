/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
	readonly PUBLIC_WEB3FORMS_ACCESS_KEY: string;
	readonly PUBLIC_STRIPE_KEY: string;
	readonly PUBLIC_BEEMINDER_CLIENT_ID: string;
	readonly PUBLIC_BEEMINDER_REDIRECT_URI: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
