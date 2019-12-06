import React from 'react';
import Api from '../../../Api';
import './style.css'
import Task from '../../molecules/Task'

interface TasksProps {
    session: Session | null
}

interface TasksState {
    tasks: Task[]
}

class Tasks extends React.Component<TasksProps, TasksState> {
    state: TasksState = {
        tasks: []
    };

    api: Api = new Api();

    componentDidMount(): void {
        // pass
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

    render() {
        if (this.props.session && this.state.tasks.length === 0) {
            this.updateTasks()
        }

        return <div>
            <h1>Tasks</h1>
            {
                this.props.session ?
                    <ul>{this.state.tasks.map(t => <li key={t.id}><Task task={t} /></li>)}</ul>
                    :
                    <p>Please login to view your tasks.</p>
            }

        </div>
    }
}

export default Tasks;