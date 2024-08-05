import { renderWithQueryProvider } from '../../lib/test/renderWithQueryProvider';
import { loadTimezones } from '../../lib/test/loadTimezones';
import React from 'react';
import Register from './Register';
import { waitFor, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, expect, it, describe } from 'vitest';
import { redirectToCheckout } from '../../lib/stripe';
import saveFeedback from '../../lib/saveFeedback';
import { toast } from 'react-toastify';
import { getCheckoutSession, getTimezones, register } from '@taskratchet/sdk';

vi.mock('react-toastify');

async function fillForm() {
	loadTimezones(['the_timezone']);

	vi.mocked(register).mockImplementation(async () => {
		return Promise.resolve(new Response());
	});

	renderWithQueryProvider(<Register />);

	await userEvent.type(await screen.findByLabelText(/Name/), 'the_name');
	await userEvent.type(await screen.findByLabelText(/Email/), 'the_email');
	await userEvent.type(
		await screen.findByLabelText(/^Password/),
		'the_password'
	);
	await userEvent.type(
		await screen.findByLabelText(/Retype Password/),
		'the_password'
	);

	await waitFor(() => {
		expect(getTimezones).toBeCalled();
	});

	await userEvent.click(await screen.findByLabelText(/Timezone/));

	const listbox = within(screen.getByRole('listbox'));

	await userEvent.click(listbox.getByText('the_timezone'));

	await userEvent.click(
		await screen.findByLabelText(
			"I have read and agree to TaskRatchet's privacy policy and terms of service."
		)
	);

	await waitFor(() => {
		expect(screen.getByText('Add payment method')).not.toBeDisabled();
	});
}

describe('registration page', () => {
	it('uses Input for name field', async () => {
		renderWithQueryProvider(<Register />);

		await screen.findByLabelText(/Name/);
	});

	it('uses Input for email field', async () => {
		renderWithQueryProvider(<Register />);

		await screen.findByLabelText(/Email/);
	});

	it('uses Input for password field', async () => {
		renderWithQueryProvider(<Register />);

		await screen.findByLabelText(/^Password/);
	});

	it('uses Input for password2 field', async () => {
		renderWithQueryProvider(<Register />);

		await screen.findByLabelText(/Retype Password/);
	});

	it('submits registration', async () => {
		await fillForm();

		await userEvent.click(await screen.findByText('Add payment method'));

		await waitFor(() => {
			expect(register).toBeCalled();
		});

		expect(register).toBeCalledWith(
			'the_name',
			'the_email',
			'the_password',
			'the_timezone',
			'session'
		);
	});

	it('uses same checkout session for registration and redirection', async () => {
		vi.mocked(getCheckoutSession).mockResolvedValue({
			id: 'session_id',
		});

		await fillForm();

		await userEvent.click(await screen.findByText('Add payment method'));

		await waitFor(() => {
			expect(redirectToCheckout).toBeCalledWith('session_id');
		});
	});

	it('collects how they learned about TaskRatchet', async () => {
		await fillForm();

		await userEvent.type(
			await screen.findByLabelText('How did you hear about us?'),
			'the_referral'
		);

		await userEvent.click(await screen.findByText('Add payment method'));

		await waitFor(() => {
			expect(saveFeedback).toBeCalledWith({
				userName: 'the_name',
				userEmail: 'the_email',
				prompt: 'How did you hear about us?',
				response: 'the_referral',
			});
		});
	});

	it('skips sending referral if none provided', async () => {
		await fillForm();

		await userEvent.click(await screen.findByText('Add payment method'));

		expect(saveFeedback).not.toBeCalled();
	});

	it('shows missing email error if none provided', async () => {
		await fillForm();

		await userEvent.clear(await screen.findByLabelText(/Email/));

		await userEvent.click(await screen.findByText('Add payment method'));

		await screen.findByText('Email is required');
	});

	it('shows missing password error if none provided', async () => {
		await fillForm();

		await userEvent.clear(await screen.findByLabelText(/^Password/));

		await userEvent.click(await screen.findByText('Add payment method'));

		await screen.findByText('Password is required');
	});

	it('shows missing password2 error if none provided', async () => {
		await fillForm();

		await userEvent.clear(await screen.findByLabelText(/Retype Password/));

		await userEvent.click(await screen.findByText('Add payment method'));

		await screen.findByText('Password is required');
	});

	it('shows missing timezone error if none provided', async () => {
		renderWithQueryProvider(<Register />);

		await userEvent.click(await screen.findByText('Add payment method'));

		await screen.findByText('Timezone is required');
	});

	it('hides validation errors until attempted submission', () => {
		renderWithQueryProvider(<Register />);

		expect(screen.queryByText(/is required/)).not.toBeInTheDocument();
	});

	it('shows error if user did not agree to terms', async () => {
		await fillForm();

		await userEvent.click(
			await screen.findByLabelText(
				"I have read and agree to TaskRatchet's privacy policy and terms of service."
			)
		);

		await userEvent.click(await screen.findByText('Add payment method'));

		await screen.findByText(/You must agree/);
	});

	it('does not use toast for validation errors', async () => {
		await fillForm();

		await userEvent.clear(await screen.findByLabelText(/Email/));

		await userEvent.click(await screen.findByText('Add payment method'));

		expect(await screen.findByText(/is required/)).toBeInTheDocument();

		expect(toast).not.toBeCalled();
	});

	it('requires name', async () => {
		await fillForm();

		await userEvent.clear(await screen.findByLabelText(/Name/));

		await userEvent.click(await screen.findByText('Add payment method'));

		await screen.findByText('Name is required');
	});

	it('does not use toast for registration errors', async () => {
		await fillForm();

		vi.mocked(register).mockResolvedValue({
			ok: false,
			status: 400,
			text: () => Promise.resolve('the_error'),
		} as any);

		await userEvent.click(await screen.findByText('Add payment method'));

		await screen.findByText(/the_error/);

		expect(toast).not.toBeCalled();
	});
});
