import React from "react";
import './style.css'

interface TaskProps {
    task: Task,
    onToggle: () => void
}

const Task = (props: TaskProps) => {
    const dueDate = new Date(props.task.due * 1000),
        dateString = dueDate.toLocaleDateString(),
        timeString = dueDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    return <div className={'molecule-task'}>
        <input type="checkbox" onChange={props.onToggle} checked={props.task.complete}/>
        <span className="molecule-task__description">{props.task.task || '[Description Missing]'}</span>
        <span className={'molecule-task__due'}>{dateString} {timeString}</span>
        <span className={'molecule-task__dollars'}>${props.task.cents / 100}</span>
    </div>
};

export default Task