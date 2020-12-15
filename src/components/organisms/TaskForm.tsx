import React from "react";
import DatePicker from 'react-datepicker'

interface TaskFormProps {
    task: string,
    due: Date | null,
    cents: number | null,
    timezone: string,
    error: string,
    onChange: (task: string, due: Date | null, cents: number | null) => void,
    onSubmit: () => void
}

const getDefaultDue = () => {
    const due = new Date();

    due.setDate(due.getDate() + 7);
    due.setHours(23);
    due.setMinutes(59);

    return due;
};

// TODO: Implement default stakes in component-level machine??

const TaskForm = (props: TaskFormProps): JSX.Element => {
    const {task, due, cents, timezone, error, onChange, onSubmit} = props
    const dollars = cents ? cents / 100 : 0

    return <form onSubmit={e => {
        e.preventDefault();
        onSubmit()
    }}>
        <div className="page-tasks__inputs">
            {error ? <p>{error}</p> : null}

            <label className={'page-tasks__description'}>Task <input
                type="text"
                placeholder={'Task'}
                value={task}
                onChange={e => {
                    onChange(e.target.value, due, cents)
                }}
            /></label>

            <label className={'page-tasks__due'}>Due {timezone ? <>(<a href={'https://docs.taskratchet.com/timezones.html'} target={'_blank'} rel={"noopener noreferrer"}>{timezone}</a>)</> : null} <DatePicker
                selected={due || getDefaultDue()}
                onChange={value => {
                    onChange(task, value, cents)
                }}
                showTimeSelect
                timeIntervals={5}
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date()}
            /></label>

            <label className={'page-tasks__dollars'}>Stakes <input
                type="number"
                placeholder={'USD'}
                min={1}
                max={2500}
                value={dollars}
                onChange={e => {
                    onChange(task, due, parseInt(e.target.value) * 100)
                }}
            /></label>
        </div>
        <input className={'page-tasks__addButton'} type="submit" value={'Add'}/>
    </form>
}

export default TaskForm
