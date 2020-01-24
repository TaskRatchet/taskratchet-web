import React from 'react';
import Api from '../../../Api';
import './style.css'
import Task from '../../molecules/Task'

interface TasksProps {
}

interface TasksState {
    messages: string[],
    tasks: Task[],
    newTask: string,
    newDue: string,
    newStakes: number
}

class Tasks extends React.Component<TasksProps, TasksState> {
    state: TasksState = {
        messages: [],
        tasks: [],
        newTask: '',
        newDue: '',
        newStakes: 5
    };

    api: Api = new Api();

    componentDidMount(): void {
        this.setState((prev: TasksState) => {
            prev.newDue = this.getDefaultDue();
            return prev;
        });

        this.updateTasks();
    }

    updateTasks = () => {
        this.api.getTasks()
            .then((res: any) => res.json())
            .then((data: any) => {
                this.setState({
                    tasks: data
                })
            })
    };

    setNewTask = (event: any) => {
        const t = event.target;
        this.setState((prev: TasksState) => {
            prev.newTask = t.value;
            return prev;
        })
    };

    setNewDue = (event: any) => {
        const t = event.target;
        this.setState((prev: TasksState) => {
            prev.newDue = t.value;
            return prev;
        })
    };

    setNewStakes = (event: any) => {
        const t = event.target;
        this.setState((prev: TasksState) => {
            prev.newStakes = t.value;
            return prev;
        })
    };

    saveTask = (event: any) => {
        event.preventDefault();

        if (!this.state.newTask) {
            this.pushMessage('Missing task description');
            return;
        }

        this.setState((prev: TasksState) => {
            prev.tasks.push({
                complete: false,
                due: this.isoToPrettyDateString(this.state.newDue),
                id: -1,
                stakes: this.state.newStakes,
                task: this.state.newTask
            });
            prev.newDue = this.getDefaultDue();
            prev.newStakes = 5;
            prev.newTask = '';
            return prev
        });

        this.api.addTask(
            this.state.newTask,
            Math.floor((new Date(this.state.newDue)).getTime() / 1000),
            this.state.newStakes
        ).then((res: any) => this.updateTasks());
    };

    isoToPrettyDateString = (isoString: string) => {
        const d = new Date(isoString);

        return d.toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    getDefaultDue = () => {
        const week = 1000 * 60 * 60 * 24 * 7,
            offset = (new Date()).getTimezoneOffset() * 60 * 1000,
            theDate = new Date(Date.now() + week - offset),
            dateString = theDate.toISOString().slice(0, 10);

        return dateString + 'T23:59:59';
    };

    toggleStatus = (task: Task) => {
        this.setState((prev: TasksState) => {
            prev.tasks = prev.tasks.map((t: Task) => {
                if (t.id === task.id) {
                    t.complete = !t.complete;
                }
                return t;
            });
            return prev;
        });

        this.api.setComplete(task.id, !task.complete).then((res: any) => this.updateTasks())
    };

    pushMessage = (msg: string) => {
        this.setState((prev: TasksState) => {
            prev.messages.push(msg);
            return prev;
        });
    };

    render() {
        return <div className={'page-tasks'}>
            <h1>Tasks</h1>

            {this.state.messages.map((msg, i) => <p key={i}>{msg}</p>)}

            <form onSubmit={this.saveTask}>
                <div className="page-tasks__inputs">
                    <label className={'page-tasks__description'}>Task <input type="text" placeholder={'Task'} value={this.state.newTask} onChange={this.setNewTask} /></label>
                    <label className={'page-tasks__due'}>Due <input type="datetime-local" value={this.state.newDue} onChange={this.setNewDue} /></label>
                    <label className={'page-tasks__stakes'}>Stakes <input type="number" placeholder={'USD'} min={1} value={this.state.newStakes} onChange={this.setNewStakes} /></label>
                </div>
                <input className={'page-tasks__addButton'} type="submit" value={'Add'}/>
            </form>

            <ul>{this.state.tasks.map(t => <li key={t.id}><Task task={t} onToggle={() => this.toggleStatus(t)} /></li>)}</ul>
        </div>
    }
}

export default Tasks;