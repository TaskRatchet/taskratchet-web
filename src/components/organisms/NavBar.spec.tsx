import { screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it } from 'vitest';

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
	it('has today button', async () => {
		renderComponent();

		await screen.findByLabelText('today');
	});
});
