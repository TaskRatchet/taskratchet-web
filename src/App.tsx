import React from 'react';
import './App.css';
import {GoogleLogin, GoogleLogout} from 'react-google-login';

type Lake = {
    id: number;
    name: string;
    trailhead: string;
}

type GoogleUser = {
    profileObj: {
        email: string
        familyName: string
        givenName: string
        googleId: string
        imageUrl: string
        name: string
    }
}

interface AppProps {
    lakes: Lake[]
}

class App extends React.Component<AppProps, {}> {
    state: {user: GoogleUser | null} = {
        user: null
    };

    responseGoogle = (response: any) => {
        console.log(response);
        const profile = response.getBasicProfile();
        console.log(profile);
        console.log(profile.getId());
        console.log(profile.getName());
        console.log(profile.getImageUrl());
        console.log(profile.getEmail());
        this.setState({
            user: response
        });
    };

    logout = () => {
        this.setState({
            user: null
        });
    };

    render() {
        return <div>
            {
                this.state.user == null
                    ? <GoogleLogin
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        clientId={'159159970464-ul3s2t2n10gidon2mh7fcbjbs7ekmn5i.apps.googleusercontent.com'}
                        buttonText="Login"
                        cookiePolicy={'single_host_origin'}
                        isSignedIn={true}
                        responseType="code"
                    />
                    : <GoogleLogout
                        clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                        buttonText="Logout"
                        onLogoutSuccess={this.logout}
                    />
            }
            <p>{this.state.user != null
                ? `logged in as ${this.state.user.profileObj.name} (${this.state.user.profileObj.email})`
                : 'logged out'}</p>
            <ul className='App'>
                {this.props.lakes.map(lake => <li key={lake.id}>{lake.name} Trailhead: {lake.trailhead}</li>)}
            </ul>
        </div>
    }
}

export default App;
