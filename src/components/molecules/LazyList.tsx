import React, {useEffect, useState} from 'react'
import {List} from "@material-ui/core";
import browser from "../../lib/Browser";
import './LazyList.css'

interface LazyListProps {
    items: JSX.Element[],
    initialIndex?: number,
    highlights?: number[]
}

export default function LazyList({items, initialIndex = 0, highlights = []}: LazyListProps) {
    const [forwardDelta, setForwardDelta] = useState<number>(0)
    const [reverseDelta, setReverseDelta] = useState<number>(0)

    const page = 10
    const {min, max} = Math

    const startByPage = initialIndex - (page + (page * reverseDelta));
    const startByHighlight = min(...highlights)
    const startInclusive = max(0, min(startByPage, startByHighlight))

    const endByPage = initialIndex + page + (page * forwardDelta);
    const endByHighlight = max(...highlights) + 1
    const endExclusive = max(endByPage, endByHighlight)

    const ref = React.createRef<HTMLUListElement>()

    useEffect(() => {
        function isDefined<T>(arg: T | undefined): arg is T {
            return arg !== undefined
        }

        const children: Element[] = Array.from(ref.current?.children || [])
        const items: Element[] = highlights.map((i) => children[i]).filter(isDefined)

        children.map((el) => el.classList.remove('molecule-lazyList__highlight'))
        items.map((el) => el.classList.add('molecule-lazyList__highlight'))

        if (items.length > 0) browser.scrollIntoView(items[0]);
    }, [ref, highlights])

    const onScroll = (e: any) => {
        const scrollPercentage = browser.getScrollPercentage(e.target as Element);

        if (scrollPercentage > .8) {
            setForwardDelta(forwardDelta + 1)
        }

        if (scrollPercentage < .2) {
            setReverseDelta(reverseDelta + 1)
        }
    };

    return <List onScroll={onScroll} ref={ref}>{items.slice(startInclusive, endExclusive)}</List>
}
