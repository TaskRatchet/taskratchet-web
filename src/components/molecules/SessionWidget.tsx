import React from "react";
import {Link} from "react-router-dom";
import './SessionWidget.css'
import {logout, useSession} from "../../lib/api/useSession";

interface SessionWidgetProps {
}

const SessionWidget = (props: SessionWidgetProps) => {
    const session = useSession();

    return <div className={'molecule-sessionWidget'}>
        {
            session ?
                <div>
                    <span>{session.email}</span>
                    <button className={'link'} onClick={logout}>Logout</button>
                    <Link to={'/account'}>Account</Link>
                </div>
                :
                <div />
        }
    </div>
};

export default SessionWidget
