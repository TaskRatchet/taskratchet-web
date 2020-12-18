import {apiFetch} from "./apiFetch";
import _ from "lodash";

interface MeInput {
    name?: string,
    email?: string,
    timezone?: string,
    beeminder_token?: string,
    beeminder_user?: string,
    beeminder_goal_new_tasks?: string,
    checkout_session_id?: string
}

const pipe = (input: MeInput, inputPath: string, output: any, outputPath: string) => {
    const value = _.get(input, inputPath)

    if (value) {
        _.set(output, outputPath, value)
    }

    return output
}

const pipeMap = (input: MeInput, pathPairs: string[][]) => {
    return pathPairs.reduce((prev: any, pair: string[]) => {
        return pipe(input, pair[0], prev, pair[1])
    }, {})
}

export async function updateMe(input: MeInput) {
    let payload = pipeMap(input, [
        ['beeminder_token','integrations.beeminder.token'],
        ['beeminder_user','integrations.beeminder.user'],
        ['beeminder_goal_new_tasks','integrations.beeminder.goal_new_tasks'],
        ['email','email'],
        ['name','name'],
        ['timezone','timezone'],
        ['checkout_session_id','checkout_session_id'],
    ])

    const response = await apiFetch(
        'me',
        true,
        'PUT',
        payload
    )

    if (!response.ok) {
        throw new Error('Failed to update me')
    }

    return response
}
