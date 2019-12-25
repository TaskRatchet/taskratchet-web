import Cookies from 'universal-cookie';

const cookies = new Cookies();

class Api {
    baseRoute: string = 'https://us-central1-taskratchet.cloudfunctions.net/api1/';

    login(email: string, password: string) {
        return fetch(this.baseRoute + 'account/login', {
            method: 'POST',
            body: JSON.stringify({
                'email': email,
                'password': password,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    register(name: string, email: string, password: string, timezone: string) {
        return fetch(this.baseRoute + 'account/register', {
            method: 'POST',
            body: JSON.stringify({
                'name': name,
                'email': email,
                'password': password,
                'timezone': timezone
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    getTimezones() {
        return fetch(this.baseRoute + 'timezones')
    }

    getCheckoutSession() {
        return fetch(this.baseRoute + 'payments/checkout/session')
    }

    // Requires that user be authenticated.
    getTasks() {
        const session = cookies.get('tr_session');

        if (!session) {
            return new Promise((resolve, reject) => {
                reject('User not logged in');
            });
        }

        return fetch(this.baseRoute + 'me/tasks', {
           method: 'GET',
           headers: {
               'X-Taskratchet-Token': session.token
           }
        });
    }

    // Requires that user be authenticated.
    addTask(task: string, due: number, stakes: number) {
        const session = cookies.get('tr_session');

        if (!session) {
            return new Promise((resolve, reject) => {
                reject('User not logged in');
            });
        }

        return fetch(this.baseRoute + 'me/tasks', {
            method: 'POST',
            body: JSON.stringify({
                task: task,
                due: due,
                stakes: stakes
            }),
            headers: {
                'X-Taskratchet-Token': session.token
            }
        });
    }

    // Requires that user be authenticated.
    setComplete(taskId: number, complete: boolean) {
        const session = cookies.get('tr_session');

        if (!session) {
            return new Promise((resolve, reject) => {
                reject('User not logged in');
            });
        }

        return fetch(this.baseRoute + 'me/tasks/' + taskId, {
            method: 'PUT',
            body: JSON.stringify({
                'complete': complete
            }),
            headers: {
                'X-Taskratchet-Token': session.token
            }
        });
    }
}

export default Api;