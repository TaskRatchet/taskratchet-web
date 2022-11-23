import React from 'react';
import NavBar from './NavBar';
import { useSession } from '../../lib/api/useSession';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, Mock, expect, it, describe, beforeEach } from 'vitest';
import { renderWithQueryProvider } from '../../lib/test/renderWithQueryProvider';
import createTicket from '../../lib/createTicket';
import { getMe } from '../../lib/api/getMe';
import { withMutedReactQueryLogger } from '../../lib/test/withMutedReactQueryLogger';
import loadControlledPromise from '../../lib/test/loadControlledPromise';

vi.mock('../../lib/api/useSession');

function renderComponent() {
	return renderWithQueryProvider(
		<BrowserRouter>
			<NavBar />
		</BrowserRouter>
	);
}

async function fillForm() {
	await userEvent.type(await screen.findByLabelText(/Email/), 'the_email');
	await userEvent.type(await screen.findByLabelText(/Message/), 'the_message');
}

describe('NavBar', () => {
	const mockUseSession = useSession as Mock;

	beforeEach(() => {
		vi.mocked(getMe).mockClear();
		vi.mocked(createTicket).mockClear();
		vi.mocked(getMe).mockResolvedValue({
			data: {
				id: 'the_user_id',
			},
		} as any);
	});

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

	it('has today button', async () => {
		renderComponent();

		await screen.findByLabelText('today');
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

	it('opens feedback form', async () => {
		renderComponent();

		await userEvent.click(await screen.findByLabelText('feedback'));

		expect(screen.getByText('Feedback')).toBeInTheDocument();
	});

	it('submits feedback form', async () => {
		renderComponent();

		await userEvent.click(await screen.findByLabelText('feedback'));
		await fillForm();
		await userEvent.click(await screen.findByText('Submit'));

		expect(createTicket).toHaveBeenCalled();
	});

	it('sends feedback in ticket', async () => {
		renderComponent();

		await userEvent.click(await screen.findByLabelText('feedback'));
		await fillForm();
		await userEvent.click(await screen.findByText('Submit'));

		expect(createTicket).toHaveBeenCalledWith(
			expect.objectContaining({
				description: 'the_message',
			})
		);
	});

	it('includes user id in ticket', async () => {
		vi.mocked(getMe).mockResolvedValue({
			id: 'the_user_id',
		} as any);

		renderComponent();

		await userEvent.click(await screen.findByLabelText('feedback'));
		await fillForm();
		await userEvent.click(await screen.findByText('Submit'));

		expect(createTicket).toHaveBeenCalledWith(
			expect.objectContaining({
				unique_external_id: 'the_user_id',
			})
		);
	});

	it('asks for email address if user not logged in', async () => {
		await withMutedReactQueryLogger(async () => {
			vi.mocked(getMe).mockRejectedValue(new Error('Not logged in'));

			renderComponent();

			await userEvent.click(await screen.findByLabelText('feedback'));
			await userEvent.type(await screen.findByLabelText(/Email/), 'the_email');
			await userEvent.type(
				await screen.findByLabelText(/Message/),
				'the_message'
			);
			await userEvent.click(await screen.findByText('Submit'));

			expect(createTicket).toHaveBeenCalledWith(
				expect.objectContaining({
					email: 'the_email',
				})
			);
		});
	});

	it('uses loading button', async () => {
		const { resolve } = loadControlledPromise(createTicket);

		renderComponent();

		await userEvent.click(await screen.findByLabelText('feedback'));
		await fillForm();
		await userEvent.click(await screen.findByText('Submit'));

		await screen.findByRole('progressbar');

		resolve();
	});

	it('shows success message', async () => {
		const { resolve } = loadControlledPromise(createTicket);

		renderComponent();

		await userEvent.click(await screen.findByLabelText('feedback'));
		await fillForm();
		await userEvent.click(await screen.findByText('Submit'));

		await screen.findByRole('progressbar');

		resolve();

		await screen.findByText('Thank you for your feedback!');
	});

	it('shows error message', async () => {
		await withMutedReactQueryLogger(async () => {
			const { reject } = loadControlledPromise(createTicket);

			renderComponent();

			await userEvent.click(await screen.findByLabelText('feedback'));
			await fillForm();
			await userEvent.click(await screen.findByText('Submit'));

			await screen.findByRole('progressbar');

			reject(new Error('the error'));

			await screen.findByText(/the error/);
		});
	});

	it('validates fields', async () => {
		renderComponent();

		await userEvent.click(await screen.findByLabelText('feedback'));
		await userEvent.click(await screen.findByText('Submit'));

		await screen.findAllByText('Required');
	});

	it('waits for submit click before showing validation errors', async () => {
		renderComponent();

		await userEvent.click(await screen.findByLabelText('feedback'));

		expect(screen.queryAllByText('Required')).toHaveLength(0);
	});

	it('does not submit feedback if validation fails', async () => {
		renderComponent();

		await userEvent.click(await screen.findByLabelText('feedback'));
		await userEvent.click(await screen.findByText('Submit'));

		expect(createTicket).not.toHaveBeenCalled();
	});

	it('loads email on user login', async () => {
		vi.mocked(getMe).mockResolvedValue(undefined as any);

		const { queryClient } = renderComponent();

		vi.mocked(getMe).mockResolvedValue({
			id: 'the_user_id',
			email: 'the_email',
		} as any);

		await userEvent.click(await screen.findByLabelText('feedback'));

		await queryClient.invalidateQueries('me');

		await waitFor(() => {
			expect(screen.getByLabelText(/Email/)).toHaveValue('the_email');
		});
	});

	it('does not refill email when user clears field', async () => {
		vi.mocked(getMe).mockResolvedValue({
			id: 'the_user_id',
			email: 'the_email',
		} as any);

		renderComponent();

		await userEvent.click(await screen.findByLabelText('feedback'));
		await userEvent.clear(await screen.findByLabelText(/Email/));

		await waitFor(() => {
			expect(screen.getByLabelText(/Email/)).toHaveValue('');
		});
	});
});
