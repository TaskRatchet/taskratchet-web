import React from 'react';
import './Authenticated.css';
import LoginForm from "../organisms/Login";
import {Link} from "react-router-dom";
import {useSession} from "../../lib/api/useSession";

interface AuthenticatedProps {}

const Authenticated = (props: React.PropsWithChildren<AuthenticatedProps>) => {
    const session = useSession();

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
