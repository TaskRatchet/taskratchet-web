import {apiFetch} from "./apiFetch";

interface MeInput {
    name?: string,
    email?: string,
    timezone?: string,
    beeminder_token?: string,
    beeminder_user?: string,
    beeminder_goal_new_tasks?: string,
    checkout_session_id?: string
}

export async function updateMe(data: MeInput) {
    const response = await apiFetch('me', true, 'PUT', data)

    if (!response.ok) {
        throw new Error('Failed to update me')
    }

    return response
}
