import React from 'react';

interface LoginProps {
    isLoggedIn: boolean,
    email: string,
    password: string,
    onEmailChange: (event: any) => void,
    onPasswordChange: (event: any) => void,
    onSubmit: (event: any) => void
}

class Login extends React.Component<LoginProps, {}> {
    render() {
        return <form onSubmit={this.props.onSubmit}>
            <input type="email" value={this.props.email} onChange={this.props.onEmailChange} name={'email'} placeholder={'Email'} /><br/>
            <input type="password" value={this.props.password} onChange={this.props.onPasswordChange} name={'password'} placeholder={'Password'} /><br/>
            <input type="submit" value={'Submit'} />
        </form>
    }
}

export default Login;
