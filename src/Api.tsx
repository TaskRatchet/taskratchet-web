import Cookies from 'universal-cookie';

const cookies = new Cookies();

class Api {
    baseRoute: string = 'https://us-central1-taskratchet.cloudfunctions.net/api1/';

    login(email: string, password: string) {
        return this._fetch(
            'account/login',
            false,
            'POST',
            {
                'email': email,
                'password': password,
            }
        );
    }

    requestResetEmail(email: string) {
        return this._fetch(
            'account/forgot-password',
            false,
            'POST',
            {'email': email}
            )
    }

    resetPassword(token: string, password: string) {
        return this._fetch(
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
        return this._fetch(
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

    getTimezones() {
        return this._fetch('timezones')
    }

    getCheckoutSession() {
        return this._fetch('payments/checkout/session');
    }

    getMe() {
        return this._fetch('me', true);
    }

    updateMe(
        name: string|null = null,
        email: string|null = null,
        timezone: string|null = null,
    ) {
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

        return this._fetch(
            '/me',
            true,
            'PUT',
            data
        );
    }

    updateCheckoutSessionId(sessionId: string) {
        return this._fetch(
            '/me',
            true,
            'PUT',
            {
                'checkout_session_id': sessionId
            }
        );
    }

    updatePassword(oldPassword: string, newPassword: string) {
        return this._fetch(
            'me',
            true,
            'PUT',
            {
                'old_password': oldPassword,
                'new_password': newPassword
            }
        )
    }

    getTasks() {
        return this._fetch('me/tasks', true);
    }

    // Requires that user be authenticated.
    addTask(task: string, due: number, stakes: number) {
        return this._fetch(
            'me/tasks',
            true,
            'POST',
            {
                task: task,
                due: due,
                stakes: stakes
            }
        );
    }

    // Requires that user be authenticated.
    setComplete(taskId: number, complete: boolean) {
        return this._fetch(
            'me/tasks/' + taskId,
            true,
            'PUT',
            {
                'complete': complete
            }
        );
    }

    _fetch = (
        route: string,
        protected_: boolean = false,
        method: string = 'GET',
        data: any = null,
    ) => {
        const session = cookies.get('tr_session'),
            route_ = this._trim(route, '/');

        if (protected_ && !session) {
            return new Promise((resolve, reject) => {
                reject('User not logged in');
            });
        }

        return fetch(this.baseRoute + route_, {
            method: method,
            body: data ? JSON.stringify(data) : undefined,
            headers: {
                'X-Taskratchet-Token': session ? session.token : undefined,
            }
        });
    };

    _trim = (s: string, c: string) => {
        if (c === "]") c = "\\]";
        if (c === "\\") c = "\\\\";
        return s.replace(new RegExp(
            "^[" + c + "]+|[" + c + "]+$", "g"
        ), "");
    };
}

export default Api;