import React from 'react';
import Api from '../../../Api';

type Task = {
    complete: boolean,
    due: string,
    id: number,
    stakes: number,
    task: string
}

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
        console.log('getting tasks');
        this.api.getTasks()
            .then(res => res.json())
            .then(data => {
                console.log(data)
                this.setState({
                    tasks: data
                })
            })
    }

    render() {
        return <div>
            <h1>Tasks</h1>
            <ul>
                {
                    this.state.tasks.map(t => <li key={t.id}>
                        <input type="checkbox" checked={t.complete} />&nbsp;
                        {t.task} by {t.due} or pay ${t.stakes}
                    </li>)
                }
            </ul>
        </div>
    }
}

export default Tasks;