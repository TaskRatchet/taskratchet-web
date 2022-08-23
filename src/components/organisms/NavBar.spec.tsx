import React from 'react';
import NavBar from './NavBar';
import { useSession } from '../../lib/api/useSession';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, Mock } from 'vitest';
import { renderWithQueryProvider } from '../../lib/test/helpers';

vi.mock('../../lib/api/useSession');

function renderComponent() {
	return renderWithQueryProvider(
		<BrowserRouter>
			<NavBar />
		</BrowserRouter>
	);
}

describe('NavBar', () => {
	const mockUseSession = useSession as Mock;

	it('displays email', async () => {
		mockUseSession.mockReturnValue({
			email: 'the_email',
		});

		renderComponent();

		userEvent.click(await screen.findByLabelText('menu'));

		await screen.findByText('the_email');
	});

	it('initially hides Logout button', () => {
		mockUseSession.mockReturnValue({
			email: 'the_email',
		});

		renderComponent();

		expect(screen.queryByText('Logout')).not.toBeInTheDocument();
	});

	it('displays Logout button when menu activated', async () => {
		mockUseSession.mockReturnValue({
			email: 'the_email',
		});

		renderComponent();

		userEvent.click(await screen.findByLabelText('menu'));

		await screen.findByText('Logout');
	});

	it('deactivates menu when backdrop clicked', async () => {
		mockUseSession.mockReturnValue({
			email: 'the_email',
		});

		renderComponent();

		userEvent.click(await screen.findByLabelText('menu'));

		const bg = await screen.findByTestId('mui-backdrop');

		userEvent.click(bg);

		await waitFor(() => {
			expect(screen.queryByText('Logout')).not.toBeInTheDocument();
		});
	});

	it('does not display logout link if no session', async () => {
		renderComponent();

		userEvent.click(await screen.findByLabelText('menu'));

		expect(screen.queryByText('Logout')).not.toBeInTheDocument();
	});

	it('has today button', async () => {
		renderComponent();

		await screen.findByLabelText('today');
	});

	it('closes drawer on navigate', async () => {
		mockUseSession.mockReturnValue({
			email: 'the_email',
		});

		renderComponent();

		userEvent.click(await screen.findByLabelText('menu'));
		userEvent.click(await screen.findByText('Account'));

		await waitFor(() => {
			expect(screen.queryByText('Logout')).not.toBeInTheDocument();
		});
	});
});
