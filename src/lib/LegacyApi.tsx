import Cookies from 'universal-cookie';
import {publishSession} from "./api/useSession";
import {apiFetch} from "./api";

const cookies = new Cookies();

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

    updatePassword(oldPassword: string, newPassword: string) {
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

    // getTasks() {
    //     return apiFetch('me/tasks', true);
    // }

    // Requires that user be authenticated.
    addTask(task: string, due: string, cents: number) {
        console.log({task, due, cents})
        return apiFetch(
            'me/tasks',
            true,
            'POST',
            {
                task: task,
                due: due,
                cents: cents
            }
        );
    }



    // _fetch = (
    //     route: string,
    //     protected_: boolean = false,
    //     method: string = 'GET',
    //     data: any = null,
    // ): Promise<Response> => {
    //     const session = cookies.get('tr_session'),
    //         route_ = this._trim(route, '/'),
    //         base = this._get_base();
    //
    //     if (protected_ && !session) {
    //         return new Promise((resolve, reject) => {
    //             reject('User not logged in');
    //         });
    //     }
    //
    //     // console.log({base, route_, method, data, session})
    //
    //     const response = fetch(base + route_, {
    //         method: method,
    //         body: data ? JSON.stringify(data) : undefined,
    //         headers: {
    //             'X-Taskratchet-Token': session ? session.token : undefined,
    //         }
    //     });
    //
    //     response.then((res: any) => {
    //         if (res.status === 403) {
    //             this.logout();
    //         }
    //     });
    //
    //     return response;
    // };
    //
    // _get_base = () => {
    //     if (isProduction) {
    //         return 'https://us-central1-taskratchet.cloudfunctions.net/api1/';
    //     }
    //
    //     if (isStaging) {
    //         return 'https://us-central1-taskratchet-dev.cloudfunctions.net/api1/';
    //     }
    //
    //     return 'http://localhost:8080/'
    // }
    //
    // _trim = (s: string, c: string) => {
    //     if (c === "]") c = "\\]";
    //     if (c === "\\") c = "\\\\";
    //     return s.replace(new RegExp(
    //         "^[" + c + "]+|[" + c + "]+$", "g"
    //     ), "");
    // };
}

const api = new LegacyApi();

export default api;
