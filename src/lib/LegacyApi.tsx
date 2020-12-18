import Cookies from 'universal-cookie';
import {publishSession} from "./api/useSession";
import {apiFetch} from "./api";

const cookies = new Cookies();

// TODO: Migrate away from everything in this class
// TODO: Delete this file

export class LegacyApi {
    login(email: string, password: string) {
        return apiFetch(
            'account/login',
            false,
            'POST',
            {
                'email': email,
                'password': password,
            }
        ).then((res: any) => {
            if (!res.ok) return false;

            res.text().then((token: string) => this._handleLoginResponse(email, token));

            return true;
        });
    }

    _handleLoginResponse(email: string, token: string) {
        cookies.set('tr_session', {
            'token': token,
            'email': email
        }, {
            'sameSite': 'lax'
        });

        publishSession();
    }

    requestResetEmail(email: string) {
        return apiFetch(
            'account/forgot-password',
            false,
            'POST',
            {'email': email}
        )
    }

    resetPassword(token: string, password: string) {
        return apiFetch(
            'account/reset-password',
            false,
            'POST',
            {
                'token': token,
                'password': password
            }
        );
    }

    register(
        name: string,
        email: string,
        password: string,
        timezone: string,
        checkoutSessionId: string | null,
    ) {
        return apiFetch(
            'account/register',
            false,
            'POST',
            {
                'name': name,
                'email': email,
                'password': password,
                'timezone': timezone,
                'checkout_session_id': checkoutSessionId,
            }
        );
    }

    // TODO: Add this logic to useMe mutation
    updateMe(
        {
            name = null,
            email = null,
            timezone = null,
            beeminder_token = null,
            beeminder_user = null,
            beeminder_goal_new_tasks = null,
        }: {
            name?: string | null,
            email?: string | null,
            timezone?: string | null,
            beeminder_token?: string | null,
            beeminder_user?: string | null,
            beeminder_goal_new_tasks?: string | null,
        }
    ): Promise<Response> {
        let data: any = {};

        if (name !== null) {
            data['name'] = name;
        }

        if (email !== null) {
            data['email'] = email;
        }

        if (timezone !== null) {
            data['timezone'] = timezone;
        }

        if (beeminder_token !== null || beeminder_user !== null || beeminder_goal_new_tasks !== null) {
            data['integrations'] = {'beeminder': {}}

            if (beeminder_token !== null) {
                data['integrations']['beeminder']['token'] = beeminder_token
            }

            if (beeminder_user !== null) {
                data['integrations']['beeminder']['user'] = beeminder_user
            }

            if (beeminder_goal_new_tasks !== null) {
                data['integrations']['beeminder']['goal_new_tasks'] = beeminder_goal_new_tasks
            }
        }

        return apiFetch(
            '/me',
            true,
            'PUT',
            data
        );
    }
}

const api = new LegacyApi();

export default api;
