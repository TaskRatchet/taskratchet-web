import React from 'react';
import NavBar from './NavBar';
import { useSession } from '../../lib/api/useSession';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, Mock, expect, it, describe } from 'vitest';
import { renderWithQueryProvider } from '../../lib/test/renderWithQueryProvider';

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

		await userEvent.click(await screen.findByLabelText('menu'));

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

		await userEvent.click(await screen.findByLabelText('menu'));

		await screen.findByText('Logout');
	});

	it('deactivates menu when backdrop clicked', async () => {
		mockUseSession.mockReturnValue({
			email: 'the_email',
		});

		renderComponent();

		await userEvent.click(await screen.findByLabelText('menu'));

		const bg = await screen.findByTestId('mui-backdrop');

		await userEvent.click(bg);

		await waitFor(() => {
			expect(screen.queryByText('Logout')).not.toBeInTheDocument();
		});
	});

	it('does not display logout link if no session', async () => {
		mockUseSession.mockReturnValue(null);

		renderComponent();

		await userEvent.click(await screen.findByLabelText('menu'));

		expect(screen.queryByText('Logout')).not.toBeInTheDocument();
	});

	it('closes drawer on navigate', async () => {
		mockUseSession.mockReturnValue({
			email: 'the_email',
		});

		renderComponent();

		await userEvent.click(await screen.findByLabelText('menu'));
		await userEvent.click(await screen.findByText('Account'));

		await waitFor(() => {
			expect(screen.queryByText('Logout')).not.toBeInTheDocument();
		});
	});
});
