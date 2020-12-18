import browser from "../../lib/Browser";
import React from "react";
import * as chrono from "chrono-node";
import _ from "lodash";
import './FreeEntry.css'

interface FreeEntryProps {
    task: string,
    due: Date | null,
    cents: number | null,
    timezone: string,
    error: string,
    onChange: (task: string, due: Date | null, stakes: number | null) => void,
    onSubmit: () => void
}

const FreeEntry = (props: FreeEntryProps) => {
    const {task, due, cents, timezone, error, onChange, onSubmit} = props

    const parseTask = (task: string) => {
        const getCents = (task: string) => {
            const matches = Array.from(task.matchAll(/\$(\d+)/g))

            if (!matches) return null

            const match = matches.pop()

            if (!match) return null

            return Number(match[1]) * 100
        };

        const response = chrono.parse(
            task,
            browser.getNow(),
            {forwardDate: true}
        ).pop()

        let due = null,
            safe = _.escape(task),
            taskHighlighted = null

        if (response) {
            due = response.date()

            if (!_.get(response, 'start.knownValues.hour')) {
                due.setHours(23, 59)
            }

            const start = response.index,
                end = response.index + response.text.length,
                len = safe.length

            // taskHighlighted = `${safe.slice(0, start)}<span class="due">${response.text}</span>${safe.slice(end, len)}`
            taskHighlighted = <>{safe.slice(0, start)}<span
                className="due">{response.text}</span>{safe.slice(end, len)}</>
        }

        return {
            task,
            taskHighlighted,
            due,
            cents: getCents(task)
        }
    }

    const {taskHighlighted} = parseTask(task)

    // console.log({task, taskHighlighted})

    return <form onSubmit={e => {
        e.preventDefault();
        onSubmit()
    }} className={'organism-freeEntry'}>
        <div className="page-tasks__inputs">
            {error ? <p>{error}</p> : null}

            <label className={'page-tasks__description'}>Task
                <input
                    type="text"
                    placeholder={'Task'}
                    value={task}
                    onChange={e => {
                        const {task, due, cents} = parseTask(e.target.value)
                        onChange(task, due, cents)
                    }}
                />
                <p className={"page-tasks__echo"}>{taskHighlighted}</p>
            </label>

            <p>Example: Call the plumber by Friday or pay $15</p>

            <div className="page-tasks__summary">
                <p>
                    <b>Due {timezone ? <>(<a href={'https://docs.taskratchet.com/timezones.html'}
                                                           target={'_blank'}
                                                           rel={"noopener noreferrer"}>{timezone}</a>)</> : null}</b><br/>
                    <span>{due ? browser.getDateTimeString(due) : "No deadline found"}</span>
                </p>

                <p>
                    <b>Stakes</b><br/>
                    <span>{cents ? `$${cents / 100}` : 'No stakes found'}</span>
                </p>
            </div>
        </div>
        <input className={'page-tasks__addButton'} type="submit" value={'Add'}/>
    </form>
}

export default FreeEntry
