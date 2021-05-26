import {fireEvent, render} from "@testing-library/react";
import LazyList from "./LazyList";
import React from "react";
import browser from "../../lib/Browser";

describe('LazyList', () => {
    it('lists elements', async () => {
        const {getByText} = await render(<LazyList items={[
            <li key={1}>Item 1</li>
        ]} />)

        expect(getByText('Item 1')).toBeInTheDocument()
    })

    it('trims elements after initialIndex', async () => {
        const {queryByText} = await render(<LazyList items={[
            <li key={1}>Item 1</li>,
            <li key={2}>Item 2</li>,
            <li key={3}>Item 3</li>,
            <li key={4}>Item 4</li>,
            <li key={5}>Item 5</li>,
            <li key={6}>Item 6</li>,
            <li key={7}>Item 7</li>,
            <li key={8}>Item 8</li>,
            <li key={9}>Item 9</li>,
            <li key={10}>Item 10</li>,
            <li key={11}>Item 11</li>,
            <li key={12}>Item 12</li>,
        ]} initialIndex={0} />)

        expect(queryByText('Item 12')).not.toBeInTheDocument()
    })

    it('lazy loads forward', async () => {
        const {baseElement, getByText} = await render(<LazyList items={[
            <li key={1}>Item 1</li>,
            <li key={2}>Item 2</li>,
            <li key={3}>Item 3</li>,
            <li key={4}>Item 4</li>,
            <li key={5}>Item 5</li>,
            <li key={6}>Item 6</li>,
            <li key={7}>Item 7</li>,
            <li key={8}>Item 8</li>,
            <li key={9}>Item 9</li>,
            <li key={10}>Item 10</li>,
            <li key={11}>Item 11</li>,
            <li key={12}>Item 12</li>,
        ]} initialIndex={0} />)

        jest.spyOn(browser, 'getScrollPercentage').mockReturnValue(1)

        fireEvent.scroll(baseElement, { target: { scrollY: 100 } });

        expect(getByText('Item 12')).toBeInTheDocument()
    })
})
