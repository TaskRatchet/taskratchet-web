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
        charged = props.task.charge_captured || props.task.charge_locked,
        charging = !charged && props.task.charge_authorized,
        difference = (dueDate.getTime() - Date.now()) / 1000,
        imminent = difference > 0 && difference <= 60 * 60 * 24,
        late = difference < 0;

    return <div className={'molecule-task'}>
        <input type="checkbox" onChange={props.onToggle} checked={props.task.complete}/>
        <span className="molecule-task__description">
            {props.task.task || '[Description Missing]'}
        </span>
        <ul className={'molecule-task__labels'}>
            {charged ? <li>Charged</li> : ''}
            {charging ? <li>Charging</li> : ''}
            {imminent ? <li>Due</li> : ''}
            {late ? <li>Late</li> : ''}
        </ul>
        <span className={'molecule-task__due'}>{dateString} {timeString}</span>
        <span className={'molecule-task__dollars'}>${props.task.cents / 100}</span>
    </div>
};

export default Task