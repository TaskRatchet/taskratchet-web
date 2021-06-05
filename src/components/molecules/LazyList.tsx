import React, {useState} from 'react'
import {List} from "@material-ui/core";
import browser from "../../lib/Browser";
import './LazyList.css'

interface LazyListProps {
    items: JSX.Element[],
    focused?: number[]
}

export default function LazyList({items, focused = [0]}: LazyListProps) {
    const [forwardDelta, setForwardDelta] = useState<number>(1)
    const [reverseDelta, setReverseDelta] = useState<number>(1)

    const page = 10
    const {min, max} = Math

    const maxForwardDelta = Math.ceil(items.length / page)
    const maxReverseDelta = Math.ceil(items.length / page)

    const reverseCount = page * reverseDelta;
    const startInclusive = max(0, min(...focused) - reverseCount)

    const forwardCount = page * forwardDelta;
    const endExclusive = max(...focused) + forwardCount + 1

    const onScroll = (e: any) => {
        const scrollPercentage = browser.getScrollPercentage(e.target as Element);

        if (scrollPercentage > .8 && forwardDelta < maxForwardDelta) {
            setForwardDelta(forwardDelta + 1)
        }

        if (scrollPercentage < .2 && reverseDelta < maxReverseDelta) {
            setReverseDelta(reverseDelta + 1)
        }
    };

    return <List onScroll={onScroll}>{items.slice(startInclusive, endExclusive)}</List>
}
