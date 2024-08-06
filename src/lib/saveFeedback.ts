type Options = {
	userName?: string;
	userEmail?: string;
	prompt?: string;
	response: string;
};

export default function saveFeedback(options: Options): void {
	fetch('https://api.web3forms.com/submit', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			...options,
			access_key: __WEB3FORMS_ACCESS_KEY__,
		}),
	});
}
