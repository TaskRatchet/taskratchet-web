import React from "react";
import {Link} from "react-router-dom";
import './style.css'
import api from "../../../lib/Api";

interface SessionWidgetProps {
}

const SessionWidget = (props: SessionWidgetProps) => {
    const session = api.useSession();

    return <div className={'molecule-sessionWidget'}>
        {
            session ?
                <div>
                    <span>{session.email}</span>
                    <button className={'link'} onClick={() => api.logout()}>Logout</button>
                    <Link to={'/account'}>Account</Link>
                </div>
                :
                <div />
        }
    </div>
};

export default SessionWidget
