import {fireEvent, render} from "@testing-library/react";
import LazyList from "./LazyList";
import React from "react";
import browser from "../../lib/Browser";

function renderComponent(count: number, index: number = 0) {
    const indices = Array.from((new Array(count)).keys())
    const items = indices.map((k) => <li key={k}>Item {k}</li>);

    return render(<LazyList items={items} />)
}

describe('LazyList', () => {
    it('lists elements', async () => {
        const {getByText} = renderComponent(1)

        expect(getByText('Item 0')).toBeInTheDocument()
    })

    it('trims elements after initialIndex', async () => {
        const {queryByText} = await renderComponent(12)

        expect(queryByText('Item 11')).not.toBeInTheDocument()
    })

    it('lazy loads forward', async () => {
        jest.spyOn(browser, 'getScrollPercentage').mockReturnValue(1)

        const {container, getByText} = await renderComponent(12)

        const list = container.querySelector('ul')

        if (!list) throw new Error('could not find list')

        fireEvent.scroll(list, { target: { scrollY: 100 } });

        expect(getByText('Item 11')).toBeInTheDocument()
    })

    it('only loads forward if scroll position > 80%', async () => {
        jest.spyOn(browser, 'getScrollPercentage').mockReturnValue(0)

        const {container, queryByText} = await renderComponent(12)

        const list = container.querySelector('ul')

        if (!list) throw new Error('could not find list')

        fireEvent.scroll(list, { target: { scrollY: 100 } });

        expect(queryByText('Item 11')).not.toBeInTheDocument()
    })

    it('loads in reverse', async () => {
        jest.spyOn(browser, 'getScrollPercentage').mockReturnValue(0)

        const {container, getByText} = await renderComponent(12, 12)

        const list = container.querySelector('ul')

        if (!list) throw new Error('could not find list')

        fireEvent.scroll(list, { target: { scrollY: 100 } });

        expect(getByText('Item 0')).toBeInTheDocument()
    })

    it('only loads in reverse if scroll position less than 20%', async () => {
        jest.spyOn(browser, 'getScrollPercentage').mockReturnValue(.2)

        const {container, queryByText} = await renderComponent(12, 12)

        const list = container.querySelector('ul')

        if (!list) throw new Error('could not find list')

        fireEvent.scroll(list, { target: { scrollY: 100 } });

        expect(queryByText('Item 0')).not.toBeInTheDocument()
    })
})
