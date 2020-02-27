import React from "react";
import './style.css'

interface TaskProps {
    task: Task,
    onToggle: () => void
}

const Task = (props: TaskProps) => {
    const dueDate = new Date(props.task.due * 1000),
        dateString = dueDate.toLocaleDateString(),
        timeString = dueDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        difference = (dueDate.getTime() - Date.now()) / 1000,
        charged = props.task.charge_captured || props.task.charge_locked,
        flags = [
            {
                'label': 'Due',
                'active': difference > 0 && difference <= 60 * 60 * 24,
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
        <input type="checkbox" onChange={props.onToggle} checked={props.task.complete}/>
        <span className="molecule-task__description">
            {props.task.task || '[Description Missing]'}
        </span>
        <ul className={'molecule-task__labels'}>
            {activeFlags.map((f) => <li>{f.label}</li>)}
        </ul>
        <span className={'molecule-task__due'}>{dateString} {timeString}</span>
        <span className={'molecule-task__dollars'}>${props.task.cents / 100}</span>
    </div>
};

export default Task