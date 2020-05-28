import React, {useEffect, useState} from 'react';
import Api from '../../../classes/Api';
import './style.css'
import Toaster from "../../../classes/Toaster";
import {useLocation} from "react-router-dom"
import queryString from 'query-string'
import {isProduction} from "../../../tr_constants"

interface Card {
    brand: string,
    last4: string,
}

interface CheckoutSession {
    id: string
}

interface AccountProps {
    api: Api
}

const Account = (props: AccountProps) => {
    const [checkoutSession, setCheckoutSession] = useState<CheckoutSession | null>(null),
        [timezones, setTimezones] = useState<string[]>([]),
        [name, setName] = useState<string>(''),
        [email, setEmail] = useState<string>(''),
        [timezone, setTimezone] = useState<string>(''),
        [cards, setCards] = useState<Card[]>([]),
        [oldPassword, setOldPassword] = useState<string>(''),
        [password, setPassword] = useState<string>(''),
        [password2, setPassword2] = useState<string>(''),
        [bmUser, setBmUser] = useState<string>(''),
        [bmGoal, setBmGoal] = useState<string>('');

    const location = useLocation<any>();

    const beeminderClientId: string = (isProduction)
        ? "1w70sy12t1106s9ptod11ex21"
        : "29k46vimhtdeptt616tuhmp2r",
        beeminderRedirect: string = (isProduction)
            ? "https://app.taskratchet.com/account"
            : "https://staging.taskratchet.com/account",
        beeminderAuthUrl: string = `https://www.beeminder.com/apps/authorize?client_id=${beeminderClientId}` +
            `&redirect_uri=${encodeURIComponent(beeminderRedirect)}&response_type=token`

    const toaster: Toaster = new Toaster();

    useEffect(() => {
        populateTimezones();
        loadUser();
        loadCheckoutSession();
        saveNewBeeminderIntegration();
    }, []);

    const saveNewBeeminderIntegration = () => {
        console.log('Checking for new Beeminder integration')

        const params: any = queryString.parse(location.search)

        if (!params.access_token || !params.username) return;

        console.log('New integration found, updating me')

        const response = props.api.useUpdateMe({
            beeminder_token: params.access_token,
            beeminder_user: params.username
        });

        toaster.send((response.ok) ?
            'Beeminder integration saved' :
            'Something went wrong');

        loadResponseData(response);
    }

    const loadCheckoutSession = () => {
        const response = props.api.useCheckoutSession()

        if (typeof response.response === 'object' && 'id' in response.response) {
            setCheckoutSession(response.response)
        }
    };

    const populateTimezones = () => {
        const response = props.api.useTimezones();

        if (Array.isArray(response.response)) {
            setTimezones(response.response);
        }
    };

    const loadUser = () => {
        const response = props.api.useMe();

        loadResponseData(response.response)
    };

    const loadResponseData = (response: any) => {
        const data = response.response;

        console.log(data);

        setName(data['name']);
        setEmail(data['email']);
        setTimezone(data['timezone']);
        setCards(data['cards']);

        if ('beeminder' in data['integrations']) {
            const bm = data['integrations']['beeminder'];
            if ('user' in bm) setBmUser(bm['user']);
            if ('goal_new_tasks' in bm) setBmGoal(bm['goal_new_tasks'] || '');
        }
    };

    const saveGeneral = (event: any) => {
        event.preventDefault();

        props.api.useUpdateMe({
            name: prepareValue(name),
            email: prepareValue(email),
            timezone: prepareValue(timezone)
        }).then((res: any) => {
            toaster.send((res.ok) ? 'Changes saved' : 'Something went wrong');
            return res.json();
        }).then(loadResponseData);
    };

    const prepareValue = (value: string) => {
        return (value === '') ? null : value;
    };

    const saveGoalName = (event: any) => {
        event.preventDefault();

        props.api.useUpdateMe({
            beeminder_goal_new_tasks: bmGoal
        }).then((res: any) => {
            toaster.send((res.ok) ? 'Beeminder goal saved' : 'Something went wrong');
            return res.json();
        }).then(loadResponseData);
    }

    const savePassword = (event: any) => {
        event.preventDefault();

        if (!isPasswordFormValid()) return;

        props.api.useUpdatePassword(oldPassword, password)
            .then((res: any) => {
                toaster.send((res.ok) ? 'Password saved' : 'Something went wrong');
            });
    };

    const isPasswordFormValid = () => {
        let passed = true;

        if (oldPassword === '') {
            toaster.send('Old password required');
            passed = false;
        }

        if (password === '') {
            toaster.send('New password required');
            passed = false;
        }

        if (password !== password2) {
            toaster.send('New password fields don\'t match');
            passed = false;
        }

        return passed;
    };

    const updatePaymentDetails = () => {
        const sessionId = getSessionId();

        if (sessionId === null) {
            toaster.send('Checkout session error');
            return;
        }

        props.api.useUpdateCheckoutSessionId(sessionId);

        redirect();
    };

    const redirect = () => {
        if (checkoutSession == null) return;

        const stripe = window.Stripe(window.stripe_key);

        stripe.redirectToCheckout({
            sessionId: getSessionId()
        }).then((result: any) => {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `result.error.message`.
            toaster.send(result.error.message);

            console.log('Checkout redirect error');
            console.log(result);
        });
    };

    const getSessionId = () => {
        if (checkoutSession == null) return null;

        return checkoutSession.id;
    };

    return <div className={'page-account'}>
        <h1>Account</h1>

        <form onSubmit={saveGeneral}>
            <label htmlFor="name">Name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id={'name'}
                name={'name'}
            />

            <label htmlFor="email">Email</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id={'email'}
                name={'email'}
            />

            <label htmlFor="timezone">Timezone</label>
            <select
                id={'timezone'}
                name="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
            >
                {timezones.map((tz, i) => <option value={tz} key={i}>{tz}</option>)}
            </select>

            <input type="submit" value={'Save'}/>
        </form>

        <h2>Reset Password</h2>

        <form onSubmit={savePassword}>
            <label htmlFor="old_password">Old Password</label>
            <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                id={'old_password'}
                name={'old_password'}
            />

            <label htmlFor="password">New Password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id={'password'}
                name={'password'}
            />

            <label htmlFor="password2">Retype Password</label>
            <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                id={'password2'}
                name={'password2'}
            />

            <input type="submit" value={'Save'}/>
        </form>

        <h2>Update Payment Details</h2>

        <p>Saved payment method:</p>

        {cards ? <ul>
            {cards.map((c, i) => <li key={i}>{c.brand} ending with {c.last4}</li>)}
        </ul> : <p>None</p>}

        <button onClick={updatePaymentDetails}>Replace payment method</button>

        <h2>Beeminder Integration</h2>

        {bmUser ? <form onSubmit={saveGoalName}>
                <p>Beeminder username: {bmUser}</p>

                <label htmlFor="bmGoal">Post new tasks to goal:</label>
                <input
                    value={bmGoal}
                    onChange={(e) => setBmGoal(e.target.value)}
                    id={'bmGoal'}
                    name={'bmGoal'}
                />

                <input type="submit" value={'Save'}/>
            </form>
            : <a href={beeminderAuthUrl}>Enable Beeminder integration</a>
        }
    </div>
}

export default Account;
