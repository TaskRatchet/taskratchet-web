import Cookies from 'universal-cookie';
import {isProduction, isStaging} from "../tr_constants"
import {useEffect, useState} from "react";

const cookies = new Cookies();

// TODO: Convert to stand-alone functions

export class Api {
    sessionSubs: Array<CallableFunction>

    constructor() {
        this.sessionSubs = [];
    }

    login(email: string, password: string) {
        return this._fetch(
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

        this.publishSession();
    }

    logout() {
        cookies.remove('tr_session');

        this.publishSession();
    }

    publishSession() {
        const session = this.getSession();

        this.sessionSubs.forEach(x => x(session));
    }

    getSession() {
        return cookies.get('tr_session');
    }

    subscribeToSession(callback: CallableFunction) {
        this.sessionSubs.push(callback);
    }

    unsubscribeFromSession(callback: CallableFunction) {
        this.sessionSubs = this.sessionSubs.filter(x => x !== callback)
    }

    useSession() {
        const [session, setSession] = useState<Session>(this.getSession());

        useEffect(() => {
            function handleUpdate(session: Session) {
                setSession(session);
            }

            this.subscribeToSession(handleUpdate)

            return () => this.unsubscribeFromSession(handleUpdate)
        }, [])

        return session;
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

    getTask(id: number) {
        return this._fetch(`me/tasks/${id}`)
    }

    // Requires that user be authenticated.
    addTask(task: string, due: string, cents: number) {
        return this._fetch(
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
    ): Promise<Response> => {
        const session = cookies.get('tr_session'),
            route_ = this._trim(route, '/'),
            base = this._get_base();

        if (protected_ && !session) {
            return new Promise((resolve, reject) => {
                reject('User not logged in');
            });
        }

        const response = fetch(base + route_, {
            method: method,
            body: data ? JSON.stringify(data) : undefined,
            headers: {
                'X-Taskratchet-Token': session ? session.token : undefined,
            }
        });

        response.then((res: any) => {
            if (res.status === 403) {
                this.logout();
            }
        });

        return response;
    };

    _get_base = () => {
        if (isProduction) {
            return 'https://us-central1-taskratchet.cloudfunctions.net/api1/';
        }

        if (isStaging) {
            return 'https://us-central1-taskratchet-dev.cloudfunctions.net/api1/';
        }

        return 'http://localhost:8080/'
    }

    _trim = (s: string, c: string) => {
        if (c === "]") c = "\\]";
        if (c === "\\") c = "\\\\";
        return s.replace(new RegExp(
            "^[" + c + "]+|[" + c + "]+$", "g"
        ), "");
    };
}

const api = new Api();

export default api;
