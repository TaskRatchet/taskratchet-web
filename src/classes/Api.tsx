import Cookies from 'universal-cookie';
import {isProduction, isStaging} from "../tr_constants"
import useFetch from 'fetch-suspense'

const cookies = new Cookies();

class Api {
    logOutHandler: null | (() => void) = null;

    constructor(logOutHandler: () => void) {
        this.logOutHandler = logOutHandler;
    }

    useLogin(email: string, password: string) {
        return this._useFetch(
            'account/login',
            false,
            'POST',
            {
                'email': email,
                'password': password,
            }
        );
    }

    useRequestResetEmail(email: string) {
        return this._useFetch(
            'account/forgot-password',
            false,
            'POST',
            {'email': email}
        )
    }

    useResetPassword(token: string, password: string) {
        return this._useFetch(
            'account/reset-password',
            false,
            'POST',
            {
                'token': token,
                'password': password
            }
        );
    }

    useRegister(
        name: string,
        email: string,
        password: string,
        timezone: string,
        checkoutSessionId: string | null,
    ) {
        return this._useFetch(
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

    useTimezones() {
        return this._useFetch('timezones')
    }

    useCheckoutSession() {
        return this._useFetch('payments/checkout/session');
    }

    useMe() {
        return this._useFetch('me', true);
    }

    useUpdateMe(
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

        return this._useFetch(
            '/me',
            true,
            'PUT',
            data
        );
    }

    useUpdateCheckoutSessionId(sessionId: string) {
        return this._useFetch(
            '/me',
            true,
            'PUT',
            {
                'checkout_session_id': sessionId
            }
        );
    }

    useUpdatePassword(oldPassword: string, newPassword: string) {
        return this._useFetch(
            'me',
            true,
            'PUT',
            {
                'old_password': oldPassword,
                'new_password': newPassword
            }
        )
    }

    useTasks() {
        return this._useFetch('me/tasks', true);
    }

    // Requires that user be authenticated.
    useAddTask(task: string, due: string, cents: number) {
        return this._useFetch(
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
    useSetComplete(taskId: number, complete: boolean) {
        return this._useFetch(
            'me/tasks/' + taskId,
            true,
            'PUT',
            {
                'complete': complete
            }
        );
    }

    _useFetch = (
        route: string,
        protected_: boolean = false,
        method: string = 'GET',
        data: any = null,
    ) => {
        const session = cookies.get('tr_session'),
            route_ = this._trim(route, '/'),
            base = this._get_base();

        if (protected_ && !session) {
            throw "User not logged in"
        }

        const response = useFetch(base + route_, {
            method: method,
            body: data ? JSON.stringify(data) : undefined,
            headers: {
                'X-Taskratchet-Token': session ? session.token : undefined,
            }
        }, { metadata: true });

        if (response.status === 403 && this.logOutHandler) {
            this.logOutHandler();
        }

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

export default Api;