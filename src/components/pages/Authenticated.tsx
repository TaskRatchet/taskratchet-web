import React from 'react';
import './Authenticated.css';
import LoginForm from "../organisms/Login";
import {Link} from "react-router-dom";
import api from "../../lib/Api";

interface AuthenticatedProps {}

const Authenticated = (props: React.PropsWithChildren<AuthenticatedProps>) => {
    const session = api.useSession();

    return <div className={'page-authenticated'}>
        {session ? props.children :
            <div>
                <p>Please login or <Link to={'/register'}>register</Link> to view this page.</p>
                <LoginForm />
            </div>
        }
    </div>
}

export default Authenticated;
