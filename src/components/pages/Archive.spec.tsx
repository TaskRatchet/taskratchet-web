import { vi, describe, it, expect } from 'vitest';
import { renderWithQueryProvider } from '../../lib/test/renderWithQueryProvider';
import Archive from './Archive';
import React from 'react';
import { loadTasksApiData } from '../../lib/test/loadTasksApiData';
import { makeTask } from '../../lib/test/makeTask';
import { screen } from '@testing-library/react';

describe('Archive', () => {
	it('should render', () => {
		renderWithQueryProvider(<Archive />);
	});

	it('lists old tasks', async () => {
		vi.setSystemTime(new Date('2021-01-01T00:00:00.000Z'));

		loadTasksApiData({
			tasks: [makeTask({ task: 'old_task', due: '5/22/2020, 11:59 PM' })],
		});

		renderWithQueryProvider(<Archive />);

		expect(await screen.findByText('old_task')).toBeInTheDocument();
	});

	it('lists tasks in reverse chronological order', async () => {
		vi.setSystemTime(new Date('2021-01-01T00:00:00.000Z'));

		loadTasksApiData({
			tasks: [
				makeTask({ task: 'task', due: '5/21/2020, 11:59 PM' }),
				makeTask({ task: 'task', due: '5/22/2020, 11:59 PM' }),
			],
		});

		renderWithQueryProvider(<Archive />);

		await screen.findByText(/5\/21/);
		await screen.findByText(/5\/22/);

		const tasks = await screen.findAllByText(/11:59 PM/);

		expect(tasks).toHaveLength(2);

		expect(tasks[0]).toHaveTextContent('5/22');
	});
});
