export default async function createTicket(input: TicketInput) {
	const headers = new Headers();

	headers.set('Content-Type', 'application/json');
	headers.set('Authorization', 'Basic' + btoa('user' + ':' + 'pass'));

	const response = await fetch('https://domain.freshdesk.com/api/v2/tickets', {
		method: 'POST',
		headers,
		body: JSON.stringify(input),
	});

	if (!response.ok) {
		throw new Error(
			`Error creating ticket: ${response.status} ${response.statusText}`
		);
	}

	return response.json();
}
