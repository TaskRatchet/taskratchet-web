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
    newCents: number
}

class Tasks extends React.Component<TasksProps, TasksState> {
    state: TasksState = {
        messages: [],
        tasks: [],
        newTask: '',
        newDue: '',
        newCents: 500
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

    setNewCents = (event: any) => {
        const t = event.target;
        this.setState((prev: TasksState) => {
            prev.newCents = t.value * 100;
            return prev;
        })
    };

    saveTask = (event: any) => {
        event.preventDefault();

        if (!this.state.newTask) {
            this.pushMessage('Missing task description');
            return;
        }

        const unixDue = Math.floor((new Date(this.state.newDue)).getTime() / 1000);

        this.setState((prev: TasksState) => {
            prev.tasks.push({
                complete: false,
                due: unixDue,
                id: -1,
                cents: this.state.newCents,
                task: this.state.newTask
            });
            prev.newDue = this.getDefaultDue();
            prev.newCents = 5;
            prev.newTask = '';
            return prev
        });

        this.api.addTask(
            this.state.newTask,
            unixDue,
            this.state.newCents
        ).then((res: any) => this.updateTasks());
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

    compareTasks = (a: Task, b: Task) => {
        if (a.due < b.due) return -1;
        if (a.due > b.due) return 1;
        return 0;
    };

    render() {
        return <div className={'page-tasks'}>
            <h1>Tasks</h1>

            {this.state.messages.map((msg, i) => <p key={i}>{msg}</p>)}

            <form onSubmit={this.saveTask}>
                <div className="page-tasks__inputs">
                    <label className={'page-tasks__description'}>Task <input type="text" placeholder={'Task'} value={this.state.newTask} onChange={this.setNewTask} /></label>
                    <label className={'page-tasks__due'}>Due <input type="datetime-local" value={this.state.newDue} onChange={this.setNewDue} /></label>
                    <label className={'page-tasks__dollars'}>Stakes <input type="number" placeholder={'USD'} min={1} value={this.state.newCents / 100} onChange={this.setNewCents} /></label>
                </div>
                <input className={'page-tasks__addButton'} type="submit" value={'Add'}/>
            </form>

            <ul>{this.state.tasks.sort(this.compareTasks).map(t => <li key={t.id}><Task task={t} onToggle={() => this.toggleStatus(t)} /></li>)}</ul>
        </div>
    }
}

export default Tasks;