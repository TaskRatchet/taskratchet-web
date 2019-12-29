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
        authenticated: boolean = false,
        method: string = 'GET',
        data: any = null,
    ) => {
        const session = cookies.get('tr_session');

        if (authenticated && !session) {
            return new Promise((resolve, reject) => {
                reject('User not logged in');
            });
        }

        return fetch(this.baseRoute + route, {
            method: method,
            body: data ? JSON.stringify(data) : undefined,
            headers: {
                'X-Taskratchet-Token': session ? session.token : undefined,
            }
        });
    }
}

export default Api;