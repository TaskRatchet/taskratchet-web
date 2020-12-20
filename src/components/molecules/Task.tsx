import React from "react";
import './Task.css'
import browser from "../../lib/Browser";

interface Flag {
    label: string,
    active: boolean,
    class: string
}

interface TaskProps {
    task: TaskType,
    onToggle: (id: string | number, complete: boolean) => void
}

const Task = (props: TaskProps) => {
    const dueDate = new Date(props.task.due),
        dateString = browser.getDateString(dueDate),
        timeString = browser.getTimeString(dueDate),
        difference = (dueDate.getTime() - Date.now()) / 1000,
        charged = props.task.charge_captured || props.task.charge_locked,
        flags = [
            {
                'label': 'Due',
                'active': !props.task.complete && difference > 0 && difference <= 60 * 60 * 24,
                'class': 'due'
            },
            {
                'label': 'Late',
                'active': difference < 0 && !props.task.complete,
                'class': 'late'
            },
            {
                'label': 'Done',
                'active': props.task.complete,
                'class': 'done'
            },
            {
                'label': 'Charged',
                'active': charged,
                'class': 'charged'
            },
            {
                'label': 'Charging',
                'active': !charged && props.task.charge_authorized,
                'class': 'charging'
            },
        ],
        activeFlags = flags.filter((f) => f.active),
        extraClasses = activeFlags.map((f) => f.class).join(' ');

    return <div className={`molecule-task ${extraClasses}`}>
        <input type="checkbox" onChange={() => {
            if (!props.task.id) return
            props.onToggle(props.task.id, !props.task.complete)
        }} checked={props.task.complete} disabled={!props.task.id}/>
        <span className="molecule-task__description">
            {props.task.task || '[Description Missing]'}
        </span>
        <ul className={'molecule-task__labels'}>
            {activeFlags.map((f: Flag, i: number) => <li key={i}>{f.label}</li>)}
        </ul>
        <span className={'molecule-task__due'}>{dateString} {timeString}</span>
        <span className={'molecule-task__dollars'}>${props.task.cents / 100}</span>
    </div>
};

export default Task
