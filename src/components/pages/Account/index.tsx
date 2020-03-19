import React, {useEffect, useState} from 'react';
import Api from '../../../classes/Api';
import './style.css'
import Toaster from "../../../classes/Toaster";

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
        [password2, setPassword2] = useState<string>('');

    const toaster: Toaster = new Toaster();

    useEffect(() => {
        populateTimezones();
        loadUser();
        loadCheckoutSession();
    }, []);

    const loadCheckoutSession = () => {
        props.api.getCheckoutSession()
            .then((res: any) => res.json())
            .then(setCheckoutSession)
    };

    const populateTimezones = () => {
        props.api.getTimezones()
            .then((res: any) => res.json())
            .then(setTimezones);
    };

    const loadUser = () => {
        props.api.getMe()
            .then((res: any) => res.json())
            .then(loadResponseData)
    };

    const loadResponseData = (data: any) => {
        console.log(data);

        setName(data['name']);
        setEmail(data['email']);
        setTimezone(data['timezone']);
        setCards(data['cards']);
    };

    const saveGeneral = (event: any) => {
        event.preventDefault();

        props.api.updateMe(
            prepareValue(name),
            prepareValue(email),
            prepareValue(timezone)
        ).then((res: any) => {
            toaster.send((res.ok) ? 'Changes saved' : 'Something went wrong');
            return res.json();
        }).then(loadResponseData);
    };

    const prepareValue = (value: string) => {
        return (value === '') ? null : value;
    };

    const savePassword = (event: any) => {
        event.preventDefault();

        if (!isPasswordFormValid()) return;

        props.api.updatePassword(oldPassword, password)
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

        props.api.updateCheckoutSessionId(sessionId);

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
    </div>
}

export default Account;
