import React from 'react';
import Api from '../../../Api';
import './style.css'
import Task from '../../molecules/Task'

interface TasksProps {
    session: Session | null
}

interface TasksState {
    tasks: Task[],
    newTask: string,
    newDue: string,
    newStakes: number
}

class Tasks extends React.Component<TasksProps, TasksState> {
    state: TasksState = {
        tasks: [],
        newTask: '',
        newDue: '',
        newStakes: 0
    };

    api: Api = new Api();

    componentDidMount(): void {
        this.setState((prev: TasksState) => {
            prev.newDue = this.getNowString();
            return prev;
        })
    }

    updateTasks = () => {
        console.log('getting tasks');
        this.api.getTasks()
            .then((res: any) => res.json())
            .then((data: any) => {
                console.log(data);

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
            const d = new Date(t.value);
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

        this.setState((prev: TasksState) => {
            prev.tasks.push({
                complete: false,
                due: this.isoToPrettyDateString(this.state.newDue),
                id: -1,
                stakes: this.state.newStakes,
                task: this.state.newTask
            });
            prev.newDue = this.getNowString();
            prev.newStakes = 0;
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

    getNowString = () => {
        const today = new Date();
        today.setSeconds(0, 0);

        return today.toISOString().slice(0, -1);
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

    render() {
        if (this.props.session && this.state.tasks.length === 0) {
            this.updateTasks()
        }

        return <div className={'page-tasks'}>

            <h1>Tasks</h1>

            <form onSubmit={this.saveTask}>
                <label>Task <input type="text" placeholder={'Task'} value={this.state.newTask} onChange={this.setNewTask} /></label>
                <label>Due <input type="datetime-local" value={this.state.newDue} onChange={this.setNewDue} /></label>
                <label>Stakes <input type="number" placeholder={'USD'} value={this.state.newStakes} onChange={this.setNewStakes} /></label>
                <input className={'page-tasks__addButton'} type="submit" value={'Add'}/>
            </form>

            {
                this.props.session ?
                    <ul>{this.state.tasks.map(t => <li key={t.id}><Task task={t} onToggle={() => this.toggleStatus(t)} /></li>)}</ul>
                    :
                    <p>Please login to view your tasks.</p>
            }

        </div>
    }
}

export default Tasks;