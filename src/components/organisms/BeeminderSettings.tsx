import React, {useEffect, useState} from "react";
import {isProduction} from "../../tr_constants";
import Input from "../molecules/Input";
import {useMe} from "../../lib/api";
import _ from "lodash";
import toaster from "../../lib/Toaster";
import browser from "../../lib/Browser";

const beeminderClientId: string = (isProduction)
    ? "1w70sy12t1106s9ptod11ex21"
    : "29k46vimhtdeptt616tuhmp2r",
    beeminderRedirect: string = (isProduction)
        ? "https://app.taskratchet.com/account"
        : "https://staging.taskratchet.com/account",
    beeminderAuthUrl: string = `https://www.beeminder.com/apps/authorize?client_id=${beeminderClientId}` +
        `&redirect_uri=${encodeURIComponent(beeminderRedirect)}&response_type=token`

const BeeminderSettings = () => {
    const [error, setError] = useState<string>('');
    const {me, updateMe, isLoading} = useMe({
        onSuccess: (data) => {
            // TODO: Make sure this doesn't result in field being populated after initial page load
            if (bmGoal) return;
            const goal = _.get(data, 'integrations.beeminder.goal_new_tasks', '');
            setBmGoal(goal)
        }
    });
    const bmUser: string = _.get(me, 'integrations.beeminder.user', '');
    const [bmGoal, setBmGoal] = useState<string>('')

    const isGoalNameValid = (goalName: string) => {
        const pattern = new RegExp(/^[-\w]*$/)

        return pattern.test(goalName)
    }

    useEffect(() => {
        const {username, access_token} = browser.getUrlParams()

        const shouldConnect = !!username
            && !!access_token
            && _.isString(username)
            && _.isString(access_token)

        if (!shouldConnect) return

        updateMe({
            beeminder_user: username,
            beeminder_token: access_token
        })
    }, [])

    return <div className={isLoading ? 'loading' : 'idle'}>
        {bmUser
            ? <form>
                <p>Beeminder user: {bmUser}</p>
                <Input
                    id={'new-task-goal'}
                    label={'Post new tasks to goal:'}
                    value={bmGoal}
                    error={error}
                    onChange={e => {
                        setBmGoal(e.target.value)
                    }}
                />
                <input
                    type="submit"
                    value={'Save'}
                    onClick={e => {
                        e.preventDefault();

                        if (!isGoalNameValid(bmGoal)) {
                            setError('Goal names can only contain letters, numbers, underscores, and hyphens.')
                            return
                        }

                        setError('')

                        updateMe({
                            beeminder_goal_new_tasks: bmGoal
                        })
                    }}
                />
            </form>
            : <a href={beeminderAuthUrl}>Enable Beeminder integration</a>
        }
    </div>
}

export default BeeminderSettings
