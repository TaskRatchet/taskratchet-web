import React from 'react';

interface AuthenticatedProps {
    session: Session | null
}

interface AuthenticatedState {
    messages: string[],
    email: string,
    password: string
}

class Login extends React.Component<AuthenticatedProps, AuthenticatedState> {
    state: AuthenticatedState = {
        messages: [],
        email: '',
        password: ''
    };

    render() {
        return <div className={'page-authenticated'}>
            {this.props.session ? this.props.children : <p>Please login to view this page.</p>}
        </div>
    }
}

export default Login;
