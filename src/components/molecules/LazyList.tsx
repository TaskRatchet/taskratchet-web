import React, {useState} from 'react'
import {List} from "@material-ui/core";

interface LazyListProps {
    items: JSX.Element[],
    initialIndex?: number
}

export default function LazyList({items, initialIndex = 0}: LazyListProps) {
    const [forwardDelta, setForwardDelta] = useState<number>(0)

    const page = 10
    const start = initialIndex - page
    const end = initialIndex + page + (page * forwardDelta)
    const listRef = React.createRef<HTMLUListElement>()

    if (listRef.current) {
        listRef.current.onscroll = () => {
            console.log('onscroll')
            setForwardDelta(forwardDelta + 1)
        }
    }

    // List ref
    // ref.onscroll = () => { ... }
    // check if percentage is within 10% of either side

    return <List ref={listRef}>{items.slice(start, end)}</List>
}
