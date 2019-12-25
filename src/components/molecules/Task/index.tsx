import React from "react";
// import './style.css'

interface TaskProps {
    task: Task,
    onToggle: () => void
}

const Task = (props: TaskProps) => {
    return <div className={'molecule-task'}>
        <input type="checkbox" onChange={props.onToggle} checked={props.task.complete}/>&nbsp;
        {props.task.task} by {props.task.due} or pay ${props.task.stakes}
    </div>
};

export default Task