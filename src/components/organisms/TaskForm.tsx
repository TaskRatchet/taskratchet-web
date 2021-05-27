import React, {useEffect} from "react";
import './TaskForm.css'
import browser from "../../lib/Browser";
import {Button, Grid, TextField} from "@material-ui/core";
import {KeyboardDatePicker, KeyboardTimePicker} from "@material-ui/pickers";

interface TaskFormProps {
    task: string,
    due: Date | null,
    cents: number | null,
    timezone: string,
    error: string,
    onChange: (task: string, due: Date | null, cents: number | null) => void,
    onSubmit: () => void
}

const TaskForm = (props: TaskFormProps): JSX.Element => {
    const {task, due, cents, timezone, error, onChange, onSubmit} = props

    useEffect(() => {
        const getDefaultDue = () => {
            const due = browser.getNow();

            due.setDate(due.getDate() + 7);
            due.setHours(23);
            due.setMinutes(59);

            return due;
        };

        // TODO: Default to stakes of last-added task
        if (cents === null) {
            onChange(task, due, 500)
        }

        // TODO: Default to due offset of last-added task
        if (due === null) {
            onChange(task, getDefaultDue(), cents)
        }
    }, [task, due, cents, onChange])

    const dollars = cents ? cents / 100 : 0

    return <form onSubmit={e => {
        e.preventDefault();
        onSubmit()
    }} className={'organism-taskForm'}>
        <Grid container spacing={2}>
            {error ? <Grid item xs={12}>{error}</Grid> : null}

            <Grid item xs={9}>
                <TextField
                    id="page-tasks__task"
                    label="Task"
                    required
                    value={task}
                    onChange={e => {
                        onChange(e.target.value, due, cents)
                    }}
                    fullWidth
                />
            </Grid>

            <Grid item xs={3}>
                <TextField
                    id="page-tasks__dollars"
                    label="Stakes"
                    required
                    type="number"
                    value={dollars}
                    onChange={e => {
                        onChange(task, due, parseInt(e.target.value) * 100)
                    }}
                    fullWidth
                />
                {/* TODO: allow deleting zero */}
                {/* value={dollars > 0 ? dollars : null} */}
            </Grid>

            <Grid item xs={6}>
                {/* TODO: Add minimum date == today */}
                <KeyboardDatePicker
                    id="page-tasks__dueDate"
                    label="Due Date"
                    required
                    format="MM/dd/yyyy"
                    value={due}
                    onChange={(value: Date | null) => {
                        onChange(task, value, cents)
                    }}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                    fullWidth
                />
            </Grid>

            <Grid item xs={6}>
                <KeyboardTimePicker
                    id="page-tasks__dueTime"
                    label="Due Time"
                    required
                    value={due}
                    onChange={(value: Date | null) => {
                        onChange(task, value, cents)
                    }}
                    KeyboardButtonProps={{
                        'aria-label': 'change time',
                    }}
                    fullWidth
                />
            </Grid>

            <Grid item xs={3}>
                <Button variant="contained" size={'small'} type="submit" color="primary">Add</Button>
            </Grid>
            <Grid item xs>
            <Button
                href={'https://docs.taskratchet.com/timezones.html'}
                target={'_blank'}
                rel={"noopener noreferrer"}
                size={'small'}
            >{timezone}</Button>
            </Grid>

        </Grid>

    </form>
}

export default TaskForm
