import React from 'react';
import './style.css';
import LoginForm from "../../organisms/Login";
import {Link} from "react-router-dom";
import Api from "../../../classes/Api";

interface AuthenticatedProps {
    session: Session | null,
    onLogin: () => void,
    api: Api
}

interface AuthenticatedState {
    messages: string[],
    email: string,
    password: string
}

class Authenticated extends React.Component<AuthenticatedProps, AuthenticatedState> {
    state: AuthenticatedState = {
        messages: [],
        email: '',
        password: ''
    };

    render() {
        return <div className={'page-authenticated'}>
            {this.props.session ? this.props.children :
                <div>
                    <p>Please login or <Link to={'/register'}>register</Link> to view this page.</p>
                    <LoginForm api={this.props.api} onLogin={this.props.onLogin} session={this.props.session} />
                </div>
            }
        </div>
    }
}

export default Authenticated;
