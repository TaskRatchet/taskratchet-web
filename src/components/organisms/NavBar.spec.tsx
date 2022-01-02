import { render } from '@testing-library/react';
import React from 'react';
import NavBar from './NavBar';
import { useSession } from '../../lib/api/useSession';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

jest.mock('../../lib/api/useSession');

async function renderComponent() {
	const queryClient = new QueryClient();
	return render(
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<NavBar />
			</BrowserRouter>
		</QueryClientProvider>
	);
}

describe('NavBar', () => {
	const mockUseSession = useSession as jest.Mock;

	it('displays email', async () => {
		mockUseSession.mockReturnValue({
			email: 'the_email',
		});

		const { getByText, getByLabelText } = await renderComponent();

		userEvent.click(getByLabelText('menu'));

		expect(getByText('the_email')).toBeInTheDocument();
	});

	it('initially hides Logout button', async () => {
		mockUseSession.mockReturnValue({
			email: 'the_email',
		});

		const { queryByText } = await renderComponent();

		expect(queryByText('Logout')).not.toBeInTheDocument();
	});

	it('displays Logout button when menu activated', async () => {
		mockUseSession.mockReturnValue({
			email: 'the_email',
		});

		const { getByText, getByLabelText } = await renderComponent();

		userEvent.click(getByLabelText('menu'));

		expect(getByText('Logout')).toBeInTheDocument();
	});

	it('deactivates menu when backdrop clicked', async () => {
		mockUseSession.mockReturnValue({
			email: 'the_email',
		});

		const { baseElement, getByLabelText, queryByText } =
			await renderComponent();

		userEvent.click(getByLabelText('menu'));

		const bg = baseElement.querySelector('.MuiBackdrop-root');

		if (!bg) throw new Error('could not find drawer bg');

		userEvent.click(bg);

		await waitFor(() => {
			expect(queryByText('Logout')).not.toBeInTheDocument();
		});
	});

	it('does not display logout link if no session', async () => {
		const { queryByText, getByLabelText } = await renderComponent();

		userEvent.click(getByLabelText('menu'));

		expect(queryByText('Logout')).not.toBeInTheDocument();
	});

	it('has today button', async () => {
		const { getByLabelText } = await renderComponent();

		expect(getByLabelText('today')).toBeInTheDocument();
	});

	it('closes drawer on navigate', async () => {
		mockUseSession.mockReturnValue({
			email: 'the_email',
		});

		const { getByText, getByLabelText, queryByText } = await renderComponent();

		userEvent.click(getByLabelText('menu'));
		userEvent.click(getByText('Account'));

		await waitFor(() => {
			expect(queryByText('Logout')).not.toBeInTheDocument();
		});
	});
});

// TODO:
// buttons can be pressed while loading indicator present
