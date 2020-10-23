import React from "react";
import createBeeminderSettingsMachine from "./BeeminderSettings.machine";
import {useMachine} from "@xstate/react/lib";
import {isProduction} from "../../tr_constants";
import Input from "../molecules/Input";

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
    const [state, send] = useMachine(machine),
        {bmUser, bmGoal} = state.context

    return <div className={state.value === "idle" ? '' : "loading"}>
        {bmUser
            ? <form>
                <p>Beeminder user: {bmUser}</p>
                <Input
                    id={'new-task-goal'}
                    label={'Post new tasks to goal:'}
                    value={bmGoal}
                    onChange={e => send({
                        type: 'GOAL',
                        value: e.target.value
                    })}
                />
                <input type="submit" value={'Save'} onClick={e => {
                    e.preventDefault();
                    send('SAVE');
                }} />
            </form>
            : <a href={beeminderAuthUrl}>Enable Beeminder integration</a>
        }
    </div>
}

export default BeeminderSettings
