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
                    <button onClick={props.logOutHandler}>Logout</button>
                </div>
                :
                <span>
                    <Link to={'/login'}>Login</Link> -&nbsp;
                    <Link to={'/register'}>Register</Link>
                </span>
        }
    </div>
};

export default SessionWidget