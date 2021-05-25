import React, {Ref} from "react";
import './Task.css'
import browser from "../../lib/Browser";
import TaskMenu from "./TaskMenu";
import {useSetComplete} from "../../lib/api/useSetComplete";

export interface TaskProps {
    task: TaskType,
    ref_?: Ref<any>
}

const Task = ({task, ref_}: TaskProps) => {
    const setComplete = useSetComplete()

    const dueDate = new Date(task.due),
        dateString = browser.getDateString(dueDate),
        timeString = browser.getTimeString(dueDate);

    return <div className={`molecule-task molecule-task__${task.status}`} ref={ref_}>
        <div className={'molecule-task__left'}>
            <input type="checkbox" onChange={() => {
                if (!task.id) return
                setComplete(task.id, !task.complete)
            }} checked={task.complete} disabled={!task.id}/>
            <span className="molecule-task__description">
                {task.task || '[Description Missing]'}
            </span>
            <ul className={'molecule-task__labels'}>
                <li>{task.status}</li>
            </ul>
            <span className={'molecule-task__due'}>{dateString} {timeString}</span>
            <span className={'molecule-task__dollars'}>${task.cents / 100}</span>
        </div>
        <TaskMenu task={task}/>
    </div>
};

export default Task
