import React from 'react';

interface RegisterProps {
    name: string,
    email: string,
    password: string,
    password2: string,
    timezones: string[],
    timezone: string,
    onNameChange: (event: any) => void,
    onEmailChange: (event: any) => void,
    onPasswordChange: (event: any) => void,
    onPassword2Change: (event: any) => void,
    onTimezoneChange: (event: any) => void,
    onSubmit: (event: any) => void
}

class Register extends React.Component<RegisterProps, {}> {
    render() {
        return <form onSubmit={this.props.onSubmit}>
            <input type="text" value={this.props.name} onChange={this.props.onNameChange} name={'name'} placeholder={'Name'} /><br/>
            <input type="email" value={this.props.email} onChange={this.props.onEmailChange} name={'email'} placeholder={'Email'} /><br/>
            <input type="password" value={this.props.password} onChange={this.props.onPasswordChange} name={'password'} placeholder={'Password'} /><br/>
            <input type="password" value={this.props.password2} onChange={this.props.onPassword2Change} name={'password2'} placeholder={'Retype Password'} /><br/>
            <select name="timezone" value={this.props.timezone} onChange={this.props.onTimezoneChange}>
                {this.props.timezones.map((tz, i) => <option value={tz} key={i}>{tz}</option>)}
            </select><br/>
            <input type="submit" value={'Register'} />
        </form>
    }
}

export default Register;