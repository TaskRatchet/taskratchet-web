import FilterButton from './FilterButton';
import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { renderWithQueryProvider } from '../../lib/test/helpers';
import { setCookie } from '../../lib/setCookie';
import { expect, it, describe } from 'vitest';

describe('FilterButton', () => {
	it('uses local storage', async () => {
		window.localStorage.setItem(
			'filters',
			JSON.stringify({
				pref: {
					pending: true,
					complete: false,
					expired: true,
				},
			})
		);

		renderWithQueryProvider(<FilterButton />);

		await userEvent.click(screen.getByLabelText('filters'));

		await waitFor(async () => {
			expect(await screen.findByLabelText('complete')).not.toBeChecked();
		});
	});

	it('sets filters on local storage', async () => {
		renderWithQueryProvider(<FilterButton />);

		await userEvent.click(await screen.findByLabelText('filters'));
		await userEvent.click(await screen.findByText('pending'));

		await waitFor(() => {
			const actual = JSON.parse(window.localStorage.getItem('filters') || '{}');
			expect(actual).toEqual(
				expect.objectContaining({
					pref: expect.objectContaining({
						pending: false,
					}),
				})
			);
		});
	});

	it('references legacy filters', async () => {
		setCookie(
			'tr-filters',
			{
				pending: true,
				complete: false,
				expired: true,
			},
			30
		);

		renderWithQueryProvider(<FilterButton />);

		await userEvent.click(screen.getByLabelText('filters'));

		await waitFor(() => {
			expect(screen.getByLabelText('complete')).not.toBeChecked();
		});
	});

	it('handles corrupted legacy filters', () => {
		document.cookie = 'tr-filters=l';

		expect(() => renderWithQueryProvider(<FilterButton />)).not.toThrow();
	});
});
