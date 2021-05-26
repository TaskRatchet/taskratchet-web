import React, {useState} from 'react'
import {List} from "@material-ui/core";
import browser from "../../lib/Browser";

interface LazyListProps {
    items: JSX.Element[],
    initialIndex?: number
}

export default function LazyList({items, initialIndex = 0}: LazyListProps) {
    const [forwardDelta, setForwardDelta] = useState<number>(0)
    const [reverseDelta, setReverseDelta] = useState<number>(0)

    const page = 10
    const start = initialIndex - (page + (page * reverseDelta))
    const end = initialIndex + page + (page * forwardDelta)

    const onScroll = (e: any) => {
        const scrollPercentage = browser.getScrollPercentage(e.target as Element);

        if (scrollPercentage > .8) {
            setForwardDelta(forwardDelta + 1)
        }

        if (scrollPercentage < .2) {
            setReverseDelta(reverseDelta + 1)
        }
    };

    return <List onScroll={onScroll}>{items.slice(start, end)}</List>
}
