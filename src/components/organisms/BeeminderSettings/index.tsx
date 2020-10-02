import React from "react";
import createBeeminderSettingsMachine from "./machine";
import {useMachine} from "@xstate/react/lib";

const machine = createBeeminderSettingsMachine()

const BeeminderSettings = () => {
    const [state, send] = useMachine(machine)

    return <div>
        {state.context.bmUser ? null : <a href={''}>Enable Beeminder integration</a>}
    </div>
}

export default BeeminderSettings
