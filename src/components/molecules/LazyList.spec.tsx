import {fireEvent, render, RenderResult} from "@testing-library/react";
import LazyList from "./LazyList";
import React from "react";
import browser from "../../lib/Browser";
import {waitFor} from "@testing-library/dom";

interface RenderComponentOptions {
    count: number,
    index?: number,
    highlights?: number[],
}

function renderComponent(
    {
        count,
        index = 0,
        highlights = [],
    }: RenderComponentOptions
) {
    const indices = Array.from((new Array(count)).keys())
    const items = indices.map((k) => <li key={k}>Item {k}</li>);

    return render(<LazyList
        items={items}
        initialIndex={index}
        highlights={highlights}
    />)
}

describe('LazyList', () => {
    beforeEach(() => {
        jest.spyOn(browser, 'scrollIntoView').mockImplementation(() => undefined)
    })

    it('lists elements', async () => {
        const {getByText} = renderComponent({count: 1})

        expect(getByText('Item 0')).toBeInTheDocument()
    })

    it('trims elements after initialIndex', async () => {
        const {queryByText} = await renderComponent({count: 12})

        expect(queryByText('Item 11')).not.toBeInTheDocument()
    })

    it('lazy loads forward', async () => {
        jest.spyOn(browser, 'getScrollPercentage').mockReturnValue(1)

        const {container, getByText} = await renderComponent({count: 12})

        const list = container.querySelector('ul')

        if (!list) throw new Error('could not find list')

        fireEvent.scroll(list, {target: {scrollY: 100}});

        expect(getByText('Item 11')).toBeInTheDocument()
    })

    it('only loads forward if scroll position > 80%', async () => {
        jest.spyOn(browser, 'getScrollPercentage').mockReturnValue(0)

        const {container, queryByText} = await renderComponent({count: 12})

        const list = container.querySelector('ul')

        if (!list) throw new Error('could not find list')

        fireEvent.scroll(list, {target: {scrollY: 100}});

        expect(queryByText('Item 11')).not.toBeInTheDocument()
    })

    it('loads in reverse', async () => {
        jest.spyOn(browser, 'getScrollPercentage').mockReturnValue(0)

        const {container, getByText} = await renderComponent({count: 12, index: 12})

        const list = container.querySelector('ul')

        if (!list) throw new Error('could not find list')

        fireEvent.scroll(list, {target: {scrollY: 100}});

        expect(getByText('Item 0')).toBeInTheDocument()
    })

    it('only loads in reverse if scroll position less than 20%', async () => {
        jest.spyOn(browser, 'getScrollPercentage').mockReturnValue(.2)

        const {container, queryByText} = await renderComponent({count: 12, index: 12})

        const list = container.querySelector('ul')

        if (!list) throw new Error('could not find list')

        fireEvent.scroll(list, {target: {scrollY: 100}});

        expect(queryByText('Item 0')).not.toBeInTheDocument()
    })

    it('calculates boundaries correctly', async () => {
        const {getByText} = await renderComponent({count: 21})

        expect(getByText('Item 0')).toBeInTheDocument()
    })

    it('displays forward highlights', async () => {
        const {getByText} = await renderComponent({count: 12, highlights: [11]})

        expect(getByText('Item 11')).toBeInTheDocument()
    })

    it('displays reverse highlights', async () => {
        const {getByText} = await renderComponent({count: 12, index: 11, highlights: [0]})

        expect(getByText('Item 0')).toBeInTheDocument()
    })

    it('scrolls to highlight', async () => {
        const {getByText} = await renderComponent({count: 1, highlights: [0]})

        expect(browser.scrollIntoView).toBeCalledWith(getByText('Item 0'))
    })

    it('classes highlights', async () => {
        const {container} = await renderComponent({count: 1, highlights: [0]})

        await waitFor(() => {
            expect(container.querySelectorAll('.molecule-lazyList__highlight')).toHaveLength(1)
        })
    })

    it('resets highlight classes', async () => {
        const {rerender, container} = await renderComponent({count: 1, highlights: [0]})

        rerender(<LazyList
            items={[<li key={0}>Item 0</li>]}
            initialIndex={0}
            highlights={[]}
        />)

        await waitFor(() => {
            expect(container.querySelectorAll('.molecule-lazyList__highlight')).toHaveLength(0)
        })
    })
})
