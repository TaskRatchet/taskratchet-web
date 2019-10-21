import React from 'react';

interface RegisterProps {
    email: string,
    password: string,
    password2: string,
    onEmailChange: (event: any) => void,
    onPasswordChange: (event: any) => void,
    onPassword2Change: (event: any) => void,
    onSubmit: (event: any) => void
}

class Register extends React.Component<RegisterProps, {}> {
    render() {
        return <div>
            <form onSubmit={this.props.onSubmit}>
                <input type="email" value={this.props.email} onChange={this.props.onEmailChange} name={'email'} placeholder={'Email'} /><br/>
                <input type="password" value={this.props.password} onChange={this.props.onPasswordChange} name={'password'} placeholder={'Password'} /><br/>
                <input type="password" value={this.props.password2} onChange={this.props.onPassword2Change} name={'password2'} placeholder={'Retype Password'} /><br/>
                <input type="submit" value={'Register'} />
            </form>
        </div>
    }
}

export default Register;