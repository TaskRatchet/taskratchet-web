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
                    <button className={'link'} onClick={props.logOutHandler}>Logout</button>
                    <Link to={'/account'}>Account</Link>
                </div>
                :
                <div />
        }
    </div>
};

export default SessionWidget