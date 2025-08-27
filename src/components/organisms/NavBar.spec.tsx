import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { renderWithQueryProvider } from '../../lib/test/renderWithQueryProvider';
import NavBar from './NavBar';

function renderComponent() {
	return renderWithQueryProvider(
		<BrowserRouter>
			<NavBar />
		</BrowserRouter>,
	);
}

describe('NavBar', () => {
	it('displays email', async () => {
		renderComponent();

		await userEvent.click(await screen.findByLabelText('menu'));

		await screen.findByText('the_email');
	});

	it('initially hides Logout button', () => {
		renderComponent();

		expect(screen.queryByText('Logout')).not.toBeInTheDocument();
	});

	it('displays Logout button when menu activated', async () => {
		renderComponent();

		await userEvent.click(await screen.findByLabelText('menu'));

		await screen.findByText('Logout');
	});

	it('deactivates menu when backdrop clicked', async () => {
		renderComponent();

		await userEvent.click(await screen.findByLabelText('menu'));

		const bg = await screen.findByTestId('mui-backdrop');

		await userEvent.click(bg);

		await waitFor(() => {
			expect(screen.queryByText('Logout')).not.toBeInTheDocument();
		});
	});

	it('does not display logout link if no session', async () => {
		renderComponent();

		await userEvent.click(await screen.findByLabelText('menu'));

		expect(screen.queryByText('Logout')).not.toBeInTheDocument();
	});

	it('has today button', async () => {
		renderComponent();

		await screen.findByLabelText('today');
	});

	it('closes drawer on navigate', async () => {
		renderComponent();

		await userEvent.click(await screen.findByLabelText('menu'));
		await userEvent.click(await screen.findByText('Settings'));

		await waitFor(() => {
			expect(screen.queryByText('Logout')).not.toBeInTheDocument();
		});
	});
});
