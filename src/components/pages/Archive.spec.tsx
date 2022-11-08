import { vi, Mock, describe, it, expect, beforeEach } from 'vitest';
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

	// it('lists old tasks', () => {
	// 	vi.setSystemTime(new Date('2021-01-01T00:00:00.000Z'));

	// 	loadTasksApiData({
	// 		tasks: [makeTask({ id: 'old_task', due: '2020-12-31T00:00:00.000Z' })],
	// 	});

	// 	renderWithQueryProvider(<Archive />);

	// 	expect(screen.getByText('old_task')).toBeInTheDocument();
	// });
});
