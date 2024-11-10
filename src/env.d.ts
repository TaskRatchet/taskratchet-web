/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
	readonly PUBLIC_WEB3FORMS_ACCESS_KEY: string;
	readonly PUBLIC_STRIPE_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
