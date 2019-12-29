import React from "react";
import {Link} from "react-router-dom";
import './style.css'

interface SessionWidgetProps {
    session: Session | null,
    logOutHandler: () => void
}

const SessionWidget = (props: SessionWidgetProps) => {
    return <div className={'molecule-sessionWidget'}>
        {
            props.session ?
                <div>
                    <span>{props.session.email}</span>
                    <a href={'#'} onClick={props.logOutHandler}>Logout</a>
                    <Link to={'/account'}>Account</Link>
                </div>
                :
                <div>
                    <Link to={'/login'}>Login</Link>
                    <Link to={'/register'}>Register</Link>
                </div>
        }
    </div>
};

export default SessionWidget