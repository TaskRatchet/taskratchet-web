import React, {useEffect, useState} from 'react';
import api from '../../../classes/Api';
import Toaster from "../../../classes/Toaster";
import queryString from 'query-string'
import {isProduction} from "../../../tr_constants"
import Input from "../../molecules/Input";
import createManageEmailMachine from "./machine"
import {useMachine} from '@xstate/react';

// ex: {list: "summaries", t: "abc"}
const queryParams: any = queryString.parse(window.location.search),
    machine = createManageEmailMachine({queryParams});



interface ManageEmailProps {
}

const ManageEmail = (props: ManageEmailProps) => {
    const [state, send] = useMachine(machine)

    console.log(state)

    return <div className={'page-manageEmail'}>
        Hello World
        {
            state.context.error ?
                <div className={'page-manageEmail__error alert info'}>{state.context.error}</div> : ''
        }
        <ul>
            {Object.keys(state.context.subs).map(key => <li>{state.context.subs[key] ? 'Y' : 'N'} : {key}</li>)}
        </ul>
    </div>
}

export default ManageEmail