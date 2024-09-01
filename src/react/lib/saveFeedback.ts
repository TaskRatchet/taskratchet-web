type Options = {
	userName?: string;
	userEmail?: string;
	prompt?: string;
	response: string;
};

export default function saveFeedback(options: Options): void {
	const access_key = import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY as unknown;

	if (typeof access_key !== 'string') {
		throw new Error('Missing access key');
	}

	void fetch('https://api.web3forms.com/submit', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			...options,
			access_key,
		}),
	});
}
