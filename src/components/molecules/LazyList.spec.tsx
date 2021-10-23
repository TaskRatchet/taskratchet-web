import { fireEvent, render } from '@testing-library/react';
import LazyList from './LazyList';
import React from 'react';
import browser from '../../lib/Browser';
import { waitFor } from '@testing-library/dom';

interface RenderComponentOptions {
	count: number;
	focused?: number[];
}

function renderComponent({ count, focused = [0] }: RenderComponentOptions) {
	const indices = Array.from(new Array(count).keys());
	const items = indices.map((k) => <li key={k}>Item {k}</li>);

	return render(<LazyList items={items} focused={focused} />);
}

describe('LazyList', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('lists elements', async () => {
		const { getByText } = renderComponent({ count: 1 });

		expect(getByText('Item 0')).toBeInTheDocument();
	});

	it('trims elements after initialIndex', async () => {
		const { queryByText } = await renderComponent({ count: 12 });

		expect(queryByText('Item 11')).not.toBeInTheDocument();
	});

	it('lazy loads forward', async () => {
		jest.spyOn(browser, 'getScrollPercentage').mockReturnValue(1);

		const { container, getByText } = await renderComponent({ count: 12 });

		const list = container.querySelector('ul');

		if (!list) throw new Error('could not find list');

		fireEvent.scroll(list, { target: { scrollY: 100 } });

		expect(getByText('Item 11')).toBeInTheDocument();
	});

	it('only loads forward if scroll position > 80%', async () => {
		jest.spyOn(browser, 'getScrollPercentage').mockReturnValue(0);

		const { container, queryByText } = await renderComponent({ count: 12 });

		const list = container.querySelector('ul');

		if (!list) throw new Error('could not find list');

		fireEvent.scroll(list, { target: { scrollY: 100 } });

		expect(queryByText('Item 11')).not.toBeInTheDocument();
	});

	it('loads in reverse', async () => {
		jest.spyOn(browser, 'getScrollPercentage').mockReturnValue(0);

		const { container, getByText } = await renderComponent({
			count: 12,
			focused: [12],
		});

		const list = container.querySelector('ul');

		if (!list) throw new Error('could not find list');

		fireEvent.scroll(list, { target: { scrollY: 100 } });

		expect(getByText('Item 0')).toBeInTheDocument();
	});

	it('only loads in reverse if scroll position less than 20%', async () => {
		jest.spyOn(browser, 'getScrollPercentage').mockReturnValue(0.2);

		const { container, queryByText } = await renderComponent({
			count: 12,
			focused: [12],
		});

		const list = container.querySelector('ul');

		if (!list) throw new Error('could not find list');

		fireEvent.scroll(list, { target: { scrollY: 100 } });

		expect(queryByText('Item 0')).not.toBeInTheDocument();
	});

	it('calculates boundaries correctly', async () => {
		const { getByText } = await renderComponent({ count: 21 });

		expect(getByText('Item 0')).toBeInTheDocument();
	});

	it('displays forward highlights', async () => {
		const { getByText } = await renderComponent({ count: 12, focused: [11] });

		expect(getByText('Item 11')).toBeInTheDocument();
	});

	it('displays reverse highlights', async () => {
		const { getByText } = await renderComponent({
			count: 12,
			focused: [0, 11],
		});

		expect(getByText('Item 0')).toBeInTheDocument();
	});

	it('resets highlight classes', async () => {
		const { rerender, container } = await renderComponent({
			count: 1,
			focused: [0],
		});

		rerender(<LazyList items={[<li key={0}>Item 0</li>]} focused={[0]} />);

		await waitFor(() => {
			expect(
				container.querySelectorAll('.molecule-lazyList__highlight')
			).toHaveLength(0);
		});
	});
});
