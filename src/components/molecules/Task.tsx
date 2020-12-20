import React from "react";
import './Task.css'
import browser from "../../lib/Browser";
import TaskMenu from "./TaskMenu";
import {useSetComplete} from "../../lib/api/useSetComplete";

interface Flag {
    label: string,
    active: boolean,
    class: string
}

interface TaskProps {
    task: TaskType
}

const Task = ({task}: TaskProps) => {
    const setComplete = useSetComplete()

    const dueDate = new Date(task.due),
        dateString = browser.getDateString(dueDate),
        timeString = browser.getTimeString(dueDate),
        difference = (dueDate.getTime() - Date.now()) / 1000,
        charged = task.charge_captured || task.charge_locked,
        flags = [
            {
                'label': 'Due',
                'active': !task.complete && difference > 0 && difference <= 60 * 60 * 24,
                'class': 'due'
            },
            {
                'label': 'Late',
                'active': difference < 0 && !task.complete,
                'class': 'late'
            },
            {
                'label': 'Done',
                'active': task.complete,
                'class': 'done'
            },
            {
                'label': 'Charged',
                'active': charged,
                'class': 'charged'
            },
            {
                'label': 'Charging',
                'active': !charged && (task.charge_authorized || task.charge_email_sent),
                'class': 'charging'
            },
        ],
        activeFlags = flags.filter((f) => f.active),
        extraClasses = activeFlags.map((f) => f.class).join(' ');

    return <div className={`molecule-task ${extraClasses}`}>
        <div className={'molecule-task__left'}>
            <input type="checkbox" onChange={() => {
                if (!task.id) return
                setComplete(task.id, !task.complete)
            }} checked={task.complete} disabled={!task.id}/>
            <span className="molecule-task__description">
                {task.task || '[Description Missing]'}
            </span>
            <ul className={'molecule-task__labels'}>
                {activeFlags.map((f: Flag, i: number) => <li key={i}>{f.label}</li>)}
            </ul>
            <span className={'molecule-task__due'}>{dateString} {timeString}</span>
            <span className={'molecule-task__dollars'}>${task.cents / 100}</span>
        </div>
        <TaskMenu task={task}/>
    </div>
};

export default Task
