import {apiFetch} from "./apiFetch";

export function updatePassword(oldPassword: string, newPassword: string) {
    return apiFetch(
        'me',
        true,
        'PUT',
        {
            'old_password': oldPassword,
            'new_password': newPassword
        }
    )
}
