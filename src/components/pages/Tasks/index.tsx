import React from 'react';
import Api from '../../../Api';
import './style.css'

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
        if (!this.props.session) {
            return;
        }
        console.log('getting tasks');
        this.api.getTasks()
            .then((res: any) => res.json())
            .then((data: any) => {
                console.log(data);
                this.setState({
                    tasks: data
                })
            })
    }

    render() {
        return <div>
            <h1>Tasks</h1>
            {
                this.props.session ?
                    <ul>
                        {
                            this.state.tasks.map(t => <li key={t.id}>
                                <input type="checkbox" checked={t.complete}/>&nbsp;
                                {t.task} by {t.due} or pay ${t.stakes}
                            </li>)
                        }
                    </ul>
                    :
                    <p>Please login to view your tasks.</p>
            }

        </div>
    }
}

export default Tasks;