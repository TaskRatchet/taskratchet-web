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
}

const api = new LegacyApi();

export default api;
