import React from 'react';
import './Tasks.css'
import 'react-datepicker/dist/react-datepicker.min.css'
import {useTasks} from "../../lib/api";
import TaskEntry from "../organisms/TaskEntry";
import TaskList from "../organisms/TaskList";
import {useCloseWarning} from "../../lib/useCloseWarning";

interface TasksProps {
    lastToday: Date|undefined
}

const Tasks = ({lastToday}: TasksProps) => {
    const {isLoading} = useTasks();

    useCloseWarning()

    return <div className={`page-tasks ${isLoading ? "loading" : "idle"}`}>
        <TaskEntry />
        <TaskList lastToday={lastToday} />
    </div>
};

export default Tasks;
