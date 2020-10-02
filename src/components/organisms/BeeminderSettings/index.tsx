import React from "react";
import createBeeminderSettingsMachine from "./machine";
import {useMachine} from "@xstate/react/lib";
import {isProduction} from "../../../tr_constants";

const machine = createBeeminderSettingsMachine()

const beeminderClientId: string = (isProduction)
    ? "1w70sy12t1106s9ptod11ex21"
    : "29k46vimhtdeptt616tuhmp2r",
    beeminderRedirect: string = (isProduction)
        ? "https://app.taskratchet.com/account"
        : "https://staging.taskratchet.com/account",
    beeminderAuthUrl: string = `https://www.beeminder.com/apps/authorize?client_id=${beeminderClientId}` +
        `&redirect_uri=${encodeURIComponent(beeminderRedirect)}&response_type=token`

const BeeminderSettings = () => {
    const [state, send] = useMachine(machine)

    return <div>
        {state.context.bmUser ? null : <a href={beeminderAuthUrl}>Enable Beeminder integration</a>}
    </div>
}

export default BeeminderSettings
