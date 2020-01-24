import React from "react";
import './style.css'

interface TaskProps {
    task: Task,
    onToggle: () => void
}

const Task = (props: TaskProps) => {
    return <div className={'molecule-task'}>
        <input type="checkbox" onChange={props.onToggle} checked={props.task.complete}/>
        <span className="molecule-task__description">{props.task.task || '[Description Missing]'}</span>
        <span className={'molecule-task__due'}>{props.task.due}</span>
        <span className={'molecule-task__stakes'}>${props.task.stakes}</span>
    </div>
};

export default Task